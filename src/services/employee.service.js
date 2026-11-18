import { request } from './api';
export const getEmployees = () => request('/employees');
export const createEmployee = (body) => request('/employees', { method: 'POST', body });
export const updateEmployee = (id, body) => request(`/employees/${id}`, { method: 'PATCH', body });
export const deleteEmployee = (id) => request(`/employees/${id}`, { method: 'DELETE' });
