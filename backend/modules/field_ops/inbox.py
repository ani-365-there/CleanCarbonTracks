from __future__ import annotations

import copy
import uuid
from collections import defaultdict
from datetime import datetime, timezone

ALLOWED = {
    "new": ["assigned", "failed"],
    "assigned": ["started", "assigned", "failed"],
    "started": ["completed", "failed"],
    "completed": [],
    "failed": [],
}


class InboxError(Exception):
    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code


def _iso(now) -> str:
    dt = now()
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat().replace("+00:00", "Z")


def _parse_ms(stamp: str) -> float:
    return datetime.fromisoformat(stamp.replace("Z", "+00:00")).timestamp() * 1000


class FieldOpsInbox:
    def __init__(self, now=None, id_factory=None):
        self._jobs: dict[str, dict] = {}
        self._listeners = defaultdict(set)
        self._now = now or (lambda: datetime.now(timezone.utc))
        self._id = id_factory or (lambda: str(uuid.uuid4()))

    def subscribe(self, name: str, handler):
        self._listeners[name].add(handler)
        return lambda: self._listeners[name].discard(handler)

    def create(self, inp: dict) -> dict:
        title = inp["title"].strip()
        if not title:
            raise InboxError("INVALID_TITLE", "title is required")
        stamp = _iso(self._now)
        job = {
            "id": inp.get("id") or self._id(),
            "title": title,
            "location": dict(inp["location"]),
            "priority": inp.get("priority", 0),
            "status": "assigned" if inp.get("assigneeId") else "new",
            "assigneeId": inp.get("assigneeId"),
            "sourceId": inp.get("sourceId"),
            "slaDueAt": inp.get("slaDueAt"),
            "metadata": dict(inp.get("metadata") or {}),
            "createdAt": stamp,
            "updatedAt": stamp,
            "overdueEmitted": False,
        }
        self._jobs[job["id"]] = job
        self._emit("job.created", job)
        if job.get("assigneeId"):
            self._emit("job.assigned", job)
        return copy.deepcopy(job)

    def set_priority(self, job_id: str, priority: float) -> dict:
        job = self._require(job_id)
        job["priority"] = priority
        job["updatedAt"] = _iso(self._now)
        return copy.deepcopy(job)

    def get(self, job_id: str) -> dict | None:
        job = self._jobs.get(job_id)
        return copy.deepcopy(job) if job else None

    def list(self, status: str | None = None, assignee_id: str | None = None) -> list[dict]:
        jobs = []
        for job in self._jobs.values():
            if status and job["status"] != status:
                continue
            if assignee_id and job.get("assigneeId") != assignee_id:
                continue
            jobs.append(copy.deepcopy(job))
        jobs.sort(key=lambda j: (-j["priority"], j["createdAt"]))
        return jobs

    def assign(self, job_id: str, assignee_id: str) -> dict:
        job = self._require(job_id)
        event = "job.reassigned" if job.get("assigneeId") and job["assigneeId"] != assignee_id else "job.assigned"
        self._move(job, "assigned")
        job["assigneeId"] = assignee_id
        self._emit(event, job, job["status"])
        return copy.deepcopy(job)

    def start(self, job_id: str, actor_id: str | None = None) -> dict:
        job = self._require(job_id)
        if actor_id and job.get("assigneeId") and job["assigneeId"] != actor_id:
            raise InboxError("FORBIDDEN", "Job is assigned to someone else")
        self._move(job, "started")
        job["startedAt"] = _iso(self._now)
        self._emit("job.started", job, "assigned")
        return copy.deepcopy(job)

    def complete(self, job_id: str) -> dict:
        job = self._require(job_id)
        self._move(job, "completed")
        job["finishedAt"] = _iso(self._now)
        self._emit("job.completed", job, "started")
        return copy.deepcopy(job)

    def fail(self, job_id: str, reason: str) -> dict:
        job = self._require(job_id)
        previous = job["status"]
        self._move(job, "failed")
        job["finishedAt"] = _iso(self._now)
        job["metadata"]["failReason"] = reason
        self._emit("job.failed", job, previous)
        return copy.deepcopy(job)

    def scan_overdue(self) -> list[dict]:
        now_ms = self._now().timestamp() * 1000
        flagged = []
        for job in self._jobs.values():
            if job["overdueEmitted"] or not job.get("slaDueAt"):
                continue
            if job["status"] in {"completed", "failed"}:
                continue
            if _parse_ms(job["slaDueAt"]) >= now_ms:
                continue
            job["overdueEmitted"] = True
            job["updatedAt"] = _iso(self._now)
            self._emit("job.overdue", job)
            flagged.append(copy.deepcopy(job))
        return flagged

    def _require(self, job_id: str) -> dict:
        job = self._jobs.get(job_id)
        if not job:
            raise InboxError("NOT_FOUND", f"Job {job_id} not found")
        return job

    def _move(self, job: dict, next_status: str) -> None:
        if job["status"] == next_status:
            job["updatedAt"] = _iso(self._now)
            return
        if next_status not in ALLOWED[job["status"]]:
            raise InboxError("INVALID_TRANSITION", f"Cannot move {job['status']} → {next_status}")
        job["status"] = next_status
        job["updatedAt"] = _iso(self._now)

    def _emit(self, name: str, job: dict, previous_status: str | None = None) -> None:
        event = {"name": name, "at": _iso(self._now), "job": copy.deepcopy(job), "previousStatus": previous_status}
        for handler in list(self._listeners.get(name, set())):
            handler(event)
        for handler in list(self._listeners.get("*", set())):
            handler(event)


def create_field_ops_inbox(**kwargs) -> FieldOpsInbox:
    return FieldOpsInbox(**kwargs)
