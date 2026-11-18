import { useState } from 'react';
import { useAction } from '../../hooks/useAction';
import { useToast } from '../../context/ToastContext.jsx';
import { getEarningsReport, getEmployeeEarnings } from '../../services/scan.service';
import { money, monthStartIST, todayIST } from '../../utils/format';
import { exportEarningsCsv, exportEarningsPdf, exportSummaryCsv } from '../../utils/exportEarnings';
import PageTitle from '../../components/ui/PageTitle.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { EmptyState } from '../../components/ui/States.jsx';

export default function StatementsPage() {
  const [from, setFrom] = useState(monthStartIST());
  const [to, setTo] = useState(todayIST());
  const [paymentDate, setPaymentDate] = useState(todayIST());
  const [report, setReport] = useState(null);
  const [period, setPeriod] = useState(null);
  const [busy, setBusy] = useState('');
  const run = useAction();
  const toast = useToast();

  const load = async (e) => {
    e.preventDefault();
    const res = await run(() => getEarningsReport(from, to));
    if (res) { setReport(res.data.report); setPeriod({ from, to }); }
  };

  const exportOne = async (emp, kind) => {
    setBusy(`${emp.employee_id}-${kind}`);
    const res = await run(() => getEmployeeEarnings(emp.employee_id, period.from, period.to));
    if (res) {
      try { kind === 'pdf' ? await exportEarningsPdf(res.data, paymentDate) : exportEarningsCsv(res.data, paymentDate); }
      catch (err) { toast(`Export failed: ${err.message}`, 'error'); }
    }
    setBusy('');
  };

  const total = report?.reduce((s, r) => s + Number(r.total_earning), 0) ?? 0;

  return (
    <>
      <PageTitle>Statements</PageTitle>
      <p className="-mt-2 mb-4 text-sm text-ink/60">Pick the period, then download each employee's payment statement as PDF or CSV.</p>
      <Card as="form" onSubmit={load} className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <label><span className="text-sm font-bold">From</span><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} required /></label>
        <label><span className="text-sm font-bold">To</span><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} required /></label>
        <label className="col-span-2 sm:col-span-1"><span className="text-sm font-bold">Payment date</span><Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} required /></label>
        <Button className="col-span-2 sm:col-span-1 sm:self-end">Show report</Button>
      </Card>

      {report && (report.length ? (
        <Card>
          <div className="divide-y divide-ink/10">
            {report.map((r) => (
              <div key={r.employee_id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{r.name} <span className="font-normal text-ink/50">#{r.employee_id}</span></p>
                  <p className="text-sm capitalize text-ink/60">{r.role_name} · {r.total_scans} pcs</p>
                </div>
                <p className="font-display text-lg font-extrabold">{money(r.total_earning)}</p>
                <div className="flex gap-2">
                  <Button variant="secondary" className="!px-3 !py-2 text-sm" disabled={!!busy} onClick={() => exportOne(r, 'pdf')}>{busy === `${r.employee_id}-pdf` ? '…' : 'PDF'}</Button>
                  <Button variant="secondary" className="!px-3 !py-2 text-sm" disabled={!!busy} onClick={() => exportOne(r, 'csv')}>{busy === `${r.employee_id}-csv` ? '…' : 'CSV'}</Button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 flex justify-between border-t-2 border-ink pt-3 font-extrabold"><span>Total</span><span>{money(total)}</span></p>
          <Button variant="secondary" className="mt-3 w-full text-sm" onClick={() => exportSummaryCsv(report, period)}>Export summary CSV</Button>
        </Card>
      ) : <EmptyState>No scans in this date range.</EmptyState>)}
    </>
  );
}
