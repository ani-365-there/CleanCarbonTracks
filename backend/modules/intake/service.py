from __future__ import annotations

from .chatbot import ActionChatbot, create_action_chatbot
from .kit import FieldReportKit, ReportError, create_field_report_kit
from .merger import DuplicateMerger, create_duplicate_merger
from .retrieve import Bm25Index


class Intake:
    """Citizen geo-reports + duplicate collapse + optional action chatbot."""

    def __init__(self, allowed_categories=None, merger_opts=None, corpus=None, tools=None, now=None):
        self.reports = create_field_report_kit(now=now, allowed_categories=allowed_categories)
        self.merger = create_duplicate_merger(**(merger_opts or {}))
        self.chatbot = create_action_chatbot(corpus or [], tools=tools)

    def file(self, inp: dict) -> dict:
        report = self.reports.create(inp)
        merged = self.merger.ingest({
            "id": report["id"],
            "location": report["location"],
            "createdAt": report["createdAt"],
            "category": report["category"],
            "assetId": report.get("assetId"),
        })
        return {"report": report, "merged": merged}

    def chat(self, session_id: str, message: str, location=None) -> dict:
        return self.chatbot.chat(session_id, message, location=location)


def create_intake(**kwargs) -> Intake:
    return Intake(**kwargs)
