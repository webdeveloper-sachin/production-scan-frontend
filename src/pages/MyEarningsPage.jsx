import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useToast } from '../context/ToastContext.jsx';
import { getMyEarnings } from '../services/scan.service';
import { fmtDate, money, monthStartIST, todayIST } from '../utils/format';
import { summarizeByStyle } from '../utils/earnings';
import { exportEarningsCsv, exportEarningsPdf } from '../utils/exportEarnings';
import PageTitle from '../components/ui/PageTitle.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import StatTile from '../components/ui/StatTile.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Async, EmptyState } from '../components/ui/States.jsx';

export default function MyEarningsPage() {
  const [form, setForm] = useState({ from: monthStartIST(), to: todayIST() });
  const [range, setRange] = useState(form);
  const toast = useToast();
  const state = useFetch(() => getMyEarnings(range.from, range.to), [range.from, range.to]);

  const apply = (r) => { setForm(r); setRange(r); };
  const exportAs = async (d, kind) => {
    try { kind === 'pdf' ? await exportEarningsPdf(d) : exportEarningsCsv(d); } catch (e) { toast(`Export failed: ${e.message}`, 'error'); }
  };

  return (
    <>
      <PageTitle>My earnings</PageTitle>
      <Card as="form" onSubmit={(e) => { e.preventDefault(); setRange(form); }} className="mb-4 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <label><span className="text-sm font-bold">From</span><Input type="date" value={form.from} max={form.to} onChange={(e) => setForm({ ...form, from: e.target.value })} required /></label>
          <label><span className="text-sm font-bold">To</span><Input type="date" value={form.to} min={form.from} onChange={(e) => setForm({ ...form, to: e.target.value })} required /></label>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="flex-1">Show</Button>
          <Button type="button" variant="secondary" onClick={() => apply({ from: todayIST(), to: todayIST() })}>Today</Button>
          <Button type="button" variant="secondary" onClick={() => apply({ from: monthStartIST(), to: todayIST() })}>This month</Button>
        </div>
      </Card>

      <Async state={state}>
        {(d) => {
          const styles = summarizeByStyle(d.days);
          return (
            <>
              <div className="mb-4 grid grid-cols-2 gap-3">
                <StatTile dark label="Total earnings" value={money(d.total_amount)} hint={`${fmtDate(d.from)} to ${fmtDate(d.to)}`} />
                <StatTile label="Pieces" value={d.total_pcs} />
                <StatTile label="Working days" value={d.working_days} />
                <StatTile label="Average / day" value={money(d.avg_per_day)} />
              </div>

              {d.total_pcs === 0 ? (
                <EmptyState>No scans in this period.</EmptyState>
              ) : (
                <>
                  <div className="mb-4 flex gap-2">
                    <Button variant="accent" className="flex-1" onClick={() => exportAs(d, 'pdf')}>Download PDF</Button>
                    <Button variant="secondary" className="flex-1" onClick={() => exportAs(d, 'csv')}>Download CSV</Button>
                  </div>

                  <Card className="mb-4">
                    <h3 className="font-display text-lg font-extrabold">Styles you made</h3>
                    <ul className="mt-2 divide-y divide-ink/10">
                      {styles.map((s) => (
                        <li key={s.style_number + s.pattern_number} className="flex items-center justify-between gap-3 py-3">
                          <div>
                            <p className="font-bold">{s.style_number}</p>
                            <p className="text-sm text-ink/60">Pattern {s.pattern_number ?? 'not mapped'} · {money(s.rate)} each</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{money(s.amount)}</p>
                            <p className="text-sm text-ink/60">{s.pcs} pcs</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  <h3 className="mb-2 font-display text-lg font-extrabold">Day by day</h3>
                  <div className="space-y-3">
                    {[...d.days].reverse().map((day) => (
                      <Card key={day.date}>
                        <div className="mb-1 flex items-center justify-between">
                          <p className="font-display font-extrabold">{fmtDate(day.date)}</p>
                          <p className="font-bold">{money(day.amount)} <span className="font-normal text-ink/60">· {day.pcs} pcs</span></p>
                        </div>
                        <ul className="divide-y divide-ink/5 text-sm">
                          {day.items.map((i) => (
                            <li key={i.style_number} className="flex justify-between py-1.5">
                              <span>{i.style_number} <span className="text-ink/50">· {i.pattern_number ?? 'not mapped'} · {money(i.rate)} × {i.pcs}</span></span>
                              <span className="font-bold">{money(i.amount)}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </>
          );
        }}
      </Async>
    </>
  );
}
