import { request } from './api';
export const createScan = (order_id) => request('/scans', { method: 'POST', body: { order_id } });
export const getEarningsReport = (from, to) => request('/reports/earnings', { params: { from, to } });
export const getEmployeeEarnings = (id, from, to) => request(`/reports/earnings/${id}`, { params: { from, to } });
export const getMyEarnings = (from, to) => request('/me/earnings', { params: { from, to } });
export const getTopStyles = (from, to, limit = 8) => request('/reports/top-styles', { params: { from, to, limit } });
