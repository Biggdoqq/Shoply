import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

export const getOrders = (params) => api.get('/orders', { params });
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
