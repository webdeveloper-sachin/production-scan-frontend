import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAction } from '../../hooks/useAction';
import { adminLogin } from '../../services/auth.service';
import Button from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';

export default function AdminLoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const run = useAction();
  const [form, setForm] = useState({ username: '', password: '' });
  const [busy, setBusy] = useState(false);

  if (user?.kind === 'admin') return <Navigate to="/admin/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const res = await run(() => adminLogin(form));
    if (res) { login(res.data); navigate('/admin/dashboard', { replace: true }); }
    setBusy(false);
  };

  return (
    <div className="grid min-h-screen place-items-center bg-ink px-4 py-10">
      <form onSubmit={submit} className="w-full max-w-sm space-y-3 rounded-3xl bg-white p-6 shadow-xl">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Admin login</h1>
        <label className="block"><span className="mb-1 block text-sm font-bold">Username</span>
          <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} autoComplete="username" autoFocus required /></label>
        <label className="block"><span className="mb-1 block text-sm font-bold">Password</span>
          <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="current-password" required /></label>
        <Button className="w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</Button>
        <Link to="/scan" className="block text-center text-sm font-bold text-ink/60 underline">Back to scan</Link>
      </form>
    </div>
  );
}
