"""Optional HTTP face. Stdlib only. Same routes as a typical notify microservice.

    python -m notifications.server
"""

from __future__ import annotations

import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

from .inbox import NotifyError, create_notifications

store = create_notifications()


def _json(handler: BaseHTTPRequestHandler, status: int, payload: dict) -> None:
    body = json.dumps(payload).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json")
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
    handler.send_header("Access-Control-Allow-Headers", "Content-Type")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


class Handler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        return

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        path = urlparse(self.path).path.rstrip("/") or "/"
        if path == "/":
            _json(self, 200, {"ok": True, "service": "notifications"})
            return
        prefix = "/notifications/"
        if path.startswith(prefix):
            user = path[len(prefix) :]
            rows = store.list(user)
            _json(self, 200, {"success": True, "count": len(rows), "data": rows})
            return
        _json(self, 404, {"error": "NOT_FOUND"})

    def do_POST(self):
        path = urlparse(self.path).path.rstrip("/")
        if path != "/notify":
            _json(self, 404, {"error": "NOT_FOUND"})
            return
        length = int(self.headers.get("Content-Length") or 0)
        raw = self.rfile.read(length) if length else b"{}"
        try:
            body = json.loads(raw.decode("utf-8") or "{}")
        except json.JSONDecodeError:
            _json(self, 400, {"error": "INVALID_JSON"})
            return
        try:
            item = store.send(body if isinstance(body, dict) else {})
        except NotifyError as exc:
            _json(self, 400, {"error": exc.code, "message": str(exc)})
            return
        _json(self, 200, {"success": True, "message": "Notification sent", "data": item})

    def do_DELETE(self):
        path = urlparse(self.path).path.rstrip("/")
        prefix = "/notifications/"
        if not path.startswith(prefix):
            _json(self, 404, {"error": "NOT_FOUND"})
            return
        item_id = path[len(prefix) :]
        try:
            store.delete(item_id)
        except NotifyError as exc:
            _json(self, 404, {"error": exc.code, "message": str(exc)})
            return
        _json(self, 200, {"success": True, "message": "Notification deleted"})


def serve(host: str = "127.0.0.1", port: int = 5000):
    httpd = ThreadingHTTPServer((host, port), Handler)
    print(f"Notification module on http://{host}:{port}")
    httpd.serve_forever()


if __name__ == "__main__":
    serve()
