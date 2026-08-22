from datetime import datetime, timezone

from field_ops import create_priority_scorer


def test_hot_outranks_mild():
    scorer = create_priority_scorer()
    hot = scorer.score({
        "waitMinutes": 240,
        "severity": 0.9,
        "repeatCount": 8,
        "categoryWeight": 0.8,
        "sensitiveLocation": True,
        "zoneMultiplier": 1.4,
    })
    mild = scorer.score({
        "waitMinutes": 5,
        "severity": 0.2,
        "repeatCount": 1,
        "categoryWeight": 0.1,
    })
    assert hot["score"] > mild["score"]
    assert hot["rankHint"] == "critical"
    assert mild["rankHint"] == "low"


def test_sla_breach():
    scorer = create_priority_scorer(
        sla_minutes={"critical": 10, "high": 10, "medium": 10, "low": 10},
        thresholds={"critical": 0.9, "high": 0.8, "medium": 0.7},
    )
    opened = datetime(2026, 8, 21, 10, 0, tzinfo=timezone.utc)
    now = datetime(2026, 8, 21, 10, 20, tzinfo=timezone.utc)
    result = scorer.score({"waitMinutes": 20, "severity": 0.1}, now=now, opened_at=opened)
    assert result["breached"] is True
