# Map intel

Geo-asset catalog + area heatmap / KPIs.

**Does not import other sellable modules.** Domain-free: bins, streetlights, labs, civic tickets.

```python
from map_intel import create_map_intel, create_geo_asset_registry, create_heatmap_kpi
```

Facade: `create_map_intel()` wires assets + heat. You can still use the two engines separately.

---

## Asset registry (`create_geo_asset_registry`)

Catalog of anything with a pin.

### Expects

A **GeoPoint**: `{"lat": float, "lng": float}` (`lat` −90…90, `lng` −180…180).

| Field | Required | Notes |
|---|---|---|
| `code` | yes | Unique business id / QR text. Stored uppercase. |
| `name` | yes | Display name |
| `type` | yes | Your string, e.g. `wet-bin`, `streetlight` |
| `location` | yes | GeoPoint |
| `status` | no | `active` / `inactive` / `missing` (default `active`) |
| `tags` | no | list of strings |
| `metadata` | no | `dict[str, str]` |
| `id` | no | UUID if you want to set it |

List / nearest filters (all optional): `type`, `status`, `tags` (all must match), `query` (substring on name/code/type/tags).

### Does / how

Stores assets in memory. Looks them up by id or code. Finds nearest / in-radius / in-box. Haversine on a sphere (Earth radius 6,371 km). `upsert` updates if `code` already exists. `create` fails if `code` is taken.

### Outputs

Asset dict: `{id, code, name, type, location, status, tags, metadata, createdAt, updatedAt}`.  
`nearest(...)` adds `distanceMeters` (float).

```python
assets = create_geo_asset_registry()
assets.create({...})
assets.get(id)
assets.get_by_code("BIN-01")
assets.list({"type": "wet-bin"})
assets.nearest({"lat": ..., "lng": ...}, limit=3, type="wet-bin")
assets.within_radius(origin, 80, {"tags": ["hostel"]})
assets.in_box({"north", "south", "east", "west"})
assets.count_by_type()
assets.export_all() / import_all(rows, mode="merge"|"replace")
assets.remove(id)
```

Raises `RegistryError` with `.code` (`INVALID_CODE`, `CODE_TAKEN`, …).

---

## Heatmap + KPIs (`create_heatmap_kpi`)

Grid hotspots and time-to-close. Feed it any geo tickets.

### Expects (event)

| Field | Required |
|---|---|
| `id` | yes |
| `location` | yes `{lat, lng}` |
| `openedAt` | yes ISO |
| `closedAt` | no — omit while still open |
| `zone` | no (default `"unspecified"`) |
| `category` | no |
| `weight` | no, default 1 |

Init: `cell_size_meters=80`.

### Does / how

Buckets events into lat/lng cells. Counts open vs closed. Averages minutes from open to close. Cell size in degrees ≈ `meters / 111_320`. `close(id, closedAt)` fills `closedAt` on an existing event.

### Outputs

**Cell:** `{key, south, west, north, east, count, openCount, weight}`  
**KPIs:** `{total, open, avgCloseMinutes, byZone, byCategory}`

```python
heat = create_heatmap_kpi(cell_size_meters=80)
heat.ingest({...})
heat.ingest_many([...])
heat.close(event_id, closed_at_iso)
heat.grid()
heat.hotspots(5)
heat.kpis()
heat.nearby_count(origin, radius_meters=200)
```

---

## Facade

```python
intel = create_map_intel(cell_size_meters=80)
intel.assets.create({...})
intel.nearest(origin, limit=3, type="wet-bin")
intel.ingest_ticket({"id": "e1", "location": loc, "openedAt": "...Z", "category": "mixed"})
intel.heat.kpis()
```
