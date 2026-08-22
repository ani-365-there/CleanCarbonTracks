from notifications import NotifyError, create_notifications


def test_send_and_list_per_user():
    n = create_notifications()
    a = n.send({"user": "ria", "message": "Bin collected"})
    n.send({"user": "arun", "message": "Job assigned"})
    rows = n.list("ria")
    assert len(rows) == 1
    assert rows[0]["id"] == a["id"]
    assert rows[0]["message"] == "Bin collected"
    assert rows[0]["read"] is False
    assert rows[0]["createdAt"].endswith("Z")


def test_trim_is_per_user_not_global():
    n = create_notifications(max_per_user=2)
    n.send({"user": "a", "message": "1"})
    n.send({"user": "a", "message": "2"})
    n.send({"user": "a", "message": "3"})
    n.send({"user": "b", "message": "keep-b"})
    assert len(n.list("a")) == 2
    assert [x["message"] for x in n.list("a")] == ["3", "2"]
    assert len(n.list("b")) == 1


def test_delete_and_missing():
    n = create_notifications()
    item = n.send({"user": "u", "message": "x"})
    n.delete(item["id"])
    assert n.list("u") == []
    try:
        n.delete(item["id"])
        assert False, "expected NOT_FOUND"
    except NotifyError as exc:
        assert exc.code == "NOT_FOUND"


def test_subscribe_and_mark_read():
    n = create_notifications()
    seen = []
    n.subscribe("*", seen.append)
    item = n.send({"user": "u", "title": "SLA", "channel": "jobs", "message": "overdue"})
    n.mark_read(item["id"])
    assert n.get(item["id"])["read"] is True
    assert [e["name"] for e in seen] == ["notification.sent", "notification.read"]
