from __future__ import annotations

import copy
import hashlib
import hmac
import re
import secrets
from datetime import datetime, timedelta, timezone


class AccessError(Exception):
    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code


def _iso(now) -> str:
    dt = now()
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat().replace("+00:00", "Z")


def _normalize_email(email: str) -> str:
    trimmed = email.strip().lower()
    if not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", trimmed):
        raise AccessError("INVALID_EMAIL", "Valid email is required")
    return trimmed


def _hash_password(password: str, salt: bytes) -> str:
    return hashlib.scrypt(password.encode(), salt=salt, n=2**14, r=8, p=1, dklen=32).hex()


class RoleAccess:
    def __init__(self, now=None, secret: str = "omega-dev-secret-change-me", session_ttl_ms: int = 12 * 60 * 60 * 1000):
        self._roles: dict[str, dict] = {}
        self._users: dict[str, dict] = {}
        self._email_index: dict[str, str] = {}
        self._passwords: dict[str, dict] = {}
        self._sessions: dict[str, dict] = {}
        self._now = now or (lambda: datetime.now(timezone.utc))
        self._secret = secret
        self._session_ttl_ms = session_ttl_ms

    def define_role(self, role: dict) -> dict:
        if not role.get("id", "").strip() or not role.get("name", "").strip():
            raise AccessError("INVALID_ROLE", "role id and name are required")
        next_role = {**role, "permissions": list(dict.fromkeys(role["permissions"]))}
        self._roles[next_role["id"]] = next_role
        return copy.deepcopy(next_role)

    def register_user(self, email: str, display_name: str, password: str, role_ids: list[str], user_id: str | None = None) -> dict:
        if len(password) < 8:
            raise AccessError("WEAK_PASSWORD", "Password must be at least 8 characters")
        email = _normalize_email(email)
        if email in self._email_index:
            raise AccessError("EMAIL_TAKEN", "Email already registered")
        for role_id in role_ids:
            if role_id not in self._roles:
                raise AccessError("UNKNOWN_ROLE", f"Unknown role {role_id}")
        uid = user_id or secrets.token_hex(8)
        user = {
            "id": uid,
            "email": email,
            "displayName": display_name.strip(),
            "roleIds": list(role_ids),
            "active": True,
            "createdAt": _iso(self._now),
        }
        salt = secrets.token_bytes(16)
        self._users[uid] = user
        self._email_index[email] = uid
        self._passwords[uid] = {"salt": salt, "hash": _hash_password(password, salt)}
        return copy.deepcopy(user)

    def login(self, email: str, password: str) -> dict:
        uid = self._email_index.get(_normalize_email(email))
        user = self._users.get(uid) if uid else None
        stored = self._passwords.get(uid) if uid else None
        if not user or not stored or not user["active"]:
            raise AccessError("AUTH_FAILED", "Invalid email or password")
        candidate = bytes.fromhex(_hash_password(password, stored["salt"]))
        expected = bytes.fromhex(stored["hash"])
        if not hmac.compare_digest(candidate, expected):
            raise AccessError("AUTH_FAILED", "Invalid email or password")
        token = self._sign(user["id"])
        now = self._now()
        if now.tzinfo is None:
            now = now.replace(tzinfo=timezone.utc)
        session = {
            "token": token,
            "userId": user["id"],
            "expiresAt": (now + timedelta(milliseconds=self._session_ttl_ms)).isoformat().replace("+00:00", "Z"),
        }
        self._sessions[token] = session
        return dict(session)

    def authenticate(self, token: str) -> dict:
        session = self._sessions.get(token)
        if not session:
            raise AccessError("UNAUTHENTICATED", "Invalid session")
        expires = datetime.fromisoformat(session["expiresAt"].replace("Z", "+00:00"))
        now = self._now()
        if now.tzinfo is None:
            now = now.replace(tzinfo=timezone.utc)
        if expires <= now:
            self._sessions.pop(token, None)
            raise AccessError("EXPIRED", "Session expired")
        user = self._users.get(session["userId"])
        if not user or not user["active"]:
            raise AccessError("UNAUTHENTICATED", "Invalid session")
        return copy.deepcopy(user)

    def logout(self, token: str) -> None:
        self._sessions.pop(token, None)

    def permissions_of(self, user_id: str) -> set[str]:
        user = self._users.get(user_id)
        if not user:
            raise AccessError("NOT_FOUND", f"User {user_id} not found")
        perms = set()
        for role_id in user["roleIds"]:
            role = self._roles.get(role_id)
            if not role:
                continue
            perms.update(role["permissions"])
        return perms

    def can(self, user_id: str, permission: str) -> bool:
        perms = self.permissions_of(user_id)
        if "*" in perms or permission in perms:
            return True
        ns = permission.split(":")[0]
        return bool(ns and f"{ns}:*" in perms)

    def assert_perm(self, user_id: str, permission: str) -> None:
        if not self.can(user_id, permission):
            raise AccessError("FORBIDDEN", f"Missing permission {permission}")

    def get_user(self, user_id: str) -> dict | None:
        user = self._users.get(user_id)
        return copy.deepcopy(user) if user else None

    def _sign(self, user_id: str) -> str:
        nonce = secrets.token_hex(16)
        now = self._now()
        payload = f"{user_id}.{nonce}.{int(now.timestamp() * 1000)}"
        sig = hmac.new(self._secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
        return f"{payload}.{sig}"


def create_role_access(**kwargs) -> RoleAccess:
    return RoleAccess(**kwargs)


def seed_civic_roles(access: RoleAccess) -> None:
    access.define_role({"id": "resident", "name": "Resident", "permissions": ["reports:create", "reports:read-own", "chat:use", "assets:read"]})
    access.define_role({"id": "worker", "name": "Field worker", "permissions": ["jobs:read", "jobs:update", "proof:create", "assets:read"]})
    access.define_role({"id": "dispatcher", "name": "Dispatcher", "permissions": ["jobs:*", "reports:read", "assets:read", "routes:plan"]})
    access.define_role({"id": "admin", "name": "Admin", "permissions": ["*"]})
