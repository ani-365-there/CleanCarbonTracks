from __future__ import annotations

from .inbox import FieldOpsInbox, InboxError, create_field_ops_inbox
from .proof import ProofOfWork, create_proof_of_work
from .scorer import PriorityScorer, create_priority_scorer


class FieldOps:
    """Worker queue + SLA scoring + proof-of-work closeout."""

    def __init__(self, now=None, scorer_opts=None):
        self.inbox = create_field_ops_inbox(now=now)
        self.scorer = create_priority_scorer(**(scorer_opts or {}))
        self.proof = create_proof_of_work()

    def open_job(self, title: str, location: dict, factors: dict, source_id=None, metadata=None) -> dict:
        scored = self.scorer.score(factors)
        job = self.inbox.create({
            "title": title,
            "location": location,
            "priority": scored["score"],
            "sourceId": source_id,
            "slaDueAt": scored["slaDueAt"],
            "metadata": {**(metadata or {}), "rank": scored["rankHint"]},
        })
        return {"job": job, "scored": scored}

    def subscribe(self, name, handler):
        return self.inbox.subscribe(name, handler)


def create_field_ops(**kwargs) -> FieldOps:
    return FieldOps(**kwargs)
