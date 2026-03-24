import axios from 'axios';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for authentication
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // You can add redirect logic here if needed
    }
    return Promise.reject(error);
  }
);

// API Endpoints

// Authentication
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.get('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/updatedetails', userData),
  updatePassword: (passwordData) => api.put('/auth/updatepassword', passwordData),
  checkStatus: () => api.get('/auth/status'),
};

// Team Members
export const teamAPI = {
  getAll: (params = {}) => api.get('/team', { params }),
  getById: (id) => api.get(`/team/${id}`),
  getByRole: (role) => api.get(`/team/role/${role}`),
  create: (memberData) => api.post('/team', memberData),
  update: (id, memberData) => api.put(`/team/${id}`, memberData),
  delete: (id) => api.delete(`/team/${id}`),
  updateOrder: (id, order) => api.put(`/team/${id}/order`, { order }),
  getStats: () => api.get('/team/admin/stats'),
};

// Projects
export const projectsAPI = {
  getAll: (params = {}) => api.get('/projects', { params }),
  getById: (id) => api.get(`/projects/${id}`),
  getFeatured: () => api.get('/projects/featured'),
  getByCategory: (category, params = {}) => api.get(`/projects/category/${category}`, { params }),
  create: (projectData) => api.post('/projects', projectData),
  update: (id, projectData) => api.put(`/projects/${id}`, projectData),
  delete: (id) => api.delete(`/projects/${id}`),
  toggleFeatured: (id) => api.put(`/projects/${id}/featured`),
  updateOrder: (id, order) => api.put(`/projects/${id}/order`, { order }),
  getStats: () => api.get('/projects/admin/stats'),
};

// Contact
export const contactAPI = {
  submit: (contactData) => api.post('/contact', contactData),
  getAll: (params = {}) => api.get('/contact', { params }),
  getById: (id) => api.get(`/contact/${id}`),
  updateStatus: (id, statusData) => api.put(`/contact/${id}/status`, statusData),
  addNote: (id, note) => api.post(`/contact/${id}/notes`, { note }),
  markAsSpam: (id) => api.put(`/contact/${id}/spam`),
  delete: (id) => api.delete(`/contact/${id}`),
  getStats: () => api.get('/contact/stats'),
};

// Helper functions
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.message || 'Server error occurred',
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      message: 'Network error - please check your connection',
      status: 0,
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: -1,
    };
  }
};

// Upload helper (for images)
export const uploadFile = async (file, endpoint = '/upload') => {
  const formData = new FormData();
  formData.append('file', file);
  
  return api.post(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Health check
export const healthCheck = () => axios.get(`${API_BASE_URL.replace('/api', '')}/health`);

export default api;