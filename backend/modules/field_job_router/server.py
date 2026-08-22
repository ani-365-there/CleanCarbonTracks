"""Demo HTTP face. python -m field_job_router  →  http://127.0.0.1:5001"""

from __future__ import annotations

import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

from .router import plan_route

START = {"lat": 20.3534, "lng": 85.8184}
JOBS = [
    {"id": "kp7-wet", "title": "KP-7 mess overflow", "location": {"lat": 20.3542, "lng": 85.8191}, "priority": 0.95, "demand": 1},
    {"id": "kp7-dry", "title": "KP-7 dry bin", "location": {"lat": 20.35435, "lng": 85.8193}, "priority": 0.35, "demand": 1},
    {"id": "parking", "title": "Parking cardboard", "location": {"lat": 20.3568, "lng": 85.8215}, "priority": 0.55, "demand": 1},
    {"id": "truckload", "title": "Hostel bulk pickup", "location": {"lat": 20.3555, "lng": 85.8200}, "priority": 0.8, "demand": 8},
]
ROOT = Path(__file__).parent / "sample_frontend"


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
    _send(handler, status, json.dumps(payload), "application/json")


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
        if path == "/jobs":
            _json(self, 200, {"start": START, "jobs": JOBS})
            return
        _json(self, 404, {"error": "NOT_FOUND"})

    def do_POST(self):
        if urlparse(self.path).path.rstrip("/") != "/plan":
            _json(self, 404, {"error": "NOT_FOUND"})
            return
        length = int(self.headers.get("Content-Length") or 0)
        body = json.loads(self.rfile.read(length) or b"{}")
        jobs = body.get("jobs") or JOBS
        start = body.get("start") or START
        capacity = body.get("capacity")
        plan = plan_route(
            jobs,
            start,
            cluster_radius_meters=float(body.get("cluster_radius_meters") or 180),
            priority_weight=float(body.get("priority_weight") or 0.5),
            capacity=None if capacity in (None, "", 0) else float(capacity),
        )
        _json(self, 200, plan)


def serve(host: str = "127.0.0.1", port: int = 5001):
    print(f"Router demo → http://{host}:{port}")
    ThreadingHTTPServer((host, port), Handler).serve_forever()


if __name__ == "__main__":
    serve()
