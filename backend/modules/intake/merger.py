from __future__ import annotations

import copy
import uuid
from datetime import datetime, timezone

from .geo import centroid, haversine_meters


def _parse(value) -> datetime:
    if isinstance(value, datetime):
        return value
    return datetime.fromisoformat(str(value).replace("Z", "+00:00"))


def _iso(dt: datetime) -> str:
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat().replace("+00:00", "Z")


class DuplicateMerger:
    def __init__(
        self,
        radius_meters: float = 40,
        window_ms: float = 3 * 60 * 60 * 1000,
        same_category_only: bool = False,
        prefer_same_asset: bool = True,
        id_factory=None,
    ):
        self.radius_meters = radius_meters
        self.window_ms = window_ms
        self.same_category_only = same_category_only
        self.prefer_same_asset = prefer_same_asset
        self._id = id_factory or (lambda: str(uuid.uuid4()))
        self._groups: dict[str, dict] = {}
        self._by_member: dict[str, str] = {}

    def ingest(self, report: dict) -> dict:
        if report["id"] in self._by_member:
            group = self._groups[self._by_member[report["id"]]]
            return {"action": "merged", "group": copy.deepcopy(group), "similarity": 1}

        created_at = _parse(report["createdAt"])
        candidate = self._best(report, created_at)
        if not candidate:
            group = {
                "id": self._id(),
                "primaryId": report["id"],
                "memberIds": [report["id"]],
                "location": dict(report["location"]),
                "category": report.get("category"),
                "assetId": report.get("assetId"),
                "count": 1,
                "firstAt": _iso(created_at),
                "lastAt": _iso(created_at),
                "status": "open",
            }
            self._groups[group["id"]] = group
            self._by_member[report["id"]] = group["id"]
            return {"action": "created", "group": copy.deepcopy(group), "similarity": 0}

        group = candidate["group"]
        group["memberIds"].append(report["id"])
        group["count"] += 1
        group["lastAt"] = _iso(created_at)
        group["location"] = centroid([group["location"], report["location"]])
        if not group.get("assetId") and report.get("assetId"):
            group["assetId"] = report["assetId"]
        self._by_member[report["id"]] = group["id"]
        return {"action": "merged", "group": copy.deepcopy(group), "similarity": candidate["similarity"]}

    def get_by_member(self, report_id: str) -> dict | None:
        group_id = self._by_member.get(report_id)
        group = self._groups.get(group_id) if group_id else None
        return copy.deepcopy(group) if group else None

    def list_open(self) -> list[dict]:
        return [copy.deepcopy(g) for g in self._groups.values() if g["status"] == "open"]

    def close_group(self, group_id: str) -> dict:
        group = self._groups.get(group_id)
        if not group:
            raise KeyError(f"Group {group_id} not found")
        group["status"] = "closed"
        return copy.deepcopy(group)

    def _best(self, report: dict, created_at: datetime) -> dict | None:
        best = None
        for group in self._groups.values():
            if group["status"] != "open":
                continue
            if self.same_category_only and report.get("category") and group.get("category") and report["category"] != group["category"]:
                continue
            distance = haversine_meters(report["location"], group["location"])
            if distance > self.radius_meters:
                continue
            dt = abs((created_at - _parse(group["lastAt"])).total_seconds() * 1000)
            if dt > self.window_ms:
                continue
            distance_score = 1 - distance / self.radius_meters
            time_score = 1 - dt / self.window_ms
            category_bonus = 0.15 if report.get("category") and report["category"] == group.get("category") else 0
            asset_bonus = 0.2 if self.prefer_same_asset and report.get("assetId") and report["assetId"] == group.get("assetId") else 0
            similarity = min(1, distance_score * 0.55 + time_score * 0.25 + category_bonus + asset_bonus)
            if best is None or similarity > best["similarity"]:
                best = {"group": group, "similarity": similarity}
        return best


def create_duplicate_merger(**kwargs) -> DuplicateMerger:
    return DuplicateMerger(**kwargs)
