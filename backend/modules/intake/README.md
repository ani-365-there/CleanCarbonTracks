# Intake

Citizen geo-tickets, same-spot duplicate collapse, and an optional action chatbot (BM25 RAG + tools).

**Does not import other sellable modules.** Photo bytes live in `object_store` (or yours); this package only stores attachment *ids*.

```python
from intake import create_intake, create_field_report_kit, create_duplicate_merger, create_action_chatbot
```

Facade: `create_intake()` wires reports + merger + chatbot. You can still use the three engines separately.

---

## Reports (`create_field_report_kit`)

### Expects

| Field | Required | Notes |
|---|---|---|
| `location` | yes | `{"lat", "lng"}` |
| `category` | yes | Lowercased. If you passed `allowed_categories` at init, must be in that list |
| `summary` | no | Defaults to `"{category} report"` |
| `notes` | no | |
| `reporterId` | no | Your user id |
| `assetId` / `assetCode` | no | Link to a map asset |
| `attachments` | no | `[{id, kind: "image"|"file", mime, byteSize, sha256?}]` |
| `source` | no | Default `"app"` |
| `metadata` | no | |
| `id` | no | |

### Does

Creates an open report. Lets you list, attach files, and move status. Does **not** classify images or assign workers.

### How

Status: `open` → `acknowledged` → `closed` or `rejected`. Once `closed`/`rejected`, further transitions fail.

### Outputs

```python
{
  "id": "...",
  "reporterId": "...",
  "assetId": "...",
  "assetCode": "BIN-01",
  "location": {"lat": ..., "lng": ...},
  "category": "mixed",
  "summary": "...",
  "notes": None,
  "attachments": [...],
  "status": "open",
  "source": "app",
  "metadata": {},
  "createdAt": "...Z",
  "updatedAt": "...Z",
  "closedAt": None,
}
```

```python
kit = create_field_report_kit(allowed_categories=["wet", "dry", "mixed"])
report = kit.create({"location": {...}, "category": "mixed", "summary": "Overflow"})
kit.get(report["id"])
kit.list(status="open", reporterId="u1")
kit.transition(report["id"], "acknowledged")
kit.attach(report["id"], {"id": "file-1", "kind": "image", "mime": "image/jpeg", "byteSize": 8000})
```

Raises `ReportError` (`.code`: `UNKNOWN_CATEGORY`, `TERMINAL`, `NOT_FOUND`, …).

---

## Duplicate merger (`create_duplicate_merger`)

Many people ping the same place. Collapses them into one group using distance + time (+ optional category/asset).

### Expects (init)

| Arg | Default | Meaning |
|---|---|---|
| `radius_meters` | 40 | Max distance to count as the same spot |
| `window_ms` | 3 hours | Max time from the group’s last report |
| `same_category_only` | False | If True, wet never merges with dry |
| `prefer_same_asset` | True | Extra score if `assetId` matches |

Ingest: `id`, `location`, `createdAt` required; `category` / `assetId` optional.

### Does / how

First nearby report opens a **group**. Later matching reports join it (`count` goes up). Similarity = distance (55%) + recency (25%) + same category (0.15) + same asset (0.2). Group location is a running centroid.

### Outputs

```python
{
  "action": "created" | "merged",
  "similarity": 0.0,
  "group": {
    "id": "...",
    "primaryId": "r1",
    "memberIds": ["r1", "r2"],
    "location": {"lat": ..., "lng": ...},
    "category": "mixed",
    "assetId": "bin-1",
    "count": 2,
    "firstAt": "...Z",
    "lastAt": "...Z",
    "status": "open",
  },
}
```

```python
merger = create_duplicate_merger(radius_meters=40)
merger.ingest({"id": "r1", "location": loc, "createdAt": stamp, "category": "mixed"})
merger.get_by_member("r2")
merger.list_open()
merger.close_group(group_id)
```

Ingesting the same `id` twice returns the existing group with `similarity=1`.

---

## Chatbot (`create_action_chatbot`)

Answers from **your** documents and can call tools: nearest asset, create report, ticket status. Works offline (BM25). Optional `llm(message, context) -> str`.

This engine does **not** know about bins. You wire tools that talk to *your* registry / reports.

**Corpus:** `{"id", "title", "body", "tags"?}`

**Tools** (optional callables)

| Key | You receive | You return |
|---|---|---|
| `find_nearest` | `{location, type?, query}` | `[{id, name, type?, distanceMeters}, ...]` |
| `create_report` | `{text, location?, category?}` | `{id: "..."}` |
| `get_status` | ticket id string | `{id, status, summary?}` or `None` |

Intent: `nearest` | `report` | `status` | `faq`. FAQ = retrieve. Others call a tool if you provided one.

```python
bot = create_action_chatbot(docs, tools={
    "find_nearest": lambda inp: assets.nearest(inp["location"], limit=3),
    "create_report": lambda draft: {"id": kit.create(...)["id"]},
    "get_status": lambda rid: kit.get(rid),
})
bot.chat("user-1", "Where is the nearest wet bin?", location={"lat": 20.35, "lng": 85.82})
```

Output: `{reply, intent, citations, action?}`. `action.type` is `find_nearest` | `create_report` | `get_status`.

---

## Facade

```python
intake = create_intake(
    allowed_categories=["wet", "dry", "mixed"],
    merger_opts={"radius_meters": 40},
    corpus=docs,
    tools={"find_nearest": ...},
)
filed = intake.file({"location": loc, "category": "mixed", "summary": "Overflow"})
# filed["report"], filed["merged"]
intake.chat("s1", "Where is the nearest wet bin?", location=loc)
```
