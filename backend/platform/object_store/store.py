from __future__ import annotations

import hashlib
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path

ALLOWED = {"image/jpeg", "image/png", "image/webp", "application/pdf"}
MAX_BYTES = 8 * 1024 * 1024


class ObjectStoreError(Exception):
    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code


def _iso(now) -> str:
    dt = now()
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat().replace("+00:00", "Z")


class ObjectStore:
    def __init__(self, now=None, id_factory=None, directory: str | None = None):
        self._memory: dict[str, dict] = {}
        self._now = now or (lambda: datetime.now(timezone.utc))
        self._id = id_factory or (lambda: str(uuid.uuid4()))
        self.directory = Path(directory) if directory else None

    def put(self, data: bytes, mime: str) -> dict:
        if mime not in ALLOWED:
            raise ObjectStoreError("UNSUPPORTED_TYPE", f"Refusing mime type {mime}")
        if not data or len(data) > MAX_BYTES:
            raise ObjectStoreError("INVALID_SIZE", "File must be between 1 byte and 8MB")
        meta = {
            "id": self._id(),
            "mime": mime,
            "byteSize": len(data),
            "sha256": hashlib.sha256(data).hexdigest(),
            "createdAt": _iso(self._now),
        }
        copy_bytes = bytes(data)
        self._memory[meta["id"]] = {"meta": meta, "bytes": copy_bytes}
        if self.directory:
            self.directory.mkdir(parents=True, exist_ok=True)
            (self.directory / meta["id"]).write_bytes(copy_bytes)
        return dict(meta)

    def get(self, obj_id: str) -> dict | None:
        hit = self._memory.get(obj_id)
        if hit:
            return {"meta": dict(hit["meta"]), "bytes": bytes(hit["bytes"])}
        if not self.directory:
            return None
        path = self._file_path(obj_id)
        if not path.exists():
            return None
        data = path.read_bytes()
        meta = {
            "id": obj_id,
            "mime": "application/octet-stream",
            "byteSize": len(data),
            "sha256": hashlib.sha256(data).hexdigest(),
            "createdAt": _iso(self._now),
        }
        return {"meta": meta, "bytes": data}

    def remove(self, obj_id: str) -> bool:
        existed = obj_id in self._memory
        self._memory.pop(obj_id, None)
        if self.directory:
            path = self._file_path(obj_id)
            if path.exists():
                path.unlink()
                return True
        return existed

    def _file_path(self, obj_id: str) -> Path:
        if not self.directory:
            raise ObjectStoreError("NO_DIR", "No directory configured")
        if not re.match(r"^[a-zA-Z0-9._-]+$", obj_id):
            raise ObjectStoreError("INVALID_ID", "Unsafe object id")
        return self.directory / obj_id


def create_object_store(**kwargs) -> ObjectStore:
    return ObjectStore(**kwargs)
