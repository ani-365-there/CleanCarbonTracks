from __future__ import annotations

from .geo import centroid, haversine_meters


def _cluster_jobs(jobs: list[dict], radius: float) -> list[dict]:
    ordered = sorted(jobs, key=lambda j: j["priority"], reverse=True)
    clusters = []
    for job in ordered:
        best = None
        for cluster in clusters:
            center = centroid([j["location"] for j in cluster["jobs"]])
            distance = haversine_meters(job["location"], center)
            if distance <= radius and (best is None or distance < best["distance"]):
                best = {"cluster": cluster, "distance": distance}
        if best:
            best["cluster"]["jobs"].append(job)
        else:
            clusters.append({"id": f"c{len(clusters) + 1}", "jobs": [job]})
    return clusters


def _stop_cost(frm: dict, job: dict, max_priority: float, priority_weight: float) -> float:
    distance = haversine_meters(frm, job["location"])
    p = 0 if max_priority <= 0 else job["priority"] / max_priority
    return distance * (1 - priority_weight) - p * 400 * priority_weight


def _tour(cluster: dict, start: dict, priority_weight: float) -> list[dict]:
    remaining = list(cluster["jobs"])
    ordered = []
    here = start
    max_priority = max((j["priority"] for j in cluster["jobs"]), default=0)
    while remaining:
        best_i = min(range(len(remaining)), key=lambda i: _stop_cost(here, remaining[i], max_priority, priority_weight))
        next_job = remaining.pop(best_i)
        ordered.append(next_job)
        here = next_job["location"]
    return ordered


def plan_route(jobs: list[dict], start: dict, cluster_radius_meters: float = 180, priority_weight: float = 0.45, max_stops: int | None = None, capacity: float | None = None) -> dict:
    priority_weight = min(1, max(0, priority_weight))
    remaining_capacity = capacity
    skipped = []
    accepted = []
    for job in sorted(jobs, key=lambda j: j["priority"], reverse=True):
        if max_stops is not None and len(accepted) >= max_stops:
            skipped.append({"job": job, "reason": "maxStops"})
            continue
        demand = job.get("demand", 1)
        if remaining_capacity is not None and demand > remaining_capacity:
            skipped.append({"job": job, "reason": "capacity"})
            continue
        accepted.append(job)
        if remaining_capacity is not None:
            remaining_capacity -= demand

    clusters = _cluster_jobs(accepted, cluster_radius_meters)
    unused = list(clusters)
    stops = []
    here = start
    total = 0.0
    while unused:
        max_priority = max((j["priority"] for c in unused for j in c["jobs"]), default=0)
        best_i = 0
        best_score = float("inf")
        for i, cluster in enumerate(unused):
            center = centroid([j["location"] for j in cluster["jobs"]])
            peak = max(j["priority"] for j in cluster["jobs"])
            score = _stop_cost(here, {"id": cluster["id"], "location": center, "priority": peak}, max_priority, priority_weight)
            if score < best_score:
                best_score = score
                best_i = i
        cluster = unused.pop(best_i)
        for job in _tour(cluster, here, priority_weight):
            distance = haversine_meters(here, job["location"])
            total += distance
            stops.append({**job, "distanceFromPreviousMeters": round(distance, 1), "clusterId": cluster["id"]})
            here = job["location"]
    return {"stops": stops, "skipped": skipped, "totalDistanceMeters": round(total, 1), "clusters": len(clusters)}


class FieldJobRouter:
    def __init__(self, **defaults):
        self.defaults = defaults

    def plan(self, jobs: list[dict], start: dict, **options) -> dict:
        return plan_route(jobs, start, **{**self.defaults, **options})


def create_field_job_router(**defaults) -> FieldJobRouter:
    return FieldJobRouter(**defaults)
