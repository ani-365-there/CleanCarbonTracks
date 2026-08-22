# Role access (platform)

Users, roles, scrypt passwords, HMAC sessions, permission checks. Domain-free.

**Not a marketplace lead.** Every team needs login; few will buy “auth” over a router. Lives under `platform/` with `object_store`.

```python
from role_access import create_role_access, seed_civic_roles
```

`seed_civic_roles` is optional. It adds `resident`, `worker`, `dispatcher`, `admin` with campus-style permissions. Define your own roles instead if you want.

## Expects

- `secret` at init (HMAC). Change it in anything real.
- Roles: `{id, name, permissions: ["reports:create", "jobs:*", "*"]}`
- Register: email, display name, password (≥8 chars), list of role ids.
- Permission strings: exact match, or `jobs:*` for that namespace, or `*` for all.

## Does

Register, login, authenticate token, logout, `can` / `assert_perm`.

## How

Passwords: scrypt (n=2¹⁴, r=8, p=1, 32-byte key), random salt, timing-safe compare.  
Session token: `userId.nonce.timestamp.hmac`. Default TTL 12 hours.  
Failed login always says “Invalid email or password” (no email leak).

## Outputs

**User:** `{id, email, displayName, roleIds, active, createdAt}`  
**Session:** `{token, userId, expiresAt}`

## API

```python
access = create_role_access(secret="change-me")
seed_civic_roles(access)  # optional
user = access.register_user("a@b.co", "Ria", "password123", ["resident"])
sess = access.login("a@b.co", "password123")
me = access.authenticate(sess["token"])
access.can(me["id"], "reports:create")
access.assert_perm(me["id"], "jobs:assign")  # raises AccessError FORBIDDEN
access.logout(sess["token"])
```

Raises `AccessError` (`.code`: `AUTH_FAILED`, `EMAIL_TAKEN`, `EXPIRED`, `FORBIDDEN`, …).
