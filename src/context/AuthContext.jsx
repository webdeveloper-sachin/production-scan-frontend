import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AUTH_KEY } from '../constants';

const AuthContext = createContext(null);

const load = () => {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; }
};

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(load);

  useEffect(() => {
    const onExpired = () => setAuth(null);
    window.addEventListener('auth:expired', onExpired);
    return () => window.removeEventListener('auth:expired', onExpired);
  }, []);

  const login = useCallback((data) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
    setAuth(data);
  }, []);
  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setAuth(null);
  }, []);

  const value = useMemo(() => ({ user: auth?.user ?? null, login, logout }), [auth, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
