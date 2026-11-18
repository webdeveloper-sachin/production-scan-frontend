import { useFetch } from '../../hooks/useFetch';
import { useAction } from '../../hooks/useAction';
import { useToast } from '../../context/ToastContext.jsx';
import { getPatterns } from '../../services/pattern.service';
import { getStyles, saveStylePattern, bulkStyles, deleteMapping } from '../../services/style.service';
import { money } from '../../utils/format';
import PageTitle from '../../components/ui/PageTitle.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import { Input, Select } from '../../components/ui/Input.jsx';
import { Async, EmptyState } from '../../components/ui/States.jsx';
import CsvUpload from '../../components/features/CsvUpload.jsx';

const COLUMNS = [{ key: 'style_number', required: true }, { key: 'pattern_number', required: true }];

export default function StylesPage() {
  const state = useFetch(() => Promise.all([getStyles(), getPatterns()]));
  const run = useAction();
  const toast = useToast();

  const add = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = Object.fromEntries(new FormData(form));
    const res = await run(() => saveStylePattern({ style_number: f.style_number.trim(), pattern_number: f.pattern_number }), 'Style saved');
    if (res) { form.reset(); state.refetch(); }
  };
  const remove = async (id) => {
    if (!window.confirm('Remove this style mapping?')) return;
    if (await run(() => deleteMapping(id), 'Removed')) state.refetch();
  };

  return (
    <>
      <PageTitle>Styles</PageTitle>
      <p className="-mt-2 mb-4 text-sm text-ink/60">Each style has one pattern. Upload the rates first, then map styles to them.</p>
      <div className="mb-6 max-w-2xl">
        <CsvUpload
          templateName="styles"
          columns={COLUMNS}
          sample={[['ST-101', 'P1'], ['ST-102', 'P2']]}
          validateRow={(r) => (!r.style_number || !r.pattern_number ? 'style_number and pattern_number are required' : null)}
          onUpload={async (rows) => {
            const r = await bulkStyles(rows);
            toast(`${r.created} added, ${r.updated} updated`);
            state.refetch();
          }}
        />
      </div>

      <Async state={state}>
        {([styles, patterns]) => (
          <>
            <Card as="form" onSubmit={add} className="mb-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <Input name="style_number" placeholder="Style number" required />
              <Select name="pattern_number" defaultValue="" required>
                <option value="" disabled>Select pattern</option>
                {patterns.map((p) => <option key={p.id} value={p.pattern_number}>{p.pattern_number} · {money(p.rate)}</option>)}
              </Select>
              <Button>Save style</Button>
            </Card>

            {styles.length ? (
              <Card as="ul" className="divide-y divide-ink/10">
                {styles.map((s) => (
                  <li key={s.mapping_id} className="flex items-center gap-2 py-3">
                    <div>
                      <p className="font-display text-lg font-extrabold">{s.style_number}</p>
                      <p className="text-sm text-ink/60">Pattern {s.pattern_number}</p>
                    </div>
                    <p className="ml-auto font-bold">{money(s.rate)}</p>
                    <Button variant="danger" onClick={() => remove(s.mapping_id)}>Remove</Button>
                  </li>
                ))}
              </Card>
            ) : <EmptyState>No styles mapped yet.</EmptyState>}
          </>
        )}
      </Async>
    </>
  );
}
