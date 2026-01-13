import axios from 'axios';

const API_URL = 'https://gigflow-4cj4.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (token expired or invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return api.post('/auth/logout');
  },
  getMe: () => api.get('/auth/me'),
};

// Gigs API
export const gigsAPI = {
  getAll: (search = '') => api.get(`/gigs${search ? `?search=${search}` : ''}`),
  getOne: (id) => api.get(`/gigs/${id}`),
  create: (data) => api.post('/gigs', data),
  update: (id, data) => api.put(`/gigs/${id}`, data),
  delete: (id) => api.delete(`/gigs/${id}`),
  getMyGigs: () => api.get('/gigs/user/my-gigs'),
};

// Bids API
export const bidsAPI = {
  create: (data) => api.post('/bids', data),
  getForGig: (gigId) => api.get(`/bids/${gigId}`),
  hire: (bidId) => api.patch(`/bids/${bidId}/hire`),
  getMyBids: () => api.get('/bids/my-bids'),
};

export default api;
