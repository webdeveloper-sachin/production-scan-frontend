import { NavLink, Outlet } from 'react-router-dom';
import { EMPLOYEE_NAV } from '../../constants';
import { useAuth } from '../../context/AuthContext.jsx';
import Icon from '../ui/Icon.jsx';

export default function EmployeeLayout({ children }) {
  const { user, logout } = useAuth();
  const link = ({ isActive }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold ${isActive ? 'bg-tape text-ink' : 'text-white/80 hover:text-white'}`;

  return (
    <>
      <header className="sticky top-0 z-30 bg-ink text-white" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-extrabold leading-tight">{user.name}</p>
            <p className="text-xs capitalize text-white/60">{user.role} · ID {user.id}</p>
          </div>
          <nav className="hidden gap-1 sm:flex">
            {EMPLOYEE_NAV.map((n) => <NavLink key={n.to} to={n.to} className={link}><Icon name={n.icon} className="h-4 w-4" />{n.label}</NavLink>)}
          </nav>
          <button onClick={logout} className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-bold text-white/80 hover:text-white">
            <Icon name="logout" className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
        <div className="tape-strip h-1.5" />
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-28 pt-5 sm:pb-10">{children ?? <Outlet />}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 border-t border-ink/10 bg-white sm:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {EMPLOYEE_NAV.map((n) => (
          <NavLink key={n.to} to={n.to} className={({ isActive }) => `flex flex-col items-center gap-0.5 py-2.5 text-xs font-bold ${isActive ? 'bg-tape text-ink' : 'text-ink/60'}`}>
            <Icon name={n.icon} className="h-5 w-5" />{n.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
