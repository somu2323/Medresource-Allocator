import axios from 'axios';

// Base URL for the API
const API_BASE_URL = 'http://localhost:5000/api'; // Local development server

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API endpoints for beds
export const bedsApi = {
  getAll: () => api.get('/beds/'),
  getById: (id: string) => api.get(`/beds/${id}/`),
  create: (data: any) => api.post('/beds/', data),
  update: (id: string, data: any) => api.put(`/beds/${id}/`, data),
  delete: (id: string) => api.delete(`/beds/${id}/`),
};

// API endpoints for equipment
export const equipmentApi = {
  getAll: () => api.get('/equipment/'),
  getById: (id: string) => api.get(`/equipment/${id}/`),
  create: (data: any) => api.post('/equipment/', data),
  update: (id: string, data: any) => api.put(`/equipment/${id}/`, data),
  delete: (id: string) => api.delete(`/equipment/${id}/`),
};

// API endpoints for staff
export const staffApi = {
  getAll: () => api.get('/staff/'),
  getById: (id: string) => api.get(`/staff/${id}/`),
  create: (data: any) => api.post('/staff/', data),
  update: (id: string, data: any) => api.put(`/staff/${id}/`, data),
  delete: (id: string) => api.delete(`/staff/${id}/`),
};

// API endpoints for schedules
export const schedulesApi = {
  getAll: () => api.get('/schedules/'),
  getById: (id: string) => api.get(`/schedules/${id}/`),
  create: (data: any) => api.post('/schedules/', data),
  update: (id: string, data: any) => api.put(`/schedules/${id}/`, data),
  delete: (id: string) => api.delete(`/schedules/${id}/`),
};

export default api;