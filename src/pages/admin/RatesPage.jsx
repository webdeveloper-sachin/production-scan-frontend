import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useAction } from '../../hooks/useAction';
import { useToast } from '../../context/ToastContext.jsx';
import { getPatterns, createPattern, bulkPatterns, updatePatternRate, deletePattern } from '../../services/pattern.service';
import PageTitle from '../../components/ui/PageTitle.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Async, EmptyState } from '../../components/ui/States.jsx';
import CsvUpload from '../../components/features/CsvUpload.jsx';

const COLUMNS = [{ key: 'pattern_number', required: true }, { key: 'rate', required: true }];

function Row({ pattern, onSave, onDelete }) {
  const [rate, setRate] = useState(pattern.rate);
  return (
    <li className="flex items-center gap-2 py-3">
      <p className="flex-1 font-bold">{pattern.pattern_number}</p>
      <Input type="number" step="0.01" min="0" value={rate} onChange={(e) => setRate(e.target.value)} className="!w-24 !py-2" />
      <Button variant="secondary" className="!px-3 !py-2" onClick={() => onSave(pattern.id, Number(rate))}>Save</Button>
      <Button variant="danger" onClick={() => onDelete(pattern.id)}>Remove</Button>
    </li>
  );
}

export default function RatesPage() {
  const state = useFetch(getPatterns);
  const run = useAction();
  const toast = useToast();

  const add = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = Object.fromEntries(new FormData(form));
    const res = await run(() => createPattern({ pattern_number: f.pattern_number.trim(), rate: Number(f.rate) }), 'Pattern added');
    if (res) { form.reset(); state.refetch(); }
  };
  const remove = async (id) => {
    if (!window.confirm('Remove this pattern?')) return;
    if (await run(() => deletePattern(id), 'Removed')) state.refetch();
  };

  return (
    <>
      <PageTitle>Patterns and rates</PageTitle>
      <p className="-mt-2 mb-4 text-sm text-ink/60">Upload a CSV to add patterns or update rates of existing ones.</p>
      <div className="mb-6 max-w-2xl">
        <CsvUpload
          templateName="rates"
          columns={COLUMNS}
          sample={[['P1', '12.50'], ['P2', '8']]}
          validateRow={(r) => (!r.pattern_number ? 'pattern_number is required' : r.rate === '' || !Number.isFinite(Number(r.rate)) || Number(r.rate) < 0 ? 'rate must be a number >= 0' : null)}
          onUpload={async (rows) => {
            const r = await bulkPatterns(rows);
            toast(`${r.created} added, ${r.updated} updated`);
            state.refetch();
          }}
        />
      </div>

      <Card as="form" onSubmit={add} className="mb-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <Input name="pattern_number" placeholder="Pattern number" required />
        <Input name="rate" type="number" step="0.01" min="0" placeholder="Rate (₹)" required />
        <Button>Add pattern</Button>
      </Card>

      <Async state={state}>
        {(patterns) => patterns.length ? (
          <Card as="ul" className="divide-y divide-ink/10">
            {patterns.map((p) => <Row key={p.id} pattern={p} onSave={(id, rate) => run(() => updatePatternRate(id, rate), 'Rate saved')} onDelete={remove} />)}
          </Card>
        ) : <EmptyState>No patterns yet.</EmptyState>}
      </Async>
    </>
  );
}
