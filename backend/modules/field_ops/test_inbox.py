from datetime import datetime, timezone

from field_ops import create_field_ops_inbox


def test_status_machine_and_events():
    inbox = create_field_ops_inbox()
    names = []
    inbox.subscribe("*", lambda event: names.append(event["name"]))
    job = inbox.create({"title": "Collect mess bin", "location": {"lat": 20.35, "lng": 85.82}, "priority": 0.9})
    inbox.assign(job["id"], "worker-1")
    inbox.start(job["id"], "worker-1")
    inbox.complete(job["id"])
    assert names == ["job.created", "job.assigned", "job.started", "job.completed"]
    assert inbox.get(job["id"])["status"] == "completed"
    try:
        inbox.start(job["id"])
        raise AssertionError("expected invalid transition")
    except Exception as exc:
        assert "Cannot move" in str(exc)


def test_overdue_emits_once():
    clock = {"now": datetime(2026, 8, 21, 10, 0, tzinfo=timezone.utc)}
    inbox = create_field_ops_inbox(now=lambda: clock["now"])
    overdue = []
    inbox.subscribe("job.overdue", lambda event: overdue.append(event["job"]["id"]))
    job = inbox.create({
        "title": "Late pickup",
        "location": {"lat": 20.35, "lng": 85.82},
        "slaDueAt": "2026-08-21T10:05:00.000Z",
    })
    assert inbox.scan_overdue() == []
    clock["now"] = datetime(2026, 8, 21, 10, 6, tzinfo=timezone.utc)
    assert len(inbox.scan_overdue()) == 1
    assert inbox.scan_overdue() == []
    assert overdue == [job["id"]]
