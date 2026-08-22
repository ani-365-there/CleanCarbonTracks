from __future__ import annotations

import math


class GeoError(Exception):
    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code


def assert_point(point: dict, label: str = "point") -> dict:
    lat = point.get("lat")
    lng = point.get("lng")
    if not isinstance(lat, (int, float)) or lat < -90 or lat > 90:
        raise GeoError("INVALID_LAT", f"{label}.lat must be between -90 and 90")
    if not isinstance(lng, (int, float)) or lng < -180 or lng > 180:
        raise GeoError("INVALID_LNG", f"{label}.lng must be between -180 and 180")
    return point


def haversine_meters(a: dict, b: dict) -> float:
    assert_point(a, "a")
    assert_point(b, "b")
    earth = 6_371_000
    d_lat = math.radians(b["lat"] - a["lat"])
    d_lng = math.radians(b["lng"] - a["lng"])
    h = (
        math.sin(d_lat / 2) ** 2
        + math.cos(math.radians(a["lat"]))
        * math.cos(math.radians(b["lat"]))
        * math.sin(d_lng / 2) ** 2
    )
    return 2 * earth * math.asin(min(1, math.sqrt(h)))


def centroid(points: list[dict]) -> dict:
    if not points:
        raise GeoError("EMPTY_POINTS", "Cannot compute centroid of no points")
    lat = sum(p["lat"] for p in points) / len(points)
    lng = sum(p["lng"] for p in points) / len(points)
    return {"lat": lat, "lng": lng}


def in_bounding_box(point: dict, box: dict) -> bool:
    assert_point(point)
    return box["south"] <= point["lat"] <= box["north"] and box["west"] <= point["lng"] <= box["east"]
