from intake import create_field_report_kit


def test_create_and_close_once():
    kit = create_field_report_kit(allowed_categories=["wet", "dry", "mixed"])
    report = kit.create(
        {
            "location": {"lat": 20.35, "lng": 85.82},
            "category": "Mixed",
            "summary": "Overflowing mess bin",
            "attachments": [{"id": "img-1", "kind": "image", "mime": "image/jpeg", "byteSize": 12000}],
            "reporterId": "u1",
        }
    )
    assert report["status"] == "open"
    assert report["category"] == "mixed"
    kit.transition(report["id"], "acknowledged")
    closed = kit.transition(report["id"], "closed")
    assert closed.get("closedAt")
    try:
        kit.transition(report["id"], "open")
        raise AssertionError("expected terminal error")
    except Exception as exc:
        assert "already closed" in str(exc)


def test_rejects_unknown_category():
    kit = create_field_report_kit(allowed_categories=["wet"])
    try:
        kit.create({"location": {"lat": 1, "lng": 1}, "category": "nuclear"})
        raise AssertionError("expected unknown category")
    except Exception as exc:
        assert "Unsupported category" in str(exc)
