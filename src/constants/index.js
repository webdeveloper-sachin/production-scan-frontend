export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
export const AUTH_KEY = 'scan.auth';

export const ADMIN_NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: 'grid' },
  { to: '/admin/orders', label: 'Orders', icon: 'box' },
  { to: '/admin/orders/sync', label: 'Sync orders', icon: 'upload' },
  { to: '/admin/rates', label: 'Rates', icon: 'tag' },
  { to: '/admin/styles', label: 'Styles', icon: 'layers' },
  { to: '/admin/team', label: 'Team', icon: 'users' },
  { to: '/admin/statements', label: 'Statements', icon: 'file' },
  { to: '/admin/account', label: 'Password', icon: 'lock' },
];

export const EMPLOYEE_NAV = [
  { to: '/scan', label: 'Scan', icon: 'scan' },
  { to: '/my-earnings', label: 'My earnings', icon: 'coins' },
];

export const ORDER_STATUS = ['PRODUCTION', 'FOUND_IN_INVENTORY', 'SHIPPED'];
export const STATUS_STYLES = {
  PRODUCTION: 'bg-amber-100 text-amber-800',
  FOUND_IN_INVENTORY: 'bg-sky-100 text-sky-800',
  SHIPPED: 'bg-emerald-100 text-emerald-800',
};
export const PAGE_SIZE = 15;
export const SCAN_COOLDOWN_MS = 2500;
