const dutyBtn = document.getElementById("duty");
const dutyLabel = document.getElementById("dutyLabel");
const dutyHint = document.getElementById("dutyHint");
const pendingEl = document.getElementById("pending");
const doneEl = document.getElementById("done");
const pendingCount = document.getElementById("pendingCount");
const doneCount = document.getElementById("doneCount");
const msg = document.getElementById("msg");
const who = document.getElementById("who");

let onDuty = false;
let locationFix = null;

function show(text, ok) {
  msg.className = ok ? "ok" : "err";
  msg.textContent = text;
}

function paintDuty() {
  dutyBtn.classList.toggle("on", onDuty);
  dutyBtn.setAttribute("aria-pressed", String(onDuty));
  dutyLabel.textContent = onDuty ? "On duty" : "Off duty";
  dutyHint.textContent = locationFix ? fmtLoc(locationFix) : "Location needed to auto-assign";
}

function jobCard(job, live) {
  const photo = job.reportPhotoUrl
    ? `<img class="job-photo" src="${job.reportPhotoUrl}" alt="" />`
    : "";
  const proof = live
    ? `<label class="camera" style="aspect-ratio:16/10;margin:8px 0">
         <div class="placeholder">After photo — proof of pickup</div>
         <input class="after" type="file" accept="image/*" capture="environment" />
       </label>
       <button class="btn primary complete" type="button">Mark collected</button>
       <button class="btn ghost fail" type="button">Could not collect</button>`
    : "";
  return `<article class="card" data-id="${job.id}">
    <strong>${job.binName || job.title}</strong>
    <div class="hint">${job.category || ""} · ${job.status}</div>
    ${photo}
    ${proof}
  </article>`;
}

async function refresh() {
  const dash = await api("/api/worker/dashboard");
  onDuty = dash.onDuty;
  paintDuty();
  pendingCount.textContent = dash.pendingCount;
  doneCount.textContent = dash.doneCount;
  pendingEl.innerHTML = dash.pending.length
    ? dash.pending.map((j) => jobCard(j, true)).join("")
    : `<div class="card"><span class="hint">${onDuty ? "No jobs yet. Wait for a resident report." : "Go on duty to get the nearest bin."}</span></div>`;
  doneEl.innerHTML = dash.done.length
    ? dash.done.map((j) => jobCard(j, false)).join("")
    : `<div class="card"><span class="hint">Nothing collected yet.</span></div>`;
}

dutyBtn.addEventListener("click", async () => {
  try {
    if (!onDuty) locationFix = await getLocation();
    const data = await api("/api/worker/duty", {
      method: "POST",
      body: JSON.stringify({ onDuty: !onDuty, location: locationFix }),
    });
    onDuty = data.onDuty;
    paintDuty();
    if (data.assigned) show(`Assigned: ${data.assigned.title}`, true);
    else if (onDuty) show("On duty. Waiting for the next overflow.", true);
    else show("Off duty.", true);
    await refresh();
  } catch (err) {
    show(err.message, false);
  }
});

pendingEl.addEventListener("change", (event) => {
  if (!event.target.classList.contains("after")) return;
  const file = event.target.files && event.target.files[0];
  const box = event.target.closest("label");
  if (!file || !box) return;
  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  img.className = "job-photo";
  box.replaceChildren(img, event.target);
});

pendingEl.addEventListener("click", async (event) => {
  const card = event.target.closest("[data-id]");
  if (!card) return;
  const jobId = card.dataset.id;
  try {
    if (event.target.classList.contains("complete")) {
      const file = card.querySelector(".after")?.files?.[0];
      if (!file) throw new Error("Take an after photo first");
      locationFix = await getLocation();
      const body = new FormData();
      body.append("lat", locationFix.lat);
      body.append("lng", locationFix.lng);
      body.append("photo", file);
      await api(`/api/worker/jobs/${jobId}/complete`, { method: "POST", body });
      show("Collected. Proof saved.", true);
      await refresh();
    }
    if (event.target.classList.contains("fail")) {
      const reason = prompt("Why could you not collect?") || "could not collect";
      await api(`/api/worker/jobs/${jobId}/fail`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      });
      show("Marked as could not collect.", true);
      await refresh();
    }
  } catch (err) {
    show(err.message, false);
  }
});

(async function init() {
  await session("worker");
  const me = await api("/api/me");
  who.textContent = me.displayName;
  try {
    locationFix = await getLocation();
  } catch (err) {
    show(err.message, false);
  }
  paintDuty();
  await refresh();
})();
