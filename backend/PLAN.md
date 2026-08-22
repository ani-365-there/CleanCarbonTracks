# Team YAHOO_D — Plan and progress

**Event:** HACQUIRE 2026 (FED, KIIT)  
**Team:** YAHOO_D (HA-032-3210)  
**Track:** PS-03 — Intelligent Waste Collection Network  
**Domain:** CleanTech / Logistics  
**Stack:** Python 3.11+ (plain dicts, no TypeScript)

This note is the working plan: what we are building, why it is split this way, and what already exists in the repo.

---

## 1. What the problem asks for

A campus / residential waste platform for three groups:

1. **Residents** — report overflowing bins (photo + location)
2. **Collection workers** — get tasks and guidance
3. **Admins** — optimize routes and watch segregation quality

Suggested commercial pieces from the brief:

- Bin reporting with image and location
- Waste-category recognition
- Collection-worker task dashboard
- Route planning and prioritization
- Pickup status and notifications
- Area-wise waste analytics

**Mandatory marketplace rule:** at least **three separable modules** that another team could buy or acquire on their own.

---

## 2. Product plan (what we pitch)

Do not pitch “one waste app.” Pitch **three products** that share tickets/events:

| Product | Job | Who would buy it alone |
|---|---|---|
| **BinWatch** | Citizen report + category + chatbot | RWAs, campuses, complaint desks |
| **CollectOS** | Worker jobs, routes, proof of pickup, alerts | Contractors, housekeeping |
| **SegregateIQ** | Heatmaps, SLAs, segregation quality | Facility / sustainability / municipality |

One-liner for the pitch:

> Campus waste is not a shortage of trucks. It is a shortage of **signal** (which bin, how bad, what type) and **dispatch** (who goes, in what order, with proof).

How they connect:

1. BinWatch emits: overflow reported (photo, GPS, category, bin id)
2. CollectOS consumes it, scores it, assigns it, returns collected / failed
3. SegregateIQ reads both and turns them into area trends

---

## 3. Marketplace plan (what we sell)

Auth, file upload, and “we have notifications” will be oversupplied. We sell **engines other teams can plug into any geo/field product**, not waste-only toys.

List these three on the trading board:

1. **notifications** — per-user send / list / delete, optional HTTP
2. **field_job_router** — cluster + visit order
3. **field_ops** — worker inbox + SLA score + proof of work

Keep in the product but do not list: `intake`, `image_classifier`, `map_intel`.  
Keep in `platform/` (do not sell as a headline): role access, object store.

---

## 4. What is in the repo today

Python packages. Each sellable module is its own folder and does **not** import another sellable module. Demo runs the full campus loop.

```text
Omega-Hackathon/
├── modules/                 # marketplace SKUs (copy a folder)
├── platform/                # object_store + role_access — plumbing
├── apps/waste_network/      # our product that wires the modules
├── apps/web/                # FastAPI + citizen / worker UI
├── demo.py                  # run the campus story
├── pyproject.toml
└── requirements.txt
```

### 4.1 Sellable modules

| Folder | What it does | Standalone buyer |
|---|---|---|
| `intake` | Geo tickets (photo ids + GPS + category), same-spot duplicate collapse, BM25 RAG chatbot with tools | Civic 311, complaint desks, campus assistants |
| `image_classifier` | Buyer sets the label list. Fuses caption, filename, optional vision hints. | Waste, crop disease, PPE, defects — **in product, not listed** |
| `notifications` | Per-user send / list / read / delete + event bus + optional HTTP | Any app that needs alerts |
| `field_ops` | Worker inbox + status/events, SLA score, hashed GPS/photo proof | Any field workforce, inspections, pickup |
| `field_job_router` | Cluster nearby jobs, order by distance + priority, optional capacity. | Delivery, technicians, waste, patrols |
| `map_intel` | Pins with id/type/GPS/QR + nearest/radius/bbox; grid hotspots and time-to-close | Anyone with a map of things; civic/ops dashboards |

Inbox (inside `field_ops`) emits job events. `notifications` is the separate toast/inbox SKU on the trading board.

### 4.2 Platform (not sold as a headline)

`platform/object_store` — jpeg/png/webp/pdf, max 8MB, SHA-256. Used for report photos and after-photos.  
`platform/role_access` — users, roles, scrypt passwords, HMAC sessions, `*` / `jobs:*` permissions.

### 4.3 Our composer

`apps/waste_network` is BinWatch + CollectOS + SegregateIQ on top of the modules:

Resident files a report → classify waste type → merge duplicates → score urgency → create/update a job → route the worker → verify proof-of-work → update heatmap. Chatbot can find the nearest bin or file a report.

Seeded demo campus: KP-7 wet/dry bins, parking dry bin, canteen point, plus resident / worker / admin users.

### 4.4 What the demo already proves

`python demo.py` currently:

- Two nearby mess overflow reports **merge into one job**
- A parking cardboard report stays a **second job**
- Router sequences both stops
- After-photo + GPS proof verifies
- Chatbot answers nearest wet bin (~25 m from the demo pin)

---

## 5. How the three products map onto folders

**BinWatch** — `intake` + `image_classifier` (+ `object_store` for photo bytes)

**CollectOS** — `field_ops` + `field_job_router`

**SegregateIQ** — `map_intel`

**Shared lock on the door** — `platform/role_access`

---

## 6. What is *not* built yet (next work)

Citizen and worker web UIs exist (`python run_web.py`). Still open:

- **Admin map / KPI screen** — heatmap engine is ready; SegregateIQ UI is thin
- **Chatbot in the UI** — wired in the composer and `demo.py` only
- **Real vision model** — classifier is text + optional vision *hints* today; a model can plug in later
- **LLM** — chatbot retrieves with BM25 offline; an LLM adapter is optional
- **QR stickers / bin master list in the real campus** — registry supports codes; physical labels not done
- **WhatsApp / SMS** — inbox already emits events; channels not wired

---

## 7. How to run what exists

```bash
pip install -r requirements.txt
python -m pytest
python demo.py
```

Tests: **33 passed** (re-run after the SKU merge).  
`pyproject.toml` sets `PYTHONPATH` to `modules`, `platform`, `apps`.

---

## 8. Demo story for the pitch (2–3 minutes)

1. Resident reports an overflowing mixed/wet bin at KP-7 with a photo pin.
2. A second person reports the same bin → one ticket, higher repeat count.
3. Worker phone: that job is clustered with nearby work; parking is a later stop.
4. Worker marks collected + after photo. Reporter-side status can close.
5. Admin: hostel hotspot, time-to-collect, mixed vs dry split.

Then say: *BinWatch sold to the hostel committee. CollectOS sold to housekeeping. SegregateIQ sold to the sustainability cell. Together they are the network.*

---

## 9. Team split (suggested)

| Person | Own this | Why |
|---|---|---|
| A | Classifier + intake | BinWatch surface |
| B | Router + field ops | CollectOS surface |
| C | Map intel | SegregateIQ |
| D | FastAPI + UI + pitch deck | Integration and story |

Everyone can copy a module folder into another team’s project during the trading round without dragging the whole repo.
