async function session(role) {
  const res = await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Could not sign in");
  localStorage.setItem("binflow_token", data.token);
  localStorage.setItem("binflow_role", role);
  return data;
}

function token() {
  return localStorage.getItem("binflow_token");
}

async function api(path, options = {}) {
  const headers = Object.assign({ Authorization: `Bearer ${token()}` }, options.headers || {});
  if (!(options.body instanceof FormData) && !headers["Content-Type"] && options.body) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = data.detail;
    throw new Error(typeof detail === "string" ? detail : "Request failed");
  }
  return data;
}

function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Location is not available on this device"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => reject(new Error("Allow location to continue")),
      { enableHighAccuracy: true, timeout: 12000 },
    );
  });
}

function fmtLoc(loc) {
  if (!loc) return "not captured";
  return `${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`;
}
