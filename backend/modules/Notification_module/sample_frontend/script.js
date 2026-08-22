const API = "http://localhost:5000";

let lastShownId = null;

function sendNotif() {
    const user = document.getElementById("user").value;
    const message = document.getElementById("message").value;

    fetch(API + "/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, message })
    })
    .then(res => res.json())
    .then(data => {
        showPopup(data.data.message); // 🔥 popup only when sending
        loadNotifs();
    });
}

function deleteNotif(id) {
    fetch(API + "/notifications/" + id, {
        method: "DELETE"
    })
    .then(() => loadNotifs());
}

function loadNotifs() {
    const user = document.getElementById("user").value;

    fetch(API + "/notifications/" + user)
    .then(res => res.json())
    .then(data => {
        const list = document.getElementById("list");
        list.innerHTML = "";

        data.data.reverse().forEach((n, index) => {
            const div = document.createElement("div");
            div.className = "notification";

            const text = document.createElement("span");
            text.innerText = n.message;

            const btn = document.createElement("button");
            btn.innerText = "❌";
            btn.onclick = () => deleteNotif(n.id);

            div.appendChild(text);
            div.appendChild(btn);
            list.appendChild(div);

            // ✅ FIXED POPUP (no repeat on delete)
        });
    });
}

function showPopup(message) {
    const popup = document.createElement("div");
    popup.className = "popup";
    popup.innerText = message;

    document.body.appendChild(popup);

    setTimeout(() => popup.remove(), 3000);
}

// optional auto-refresh
setInterval(loadNotifs, 3000);