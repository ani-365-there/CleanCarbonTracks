from __future__ import annotations

import math
import re

STOP = {"a", "an", "the", "and", "or", "of", "to", "in", "on", "for", "is", "are", "do", "i", "me", "my", "please"}


def tokenize(text: str) -> list[str]:
    cleaned = re.sub(r"[^a-z0-9\s]", " ", text.lower())
    return [t for t in cleaned.split() if len(t) > 1 and t not in STOP]


class Bm25Index:
    def __init__(self, docs: list[dict], k1: float = 1.5, b: float = 0.75):
        self.k1 = k1
        self.b = b
        self.docs = []
        self.df: dict[str, int] = {}
        for doc in docs:
            tokens = tokenize(f"{doc['title']} {doc['body']} {' '.join(doc.get('tags') or [])}")
            tf: dict[str, int] = {}
            for token in tokens:
                tf[token] = tf.get(token, 0) + 1
            self.docs.append({"doc": doc, "tokens": tokens, "tf": tf})
            for term in set(tokens):
                self.df[term] = self.df.get(term, 0) + 1
        self.avg_len = sum(len(d["tokens"]) for d in self.docs) / max(1, len(self.docs))

    def search(self, query: str, limit: int = 3) -> list[dict]:
        q_tokens = tokenize(query)
        if not q_tokens or not self.docs:
            return []
        n = len(self.docs)
        scored = []
        for item in self.docs:
            score = 0.0
            for term in q_tokens:
                df = self.df.get(term, 0)
                if df == 0:
                    continue
                idf = math.log(1 + (n - df + 0.5) / (df + 0.5))
                f = item["tf"].get(term, 0)
                denom = f + self.k1 * (1 - self.b + self.b * (len(item["tokens"]) / self.avg_len))
                score += idf * ((f * (self.k1 + 1)) / denom)
            scored.append({
                "id": item["doc"]["id"],
                "title": item["doc"]["title"],
                "score": score,
                "snippet": _snippet(item["doc"]["body"], q_tokens),
            })
        return sorted([d for d in scored if d["score"] > 0], key=lambda d: d["score"], reverse=True)[:limit]


def _snippet(body: str, q_tokens: list[str]) -> str:
    lower = body.lower()
    idx = 0
    for term in q_tokens:
        found = lower.find(term)
        if found >= 0:
            idx = found
            break
    start = max(0, idx - 40)
    end = min(len(body), idx + 120)
    return body[start:end].strip()
