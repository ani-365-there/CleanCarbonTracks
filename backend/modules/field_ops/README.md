# Field ops

Worker queue + SLA scoring + proof-of-work closeout.

**Does not import other sellable modules.** Pair with `field_job_router` for visit order. Photo bytes live in `object_store`; this package stores attachment *ids*.

Standalone demo (screen-record this):

```bash
python run_demo_field_ops.py
```

Open http://127.0.0.1:5002

```python
from field_ops import create_field_ops, create_field_ops_inbox, create_priority_scorer, create_proof_of_work
```

Facade: `create_field_ops()` wires inbox + scorer + proof. You can still use the three engines separately.

---

## Inbox (`create_field_ops_inbox`)

Worker jobs + status machine + event bus. Notifications are events other code subscribes to.

### Expects (create job)

| Field | Required |
|---|---|
| `title` | yes |
| `location` | yes `{lat, lng}` |
| `priority` | no, default 0 |
| `assigneeId` | no — if set, status starts as `assigned` |
| `sourceId` | no — e.g. report id |
| `slaDueAt` | no ISO string |
| `metadata` | no |
| `id` | no |

### Does / how

Allowed moves:

```
new → assigned | failed
assigned → started | assigned | failed
started → completed | failed
completed / failed → (end)
```

Events: `job.created`, `job.assigned`, `job.reassigned`, `job.started`, `job.completed`, `job.failed`, `job.overdue`. Subscribe to one name or `"*"`.

`scan_overdue()` compares `slaDueAt` to now; emits `job.overdue` **once** per job.

### Outputs

Job: `{id, title, location, priority, status, assigneeId, sourceId, slaDueAt, metadata, createdAt, updatedAt, startedAt, finishedAt, overdueEmitted}`.

Event: `{name, at, job, previousStatus}`.

```python
inbox = create_field_ops_inbox()
unsub = inbox.subscribe("job.completed", lambda event: print(event["job"]["id"]))
job = inbox.create({"title": "Pickup", "location": loc, "priority": 0.8})
inbox.assign(job["id"], "worker-1")
inbox.start(job["id"], "worker-1")
inbox.complete(job["id"])
inbox.list(status="assigned", assignee_id="worker-1")
inbox.scan_overdue()
```

Raises `InboxError` (`INVALID_TRANSITION`, `FORBIDDEN`, `NOT_FOUND`, …).

---

## Scorer (`create_priority_scorer`)

Turns ticket facts into a 0–1 score, a rank, and a due time. No map, no jobs.

### Expects (`score(factors)`)

| Field | Required | Meaning |
|---|---|---|
| `waitMinutes` | yes | How long it has been waiting |
| `severity` | yes | 0–1 (photo fullness, danger, …) |
| `zoneMultiplier` | no | `> 1` = VIP zone boost; `0–1` used as-is |
| `repeatCount` | no | Default 1. Capped at `repeat_cap` (8) |
| `categoryWeight` | no | 0–1 (e.g. hazardous=1, dry=0.25) |
| `sensitiveLocation` | no | bool (mess, hospital, …) |

Optional `now=` and `opened_at=` datetimes for SLA math.

### How

Defaults: wait 25%, severity 30%, zone 10%, repeats 20%, category 10%, sensitive 5%.  
SLA minutes by rank: critical 30, high 90, medium 240, low 720.  
Ranks: ≥0.8 critical, ≥0.6 high, ≥0.35 medium, else low.

### Outputs

```python
{
  "score": 0.74,
  "rankHint": "high",
  "slaDueAt": "2026-08-21T12:00:00Z",
  "breached": False,
  "breakdown": {"wait": ..., "severity": ..., "zone": ..., "repeats": ..., "category": ..., "sensitive": ...},
}
```

```python
scorer = create_priority_scorer()
scorer.score({"waitMinutes": 180, "severity": 0.8, "repeatCount": 5, "sensitiveLocation": True})
```

---

## Proof of work (`create_proof_of_work`)

Before/after photo metadata + GPS + time, hashed so edits are obvious. Verify against the job pin.

### Expects

| Field | Required |
|---|---|
| `id` | yes |
| `jobId` | yes |
| `actorId` | yes |
| `location` | yes `{lat, lng}` |
| `capturedAt` | yes ISO string |
| `before` / `after` | photo dicts (at least `after` if you require it) |
| `notes` | no |

Photo dict: `{attachmentId, mime, sha256, capturedAt}`.

Verify rules: `expectedLocation` required; `maxDistanceMeters` default 75; `requireBefore` / `requireAfter` default False; optional `earliest` / `latest`.

### Does / how

Hashes a canonical JSON of the pack (SHA-256). Checks GPS distance, required photos, time window, and that the fingerprint still matches. Tampering with location while keeping an old fingerprint fails `fingerprintMatches`.

### Outputs

Pack includes `fingerprint` (hex). Verify:

```python
{"ok": True, "fingerprintMatches": True, "checks": {"fingerprint": True, "location": True, "before": True, "after": True, "earliest": True, "latest": True}}
```

```python
proof = create_proof_of_work()
pack = proof.record({
  "id": "e1", "jobId": "job-1", "actorId": "worker-1",
  "location": loc, "capturedAt": "...Z",
  "after": {"attachmentId": "img-2", "mime": "image/jpeg", "sha256": "…", "capturedAt": "…"},
})
proof.verify(pack["id"], {"expectedLocation": job_loc, "requireAfter": True})
proof.for_job("job-1")
```

Raises `ProofError` (`INVALID_PACK`, `NOT_FOUND`). Also: `create_evidence_pack` / `verify_evidence_pack` as standalone functions.

---

## Facade

```python
ops = create_field_ops()
opened = ops.open_job("Pickup", loc, {"waitMinutes": 40, "severity": 0.8})
# opened["job"], opened["scored"]
ops.subscribe("job.completed", handler)
```
