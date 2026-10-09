const API_BASE_URL = typeof window !== 'undefined' && window.location.origin ? `${window.location.origin}/api` : 'http://localhost:5000/api';

const getHeaders = () => {
  let token = '';
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem('gtmms_session') || sessionStorage.getItem('gtmms_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        token = parsed.token || '';
      } catch (e) {
        /* ignore */
      }
    }
  }
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const resolveUrl = (endpoint) => {
  if (endpoint.startsWith('http')) return endpoint;
  const cleanEndpoint = endpoint.startsWith('/api') ? endpoint.replace('/api', '') : endpoint;
  const formattedEndpoint = cleanEndpoint.startsWith('/') ? cleanEndpoint : `/${cleanEndpoint}`;
  return `${API_BASE_URL}${formattedEndpoint}`;
};

const parseResponse = async (res) => {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return await res.json();
  }
  const text = await res.text();
  console.warn(`[API Non-JSON Response ${res.status}]:`, text.slice(0, 200));
  return { success: false, message: `Server error (${res.status}): unexpected HTML response` };
};

export const api = {
  async get(endpoint) {
    try {
      const url = resolveUrl(endpoint);
      const res = await fetch(url, {
        method: 'GET',
        headers: getHeaders()
      });
      return await parseResponse(res);
    } catch (err) {
      console.warn(`[API GET ${endpoint} Error]:`, err);
      return { success: false, message: err.message };
    }
  },

  async post(endpoint, data) {
    try {
      const url = resolveUrl(endpoint);
      const res = await fetch(url, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return await parseResponse(res);
    } catch (err) {
      console.warn(`[API POST ${endpoint} Error]:`, err);
      return { success: false, message: err.message };
    }
  },

  async put(endpoint, data) {
    try {
      const url = resolveUrl(endpoint);
      const res = await fetch(url, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return await parseResponse(res);
    } catch (err) {
      console.warn(`[API PUT ${endpoint} Error]:`, err);
      return { success: false, message: err.message };
    }
  },

  async delete(endpoint) {
    try {
      const url = resolveUrl(endpoint);
      const res = await fetch(url, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return await parseResponse(res);
    } catch (err) {
      console.warn(`[API DELETE ${endpoint} Error]:`, err);
      return { success: false, message: err.message };
    }
  }
};
