import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAction } from '../../hooks/useAction';
import { changePassword } from '../../services/auth.service';
import PageTitle from '../../components/ui/PageTitle.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';

const EMPTY = { current: '', next: '', confirm: '' };

export default function AccountPage() {
  const { user, login } = useAuth();
  const run = useAction();
  const [form, setForm] = useState(EMPTY);
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.next.length < 10) return setError('New password must be at least 10 characters.');
    if (form.next !== form.confirm) return setError('New password and confirmation do not match.');

    setBusy(true);
    const res = await run(
      () => changePassword({ current_password: form.current, new_password: form.next }),
      'Password changed'
    );
    if (res) {
      login(res.data); // naya token, taki abhi ka session chalta rahe
      setForm(EMPTY);
    }
    setBusy(false);
  };

  const type = show ? 'text' : 'password';

  return (
    <>
      <PageTitle>Password</PageTitle>
      <p className="-mt-2 mb-4 text-sm text-ink/60">Signed in as <b>{user.name}</b>. Changing the password logs out every other admin session.</p>

      <Card as="form" onSubmit={submit} className="max-w-md space-y-3">
        <label className="block"><span className="mb-1 block text-sm font-bold">Current password</span>
          <Input type={type} value={form.current} onChange={set('current')} autoComplete="current-password" required /></label>
        <label className="block"><span className="mb-1 block text-sm font-bold">New password</span>
          <Input type={type} value={form.next} onChange={set('next')} autoComplete="new-password" minLength={10} required /></label>
        <label className="block"><span className="mb-1 block text-sm font-bold">Confirm new password</span>
          <Input type={type} value={form.confirm} onChange={set('confirm')} autoComplete="new-password" required /></label>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} className="h-4 w-4 accent-ink" /> Show passwords
        </label>
        <p className="text-xs text-ink/60">Use at least 10 characters. A few random words work well.</p>

        {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700" role="alert">{error}</p>}
        <Button className="w-full" disabled={busy}>{busy ? 'Saving…' : 'Change password'}</Button>
      </Card>
    </>
  );
}
