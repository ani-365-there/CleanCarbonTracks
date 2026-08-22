from __future__ import annotations

from datetime import datetime, timedelta, timezone


DEFAULTS = {
    "weights": {"wait": 0.25, "severity": 0.3, "zone": 0.1, "repeats": 0.2, "category": 0.1, "sensitive": 0.05},
    "wait_cap_minutes": 360,
    "repeat_cap": 8,
    "sla_minutes": {"critical": 30, "high": 90, "medium": 240, "low": 720},
    "thresholds": {"critical": 0.8, "high": 0.6, "medium": 0.35},
}


def _clamp01(n) -> float:
    try:
        return min(1, max(0, float(n)))
    except (TypeError, ValueError):
        return 0


def _rank(score: float, thresholds: dict) -> str:
    if score >= thresholds["critical"]:
        return "critical"
    if score >= thresholds["high"]:
        return "high"
    if score >= thresholds["medium"]:
        return "medium"
    return "low"


class PriorityScorer:
    def __init__(self, weights=None, wait_cap_minutes=None, repeat_cap=None, sla_minutes=None, thresholds=None):
        self.weights = {**DEFAULTS["weights"], **(weights or {})}
        self.wait_cap_minutes = wait_cap_minutes or DEFAULTS["wait_cap_minutes"]
        self.repeat_cap = repeat_cap or DEFAULTS["repeat_cap"]
        self.sla_minutes = {**DEFAULTS["sla_minutes"], **(sla_minutes or {})}
        self.thresholds = {**DEFAULTS["thresholds"], **(thresholds or {})}

    def score(self, factors: dict, now: datetime | None = None, opened_at: datetime | None = None) -> dict:
        now = now or datetime.now(timezone.utc)
        wait = _clamp01(factors["waitMinutes"] / self.wait_cap_minutes)
        severity = _clamp01(factors["severity"])
        zone_raw = factors.get("zoneMultiplier")
        if zone_raw is None:
            zone = 0
        elif zone_raw > 1:
            zone = _clamp01(zone_raw - 1)
        else:
            zone = _clamp01(zone_raw)
        repeats = _clamp01(factors.get("repeatCount", 1) / self.repeat_cap)
        category = _clamp01(factors.get("categoryWeight", 0))
        sensitive = 1 if factors.get("sensitiveLocation") else 0
        w = self.weights
        raw = (
            wait * w["wait"]
            + severity * w["severity"]
            + zone * w["zone"]
            + repeats * w["repeats"]
            + category * w["category"]
            + sensitive * w["sensitive"]
        )
        score = round(_clamp01(raw), 4)
        rank = _rank(score, self.thresholds)
        opened = _aware(opened_at or (now - timedelta(minutes=factors["waitMinutes"])))
        now = _aware(now)
        sla_due = opened + timedelta(minutes=self.sla_minutes[rank])
        return {
            "score": score,
            "rankHint": rank,
            "slaDueAt": sla_due.isoformat().replace("+00:00", "Z"),
            "breached": now > sla_due,
            "breakdown": {
                "wait": round(wait * w["wait"], 4),
                "severity": round(severity * w["severity"], 4),
                "zone": round(zone * w["zone"], 4),
                "repeats": round(repeats * w["repeats"], 4),
                "category": round(category * w["category"], 4),
                "sensitive": round(sensitive * w["sensitive"], 4),
            },
        }


def _aware(dt: datetime) -> datetime:
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)


def create_priority_scorer(**kwargs) -> PriorityScorer:
    return PriorityScorer(**kwargs)
