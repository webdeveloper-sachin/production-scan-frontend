import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

// kind: 'admin' | 'employee'. Galat user ko uske sahi page par bhej deta hai.
export default function RequireAuth({ kind }) {
  const { user } = useAuth();
  if (!user) return <Navigate to={kind === 'admin' ? '/admin/login' : '/scan'} replace />;
  if (user.kind !== kind) return <Navigate to={user.kind === 'admin' ? '/admin/dashboard' : '/scan'} replace />;
  return <Outlet />;
}
