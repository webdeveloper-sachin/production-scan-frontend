import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { getEarningsReport, getTopStyles } from '../../services/scan.service';
import { money, monthStartIST, todayIST } from '../../utils/format';
import PageTitle from '../../components/ui/PageTitle.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import StatTile from '../../components/ui/StatTile.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Async, EmptyState } from '../../components/ui/States.jsx';

export default function DashboardPage() {
  const [form, setForm] = useState({ from: monthStartIST(), to: todayIST() });
  const [range, setRange] = useState(form);
  const state = useFetch(
    async () => {
      const [top, earn] = await Promise.all([getTopStyles(range.from, range.to, 8), getEarningsReport(range.from, range.to)]);
      return { styles: top.styles, report: earn.report };
    },
    [range.from, range.to]
  );

  return (
    <>
      <PageTitle>Dashboard</PageTitle>
      <Card as="form" onSubmit={(e) => { e.preventDefault(); setRange(form); }} className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <label><span className="text-sm font-bold">From</span><Input type="date" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} required /></label>
        <label><span className="text-sm font-bold">To</span><Input type="date" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} required /></label>
        <Button className="col-span-2 sm:col-span-1 sm:self-end">Apply</Button>
      </Card>

      <Async state={state}>
        {({ styles, report }) => {
          const pcs = report.reduce((s, r) => s + r.total_scans, 0);
          const payout = report.reduce((s, r) => s + Number(r.total_earning), 0);
          const maxPcs = Math.max(...styles.map((s) => s.pcs), 1);
          const topPeople = [...report].sort((a, b) => b.total_scans - a.total_scans).slice(0, 5);

          return (
            <>
              <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatTile dark label="Pieces produced" value={pcs} />
                <StatTile label="Total payout" value={money(payout)} />
                <StatTile label="Active employees" value={report.length} />
                <StatTile label="Styles in production" value={styles.length} hint="top 8 shown" />
              </div>

              <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
                <Card>
                  <h3 className="font-display text-lg font-extrabold">Top performing styles</h3>
                  {styles.length ? (
                    <ol className="mt-3 space-y-3">
                      {styles.map((s, i) => (
                        <li key={s.style_number}>
                          <div className="flex items-baseline justify-between gap-2 text-sm">
                            <span className="font-bold"><span className="mr-2 text-ink/40">{i + 1}</span>{s.style_number}
                              <span className="ml-2 font-normal text-ink/50">{s.pattern_number ?? 'not mapped'}</span></span>
                            <span><b>{s.pcs}</b> pcs · {money(s.amount)}</span>
                          </div>
                          <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink/10">
                            <div className="h-full rounded-full bg-tape" style={{ width: `${(s.pcs / maxPcs) * 100}%` }} />
                          </div>
                        </li>
                      ))}
                    </ol>
                  ) : <div className="mt-3"><EmptyState>No production in this period.</EmptyState></div>}
                </Card>

                <Card>
                  <h3 className="font-display text-lg font-extrabold">Top employees</h3>
                  {topPeople.length ? (
                    <ul className="mt-2 divide-y divide-ink/10">
                      {topPeople.map((p) => (
                        <li key={p.employee_id} className="flex items-center justify-between py-3">
                          <div><p className="font-bold">{p.name}</p><p className="text-xs capitalize text-ink/60">{p.role_name}</p></div>
                          <p className="text-right text-sm"><b>{p.total_scans}</b> pcs<br /><span className="text-ink/60">{money(p.total_earning)}</span></p>
                        </li>
                      ))}
                    </ul>
                  ) : <div className="mt-3"><EmptyState>No scans yet.</EmptyState></div>}
                </Card>
              </div>
            </>
          );
        }}
      </Async>
    </>
  );
}
