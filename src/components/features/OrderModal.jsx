import { ORDER_STATUS } from '../../constants';
import { useFetch } from '../../hooks/useFetch';
import { useAction } from '../../hooks/useAction';
import { getOrder, updateOrderStatus } from '../../services/order.service';
import { fmtDateTime, prettyStatus } from '../../utils/format';
import Modal from '../ui/Modal.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import { Async, EmptyState } from '../ui/States.jsx';

export default function OrderModal({ orderId, onClose, onChanged }) {
  const state = useFetch(() => getOrder(orderId), [orderId]);
  const run = useAction();

  const changeStatus = async (status) => {
    const res = await run(() => updateOrderStatus(orderId, status), 'Status updated');
    if (res) { state.refetch(); onChanged?.(); }
  };

  return (
    <Modal title={`Order #${orderId}`} onClose={onClose}>
      <Async state={state}>
        {(o) => (
          <>
            <p className="font-bold">{o.style_number} · {o.size} · {o.color}</p>
            <p className="mb-3 text-sm text-ink/70">{o.channel} · batch {o.sync_id.slice(0, 8)}</p>
            <Badge status={o.status} />
            <div className="my-4 grid grid-cols-3 gap-2">
              {ORDER_STATUS.map((s) => (
                <Button
                  key={s}
                  variant="secondary"
                  className={`!px-1 !py-2 text-xs ${s === o.status ? 'ring-2 ring-tape' : ''}`}
                  onClick={() => changeStatus(s)}
                >
                  {prettyStatus(s)}
                </Button>
              ))}
            </div>
            <h4 className="font-display font-extrabold">Scans</h4>
            {o.scans.length ? (
              <ul className="divide-y divide-ink/10 text-sm">
                {o.scans.map((s) => (
                  <li key={s.id} className="py-2">{s.employee_name} ({s.role_name}) · {fmtDateTime(s.scanned_at)}</li>
                ))}
              </ul>
            ) : (
              <EmptyState>Not scanned yet.</EmptyState>
            )}
          </>
        )}
      </Async>
    </Modal>
  );
}
