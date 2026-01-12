import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
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
