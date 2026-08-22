from __future__ import annotations

import re
import time

from .retrieve import Bm25Index


def detect_intent(message: str) -> str:
    text = message.lower()
    if re.search(r"\b(status|ticket|update|what happened)\b", text) or re.search(r"\b[0-9a-f]{8}-[0-9a-f-]{8,}\b", text, re.I):
        return "status"
    if re.search(r"\b(report|overflow|overflowing|full bin|dump|complaint|garbage pile)\b", text):
        return "report"
    if re.search(r"\b(near|nearest|closest|where.*(bin|point|drop)|find)\b", text):
        return "nearest"
    return "faq"


def extract_type(message: str) -> str | None:
    match = re.search(r"\b(wet|dry|mixed|hazardous|e-?waste|organic|recyclable)\b", message.lower())
    if not match:
        return None
    return match.group(1).replace("e-waste", "ewaste")


def extract_ticket_id(message: str) -> str | None:
    uuid = re.search(r"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}", message, re.I)
    if uuid:
        return uuid.group(0)
    short = re.search(r"\b(r|t|job)[-_][a-z0-9]+\b", message, re.I)
    return short.group(0) if short else None


class ActionChatbot:
    def __init__(self, corpus: list[dict], tools: dict | None = None, llm=None):
        self.index = Bm25Index(corpus)
        self.tools = tools or {}
        self.llm = llm
        self.sessions: dict[str, dict] = {}

    def chat(self, session_id: str, message: str, location: dict | None = None) -> dict:
        intent = detect_intent(message)
        session = self.sessions.get(session_id) or {}
        session["lastIntent"] = intent
        session["updatedAt"] = time.time()

        if intent == "nearest":
            if not location:
                return self._finish(session_id, session, {
                    "reply": "Share your location and I will find the nearest drop point.",
                    "intent": intent,
                    "citations": [],
                })
            typ = extract_type(message)
            finder = self.tools.get("find_nearest")
            hits = finder({"location": location, "type": typ, "query": message}) if finder else []
            session["lastNearest"] = hits
            if not hits:
                lines = "I could not find a matching point nearby."
            else:
                lines = "\n".join(
                    f"{i + 1}. {h['name']}" + (f" ({h['type']})" if h.get("type") else "") + f" — {round(h['distanceMeters'])} m"
                    for i, h in enumerate(hits[:3])
                )
            return self._finish(session_id, session, {
                "reply": lines,
                "intent": intent,
                "citations": [],
                "action": {"type": "find_nearest", "payload": hits[:3]},
            })

        if intent == "report":
            create = self.tools.get("create_report")
            created = create({"text": message, "location": location, "category": extract_type(message)}) if create else None
            if not created:
                retrieved = self.index.search(message, 2)
                return self._finish(session_id, session, {
                    "reply": "I can file this as a field report if reporting is connected. Describe the issue and include a location.",
                    "intent": intent,
                    "citations": [{"id": c["id"], "title": c["title"]} for c in retrieved],
                })
            session["lastReportId"] = created["id"]
            return self._finish(session_id, session, {
                "reply": f"Report filed as {created['id']}. You will get status updates on this ticket.",
                "intent": intent,
                "citations": [],
                "action": {"type": "create_report", "payload": created},
            })

        if intent == "status":
            ticket_id = extract_ticket_id(message) or session.get("lastReportId")
            if not ticket_id:
                return self._finish(session_id, session, {
                    "reply": "Give me a ticket id and I will check its status.",
                    "intent": intent,
                    "citations": [],
                })
            getter = self.tools.get("get_status")
            status = getter(ticket_id) if getter else None
            if status:
                extra = f" — {status['summary']}" if status.get("summary") else ""
                reply = f"Ticket {status['id']} is {status['status']}{extra}."
            else:
                reply = f"No ticket found for {ticket_id}."
            return self._finish(session_id, session, {
                "reply": reply,
                "intent": intent,
                "citations": [],
                "action": {"type": "get_status", "payload": status},
            })

        retrieved = self.index.search(message, 3)
        if self.llm:
            context = "\n\n".join(f"### {c['title']}\n{c['snippet']}" for c in retrieved)
            reply = self.llm(message, context)
        elif retrieved:
            reply = f"{retrieved[0]['title']}: {retrieved[0]['snippet']}"
        else:
            reply = "I do not have that in the knowledge base yet."
        return self._finish(session_id, session, {
            "reply": reply,
            "intent": intent,
            "citations": [{"id": c["id"], "title": c["title"]} for c in retrieved],
        })

    def _finish(self, session_id: str, session: dict, response: dict) -> dict:
        self.sessions[session_id] = session
        return response


def create_action_chatbot(corpus: list[dict], **kwargs) -> ActionChatbot:
    return ActionChatbot(corpus, **kwargs)
