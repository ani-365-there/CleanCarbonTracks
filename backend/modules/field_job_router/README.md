# Field-job router

Pins + priorities in, clustered visit order out. Not turn-by-turn maps.

Standalone demo (screen-record this):

```bash
python run_demo_router.py
```

Open http://127.0.0.1:5001

```python
from field_job_router import create_field_job_router, plan_route
```

## Expects

**Jobs**

| Field | Required |
|---|---|
| `id` | yes |
| `location` | yes `{lat, lng}` |
| `priority` | yes float (higher first) |
| `demand` | no, default 1 (for capacity) |

**Start** — GeoPoint of the depot / worker.

**Options**

| Arg | Default |
|---|---|
| `cluster_radius_meters` | 180 |
| `priority_weight` | 0.45 (0 = nearest-neighbor only, 1 = urgency only) |
| `max_stops` | None |
| `capacity` | None (sum of `demand`) |

## Does

Drops jobs that exceed capacity / max stops. Groups nearby jobs. Orders clusters, then orders stops inside each cluster.

## How

1. Sort by priority; skip if capacity or max_stops would break.
2. Greedy clustering: join a cluster if within `cluster_radius_meters` of its centroid.
3. Pick next cluster with a cost of `distance * (1-w) − priority * w`.
4. Inside a cluster: same cost, nearest-neighbor style.

## Outputs

```python
{
  "stops": [
    {"id": "a", "location": {...}, "priority": 0.9, "demand": 1,
     "distanceFromPreviousMeters": 179.0, "clusterId": "c1"},
    ...
  ],
  "skipped": [{"job": {...}, "reason": "capacity" | "maxStops"}],
  "totalDistanceMeters": 558.3,
  "clusters": 2,
}
```

## API

```python
router = create_field_job_router(cluster_radius_meters=180, priority_weight=0.5)
plan = router.plan(jobs, start={"lat": 20.35, "lng": 85.818})
# or plan_route(jobs, start, ...)
```
