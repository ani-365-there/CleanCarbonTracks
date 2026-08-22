from map_intel import create_heatmap_kpi


def test_buckets_and_time_to_close():
    heat = create_heatmap_kpi(cell_size_meters=80)
    heat.ingest_many(
        [
            {
                "id": "1",
                "location": {"lat": 20.3542, "lng": 85.8191},
                "openedAt": "2026-08-21T10:00:00.000Z",
                "closedAt": "2026-08-21T10:20:00.000Z",
                "zone": "kp7",
                "category": "mixed",
            },
            {
                "id": "2",
                "location": {"lat": 20.35421, "lng": 85.81911},
                "openedAt": "2026-08-21T11:00:00.000Z",
                "zone": "kp7",
                "category": "wet",
            },
            {
                "id": "3",
                "location": {"lat": 20.36, "lng": 85.83},
                "openedAt": "2026-08-21T09:00:00.000Z",
                "closedAt": "2026-08-21T10:00:00.000Z",
                "zone": "parking",
                "category": "dry",
            },
        ]
    )
    grid = heat.grid()
    assert len(grid) >= 2
    assert heat.hotspots(1)[0]["count"] == 2
    kpis = heat.kpis()
    assert kpis["total"] == 3
    assert kpis["open"] == 1
    assert kpis["avgCloseMinutes"] == 40
    assert next(z for z in kpis["byZone"] if z["zone"] == "kp7")["openCount"] == 1
