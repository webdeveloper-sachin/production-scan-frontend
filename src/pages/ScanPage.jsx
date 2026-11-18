import { useRef, useState } from 'react';
import { SCAN_COOLDOWN_MS } from '../constants';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { createScan } from '../services/scan.service';
import { parseOrderId } from '../utils/qr';
import PageTitle from '../components/ui/PageTitle.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import QrScanner from '../components/features/QrScanner.jsx';

export default function ScanPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [log, setLog] = useState([]);
  const busy = useRef(false);

  const submitScan = async (raw) => {
    if (busy.current) return;
    const orderId = parseOrderId(raw);
    if (!orderId) return toast('No order id found in this code', 'error');

    busy.current = true;
    try {
      const scan = await createScan(orderId);
      setResult({ ok: true, order: scan });
      setLog((l) => [`#${scan.order_id} · ${scan.style_number} · ${scan.size}`, ...l].slice(0, 8));
      setCode('');
      navigator.vibrate?.(80);
    } catch (e) {
      setResult({ ok: false, message: e.message });
      navigator.vibrate?.([120, 60, 120]);
    }
    setTimeout(() => { busy.current = false; }, SCAN_COOLDOWN_MS);
  };

  return (
    <>
      <PageTitle aside={<span className="rounded-full bg-tape px-3 py-1 text-xs font-bold capitalize">{user.role}</span>}>Scan order</PageTitle>
      <Card className="space-y-4">
        <QrScanner onScan={submitScan} />
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); submitScan(code); }}>
          <Input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" placeholder="Or type the order id" autoComplete="off" />
          <Button>Submit</Button>
        </form>
      </Card>

      {result && (
        <div className={`mt-4 rounded-2xl p-4 text-white ${result.ok ? 'bg-emerald-600' : 'bg-red-600'}`} role="status">
          <p className="font-display text-xl font-extrabold">{result.ok ? 'Scan recorded' : 'Scan failed'}</p>
          <p className="mt-1">
            {result.ok ? `Order #${result.order.order_id} · ${result.order.style_number} · ${result.order.size} · ${result.order.color}` : result.message}
          </p>
        </div>
      )}

      {log.length > 0 && (
        <Card className="mt-4">
          <h3 className="font-display text-lg font-extrabold">Scanned this session ({log.length})</h3>
          <ul className="mt-1 divide-y divide-ink/10 text-sm">{log.map((l, i) => <li key={i} className="py-2">{l}</li>)}</ul>
        </Card>
      )}
    </>
  );
}
