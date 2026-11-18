import { useState } from 'react';
import { Link } from 'react-router-dom';
import { syncOrders } from '../../services/order.service';
import PageTitle from '../../components/ui/PageTitle.jsx';
import CsvUpload from '../../components/features/CsvUpload.jsx';

const COLUMNS = [
  { key: 'style_number', required: true },
  { key: 'size', required: true },
  { key: 'color' },
  { key: 'channel', required: true },
];
const SAMPLE = [['ST-101', 'M', 'Red', 'Amazon'], ['ST-101', 'L', 'Blue', 'Myntra']];

export default function SyncOrdersPage() {
  const [done, setDone] = useState(null);

  return (
    <>
      <PageTitle>Sync orders</PageTitle>
      <p className="-mt-2 mb-4 text-sm text-ink/60">Upload a CSV. All rows in one file become one batch with the same sync id.</p>
      <div className="max-w-2xl space-y-4">
        <CsvUpload
          templateName="orders"
          columns={COLUMNS}
          sample={SAMPLE}
          actionLabel="Sync"
          validateRow={(r) => (!r.style_number || !r.size || !r.channel ? 'style_number, size and channel are required' : null)}
          onUpload={async (rows) => setDone(await syncOrders(rows.map((r) => ({ ...r, color: r.color || undefined }))))}
        />
        {done && (
          <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-900 ring-1 ring-emerald-200">
            <p className="font-display text-lg font-extrabold">{done.total_synced} orders synced</p>
            <p className="text-sm">Batch {done.sync_id.slice(0, 8)}</p>
            <Link to="/admin/orders" className="mt-2 inline-block text-sm font-bold underline">View synced orders</Link>
          </div>
        )}
      </div>
    </>
  );
}
