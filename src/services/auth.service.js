import { request } from './api';
export const lookupEmployee = (employee_id) => request('/auth/employee/lookup', { method: 'POST', body: { employee_id } });
export const employeeLogin = (employee_id) => request('/auth/employee/login', { method: 'POST', body: { employee_id } });
export const adminLogin = (body) => request('/auth/admin/login', { method: 'POST', body });
export const changePassword = (body) => request('/auth/admin/change-password', { method: 'POST', body });
