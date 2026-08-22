from __future__ import annotations

import copy
import uuid
from datetime import datetime, timezone

from .geo import assert_point, haversine_meters, in_bounding_box


class RegistryError(Exception):
    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code


def _iso(now) -> str:
    return now().astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def _clone(asset: dict) -> dict:
    return copy.deepcopy(asset)


def _normalize_code(code: str) -> str:
    trimmed = code.strip()
    if not trimmed:
        raise RegistryError("INVALID_CODE", "Asset code is required")
    return trimmed.upper()


def _matches(asset: dict, filt: dict | None) -> bool:
    if not filt:
        return True
    if filt.get("type") and asset["type"] != filt["type"]:
        return False
    if filt.get("status") and asset["status"] != filt["status"]:
        return False
    if filt.get("tags") and not all(tag in asset["tags"] for tag in filt["tags"]):
        return False
    if filt.get("query"):
        q = filt["query"].strip().lower()
        hay = f"{asset['name']} {asset['code']} {asset['type']} {' '.join(asset['tags'])}".lower()
        if q not in hay:
            return False
    return True


class GeoAssetRegistry:
    def __init__(self, now=None, id_factory=None):
        self._assets: dict[str, dict] = {}
        self._by_code: dict[str, str] = {}
        self._now = now or (lambda: datetime.now(timezone.utc))
        self._id = id_factory or (lambda: str(uuid.uuid4()))

    def create(self, inp: dict) -> dict:
        code = _normalize_code(inp["code"])
        if code in self._by_code:
            raise RegistryError("CODE_TAKEN", f"Asset code {code} is already used")
        return self.upsert(inp)

    def upsert(self, inp: dict) -> dict:
        code = _normalize_code(inp["code"])
        name = inp["name"].strip()
        typ = inp["type"].strip()
        if not name:
            raise RegistryError("INVALID_NAME", "Asset name is required")
        if not typ:
            raise RegistryError("INVALID_TYPE", "Asset type is required")
        assert_point(inp["location"], "location")

        existing_id = inp.get("id") or self._by_code.get(code)
        existing = self._assets.get(existing_id) if existing_id else None
        stamp = _iso(self._now)

        if existing and inp.get("id") and existing["code"] != code and code in self._by_code:
            raise RegistryError("CODE_TAKEN", f"Asset code {code} is already used")
        if not existing and code in self._by_code:
            raise RegistryError("CODE_TAKEN", f"Asset code {code} is already used")

        tags = list(dict.fromkeys(t.strip() for t in (inp.get("tags") or (existing or {}).get("tags") or []) if t.strip()))
        asset = {
            "id": (existing or {}).get("id") or existing_id or self._id(),
            "code": code,
            "name": name,
            "type": typ,
            "location": dict(inp["location"]),
            "status": inp.get("status") or (existing or {}).get("status") or "active",
            "tags": tags,
            "metadata": dict(inp.get("metadata") or (existing or {}).get("metadata") or {}),
            "createdAt": (existing or {}).get("createdAt") or stamp,
            "updatedAt": stamp,
        }
        if existing and existing["code"] != code:
            self._by_code.pop(existing["code"], None)
        self._assets[asset["id"]] = asset
        self._by_code[code] = asset["id"]
        return _clone(asset)

    def get(self, asset_id: str) -> dict | None:
        asset = self._assets.get(asset_id)
        return _clone(asset) if asset else None

    def get_by_code(self, code: str) -> dict | None:
        asset_id = self._by_code.get(_normalize_code(code))
        return self.get(asset_id) if asset_id else None

    def remove(self, asset_id: str) -> bool:
        asset = self._assets.pop(asset_id, None)
        if not asset:
            return False
        self._by_code.pop(asset["code"], None)
        return True

    def list(self, filt: dict | None = None) -> list[dict]:
        return [_clone(a) for a in self._assets.values() if _matches(a, filt)]

    def nearest(self, origin: dict, limit: int = 5, max_distance_meters: float | None = None, **filt) -> list[dict]:
        if limit < 1:
            raise RegistryError("INVALID_LIMIT", "limit must be >= 1")
        ranked = []
        for asset in self.list(filt or None):
            item = _clone(asset)
            item["distanceMeters"] = haversine_meters(origin, asset["location"])
            if max_distance_meters is None or item["distanceMeters"] <= max_distance_meters:
                ranked.append(item)
        ranked.sort(key=lambda a: a["distanceMeters"])
        return ranked[:limit]

    def within_radius(self, origin: dict, radius_meters: float, filt: dict | None = None) -> list[dict]:
        if not radius_meters > 0:
            raise RegistryError("INVALID_RADIUS", "radiusMeters must be > 0")
        return self.nearest(origin, limit=10**9, max_distance_meters=radius_meters, **(filt or {}))

    def in_box(self, box: dict, filt: dict | None = None) -> list[dict]:
        if box["north"] < box["south"]:
            raise RegistryError("INVALID_BOX", "north must be >= south")
        return [a for a in self.list(filt) if in_bounding_box(a["location"], box)]

    def count_by_type(self, filt: dict | None = None) -> dict[str, int]:
        counts: dict[str, int] = {}
        for asset in self.list(filt):
            counts[asset["type"]] = counts.get(asset["type"], 0) + 1
        return counts

    def export_all(self) -> list[dict]:
        return self.list()

    def import_all(self, assets: list[dict], mode: str = "merge") -> int:
        if mode == "replace":
            self._assets.clear()
            self._by_code.clear()
        for asset in assets:
            self.upsert(asset)
        return len(self._assets)


def create_geo_asset_registry(**kwargs) -> GeoAssetRegistry:
    return GeoAssetRegistry(**kwargs)
