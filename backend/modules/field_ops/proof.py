from __future__ import annotations

import copy
import hashlib
import json

from .geo import haversine_meters


class ProofError(Exception):
    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code


def fingerprint_of(pack: dict) -> str:
    canonical = json.dumps(
        {
            "id": pack["id"],
            "jobId": pack["jobId"],
            "actorId": pack["actorId"],
            "location": pack["location"],
            "capturedAt": pack["capturedAt"],
            "before": pack.get("before"),
            "after": pack.get("after"),
            "notes": pack.get("notes"),
        },
        sort_keys=True,
        separators=(",", ":"),
    )
    return hashlib.sha256(canonical.encode()).hexdigest()


def create_evidence_pack(inp: dict) -> dict:
    if not str(inp.get("jobId", "")).strip() or not str(inp.get("actorId", "")).strip():
        raise ProofError("INVALID_PACK", "jobId and actorId are required")
    pack = copy.deepcopy(inp)
    pack["fingerprint"] = fingerprint_of(pack)
    return pack


def verify_evidence_pack(pack: dict, rules: dict) -> dict:
    recomputed = fingerprint_of(pack)
    fingerprint_matches = recomputed == pack.get("fingerprint")
    distance = haversine_meters(pack["location"], rules["expectedLocation"])
    max_distance = rules.get("maxDistanceMeters", 75)
    captured = pack["capturedAt"]
    checks = {
        "fingerprint": fingerprint_matches,
        "location": distance <= max_distance,
        "before": bool(pack.get("before")) if rules.get("requireBefore") else True,
        "after": bool(pack.get("after")) if rules.get("requireAfter") else True,
        "earliest": captured >= rules["earliest"] if rules.get("earliest") else True,
        "latest": captured <= rules["latest"] if rules.get("latest") else True,
    }
    return {"ok": all(checks.values()), "fingerprintMatches": fingerprint_matches, "checks": checks}


class ProofOfWork:
    def __init__(self):
        self._packs: dict[str, dict] = {}

    def record(self, inp: dict) -> dict:
        pack = create_evidence_pack(inp)
        self._packs[pack["id"]] = pack
        return copy.deepcopy(pack)

    def get(self, pack_id: str) -> dict | None:
        pack = self._packs.get(pack_id)
        return copy.deepcopy(pack) if pack else None

    def for_job(self, job_id: str) -> list[dict]:
        return [copy.deepcopy(p) for p in self._packs.values() if p["jobId"] == job_id]

    def verify(self, pack_id: str, rules: dict) -> dict:
        pack = self._packs.get(pack_id)
        if not pack:
            raise ProofError("NOT_FOUND", f"Evidence {pack_id} not found")
        return verify_evidence_pack(pack, rules)


def create_proof_of_work() -> ProofOfWork:
    return ProofOfWork()
