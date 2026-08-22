# Object store (platform)

In-memory (optional disk) blob store for report photos and proof-of-work images.

**Not a marketplace lead.** Pair it with `intake` / `field_ops`, which only store attachment ids.

```python
from object_store import create_object_store
```

`platform/` must be on `PYTHONPATH` (same as `modules/`).

## Expects

`put(data: bytes, mime: str)`

Allowed MIME: `image/jpeg`, `image/png`, `image/webp`, `application/pdf`.  
Size: 1 byte … 8 MB.

Optional `directory=` to also write files to disk. Ids must match `[a-zA-Z0-9._-]+`.

## Does

Stores bytes, returns metadata with SHA-256. Get / delete by id.

## How

SHA-256 of the bytes on write. Memory copy plus optional file next to `directory / id`.

## Outputs

```python
{"id": "...", "mime": "image/jpeg", "byteSize": 12000, "sha256": "64 hex chars", "createdAt": "...Z"}
```

`get(id)` → `{meta, bytes}` or `None`.

## API

```python
store = create_object_store()  # or directory="./data/blobs"
meta = store.put(jpeg_bytes, "image/jpeg")
blob = store.get(meta["id"])
store.remove(meta["id"])
```

Raises `ObjectStoreError` (`UNSUPPORTED_TYPE`, `INVALID_SIZE`, `INVALID_ID`).
