import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { ADMIN_NAV } from '../../constants';
import { useAuth } from '../../context/AuthContext.jsx';
import Icon from '../ui/Icon.jsx';

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-tape font-display text-lg font-extrabold text-ink">S</span>
      <span className="font-display text-lg font-extrabold tracking-tight">Production Scan</span>
    </div>
  );
}

function Nav({ onNavigate }) {
  return (
    <nav className="space-y-1">
      {ADMIN_NAV.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          end
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
              isActive ? 'bg-tape text-ink' : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`
          }
        >
          <Icon name={n.icon} className="h-[18px] w-[18px]" />
          {n.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AdminLayout() {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const current = ADMIN_NAV.find((n) => n.to === pathname)?.label;

  return (
    <div className="min-h-screen md:grid md:grid-cols-[250px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col bg-ink p-4 text-white md:flex">
        <div className="mb-8 mt-2 px-2"><Brand /></div>
        <Nav />
        <button onClick={logout} className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white">
          <Icon name="logout" className="h-[18px] w-[18px]" /> Logout
        </button>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 bg-ink text-white md:hidden" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => setOpen(true)} aria-label="Open menu"><Icon name="menu" /></button>
            <span className="font-display text-lg font-extrabold">{current || 'Admin'}</span>
            <span className="w-5" />
          </div>
          <div className="tape-strip h-1.5" />
        </header>

        {open && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-ink/60" onClick={() => setOpen(false)} />
            <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-ink p-4 text-white">
              <div className="mb-6 mt-2 flex items-center justify-between px-2">
                <Brand />
                <button onClick={() => setOpen(false)} aria-label="Close menu"><Icon name="x" /></button>
              </div>
              <Nav onNavigate={() => setOpen(false)} />
              <button onClick={logout} className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-white/70">
                <Icon name="logout" className="h-[18px] w-[18px]" /> Logout
              </button>
            </div>
          </div>
        )}

        <main className="mx-auto max-w-6xl px-4 py-5 md:px-8 md:py-8"><Outlet /></main>
      </div>
    </div>
  );
}
