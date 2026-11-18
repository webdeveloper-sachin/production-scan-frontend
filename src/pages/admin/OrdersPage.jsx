import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ORDER_STATUS, PAGE_SIZE } from '../../constants';
import { useFetch } from '../../hooks/useFetch';
import { getOrders } from '../../services/order.service';
import { fmtDateTime, prettyStatus } from '../../utils/format';
import PageTitle from '../../components/ui/PageTitle.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import { Input, Select } from '../../components/ui/Input.jsx';
import { Async, EmptyState } from '../../components/ui/States.jsx';
import OrderModal from '../../components/features/OrderModal.jsx';

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [style, setStyle] = useState('');
  const [selected, setSelected] = useState(null);
  const state = useFetch(() => getOrders({ page, limit: PAGE_SIZE, status, style_number: style.trim() }), [page, status, style]);
  const reset = (setter) => (e) => { setter(e.target.value); setPage(1); };

  return (
    <>
      <PageTitle aside={<Link to="/admin/orders/sync" className="rounded-xl bg-tape px-4 py-2 text-sm font-bold">Sync orders</Link>}>
        Synced orders
      </PageTitle>
      <p className="-mt-2 mb-4 text-sm text-ink/60">Latest synced first. {state.data && `${state.data.pagination.total} orders in total.`}</p>

      <div className="mb-4 grid grid-cols-2 gap-2 sm:max-w-md">
        <Select value={status} onChange={reset(setStatus)}>
          <option value="">All statuses</option>
          {ORDER_STATUS.map((s) => <option key={s} value={s}>{prettyStatus(s)}</option>)}
        </Select>
        <Input value={style} onChange={reset(setStyle)} placeholder="Style number" />
      </div>

      <Async state={state}>
        {({ orders, pagination }) => (
          <>
            {orders.length ? (
              <>
                <div className="hidden overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10 md:block">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-ink/5 text-xs uppercase tracking-wide text-ink/60">
                      <tr>{['Order', 'Style', 'Size', 'Color', 'Channel', 'Status', 'Synced at'].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5">
                      {orders.map((o) => (
                        <tr key={o.order_id} onClick={() => setSelected(o.order_id)} className="cursor-pointer hover:bg-ink/5">
                          <td className="px-4 py-3 font-bold">#{o.order_id}</td>
                          <td className="px-4 py-3">{o.style_number}</td>
                          <td className="px-4 py-3">{o.size}</td>
                          <td className="px-4 py-3">{o.color}</td>
                          <td className="px-4 py-3">{o.channel}</td>
                          <td className="px-4 py-3"><Badge status={o.status} /></td>
                          <td className="px-4 py-3 text-ink/70">{fmtDateTime(o.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid gap-2 md:hidden">
                  {orders.map((o) => (
                    <Card as="button" key={o.order_id} onClick={() => setSelected(o.order_id)} className="flex items-center justify-between text-left">
                      <div>
                        <p className="font-display text-lg font-extrabold">#{o.order_id} · {o.style_number}</p>
                        <p className="text-sm text-ink/70">{o.size} · {o.color} · {o.channel}</p>
                        <p className="text-xs text-ink/50">{fmtDateTime(o.created_at)}</p>
                      </div>
                      <Badge status={o.status} />
                    </Card>
                  ))}
                </div>
              </>
            ) : <EmptyState>No orders yet. Upload a CSV from Sync orders.</EmptyState>}

            <div className="mt-4 flex items-center justify-between">
              <Button variant="secondary" disabled={pagination.page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <span className="text-sm">Page {pagination.page} of {pagination.total_pages || 1}</span>
              <Button variant="secondary" disabled={pagination.page >= pagination.total_pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </>
        )}
      </Async>

      {selected && <OrderModal orderId={selected} onClose={() => setSelected(null)} onChanged={state.refetch} />}
    </>
  );
}
