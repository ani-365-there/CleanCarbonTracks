"""Demo HTTP face. python -m field_ops  →  http://127.0.0.1:5002"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

from .inbox import InboxError
from .proof import ProofError
from .service import create_field_ops

PIN = {"lat": 20.3542, "lng": 85.8191}
FAR = {"lat": 20.372, "lng": 85.84}
ROOT = Path(__file__).parent / "sample_frontend"
ops = create_field_ops()
events: list[dict] = []
ops.subscribe("*", lambda e: events.append({"name": e["name"], "status": e["job"]["status"]}))
state = {"job": None, "scored": None, "proof": None, "verify": None}


def _iso():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def snapshot():
    job = None
    if state["job"]:
        job = ops.inbox.get(state["job"]["id"])
    return {"job": job, "scored": state["scored"], "proof": state["proof"], "verify": state["verify"], "events": events[-8:]}


def _send(handler, status, body, content_type):
    data = body if isinstance(body, bytes) else body.encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", content_type)
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Access-Control-Allow-Headers", "Content-Type")
    handler.send_header("Content-Length", str(len(data)))
    handler.end_headers()
    handler.wfile.write(data)


def _json(handler, status, payload):
    _send(handler, status, json.dumps(payload, default=str), "application/json")


def _read(handler):
    length = int(handler.headers.get("Content-Length") or 0)
    return json.loads(handler.rfile.read(length) or b"{}") if length else {}


class Handler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        return

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        path = urlparse(self.path).path
        if path in ("/", "/index.html"):
            _send(self, 200, (ROOT / "index.html").read_bytes(), "text/html; charset=utf-8")
            return
        if path == "/state":
            _json(self, 200, snapshot())
            return
        _json(self, 404, {"error": "NOT_FOUND"})

    def do_POST(self):
        path = urlparse(self.path).path.rstrip("/")
        try:
            if path == "/open":
                opened = ops.open_job(
                    "KP-7 mess overflow",
                    PIN,
                    {"waitMinutes": 180, "severity": 0.85, "repeatCount": 3, "sensitiveLocation": True, "categoryWeight": 0.75},
                )
                state["job"] = opened["job"]
                state["scored"] = opened["scored"]
                state["proof"] = None
                state["verify"] = None
            elif path == "/assign":
                ops.inbox.assign(state["job"]["id"], "arun")
            elif path == "/start":
                ops.inbox.start(state["job"]["id"], "arun")
            elif path == "/proof":
                body = _read(self)
                loc = FAR if body.get("far") else PIN
                pack = ops.proof.record({
                    "id": "e1",
                    "jobId": state["job"]["id"],
                    "actorId": "arun",
                    "location": loc,
                    "capturedAt": _iso(),
                    "after": {"attachmentId": "after-1", "mime": "image/jpeg", "sha256": "abc", "capturedAt": _iso()},
                })
                state["proof"] = pack
                state["verify"] = ops.proof.verify(pack["id"], {"expectedLocation": PIN, "requireAfter": True, "maxDistanceMeters": 75})
            elif path == "/complete":
                if not state["verify"] or not state["verify"].get("ok"):
                    _json(self, 400, {"error": "PROOF_REQUIRED", "verify": state["verify"]})
                    return
                ops.inbox.complete(state["job"]["id"])
            else:
                _json(self, 404, {"error": "NOT_FOUND"})
                return
        except (InboxError, ProofError, TypeError, KeyError) as exc:
            _json(self, 400, {"error": getattr(exc, "code", "ERROR"), "message": str(exc)})
            return
        _json(self, 200, snapshot())


def serve(host: str = "127.0.0.1", port: int = 5002):
    print(f"Field ops demo → http://{host}:{port}")
    ThreadingHTTPServer((host, port), Handler).serve_forever()


if __name__ == "__main__":
    serve()
