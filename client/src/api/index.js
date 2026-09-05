import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Guard against HTML error pages or SPA rewrites masquerading as JSON
api.interceptors.response.use(
  (response) => {
    if (typeof response.data === 'string' && response.data.trim().startsWith('<!doctype html>')) {
      return Promise.reject(new Error('Received HTML response instead of JSON from API'));
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

export const createOrder = (data) => api.post('/orders', data);
export const getOrders = (params) => api.get('/orders', { params });
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });
export const deleteOrder = (id) => api.delete(`/orders/${id}`);

export const getSettings = () => api.get('/settings');
export const updateSettings = (data) => api.put('/settings', data);
export const testTelegram = (data) => api.post('/settings/test-telegram', data);

export const uploadImage = (formData) => api.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

export const createPaymentSession = (data) => api.post('/payments/create-khqr', data);
export const checkPaymentStatus = (orderNumber) => api.get(`/payments/status/${orderNumber}`);
export const simulatePaymentConfirm = (orderNumber) => api.post('/payments/simulate-confirm', { orderNumber });

export default api;
