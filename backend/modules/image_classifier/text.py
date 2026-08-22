from __future__ import annotations

import re

STOP = {
    "a", "an", "the", "and", "or", "of", "in", "on", "at", "to", "for", "with",
    "this", "that", "is", "are", "bin", "image", "photo", "img", "jpg", "jpeg", "png", "webp",
}


def tokenize(raw: str) -> list[str]:
    text = re.sub(r"[_\-.]+", " ", raw.lower())
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return [t for t in text.split() if len(t) > 1 and t not in STOP]


def ngrams(tokens: list[str]) -> list[str]:
    grams = list(tokens)
    grams.extend(f"{tokens[i]} {tokens[i + 1]}" for i in range(len(tokens) - 1))
    return grams


def score_against_label(haystack: list[str], label: dict) -> dict:
    vocab = ngrams(tokenize(" ".join([label["id"], label["name"], *label.get("synonyms", [])])))
    vocab_set = set(vocab)
    matched = []
    hits = 0
    for token in haystack:
        if token in vocab_set:
            hits += 2 if " " in token else 1
            matched.append(token)
    weight = label.get("weight", 1)
    score = 0 if hits == 0 else min(1, (hits / max(3, len(vocab) * 0.35)) * weight)
    return {"score": score, "matched": list(dict.fromkeys(matched))}


def fuse_text(text: str | None = None, filename: str | None = None) -> list[str]:
    return ngrams(tokenize(f"{text or ''} {filename or ''}"))
