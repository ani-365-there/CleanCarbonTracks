from object_store import create_object_store


def test_stores_bytes():
    store = create_object_store()
    jpeg = bytes([0xFF, 0xD8, 0xFF, 0x00])
    saved = store.put(jpeg, "image/jpeg")
    assert saved["byteSize"] == 4
    assert len(saved["sha256"]) == 64
    loaded = store.get(saved["id"])
    assert loaded["bytes"] == jpeg


def test_rejects_bad_type():
    store = create_object_store()
    try:
        store.put(b"hi", "text/html")
        raise AssertionError("expected reject")
    except Exception as exc:
        assert "Refusing mime" in str(exc)
