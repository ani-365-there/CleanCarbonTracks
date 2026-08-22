from __future__ import annotations

import copy
from collections import defaultdict

from .geo import haversine_meters

METERS_PER_DEG_LAT = 111_320


def _cell_key(point: dict, deg: float) -> tuple[str, float, float]:
    south = (point["lat"] // deg) * deg
    west = (point["lng"] // deg) * deg
    return f"{south:.5f}:{west:.5f}", south, west


def _close_minutes(event: dict) -> float | None:
    if not event.get("closedAt"):
        return None
    from datetime import datetime

    ms = (
        datetime.fromisoformat(event["closedAt"].replace("Z", "+00:00")).timestamp()
        - datetime.fromisoformat(event["openedAt"].replace("Z", "+00:00")).timestamp()
    ) * 1000
    if ms < 0:
        return None
    return ms / 60000


class HeatmapKpi:
    def __init__(self, cell_size_meters: float = 80):
        self.cell_size_meters = cell_size_meters
        self.cell_deg = cell_size_meters / METERS_PER_DEG_LAT
        self._events: dict[str, dict] = {}

    def ingest(self, event: dict) -> None:
        stored = copy.deepcopy(event)
        stored["location"] = dict(event["location"])
        self._events[event["id"]] = stored

    def ingest_many(self, events: list[dict]) -> None:
        for event in events:
            self.ingest(event)

    def close(self, event_id: str, closed_at: str) -> None:
        event = self._events.get(event_id)
        if not event:
            raise KeyError(f"Event {event_id} not found")
        event["closedAt"] = closed_at

    def grid(self) -> list[dict]:
        cells: dict[str, dict] = {}
        for event in self._events.values():
            key, south, west = _cell_key(event["location"], self.cell_deg)
            current = cells.get(key) or {
                "key": key,
                "south": south,
                "west": west,
                "north": south + self.cell_deg,
                "east": west + self.cell_deg,
                "count": 0,
                "openCount": 0,
                "weight": 0,
            }
            current["count"] += 1
            current["weight"] += event.get("weight", 1)
            if not event.get("closedAt"):
                current["openCount"] += 1
            cells[key] = current
        return sorted(cells.values(), key=lambda c: c["weight"], reverse=True)

    def hotspots(self, limit: int = 5) -> list[dict]:
        return self.grid()[:limit]

    def kpis(self) -> dict:
        closes = []
        by_zone = defaultdict(lambda: {"count": 0, "open": 0, "closes": []})
        by_category: dict[str, int] = {}
        open_count = 0
        for event in self._events.values():
            minutes = _close_minutes(event)
            if minutes is None:
                open_count += 1
            else:
                closes.append(minutes)
            zone = event.get("zone") or "unspecified"
            z = by_zone[zone]
            z["count"] += 1
            if minutes is None:
                z["open"] += 1
            else:
                z["closes"].append(minutes)
            if event.get("category"):
                by_category[event["category"]] = by_category.get(event["category"], 0) + 1

        def avg(values):
            return round(sum(values) / len(values), 2) if values else None

        return {
            "total": len(self._events),
            "open": open_count,
            "avgCloseMinutes": avg(closes),
            "byZone": [
                {
                    "zone": zone,
                    "count": v["count"],
                    "openCount": v["open"],
                    "avgCloseMinutes": avg(v["closes"]),
                }
                for zone, v in by_zone.items()
            ],
            "byCategory": by_category,
        }

    def nearby_count(self, origin: dict, radius_meters: float) -> int:
        return sum(1 for e in self._events.values() if haversine_meters(origin, e["location"]) <= radius_meters)


def create_heatmap_kpi(**kwargs) -> HeatmapKpi:
    return HeatmapKpi(**kwargs)
