from map_intel import create_geo_asset_registry

MESS = {
    "code": "BIN-MESS-01",
    "name": "KP-7 Mess wet bin",
    "type": "wet-bin",
    "location": {"lat": 20.3542, "lng": 85.8191},
    "tags": ["hostel", "wet"],
}
PARKING = {
    "code": "BIN-PARK-01",
    "name": "Parking dry bin",
    "type": "dry-bin",
    "location": {"lat": 20.356, "lng": 85.821},
    "tags": ["parking", "dry"],
}


def test_nearest_and_code_lookup():
    registry = create_geo_asset_registry()
    created = registry.upsert(MESS)
    registry.upsert(PARKING)
    assert registry.get_by_code("bin-mess-01")["id"] == created["id"]
    nearest = registry.nearest({"lat": 20.3543, "lng": 85.81915}, limit=1)
    assert nearest[0]["code"] == "BIN-MESS-01"
    assert nearest[0]["distanceMeters"] < 50


def test_create_rejects_duplicate_code_upsert_updates():
    registry = create_geo_asset_registry()
    registry.create(MESS)
    try:
        registry.create({**MESS, "name": "copy"})
        raise AssertionError("expected duplicate error")
    except Exception as exc:
        assert "already used" in str(exc)
    assert "moved" in registry.upsert({**MESS, "name": "KP-7 Mess wet bin (moved)"})["name"]


def test_filters_and_radius():
    registry = create_geo_asset_registry()
    registry.upsert(MESS)
    registry.upsert(PARKING)
    wet = registry.within_radius(MESS["location"], 20, {"type": "wet-bin"})
    assert len(wet) == 1
    assert len(registry.list({"tags": ["parking"]})) == 1
    assert registry.count_by_type()["dry-bin"] == 1


def test_export_import():
    a = create_geo_asset_registry()
    a.upsert(MESS)
    b = create_geo_asset_registry()
    b.import_all(a.export_all(), mode="replace")
    assert b.get_by_code("BIN-MESS-01")["name"] == MESS["name"]
