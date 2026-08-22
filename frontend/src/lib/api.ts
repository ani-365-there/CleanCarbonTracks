const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchFromBackend(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function categorizeWasteItem(item: string) {
  return fetchFromBackend(`/api/categorize?item=${encodeURIComponent(item)}`);
}

export async function fetchAnalyticsData() {
  return fetchFromBackend('/api/analytics');
}

export async function fetchVehiclesData() {
  return fetchFromBackend('/api/vehicles');
}

export async function submitPickupRequest(data: Record<string, any>) {
  return fetchFromBackend('/api/pickups', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function loginSession(role: 'citizen' | 'worker') {
  return fetchFromBackend('/api/session', {
    method: 'POST',
    body: JSON.stringify({ role }),
  });
}
