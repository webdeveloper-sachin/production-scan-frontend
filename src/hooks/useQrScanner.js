import { useCallback, useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export function useQrScanner(elementId, onScan) {
  const scannerRef = useRef(null);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  const [active, setActive] = useState(false);
  const [error, setError] = useState('');

  const stop = useCallback(async () => {
    const s = scannerRef.current;
    scannerRef.current = null;
    setActive(false);
    if (s) {
      try { await s.stop(); s.clear(); } catch { /* already stopped */ }
    }
  }, []);

  const start = useCallback(async () => {
    setError('');
    const s = new Html5Qrcode(elementId);
    scannerRef.current = s;
    try {
      await s.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (text) => onScanRef.current(text),
        () => {}
      );
      setActive(true);
    } catch {
      scannerRef.current = null;
      setError('Camera is blocked. Allow camera access and open the app on https or localhost.');
    }
  }, [elementId]);

  useEffect(() => () => { stop(); }, [stop]);

  return { active, error, start, stop };
}
