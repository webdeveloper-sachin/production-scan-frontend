import { request } from './api';
export const getPatterns = () => request('/patterns');
export const createPattern = (body) => request('/patterns', { method: 'POST', body });
export const bulkPatterns = (patterns) => request('/patterns/bulk', { method: 'POST', body: { patterns } });
export const updatePatternRate = (id, rate) => request(`/patterns/${id}`, { method: 'PATCH', body: { rate } });
export const deletePattern = (id) => request(`/patterns/${id}`, { method: 'DELETE' });
