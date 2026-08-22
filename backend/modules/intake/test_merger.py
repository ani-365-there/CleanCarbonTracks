from intake import create_duplicate_merger

NEAR = {"lat": 20.3542, "lng": 85.8191}
ALSO_NEAR = {"lat": 20.35422, "lng": 85.81912}
FAR = {"lat": 20.36, "lng": 85.83}


def test_merges_nearby_reports():
    merger = create_duplicate_merger(radius_meters=40, window_ms=60 * 60 * 1000)
    first = merger.ingest({
        "id": "r1",
        "location": NEAR,
        "createdAt": "2026-08-21T10:00:00.000Z",
        "category": "mixed",
        "assetId": "bin-1",
    })
    second = merger.ingest({
        "id": "r2",
        "location": ALSO_NEAR,
        "createdAt": "2026-08-21T10:08:00.000Z",
        "category": "mixed",
        "assetId": "bin-1",
    })
    assert first["action"] == "created"
    assert second["action"] == "merged"
    assert second["group"]["count"] == 2
    assert second["group"]["memberIds"] == ["r1", "r2"]
    assert second["similarity"] > 0.5


def test_does_not_merge_far_reports():
    merger = create_duplicate_merger(radius_meters=40)
    merger.ingest({"id": "r1", "location": NEAR, "createdAt": "2026-08-21T10:00:00.000Z"})
    other = merger.ingest({"id": "r2", "location": FAR, "createdAt": "2026-08-21T10:01:00.000Z"})
    assert other["action"] == "created"
    assert len(merger.list_open()) == 2
