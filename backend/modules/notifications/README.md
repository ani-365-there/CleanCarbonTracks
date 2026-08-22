# Notification inbox

Per-user alerts: send, list, mark read, delete, event bus. Domain-free — jobs, payments, chat, system toasts.

**Does not import other sellable modules.** In-memory. Optional stdlib HTTP face (no Express, no API key).

```python
from notifications import create_notifications
```

---

## Expects

**`send(inp)`**

| Field | Required | Notes |
|---|---|---|
| `user` | yes | Recipient id (`userId` also accepted) |
| `message` | yes | Body (`body` also accepted) |
| `title` | no | Short headline |
| `channel` | no | Default `"general"` (e.g. `jobs`, `payments`) |
| `id` | no | UUID if omitted |

Init: `max_per_user=50` (oldest dropped **for that user only**).

---

## Does

Stores a notification for one user. Lists newest first. Marks read. Deletes. Emits events other code can subscribe to.

---

## How

Each user has their own cap. IDs are UUIDs. Times are ISO-Z. `subscribe(name, handler)` — use `"*"` or `notification.sent` / `notification.read` / `notification.deleted`.

HTTP (optional): `python -m notifications.server` on `127.0.0.1:5000`

| Method | Path | Body / params |
|---|---|---|
| POST | `/notify` | `{user, message, title?, channel?}` |
| GET | `/notifications/:user` | |
| DELETE | `/notifications/:id` | |

CORS is open so a static HTML demo can call it.

---

## Outputs

```python
{
  "id": "...",
  "user": "worker-1",
  "message": "Job assigned",
  "title": "CollectOS",
  "channel": "jobs",
  "read": False,
  "createdAt": "...Z",
}
```

HTTP list: `{success, count, data: [...]}`.  
Missing delete raises `NotifyError` (`.code`: `NOT_FOUND`). Send without user/message: `INVALID_USER` / `INVALID_MESSAGE`.

---

## API

```python
n = create_notifications(max_per_user=50)
n.subscribe("*", lambda event: print(event["name"], event["notification"]["id"]))
item = n.send({"user": "worker-1", "channel": "jobs", "message": "Pickup assigned at KP-7"})
n.list("worker-1")
n.list("worker-1", unread_only=True)
n.mark_read(item["id"])
n.delete(item["id"])
```

```bash
python -m notifications.server
# open sample_frontend/index.html
```
