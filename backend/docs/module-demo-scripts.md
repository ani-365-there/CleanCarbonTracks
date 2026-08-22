# Sale modules — 30–45s read-aloud

Speak **one block per video**. Each is ~90–100 words (~35–40 seconds at a normal pace).  
The cue card under each block is for you, not for the voiceover.

## How to record (one module at a time)

From the repo root. Close the other demo first so ports don’t clash.

**Router** — `python run_demo_router.py` → http://127.0.0.1:5001  
Click **Plan route** (two KP-7 stops share a cluster, parking is later). Then **Plan with capacity 3** (hostel bulk is skipped).

**Field ops** — `python run_demo_field_ops.py` → http://127.0.0.1:5002  
Click **1 → 2 → 3 → 4a → 5** (proof OK, job completes). Open a new job, then **4b** (proof FAIL, complete blocked).

---

## 1. Notification Inbox

Buyer gets a per-user alert inbox they can drop under any app. `create_notifications` builds it. They call `send` with a user id and a message — optional title and channel. `list` returns that user’s items, newest first. `mark_read` and `delete` manage the queue. `subscribe` fires on sent, read, and deleted so their UI or SMS can hook in. Optional HTTP: `python -m notifications` — POST `/notify`, GET `/notifications/:user`, DELETE by id. No database, no API key.

**In:** `{user, message, title?, channel?}`. Cap is per user (`max_per_user`).  
**Out:** `{id, user, message, title, channel, read, createdAt}`. HTTP list: `{success, count, data}`.  
**Functions:** `create_notifications` · `send` · `list` · `mark_read` · `delete` · `subscribe`

---

## 2. Priority Field-Job Router

Pins and priorities in, visit order out. `create_field_job_router` — or just `plan_route`. Input is a start GPS and jobs with `id`, `{lat, lng}`, and `priority`. It clusters nearby stops, then orders clusters and stops by distance versus urgency. Optional capacity and max-stops drop overflow into `skipped`. Not turn-by-turn maps. Same engine for technicians, delivery, patrols, or collection.

**In:** `jobs[{id, location, priority, demand?}]` + `start {lat, lng}`. Options: `cluster_radius_meters`, `priority_weight`, `max_stops`, `capacity`.  
**Out:** `{stops, skipped, totalDistanceMeters, clusters}`. Each stop adds `distanceFromPreviousMeters` and `clusterId`.  
**Functions:** `create_field_job_router` · `plan` / `plan_route`

---

## 3. Field Ops Kernel

Three engines, one folder. `create_field_ops` wires them. `open_job` takes a title, a pin, and factors — wait, severity, repeats — `score` returns 0–1, a rank, and `slaDueAt`, then `create` opens the inbox job. Workers move with `assign`, `start`, `complete` / `fail`. Events fire for alerts. Closeout: `record` a GPS plus after-photo ids, `verify` against the job pin — tamper or too-far fails. Bytes stay in their store.

**In:** job `{title, location}` + score factors; proof `{jobId, actorId, location, capturedAt, after}`.  
**Out:** job + `{score, rankHint, slaDueAt}`; verify `{ok, fingerprintMatches, checks}`.  
**Functions:** `create_field_ops` / `open_job` · `score` · `create` `assign` `start` `complete` `subscribe` `scan_overdue` · `record` `verify`
