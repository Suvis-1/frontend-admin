export const API_BASE = import.meta.env.VITE_API_BASE;

// Helper gets auth headers if token exists
function authHeaders(extra = {}) {
  const token = localStorage.getItem('adminToken');
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

// Lessons
export async function fetchLessons() {
  const res = await fetch(`${API_BASE}/lessons`);
  return res.json();
}

export async function createLesson(payload) {
  const res = await fetch(`${API_BASE}/lessons`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function deleteLesson(id) {
  const res = await fetch(`${API_BASE}/lessons/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  return res.json();
}

export async function updateLesson(id, payload) {
  const res = await fetch(`${API_BASE}/lessons/${id}`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload)
  });
  return res.json();
}

// Icons
export async function fetchIcons() {
  const res = await fetch(`${API_BASE}/icons`);
  return res.json();
}

export async function uploadIcon(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${API_BASE}/icons`, {
    method: 'POST',
    headers: authHeaders(), // token required
    body: fd
  });
  return res.json();
}

// Orders
export async function fetchOrders() {
  const res = await fetch(`${API_BASE}/orders`, {
    headers: authHeaders()
  });
  return res.json();
}
