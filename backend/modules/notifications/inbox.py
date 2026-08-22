from __future__ import annotations

import copy
import uuid
from collections import defaultdict
from datetime import datetime, timezone


class NotifyError(Exception):
    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code


def _iso(now) -> str:
    dt = now()
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat().replace("+00:00", "Z")


class Notifications:
    """Per-user in-memory inbox. Domain-free: jobs, payments, chat, system alerts."""

    def __init__(self, now=None, id_factory=None, max_per_user: int = 50):
        self._items: dict[str, dict] = {}
        self._listeners = defaultdict(set)
        self._now = now or (lambda: datetime.now(timezone.utc))
        self._id = id_factory or (lambda: str(uuid.uuid4()))
        self._max_per_user = max(1, int(max_per_user))

    def subscribe(self, name: str, handler):
        self._listeners[name].add(handler)
        return lambda: self._listeners[name].discard(handler)

    def send(self, inp: dict) -> dict:
        user = str(inp.get("user") or inp.get("userId") or "").strip()
        message = str(inp.get("message") or inp.get("body") or "").strip()
        if not user:
            raise NotifyError("INVALID_USER", "user is required")
        if not message:
            raise NotifyError("INVALID_MESSAGE", "message is required")
        stamp = _iso(self._now)
        item = {
            "id": str(inp.get("id") or self._id()),
            "user": user,
            "message": message,
            "title": (inp.get("title") or "").strip() or None,
            "channel": (inp.get("channel") or "general").strip() or "general",
            "read": False,
            "createdAt": stamp,
        }
        self._items[item["id"]] = item
        self._trim(user)
        self._emit("notification.sent", item)
        return copy.deepcopy(item)

    def get(self, item_id: str) -> dict | None:
        item = self._items.get(str(item_id))
        return copy.deepcopy(item) if item else None

    def list(self, user: str, unread_only: bool = False, channel: str | None = None) -> list[dict]:
        user = str(user).strip()
        rows = [copy.deepcopy(n) for n in self._items.values() if n["user"] == user]
        if unread_only:
            rows = [n for n in rows if not n["read"]]
        if channel:
            rows = [n for n in rows if n["channel"] == channel]
        rows.sort(key=lambda n: n["createdAt"], reverse=True)
        return rows

    def mark_read(self, item_id: str) -> dict:
        item = self._require(item_id)
        item["read"] = True
        self._emit("notification.read", item)
        return copy.deepcopy(item)

    def delete(self, item_id: str) -> dict:
        item = self._require(item_id)
        del self._items[str(item_id)]
        self._emit("notification.deleted", item)
        return copy.deepcopy(item)

    def _trim(self, user: str) -> None:
        owned = sorted(
            (n for n in self._items.values() if n["user"] == user),
            key=lambda n: n["createdAt"],
        )
        extra = len(owned) - self._max_per_user
        for old in owned[: max(0, extra)]:
            self._items.pop(old["id"], None)

    def _require(self, item_id: str) -> dict:
        item = self._items.get(str(item_id))
        if not item:
            raise NotifyError("NOT_FOUND", f"notification {item_id} not found")
        return item

    def _emit(self, name: str, item: dict) -> None:
        event = {"name": name, "at": _iso(self._now), "notification": copy.deepcopy(item)}
        for handler in list(self._listeners.get(name, set()) | self._listeners.get("*", set())):
            handler(event)


def create_notifications(**kwargs) -> Notifications:
    return Notifications(**kwargs)
