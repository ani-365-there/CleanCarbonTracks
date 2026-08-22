from waste_network import create_waste_network


def test_full_loop():
    net = create_waste_network()
    resident = net["access"].get_user("user-resident")
    worker = net["access"].get_user("user-worker")
    a = net["file_report"](
        resident["id"],
        {"lat": 20.35422, "lng": 85.81912},
        "Overflowing food leftovers at the mess",
        filename="full.jpg",
        asset_code="BIN-KP7-WET",
    )
    b = net["file_report"](
        resident["id"],
        {"lat": 20.35423, "lng": 85.81913},
        "Mess bin still overflowing mixed waste",
        filename="full2.jpg",
        asset_code="BIN-KP7-WET",
    )
    assert b["merged"]["action"] == "merged"
    assert b["merged"]["group"]["count"] == 2
    assert len(net["inbox"].list()) >= 1
    net["file_report"](
        resident["id"],
        {"lat": 20.3568, "lng": 85.8215},
        "Dry cardboard beside parking",
        filename="cardboard.jpg",
        asset_code="BIN-PARK-DRY",
    )
    plan = net["plan_for_worker"](worker["id"], {"lat": 20.353, "lng": 85.818})
    assert len(plan["stops"]) >= 2
    stop = plan["stops"][0]
    closed = net["complete_with_proof"](worker["id"], stop["id"], stop["location"], "x", "after")
    assert closed["verified"]["ok"] is True
    assert net["heat"].kpis()["open"] < net["heat"].kpis()["total"]


def test_on_duty_auto_assigns_nearest_job():
    net = create_waste_network()
    resident = net["access"].get_user("user-resident")
    worker = net["access"].get_user("user-worker")
    net["file_report"](
        resident["id"],
        {"lat": 20.3542, "lng": 85.8191},
        "overflow mixed",
        category="mixed",
    )
    result = net["set_duty"](worker["id"], True, {"lat": 20.3543, "lng": 85.8192})
    assert result["onDuty"] is True
    assert result["assigned"] is not None
    dash = net["worker_dashboard"](worker["id"])
    assert dash["pendingCount"] == 1
    assert dash["doneCount"] == 0


def test_citizen_reports_include_pickup_status():
    net = create_waste_network()
    resident = net["access"].get_user("user-resident")
    net["file_report"](
        resident["id"],
        {"lat": 20.3542, "lng": 85.8191},
        "wet overflow",
        category="wet",
    )
    items = net["citizen_reports"](resident["id"])
    assert len(items) == 1
    assert items[0]["category"] == "wet"
    assert items[0]["pickupStatus"] in {"reported", "assigned"}


def test_resident_cannot_complete_jobs():
    net = create_waste_network()
    resident = net["access"].get_user("user-resident")
    net["file_report"](resident["id"], {"lat": 20.3542, "lng": 85.8191}, "overflow mixed")
    job = net["inbox"].list()[0]
    try:
        net["complete_with_proof"](resident["id"], job["id"], job["location"], "x", "a")
        raise AssertionError("expected forbidden")
    except Exception as exc:
        assert "Missing permission" in str(exc)
