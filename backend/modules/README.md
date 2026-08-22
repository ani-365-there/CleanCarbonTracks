# Omega modules — copy a folder

Each package is independent. **No sellable module imports another.** You wire them in *your* app.

Add to `PYTHONPATH`: `modules` (and `platform` if you want auth / file store).

```text
export PYTHONPATH=modules:platform   # Unix
$env:PYTHONPATH = "modules;platform" # Windows
```

| Folder | README | One-line |
|---|---|---|
| [intake](intake/README.md) | photo+GPS tickets, duplicate collapse, RAG chatbot | Citizen signal |
| [image_classifier](image_classifier/README.md) | buyer label list | Rank a category (kept in product, not listed) |
| [notifications](notifications/README.md) | per-user send / list / delete + HTTP | Alerts |
| [field_ops](field_ops/README.md) | jobs + SLA score + GPS proof | Worker queue |
| [field_job_router](field_job_router/README.md) | pins + priority | Visit order |
| [map_intel](map_intel/README.md) | pins + heatmap / KPIs | Map of things |

Platform (do not sell as a headline): [object_store](../platform/object_store/README.md), [role_access](../platform/role_access/README.md).

**Listed for sale:** notifications, field_job_router, field_ops.  
Pitch products: **BinWatch** = intake + classifier; **CollectOS** = field ops + router; **SegregateIQ** = map intel.

## Shared convention

Every location is `{"lat": float, "lng": float}`.  
Returned records are plain dicts (JSON-friendly).  
Errors are exceptions with a `.code` string where noted.

## Typical wiring (you write this)

1. Citizen photo → `object_store.put` → id into `intake` report create
2. Optional `image_classifier.classify` for category
3. Merger ingest (or `create_intake().file`)
4. `field_ops` score → inbox create
5. `field_job_router.plan` for a worker start point
6. After photo → proof record → inbox complete
7. `map_intel` heatmap ingest / close on those events

See `apps/waste_network` for one full composer. You do not need it to use a single module.
