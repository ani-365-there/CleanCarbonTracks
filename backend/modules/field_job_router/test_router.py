from field_job_router import haversine_meters, plan_route

DEPOT = {"lat": 20.35, "lng": 85.818}


def test_clusters_nearby_jobs():
    mess_a = {"id": "a", "location": {"lat": 20.3542, "lng": 85.8191}, "priority": 0.95}
    mess_b = {"id": "b", "location": {"lat": 20.3543, "lng": 85.8192}, "priority": 0.4}
    far = {"id": "c", "location": {"lat": 20.362, "lng": 85.83}, "priority": 0.5}
    plan = plan_route([mess_b, far, mess_a], DEPOT, cluster_radius_meters=120, priority_weight=0.6)
    assert plan["clusters"] == 2
    assert sorted(s["id"] for s in plan["stops"][:2]) == ["a", "b"]
    assert plan["stops"][0]["clusterId"] == plan["stops"][1]["clusterId"]
    assert plan["totalDistanceMeters"] > 0


def test_skips_over_capacity():
    plan = plan_route(
        [
            {"id": "small", "location": DEPOT, "priority": 0.2, "demand": 1},
            {"id": "huge", "location": DEPOT, "priority": 0.9, "demand": 10},
        ],
        DEPOT,
        capacity=3,
    )
    assert any(s["job"]["id"] == "huge" for s in plan["skipped"])
    assert any(s["id"] == "small" for s in plan["stops"])


def test_shorter_than_naive_far_first():
    jobs = [
        {"id": "near", "location": {"lat": 20.351, "lng": 85.818}, "priority": 0.5},
        {"id": "mid", "location": {"lat": 20.353, "lng": 85.818}, "priority": 0.5},
        {"id": "far", "location": {"lat": 20.356, "lng": 85.818}, "priority": 0.5},
    ]
    plan = plan_route(jobs, DEPOT, cluster_radius_meters=5000, priority_weight=0)
    naive = (
        haversine_meters(DEPOT, jobs[2]["location"])
        + haversine_meters(jobs[2]["location"], jobs[0]["location"])
        + haversine_meters(jobs[0]["location"], jobs[1]["location"])
    )
    assert plan["totalDistanceMeters"] < naive
