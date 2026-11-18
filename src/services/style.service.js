import { request } from './api';
export const getStyles = () => request('/style-mappings');
export const saveStylePattern = (body) => request('/style-mappings', { method: 'POST', body });
export const bulkStyles = (mappings) => request('/style-mappings/bulk', { method: 'POST', body: { mappings } });
export const deleteMapping = (id) => request(`/style-mappings/${id}`, { method: 'DELETE' });
