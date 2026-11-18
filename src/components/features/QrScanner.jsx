import { useQrScanner } from '../../hooks/useQrScanner';
import Button from '../ui/Button.jsx';

export default function QrScanner({ onScan }) {
  const { active, error, start, stop } = useQrScanner('qr-reader', onScan);

  return (
    <div className="space-y-3">
      <div id="qr-reader" className="overflow-hidden rounded-2xl bg-ink/5" />
      {error && <p className="text-sm font-bold text-red-600">{error}</p>}
      <Button className="w-full" onClick={active ? stop : start}>
        {active ? 'Stop camera' : 'Start camera'}
      </Button>
    </div>
  );
}
