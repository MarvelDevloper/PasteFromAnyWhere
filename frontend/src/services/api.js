import axios from 'axios';

// Use VITE_API_URL if explicitly set, otherwise use relative pathing for Vite proxy to prevent CORS issues
const API_URL = import.meta.env.VITE_API_URL !== undefined ? import.meta.env.VITE_API_URL : '';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to attach JWT Authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pastebin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth Endpoints
export const authApi = {
  login: (data) => api.post('/auth/api/login', data),
  register: (data) => api.post('/auth/api/register', data),
  verifyRefresh: () => api.get('/auth/api/verifyRefresh'),
};

let logoutHandler = null;

export const setLogoutHandler = (handler) => {
  logoutHandler = handler;
};

// Response interceptor to handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Prevent infinite loop if refreshing fails or if refresh URL itself returns 401
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/api/verifyRefresh') {
      originalRequest._retry = true;
      try {
        const response = await authApi.verifyRefresh();
        const newToken = response.data?.token;
        if (newToken) {
          localStorage.setItem('pastebin_token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Session expired, auto-refresh failed:', refreshError);
        if (logoutHandler) {
          logoutHandler();
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Paste Endpoints
export const pasteApi = {
  create: (data) => api.post('/paste/create', data),
  getAll: (page = 1, limit = 10) => api.get(`/paste/get-all?page=${page}&limit=${limit}`),
  getSingle: (pasteId) => api.get(`/paste/get-single/${pasteId}`),
  update: (pasteId, data) => api.patch(`/paste/update/${pasteId}`, data),
  delete: (pasteId) => api.delete(`/paste/delete/${pasteId}`),
};

export default api;
