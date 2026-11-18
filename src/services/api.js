import { API_BASE_URL, AUTH_KEY } from '../constants';

export class ApiRequestError extends Error {
  constructor(message, status, details = []) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const getToken = () => {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY))?.token; } catch { return null; }
};

export async function request(path, { method = 'GET', body, params } = {}) {
  const query = params
    ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    : '';
  const token = getToken();
  const headers = { ...(body && { 'Content-Type': 'application/json' }), ...(token && { Authorization: `Bearer ${token}` }) };

  let res;
  try {
    res = await fetch(API_BASE_URL + path + query, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiRequestError('Cannot reach the server. Check that the backend is running.', 0);
  }

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    // Token expire/invalid: session clear karo, app login par bhej dega
    if (res.status === 401 && token) {
      localStorage.removeItem(AUTH_KEY);
      window.dispatchEvent(new Event('auth:expired'));
    }
    const details = json?.errors || [];
    throw new ApiRequestError([json?.message || 'Request failed', details[0]].filter(Boolean).join(': '), res.status, details);
  }
  return json?.data;
}
