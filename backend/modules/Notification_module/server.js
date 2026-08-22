const crypto = require("crypto");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;
const MAX_PER_USER = 50;

app.use(cors());
app.use(express.json());

let notifications = [];

function listFor(user) {
    return notifications.filter((n) => n.user === user);
}

app.post("/notify", (req, res) => {
    const { user, message, title, channel } = req.body || {};
    if (!user || !message) {
        return res.status(400).json({ error: "INVALID_MESSAGE", message: "User and message required" });
    }

    const notif = {
        id: crypto.randomUUID(),
        user: String(user).trim(),
        message: String(message).trim(),
        title: title || null,
        channel: channel || "general",
        read: false,
        createdAt: new Date().toISOString(),
    };
    notifications.push(notif);

    const owned = notifications.filter((n) => n.user === notif.user);
    if (owned.length > MAX_PER_USER) {
        const drop = owned[0];
        notifications = notifications.filter((n) => n.id !== drop.id);
    }

    res.json({ success: true, message: "Notification sent", data: notif });
});

app.get("/notifications/:user", (req, res) => {
    const userNotifs = listFor(req.params.user).slice().reverse();
    res.json({ success: true, count: userNotifs.length, data: userNotifs });
});

app.delete("/notifications/:id", (req, res) => {
    const before = notifications.length;
    notifications = notifications.filter((n) => n.id !== req.params.id);
    if (notifications.length === before) {
        return res.status(404).json({ error: "NOT_FOUND", message: "notification not found" });
    }
    res.json({ success: true, message: "Notification deleted" });
});

app.get("/", (_req, res) => {
    res.json({ ok: true, service: "notifications" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
