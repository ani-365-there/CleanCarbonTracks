from role_access import create_role_access, seed_civic_roles


def test_register_login_permissions():
    access = create_role_access(secret="test-secret")
    seed_civic_roles(access)
    user = access.register_user("res@campus.test", "Ria", "password123", ["resident"])
    session = access.login("res@campus.test", "password123")
    me = access.authenticate(session["token"])
    assert me["id"] == user["id"]
    assert access.can(me["id"], "reports:create") is True
    assert access.can(me["id"], "jobs:assign") is False
    try:
        access.assert_perm(me["id"], "jobs:*")
        raise AssertionError("expected forbidden")
    except Exception as exc:
        assert "Missing permission" in str(exc)


def test_bad_password_same_message():
    access = create_role_access()
    seed_civic_roles(access)
    access.register_user("a@b.co", "A", "password123", ["admin"])
    try:
        access.login("a@b.co", "nope-nope")
        raise AssertionError("expected auth fail")
    except Exception as exc:
        assert "Invalid email or password" in str(exc)
    try:
        access.login("missing@b.co", "password123")
        raise AssertionError("expected auth fail")
    except Exception as exc:
        assert "Invalid email or password" in str(exc)


def test_admin_wildcard():
    access = create_role_access()
    seed_civic_roles(access)
    admin = access.register_user("admin@campus.test", "Admin", "password123", ["admin"])
    assert access.can(admin["id"], "analytics:read") is True
