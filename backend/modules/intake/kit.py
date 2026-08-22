from __future__ import annotations

import copy
import uuid
from datetime import datetime, timezone

from .geo import assert_point


class ReportError(Exception):
    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code


TERMINAL = {"closed", "rejected"}


def _iso(now) -> str:
    dt = now()
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat().replace("+00:00", "Z")


class FieldReportKit:
    def __init__(self, now=None, id_factory=None, allowed_categories=None):
        self._reports: dict[str, dict] = {}
        self._now = now or (lambda: datetime.now(timezone.utc))
        self._id = id_factory or (lambda: str(uuid.uuid4()))
        self._allowed = {c.strip().lower() for c in allowed_categories} if allowed_categories else None

    def create(self, inp: dict) -> dict:
        category = inp["category"].strip().lower()
        if not category:
            raise ReportError("INVALID_CATEGORY", "category is required")
        if self._allowed is not None and category not in self._allowed:
            raise ReportError("UNKNOWN_CATEGORY", f"Unsupported category: {category}")
        assert_point(inp["location"], "location")
        stamp = _iso(self._now)
        summary = (inp.get("summary") or f"{category} report").strip()
        if not summary:
            raise ReportError("INVALID_SUMMARY", "summary is required")
        code = inp.get("assetCode")
        report = {
            "id": inp.get("id") or self._id(),
            "reporterId": inp.get("reporterId"),
            "assetId": inp.get("assetId"),
            "assetCode": code.strip().upper() if code else None,
            "location": dict(inp["location"]),
            "category": category,
            "summary": summary,
            "notes": (inp.get("notes") or "").strip() or None,
            "attachments": [dict(a) for a in inp.get("attachments") or []],
            "status": "open",
            "source": inp.get("source") or "app",
            "metadata": dict(inp.get("metadata") or {}),
            "createdAt": stamp,
            "updatedAt": stamp,
        }
        if report["id"] in self._reports:
            raise ReportError("DUPLICATE_ID", f"Report {report['id']} already exists")
        self._reports[report["id"]] = report
        return copy.deepcopy(report)

    def get(self, report_id: str) -> dict | None:
        report = self._reports.get(report_id)
        return copy.deepcopy(report) if report else None

    def list(self, **filt) -> list[dict]:
        out = []
        for report in self._reports.values():
            if filt.get("status") and report["status"] != filt["status"]:
                continue
            if filt.get("category") and report["category"] != filt["category"].strip().lower():
                continue
            if filt.get("reporterId") and report["reporterId"] != filt["reporterId"]:
                continue
            if filt.get("assetId") and report["assetId"] != filt["assetId"]:
                continue
            out.append(copy.deepcopy(report))
        return out

    def transition(self, report_id: str, status: str, metadata: dict | None = None) -> dict:
        report = self._reports.get(report_id)
        if not report:
            raise ReportError("NOT_FOUND", f"Report {report_id} not found")
        if report["status"] in TERMINAL:
            raise ReportError("TERMINAL", f"Report {report_id} is already {report['status']}")
        stamp = _iso(self._now)
        report["status"] = status
        report["updatedAt"] = stamp
        if status in TERMINAL:
            report["closedAt"] = stamp
        if metadata:
            report["metadata"].update(metadata)
        return copy.deepcopy(report)


def create_field_report_kit(**kwargs) -> FieldReportKit:
    return FieldReportKit(**kwargs)
