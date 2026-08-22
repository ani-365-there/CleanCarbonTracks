# Omega Hackathon — Intelligent Waste Collection Network

Python modules you can sell independently, plus a campus waste app that wires them together.

## Setup

```bash
pip install -r requirements.txt
python -m pytest
python demo.py
python run_web.py
```

Open http://127.0.0.1:8000 — resident UI and collector UI.

## Folders

- `modules/` — marketplace SKUs (copy a folder). Integrator docs: [`modules/README.md`](modules/README.md) and a `README.md` inside each package.
- `platform/` — `object_store` + `role_access` (plumbing, not a pitch product)
- `apps/waste_network` — our product wiring

## Listed for sale (3)

- **notifications** — per-user alerts + optional HTTP
- **field_job_router** — cluster + visit order
- **field_ops** — inbox + SLA score + proof of work

Classifier stays in the product (BinWatch). It is not on the trading board.

## Product mapping

- **BinWatch** — intake + image_classifier
- **CollectOS** — field_ops + field_job_router
- **SegregateIQ** — map_intel
