const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchOverview() {
  const res = await fetch(`${API_BASE}/overview`);
  return res.json();
}

export async function fetchFilters() {
  const res = await fetch(`${API_BASE}/filters`);
  return res.json();
}

export async function fetchObjective1() {
  const res = await fetch(`${API_BASE}/objective1`);
  return res.json();
}

export async function fetchObjective2() {
  const res = await fetch(`${API_BASE}/objective2`);
  return res.json();
}

export async function fetchObjective3() {
  const res = await fetch(`${API_BASE}/objective3`);
  return res.json();
}

export async function fetchObjective4() {
  const res = await fetch(`${API_BASE}/objective4`);
  return res.json();
}

export async function simulateScenario(params) {
  const res = await fetch(`${API_BASE}/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  return res.json();
}

export async function fetchItems(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/items?${query}`);
  return res.json();
}

export function getExportUrl() {
  return `${API_BASE}/export/csv`;
}
