from __future__ import annotations

from datetime import datetime, timezone

from field_job_router import create_field_job_router
from field_ops import create_field_ops_inbox, create_priority_scorer, create_proof_of_work
from image_classifier import WASTE_CAMPUS_TAXONOMY, create_image_classifier
from intake import create_action_chatbot, create_duplicate_merger, create_field_report_kit
from map_intel import create_geo_asset_registry, create_heatmap_kpi, haversine_meters
from object_store import create_object_store
from role_access import create_role_access, seed_civic_roles

from .corpus import CAMPUS_CORPUS
from .seed import seed_campus

CATEGORY_WEIGHT = {"hazardous": 1, "mixed": 0.75, "wet": 0.55, "ewaste": 0.5, "dry": 0.25}


def create_waste_network(now=None, secret: str = "waste-network-dev"):
    now = now or (lambda: datetime.now(timezone.utc))
    access = create_role_access(now=now, secret=secret)
    seed_civic_roles(access)
    assets = create_geo_asset_registry(now=now)
    reports = create_field_report_kit(
        now=now,
        allowed_categories=["wet", "dry", "mixed", "hazardous", "ewaste"],
    )
    classifier = create_image_classifier(WASTE_CAMPUS_TAXONOMY)
    merger = create_duplicate_merger(radius_meters=40, window_ms=3 * 60 * 60 * 1000)
    scorer = create_priority_scorer()
    router = create_field_job_router(cluster_radius_meters=180, priority_weight=0.5)
    inbox = create_field_ops_inbox(now=now)
    proof = create_proof_of_work()
    heat = create_heatmap_kpi(cell_size_meters=80)
    files = create_object_store()
    seed_campus(access, assets)

    def find_nearest(inp):
        typ = inp.get("type")
        if typ:
            typ = typ.replace("recyclable", "dry").replace("organic", "wet") + "-bin"
        return [
            {
                "id": asset["id"],
                "name": asset["name"],
                "type": asset["type"],
                "distanceMeters": asset["distanceMeters"],
            }
            for asset in assets.nearest(inp["location"], limit=3, type=typ)
        ]

    def create_report(draft):
        created = reports.create({
            "location": draft.get("location") or {"lat": 20.354, "lng": 85.819},
            "category": draft.get("category") or "mixed",
            "summary": draft["text"],
            "source": "chatbot",
        })
        return {"id": created["id"]}

    def get_status(report_id):
        report = reports.get(report_id)
        if not report:
            return None
        return {"id": report["id"], "status": report["status"], "summary": report["summary"]}

    chatbot = create_action_chatbot(
        CAMPUS_CORPUS,
        tools={"find_nearest": find_nearest, "create_report": create_report, "get_status": get_status},
    )

    def on_complete(event):
        heat.close(event["job"]["id"], event["at"])
        source_id = event["job"].get("sourceId")
        if source_id:
            report = reports.get(source_id)
            if report and report["status"] != "closed":
                reports.transition(source_id, "closed")

    inbox.subscribe("job.completed", on_complete)

    duty = {}

    def file_report(reporter_id, location, text, filename=None, asset_code=None, photo=None, category=None):
        access.assert_perm(reporter_id, "reports:create")
        classified = classifier.classify(text=text, filename=filename)
        category = (category or (classified["top"] or {}).get("id") or "mixed").strip().lower()
        asset = assets.get_by_code(asset_code) if asset_code else (assets.nearest(location, limit=1) or [None])[0]
        attachments = []
        if photo:
            stored = files.put(photo["bytes"], photo["mime"])
            attachments.append({
                "id": stored["id"],
                "kind": "image",
                "mime": stored["mime"],
                "byteSize": stored["byteSize"],
                "sha256": stored["sha256"],
            })
        report = reports.create({
            "reporterId": reporter_id,
            "location": location,
            "category": category,
            "summary": text,
            "assetId": asset["id"] if asset else None,
            "assetCode": asset["code"] if asset else None,
            "attachments": attachments,
        })
        merged = merger.ingest({
            "id": report["id"],
            "location": report["location"],
            "createdAt": report["createdAt"],
            "category": report["category"],
            "assetId": report.get("assetId"),
        })
        scored = scorer.score({
            "waitMinutes": 0,
            "severity": (classified["top"] or {}).get("score", 0.4),
            "repeatCount": merged["group"]["count"],
            "categoryWeight": CATEGORY_WEIGHT.get(category, 0.4),
            "sensitiveLocation": bool(asset and ("mess" in asset["tags"] or "hostel" in asset["tags"])),
        })
        job = next(
            (
                item
                for item in inbox.list()
                if item.get("sourceId")
                and item["sourceId"] in merged["group"]["memberIds"]
                and item["status"] not in {"completed", "failed"}
            ),
            None,
        )
        if merged["action"] == "created" or not job:
            job = inbox.create({
                "title": f"{category} · {(asset or {}).get('name', 'unmapped bin')}",
                "location": merged["group"]["location"],
                "priority": scored["score"],
                "sourceId": report["id"],
                "slaDueAt": scored["slaDueAt"],
                "metadata": {"groupId": merged["group"]["id"], "rank": scored["rankHint"]},
            })
            heat.ingest({
                "id": job["id"],
                "location": job["location"],
                "openedAt": job["createdAt"],
                "zone": (asset["tags"][0] if asset and asset["tags"] else "campus"),
                "category": category,
                "weight": scored["score"],
            })
        else:
            job = inbox.set_priority(job["id"], max(job["priority"], scored["score"]))
        if job["status"] == "new":
            assigned = _assign_nearest_on_duty(job)
            if assigned:
                job = assigned
        return {"report": report, "merged": merged, "classified": classified, "scored": scored, "job": job}

    def plan_for_worker(worker_id, start):
        access.assert_perm(worker_id, "jobs:read")
        open_jobs = [j for j in inbox.list() if j["status"] in {"new", "assigned"}]
        return router.plan([{"id": j["id"], "location": j["location"], "priority": j["priority"]} for j in open_jobs], start)

    def complete_with_proof(
        worker_id,
        job_id,
        location,
        after_sha256=None,
        after_attachment_id=None,
        photo=None,
        max_distance_meters=75,
    ):
        access.assert_perm(worker_id, "proof:create")
        job = inbox.get(job_id)
        if not job:
            raise KeyError("Job not found")
        if job["status"] == "new":
            inbox.assign(job["id"], worker_id)
        if inbox.get(job["id"])["status"] == "assigned":
            inbox.start(job["id"], worker_id)
        if photo:
            stored = files.put(photo["bytes"], photo["mime"])
            after_attachment_id = stored["id"]
            after_sha256 = stored["sha256"]
        if not after_attachment_id or not after_sha256:
            raise ValueError("After-photo is required")
        stamp = now().isoformat().replace("+00:00", "Z") if getattr(now(), "tzinfo", None) else now().isoformat() + "Z"
        pack = proof.record({
            "id": f"pow-{job['id']}",
            "jobId": job["id"],
            "actorId": worker_id,
            "location": location,
            "capturedAt": stamp,
            "after": {
                "attachmentId": after_attachment_id,
                "mime": photo["mime"] if photo else "image/jpeg",
                "sha256": after_sha256,
                "capturedAt": stamp,
            },
        })
        verified = proof.verify(pack["id"], {
            "expectedLocation": job["location"],
            "requireAfter": True,
            "maxDistanceMeters": max_distance_meters,
        })
        if not verified["ok"]:
            raise RuntimeError("Proof failed location or completeness check")
        inbox.complete(job["id"])
        return {"pack": pack, "verified": verified, "job": inbox.get(job["id"])}

    def _assign_nearest_on_duty(job):
        candidates = [
            (wid, state)
            for wid, state in duty.items()
            if state.get("onDuty") and state.get("location")
        ]
        if not candidates:
            return None
        worker_id, state = min(
            candidates,
            key=lambda item: haversine_meters(item[1]["location"], job["location"]),
        )
        current = inbox.get(job["id"])
        if current["status"] == "new":
            return inbox.assign(job["id"], worker_id)
        return current

    def set_duty(worker_id, on_duty, location=None):
        access.assert_perm(worker_id, "jobs:read")
        duty[worker_id] = {"onDuty": bool(on_duty), "location": location}
        assigned = None
        if on_duty and location:
            busy = [
                j for j in inbox.list(assignee_id=worker_id)
                if j["status"] in {"assigned", "started"}
            ]
            if not busy:
                open_jobs = [j for j in inbox.list() if j["status"] == "new"]
                if open_jobs:
                    nearest = min(open_jobs, key=lambda j: haversine_meters(location, j["location"]))
                    assigned = inbox.assign(nearest["id"], worker_id)
        return {"onDuty": bool(on_duty), "location": location, "assigned": assigned}

    def worker_dashboard(worker_id):
        access.assert_perm(worker_id, "jobs:read")
        mine = inbox.list(assignee_id=worker_id)
        pending = [j for j in mine if j["status"] in {"assigned", "started"}]
        done = [j for j in mine if j["status"] == "completed"]
        failed = [j for j in mine if j["status"] == "failed"]
        return {
            "onDuty": bool(duty.get(worker_id, {}).get("onDuty")),
            "location": duty.get(worker_id, {}).get("location"),
            "pendingCount": len(pending),
            "doneCount": len(done),
            "failedCount": len(failed),
            "pending": pending,
            "done": done,
            "failed": failed,
        }

    def citizen_reports(reporter_id):
        access.assert_perm(reporter_id, "reports:create")
        items = []
        for report in reports.list(reporterId=reporter_id):
            group = merger.get_by_member(report["id"])
            member_ids = group["memberIds"] if group else [report["id"]]
            job = next(
                (
                    j for j in inbox.list()
                    if j.get("sourceId") in member_ids
                ),
                None,
            )
            pickup = {
                "new": "reported",
                "assigned": "assigned",
                "started": "en route",
                "completed": "collected",
                "failed": "could not collect",
            }.get((job or {}).get("status"), report["status"])
            photo_id = report["attachments"][0]["id"] if report.get("attachments") else None
            items.append({
                **report,
                "pickupStatus": pickup,
                "jobId": job["id"] if job else None,
                "photoUrl": f"/api/photos/{photo_id}" if photo_id else None,
                "binName": report.get("assetCode") or "Unmapped bin",
            })
        items.sort(key=lambda r: r["createdAt"], reverse=True)
        return items

    return {
        "access": access,
        "assets": assets,
        "reports": reports,
        "classifier": classifier,
        "merger": merger,
        "scorer": scorer,
        "router": router,
        "inbox": inbox,
        "proof": proof,
        "heat": heat,
        "files": files,
        "chatbot": chatbot,
        "file_report": file_report,
        "plan_for_worker": plan_for_worker,
        "complete_with_proof": complete_with_proof,
        "set_duty": set_duty,
        "worker_dashboard": worker_dashboard,
        "citizen_reports": citizen_reports,
        "duty": duty,
    }
