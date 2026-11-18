import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAction } from '../../hooks/useAction';
import { lookupEmployee, employeeLogin } from '../../services/auth.service';
import Button from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';

export default function EmployeeLogin() {
  const { login } = useAuth();
  const run = useAction();
  const [id, setId] = useState('');
  const [found, setFound] = useState(null);
  const [busy, setBusy] = useState(false);

  const find = async (e) => {
    e.preventDefault();
    setBusy(true);
    const res = await run(() => lookupEmployee(Number(id)));
    if (res) setFound(res.data);
    setBusy(false);
  };

  const start = async () => {
    setBusy(true);
    const res = await run(() => employeeLogin(found.id));
    if (res) login(res.data);
    else setBusy(false);
  };

  return (
    <div className="grid min-h-screen place-items-center bg-ink px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center text-white">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-tape font-display text-2xl font-extrabold text-ink">S</span>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight">Production Scan</h1>
          <p className="text-sm text-white/60">Enter your employee ID to start</p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-xl">
          {!found ? (
            <form onSubmit={find} className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-sm font-bold">Employee ID</span>
                <Input value={id} onChange={(e) => setId(e.target.value.replace(/\D/g, ''))} inputMode="numeric" placeholder="e.g. 12" autoFocus required />
              </label>
              <Button className="w-full" disabled={busy || !id}>{busy ? 'Checking…' : 'Continue'}</Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-ink font-display text-lg font-extrabold text-white">
                  {found.name.slice(0, 1).toUpperCase()}
                </span>
                <div>
                  <p className="font-display text-xl font-extrabold leading-tight">{found.name}</p>
                  <p className="text-sm text-ink/60">ID {found.id}</p>
                </div>
              </div>
              <div>
                <p className="mb-1 text-sm font-bold">Role</p>
                <span className="inline-flex items-center gap-2 rounded-full bg-tape px-4 py-2 text-sm font-bold capitalize text-ink">
                  <span className="h-2 w-2 rounded-full bg-ink" /> {found.role}
                </span>
              </div>
              <Button className="w-full" onClick={start} disabled={busy}>
                {busy ? 'Starting…' : `Start scanning as ${found.role}`}
              </Button>
              <button onClick={() => setFound(null)} className="w-full text-center text-sm font-bold text-ink/60 underline">Not you? Change ID</button>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-white/50">
          <Link to="/admin/login" className="font-bold underline">Admin login</Link>
        </p>
      </div>
    </div>
  );
}
