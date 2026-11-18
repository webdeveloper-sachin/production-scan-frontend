import { request } from './api';
export const getOrders = (params) => request('/orders', { params });
export const getOrder = (id) => request(`/orders/${id}`);
export const syncOrders = (orders) => request('/orders/sync', { method: 'POST', body: { orders } });
export const updateOrderStatus = (id, status) => request(`/orders/${id}/status`, { method: 'PATCH', body: { status } });
