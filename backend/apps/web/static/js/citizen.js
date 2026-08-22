const photo = document.getElementById("photo");
const preview = document.getElementById("preview");
const camHint = document.getElementById("camHint");
const submit = document.getElementById("submit");
const locLabel = document.getElementById("locLabel");
const notes = document.getElementById("notes");
const list = document.getElementById("list");
const msg = document.getElementById("msg");
const who = document.getElementById("who");

let category = null;
let locationFix = null;
let photoFile = null;

function show(text, ok) {
  msg.className = ok ? "ok" : "err";
  msg.textContent = text;
}

function ready() {
  submit.disabled = !(photoFile && category && locationFix);
}

document.querySelectorAll(".pill").forEach((btn) => {
  btn.addEventListener("click", () => {
    category = btn.dataset.cat;
    document.querySelectorAll(".pill").forEach((b) => b.classList.toggle("on", b === btn));
    ready();
  });
});

photo.addEventListener("change", () => {
  photoFile = photo.files && photo.files[0];
  if (!photoFile) return;
  preview.src = URL.createObjectURL(photoFile);
  preview.hidden = false;
  camHint.hidden = true;
  ready();
});

async function loadReports() {
  const data = await api("/api/citizen/reports");
  if (!data.reports.length) {
    list.innerHTML = `<div class="card"><span class="hint">Nothing reported yet.</span></div>`;
    return;
  }
  list.innerHTML = data.reports
    .map((r) => {
      const cls = r.pickupStatus === "collected" ? "collected" : r.pickupStatus.replace(/\s/g, "");
      return `<article class="card row">
        ${r.photoUrl ? `<img src="${r.photoUrl}" alt="${r.category}" />` : "<div></div>"}
        <div>
          <strong>${r.binName}</strong>
          <div class="hint">${r.category} · ${new Date(r.createdAt).toLocaleString()}</div>
        </div>
        <span class="status ${cls}">${r.pickupStatus}</span>
      </article>`;
    })
    .join("");
}

submit.addEventListener("click", async () => {
  if (submit.disabled) return;
  submit.disabled = true;
  show("Sending…", true);
  try {
    const body = new FormData();
    body.append("category", category);
    body.append("lat", locationFix.lat);
    body.append("lng", locationFix.lng);
    body.append("notes", notes.value);
    body.append("photo", photoFile);
    await api("/api/citizen/reports", { method: "POST", body });
    show("Reported. Collection has the ticket.", true);
    notes.value = "";
    await loadReports();
  } catch (err) {
    show(err.message, false);
  }
  ready();
});

(async function init() {
  await session("citizen");
  const me = await api("/api/me");
  who.textContent = me.displayName;
  try {
    locationFix = await getLocation();
    locLabel.textContent = fmtLoc(locationFix);
  } catch (err) {
    locLabel.textContent = "blocked";
    show(err.message, false);
  }
  await loadReports();
  ready();
})();
