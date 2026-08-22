# Configurable image classifier

Buyer supplies the label list. Scores text, filename, and optional vision hints. No GPU, no API key.

```python
from image_classifier import create_image_classifier, WASTE_CAMPUS_TAXONOMY
```

Waste teams can use `WASTE_CAMPUS_TAXONOMY`. Other teams pass their own labels (crop disease, PPE, defect/OK).

## Expects

**Taxonomy**

```python
{
  "id": "waste",
  "name": "Waste",
  "labels": [
    {"id": "wet", "name": "Wet", "synonyms": ["food", "organic"], "weight": 1},  # weight optional
  ],
}
```

Each label needs unique `id`, `name`, and usually `synonyms`.

**Classify input** (all optional, but give at least text, filename, or vision_labels)

| Field | Type |
|---|---|
| `text` | caption / user note |
| `filename` | e.g. `mess_full.jpg` |
| `vision_labels` | `[{"label": "banana", "score": 0.9}, ...]` from *your* model |
| `image` | `{"bytes": bytes, "mime": str}` — only used if you passed a `vision=` callable at init |

Optional `min_score` (default `0.18`). Below that, result is unknown.

Optional `vision=callable(bytes, mime) -> [{label, score}]`.

## Does

Ranks every taxonomy label. Picks the top if it clears `min_score`.

## How

1. Tokenize caption + filename (stopwords stripped, bigrams kept).
2. Score overlap with each label’s id / name / synonyms.
3. If vision hints exist, boost labels whose synonyms match those tokens.
4. Fuse: `0.65 * text + 0.7 * vision` (plus a small bonus if both hit).

This is **not** a trained neural net unless you plug one in via `vision`.

## Outputs

```python
{
  "taxonomyId": "waste-campus",
  "unknown": False,
  "top": {"id": "wet", "name": "Wet / organic", "score": 0.42, "matched": ["food", "mess"]},
  "ranked": [ ... all labels, highest first ... ],
}
```

If unknown: `top` is `None`, `unknown` is `True`.

## API

```python
clf = create_image_classifier(WASTE_CAMPUS_TAXONOMY)
result = clf.classify(text="overflowing food at mess", filename="bin.jpg")
result["top"]["id"]  # "wet" or "mixed" or ...
```

Raises `ClassifierError` if the taxonomy is empty or has duplicate ids.
