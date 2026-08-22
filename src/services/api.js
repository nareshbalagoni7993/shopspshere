import { loadingBus } from './loadingBus';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AUTH_STORAGE_KEY = 'shopsphere_auth';

export const getStoredAuth = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredAuth = (user, token) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token }));
};

export const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

const getToken = () => getStoredAuth()?.token;

const parseResponse = async (res) => {
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json() : null;

  if (!res.ok) {
    const message = body?.message || `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.body = body;
    throw error;
  }

  return body;
};

export const apiRequest = async (path, { method = 'GET', body, headers = {}, showLoader = true } = {}) => {
  const token = getToken();
  if (showLoader) loadingBus.start();

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined
    });

    return await parseResponse(res);
  } finally {
    if (showLoader) loadingBus.end();
  }
};

export const apiUpload = async (path, formData) => {
  const token = getToken();
  loadingBus.start();

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });

    return await parseResponse(res);
  } finally {
    loadingBus.end();
  }
};

// Resolve a possibly-relative image path (e.g. "/uploads/x.jpg") returned by
// the API into an absolute URL the <img> tag can load.
export const resolveAssetUrl = (url) => {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  const origin = API_BASE_URL.replace(/\/api\/?$/, '');
  return `${origin}${url}`;
};
