from __future__ import annotations

import re

from .text import fuse_text, score_against_label

WASTE_CAMPUS_TAXONOMY = {
    "id": "waste-campus",
    "name": "Campus waste",
    "unknownLabelId": "unknown",
    "labels": [
        {"id": "wet", "name": "Wet / organic", "synonyms": ["food", "leftover", "organic", "banana", "mess", "kitchen", "peel", "spoiled"]},
        {"id": "dry", "name": "Dry recyclable", "synonyms": ["plastic", "bottle", "paper", "cardboard", "can", "wrapper", "newspaper"]},
        {"id": "mixed", "name": "Mixed / overflow", "synonyms": ["mixed", "overflow", "overflowing", "full", "garbage", "dump", "pile"]},
        {"id": "hazardous", "name": "Hazardous", "synonyms": ["battery", "chemical", "medical", "syringe", "paint", "bleach", "acid"]},
        {"id": "ewaste", "name": "E-waste", "synonyms": ["phone", "charger", "laptop", "cable", "electronics", "adapter"]},
    ],
}


class ClassifierError(Exception):
    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code


def _validate(taxonomy: dict) -> None:
    if not taxonomy.get("id", "").strip() or not taxonomy.get("name", "").strip():
        raise ClassifierError("INVALID_TAXONOMY", "taxonomy id and name are required")
    if not taxonomy.get("labels"):
        raise ClassifierError("EMPTY_LABELS", "taxonomy needs at least one label")
    ids = set()
    for label in taxonomy["labels"]:
        if not label.get("id", "").strip() or not label.get("name", "").strip():
            raise ClassifierError("INVALID_LABEL", "each label needs id and name")
        if label["id"] in ids:
            raise ClassifierError("DUPLICATE_LABEL", f"duplicate label id {label['id']}")
        ids.add(label["id"])


class ImageClassifier:
    def __init__(self, taxonomy: dict, min_score: float = 0.18, vision=None):
        _validate(taxonomy)
        self.taxonomy = taxonomy
        self.min_score = min_score
        self.vision = vision

    def classify(self, text: str | None = None, filename: str | None = None, vision_labels: list | None = None, image: dict | None = None) -> dict:
        text_tokens = fuse_text(text, filename)
        hints = list(vision_labels or [])
        if image and self.vision:
            hints.extend(self.vision(image["bytes"], image["mime"]))

        ranked = []
        for label in self.taxonomy["labels"]:
            text_hit = score_against_label(text_tokens, label)
            synonym_set = {t for t in re.split(r"[^a-z0-9]+", " ".join([label["id"], label["name"], *label.get("synonyms", [])]).lower()) if t}
            vision_score = 0.0
            vision_matched = []
            for hint in hints:
                hint_tokens = [t for t in re.split(r"[^a-z0-9]+", hint["label"].lower()) if t]
                hits = sum(1 for t in hint_tokens if t in synonym_set)
                if not hits:
                    continue
                combined = min(1, max(0, hint["score"]) * (0.55 + 0.45 * (hits / len(hint_tokens))))
                if combined > vision_score:
                    vision_score = combined
                    vision_matched.append(hint["label"])
            score = min(1, text_hit["score"] * 0.65 + vision_score * 0.7 + (0.1 if text_hit["score"] > 0 and vision_score > 0 else 0))
            ranked.append({
                "id": label["id"],
                "name": label["name"],
                "score": round(score, 4),
                "matched": list(dict.fromkeys([*text_hit["matched"], *vision_matched])),
            })
        ranked.sort(key=lambda r: r["score"], reverse=True)
        top = ranked[0] if ranked else None
        unknown = top is None or top["score"] < self.min_score
        return {
            "taxonomyId": self.taxonomy["id"],
            "top": None if unknown else top,
            "ranked": ranked,
            "unknown": unknown,
        }


def create_image_classifier(taxonomy: dict, **kwargs) -> ImageClassifier:
    return ImageClassifier(taxonomy, **kwargs)
