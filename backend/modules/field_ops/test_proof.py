from field_ops import create_evidence_pack, verify_evidence_pack


def test_nearby_ok_far_and_tamper_fail():
    pack = create_evidence_pack({
        "id": "e1",
        "jobId": "job-1",
        "actorId": "worker-1",
        "location": {"lat": 20.3542, "lng": 85.8191},
        "capturedAt": "2026-08-21T10:30:00.000Z",
        "after": {
            "attachmentId": "img-after",
            "mime": "image/jpeg",
            "sha256": "abc",
            "capturedAt": "2026-08-21T10:30:00.000Z",
        },
    })
    expected = {"lat": 20.35425, "lng": 85.81912}
    assert verify_evidence_pack(pack, {"expectedLocation": expected, "requireAfter": True})["ok"] is True

    far = create_evidence_pack({**pack, "location": {"lat": 20.4, "lng": 85.9}})
    assert verify_evidence_pack(far, {"expectedLocation": expected, "requireAfter": True})["checks"]["location"] is False

    tampered = {**pack, "location": {"lat": 20.4, "lng": 85.9}}
    result = verify_evidence_pack(tampered, {"expectedLocation": expected, "requireAfter": True})
    assert result["ok"] is False
    assert result["checks"]["location"] is False
    assert result["fingerprintMatches"] is False
