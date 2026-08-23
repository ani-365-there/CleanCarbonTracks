from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path[:0] = [
    str(ROOT / "modules"),
    str(ROOT / "modules" / "vernacular_wrapper"),
    str(ROOT / "platform"),
    str(ROOT / "apps")
]

from fastapi import FastAPI, File, Form, Header, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from fastapi.staticfiles import StaticFiles
from waste_network import create_waste_network
from image_classifier.classifier import ImageClassifier, WASTE_CAMPUS_TAXONOMY
from translator import translator, SUPPORTED_LANGUAGES

STATIC = Path(__file__).parent / "static"
MIME_MAP = {
    "image/jpg": "image/jpeg",
    "image/pjpeg": "image/jpeg",
    "image/x-png": "image/png",
}

net = create_waste_network()
classifier = ImageClassifier(WASTE_CAMPUS_TAXONOMY)

app = FastAPI(title="CleanCarbon & Binflow Integrated API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/ui", StaticFiles(directory=STATIC, html=True), name="ui")


def _user(authorization: str | None):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(401, "Sign in first")
    token = authorization.split(" ", 1)[1].strip()
    try:
        return net["access"].authenticate(token)
    except Exception as exc:
        raise HTTPException(401, str(exc)) from exc


def _photo(upload: UploadFile) -> dict:
    data = upload.file.read()
    mime = MIME_MAP.get(upload.content_type or "", upload.content_type or "image/jpeg")
    if mime not in {"image/jpeg", "image/png", "image/webp"}:
        mime = "image/jpeg"
    return {"bytes": data, "mime": mime}


@app.get("/")
def root():
    from fastapi.responses import FileResponse
    return FileResponse(STATIC / "index.html")


@app.get("/api/languages")
def get_languages():
    return {"languages": SUPPORTED_LANGUAGES}


@app.post("/api/translate")
def translate_text(payload: dict):
    text = payload.get("text") or ""
    target_lang = payload.get("target_language") or "hi"
    if not text.strip():
        raise HTTPException(400, "Text is required")
    return translator.translate_text(text, target_lang)


@app.post("/api/session")
def session(payload: dict):
    role = (payload.get("role") or "").strip().lower()
    email = {"citizen": "ria@kiit.test", "worker": "arun@kiit.test"}.get(role)
    if not email:
        raise HTTPException(400, "Choose citizen or worker")
    try:
        sess = net["access"].login(email, "password123")
    except Exception as exc:
        raise HTTPException(401, str(exc)) from exc
    user = net["access"].authenticate(sess["token"])
    return {"token": sess["token"], "user": user, "role": role}


@app.get("/api/me")
def me(authorization: str | None = Header(default=None)):
    return _user(authorization)


@app.get("/api/categorize")
def categorize(item: str, lang: str = "en"):
    if not item or not item.strip():
        raise HTTPException(400, "Item query required")
    res = classifier.classify(text=item)
    top = res.get("top")
    
    # Map classifier results to rich frontend rule metadata
    category_map = {
        "wet": {
            "category": "Biodegradable (Organic & Wet Waste)",
            "type": "organic",
            "binColor": "green",
            "tip": "🌱 Ideal for home composting or biogas! Keep sealed in a biodegradable bag.",
            "co2SavingsKgPerKg": 0.8,
        },
        "dry": {
            "category": "Non-biodegradable / Recyclable (Dry Waste)",
            "type": "plastic",
            "binColor": "blue",
            "tip": "♻️ Rinse and flatten bottles or paper before disposal.",
            "co2SavingsKgPerKg": 1.5,
        },
        "hazardous": {
            "category": "Hazardous / Biomedical Waste",
            "type": "hazardous",
            "binColor": "red",
            "tip": "☣️ Wrap securely and label as hazardous. Requires specialized handling.",
            "co2SavingsKgPerKg": 0.5,
        },
        "ewaste": {
            "category": "E-Waste & Electronics",
            "type": "e-waste",
            "binColor": "red",
            "tip": "⚡ Deposit at an authorized E-waste collection point.",
            "co2SavingsKgPerKg": 4.5,
        },
    }
    
    label_id = top["id"] if top else "dry"
    meta = category_map.get(label_id, {
        "category": "General Waste / Unclassified",
        "type": "other",
        "binColor": "black",
        "tip": "ℹ️ Check municipal segregated collection guidelines.",
        "co2SavingsKgPerKg": 0.2,
    })
    
    vernacular = None
    if lang and lang != "en":
        vernacular = {
            "category": translator.translate_text(meta["category"], lang),
            "tip": translator.translate_text(meta["tip"], lang),
        }
    
    return {
        "item": item,
        "classification": res,
        "vernacular": vernacular,
        **meta
    }


@app.get("/api/analytics")
def get_analytics():
    return {
        "totalPickups": 1420,
        "carbonSavedKg": 3540.8,
        "divertedFromLandfillPct": 84.5,
        "activeVehicles": 8,
        "efficiencyRate": 92.3,
        "monthlyTrend": [
          {"month": "Jan", "pickups": 180, "co2Saved": 450},
          {"month": "Feb", "pickups": 210, "co2Saved": 520},
          {"month": "Mar", "pickups": 250, "co2Saved": 620},
          {"month": "Apr", "pickups": 290, "co2Saved": 710},
          {"month": "May", "pickups": 320, "co2Saved": 800},
          {"month": "Jun", "pickups": 370, "co2Saved": 930}
        ]
    }


@app.get("/api/vehicles")
def get_vehicles():
    return [
        {"id": "V-101", "driver": "Arun Kumar", "route": "Sector 5, KIIT Campus", "status": "active", "batteryLevel": 88, "wasteCollectedKg": 420},
        {"id": "V-102", "driver": "Rajesh Patel", "route": "Patia Market Hub", "status": "active", "batteryLevel": 72, "wasteCollectedKg": 380},
        {"id": "V-103", "driver": "Priya Singh", "route": "Infocity Residential", "status": "maintenance", "batteryLevel": 15, "wasteCollectedKg": 0},
        {"id": "V-104", "driver": "Suresh Mohanty", "route": "Chandaka Road", "status": "active", "batteryLevel": 95, "wasteCollectedKg": 510}
    ]


@app.get("/api/pickups")
def list_pickups(authorization: str | None = Header(default=None)):
    try:
        user = _user(authorization)
        return net["citizen_reports"](user["id"])
    except Exception:
        # Default mock pickups fallback if unauthenticated demo mode
        return [
            {
                "id": "PK-1001",
                "name": "Ria Sharma",
                "address": "Block C, KIIT Hostel 3",
                "wasteType": "organic",
                "preferredDate": "2026-08-23",
                "notes": "Food waste from canteen",
                "status": "scheduled",
                "createdAt": "2026-08-22T10:00:00Z"
            },
            {
                "id": "PK-1002",
                "name": "Amit Das",
                "address": "House 45, Infocity Green",
                "wasteType": "e-waste",
                "preferredDate": "2026-08-24",
                "notes": "Old batteries and computer monitor",
                "status": "pending",
                "createdAt": "2026-08-22T11:30:00Z"
            }
        ]


@app.post("/api/pickups")
def create_pickup(payload: dict):
    new_pickup = {
        "id": f"PK-{net['reports'].__len__() + 1000}",
        "name": payload.get("name") or "Anonymous Resident",
        "address": payload.get("address") or "Address Not Provided",
        "wasteType": payload.get("wasteType") or "plastic",
        "preferredDate": payload.get("preferredDate") or "2026-08-23",
        "notes": payload.get("notes") or "",
        "status": "scheduled",
        "createdAt": "2026-08-22T12:00:00Z",
    }
    return new_pickup


@app.post("/api/citizen/reports")
def create_citizen_report(
    category: str = Form(...),
    lat: float = Form(...),
    lng: float = Form(...),
    notes: str = Form(""),
    photo: UploadFile = File(...),
    authorization: str | None = Header(default=None),
):
    user = _user(authorization)
    category = category.strip().lower()
    if category not in {"wet", "dry", "mixed"}:
        raise HTTPException(400, "Pick wet, dry, or mixed")
    try:
        result = net["file_report"](
            user["id"],
            {"lat": lat, "lng": lng},
            notes or f"Overflowing {category} waste",
            filename=photo.filename,
            photo=_photo(photo),
            category=category,
        )
    except Exception as exc:
        raise HTTPException(400, str(exc)) from exc
    return {
        "report": result["report"],
        "job": result["job"],
        "pickupStatus": "assigned" if result["job"]["status"] == "assigned" else "reported",
    }


@app.get("/api/citizen/reports")
def list_citizen_reports(authorization: str | None = Header(default=None)):
    user = _user(authorization)
    return {"reports": net["citizen_reports"](user["id"])}


@app.post("/api/worker/duty")
def worker_duty(payload: dict, authorization: str | None = Header(default=None)):
    user = _user(authorization)
    location = payload.get("location")
    if payload.get("onDuty") and not location:
        raise HTTPException(400, "Location is required to go on duty")
    try:
        return net["set_duty"](user["id"], bool(payload.get("onDuty")), location)
    except Exception as exc:
        raise HTTPException(400, str(exc)) from exc


@app.get("/api/worker/dashboard")
def worker_dash(authorization: str | None = Header(default=None)):
    user = _user(authorization)
    dash = net["worker_dashboard"](user["id"])
    for job in dash["pending"] + dash["done"] + dash["failed"]:
        report = net["reports"].get(job.get("sourceId") or "")
        job["category"] = (report or {}).get("category")
        job["binName"] = (report or {}).get("assetCode") or job["title"]
        atts = (report or {}).get("attachments") or []
        job["reportPhotoUrl"] = f"/api/photos/{atts[0]['id']}" if atts else None
    return dash


@app.post("/api/worker/jobs/{job_id}/complete")
def complete_job(
    job_id: str,
    lat: float = Form(...),
    lng: float = Form(...),
    photo: UploadFile = File(...),
    authorization: str | None = Header(default=None),
):
    user = _user(authorization)
    try:
        return net["complete_with_proof"](
            user["id"],
            job_id,
            {"lat": lat, "lng": lng},
            photo=_photo(photo),
            max_distance_meters=50_000,
        )
    except Exception as exc:
        raise HTTPException(400, str(exc)) from exc


@app.post("/api/worker/jobs/{job_id}/fail")
def fail_job(job_id: str, payload: dict, authorization: str | None = Header(default=None)):
    user = _user(authorization)
    net["access"].assert_perm(user["id"], "jobs:update")
    reason = (payload.get("reason") or "could not collect").strip()
    try:
        job = net["inbox"].get(job_id)
        if not job:
            raise HTTPException(404, "Job not found")
        if job["status"] == "new":
            net["inbox"].assign(job_id, user["id"])
        if net["inbox"].get(job_id)["status"] == "assigned":
            net["inbox"].start(job_id, user["id"])
        return net["inbox"].fail(job_id, reason)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(400, str(exc)) from exc


@app.get("/api/photos/{photo_id}")
def photo(photo_id: str):
    stored = net["files"].get(photo_id)
    if not stored:
        raise HTTPException(404, "Photo not found")
    return Response(content=stored["bytes"], media_type=stored["meta"]["mime"])


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)

