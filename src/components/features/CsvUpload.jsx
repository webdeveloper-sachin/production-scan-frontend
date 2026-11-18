import { useRef, useState } from 'react';
import { useToast } from '../../context/ToastContext.jsx';
import { parseCsvFile, downloadTemplate } from '../../utils/csvParse';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';

const MAX_ROWS = 5000;

// columns: [{ key, required }], sample: [[...]], validateRow(row) -> error text | null
export default function CsvUpload({ templateName, columns, sample, validateRow, onUpload, actionLabel = 'Upload' }) {
  const [parsed, setParsed] = useState({ file: '', rows: [], errors: [] });
  const [serverErrors, setServerErrors] = useState([]);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();
  const toast = useToast();

  const handleFile = async (file) => {
    if (!file) return;
    setServerErrors([]);
    if (!/\.csv$/i.test(file.name)) return setParsed({ file: file.name, rows: [], errors: ['Please choose a .csv file.'] });

    const res = await parseCsvFile(file);
    const headers = res.meta.fields || [];
    const missing = columns.filter((c) => c.required && !headers.includes(c.key)).map((c) => c.key);
    if (missing.length) {
      return setParsed({ file: file.name, rows: [], errors: [`Missing column(s): ${missing.join(', ')}. Download the template to see the format.`] });
    }

    const rows = res.data.map((r) => Object.fromEntries(columns.map((c) => [c.key, String(r[c.key] ?? '').trim()])));
    const errors = [];
    if (!rows.length) errors.push('The file has no data rows.');
    if (rows.length > MAX_ROWS) errors.push(`Max ${MAX_ROWS} rows per file. Please split the file.`);
    rows.forEach((r, i) => { const e = validateRow(r); if (e) errors.push(`Row ${i + 1}: ${e}`); });
    setParsed({ file: file.name, rows, errors });
  };

  const reset = () => { setParsed({ file: '', rows: [], errors: [] }); if (inputRef.current) inputRef.current.value = ''; };

  const upload = async () => {
    setBusy(true);
    setServerErrors([]);
    try {
      await onUpload(parsed.rows);
      reset();
    } catch (e) {
      toast(e.message, 'error');
      setServerErrors(e.details || []);
    }
    setBusy(false);
  };

  const { file, rows, errors } = parsed;
  const showErrors = [...errors, ...serverErrors];

  return (
    <Card>
      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition ${dragging ? 'border-tape bg-tape/10' : 'border-ink/20 hover:bg-ink/5'}`}
      >
        <Icon name="upload" className="h-7 w-7 text-ink/60" />
        <span className="font-bold">{file || 'Choose a CSV file or drop it here'}</span>
        <span className="text-sm text-ink/60">Columns: {columns.map((c) => c.key + (c.required ? '*' : '')).join(', ')}</span>
        <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
      </label>

      <button type="button" onClick={() => downloadTemplate(templateName, columns, sample)} className="mt-3 text-sm font-bold underline">
        Download template
      </button>

      {showErrors.length > 0 && (
        <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">
          <p className="font-bold">{errors.length ? 'Fix these issues and choose the file again' : 'Upload failed'}</p>
          <ul className="mt-1 list-disc pl-5">
            {showErrors.slice(0, 6).map((e, i) => <li key={i}>{e}</li>)}
          </ul>
          {showErrors.length > 6 && <p className="mt-1">…and {showErrors.length - 6} more</p>}
        </div>
      )}

      {rows.length > 0 && errors.length === 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-bold">{rows.length} rows ready. Preview:</p>
          <div className="overflow-x-auto rounded-xl ring-1 ring-ink/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink/5 text-xs uppercase tracking-wide text-ink/60">
                <tr>{columns.map((c) => <th key={c.key} className="px-3 py-2">{c.key}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {rows.slice(0, 6).map((r, i) => (
                  <tr key={i}>{columns.map((c) => <td key={c.key} className="whitespace-nowrap px-3 py-2">{r[c.key] || '-'}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={upload} disabled={busy} className="flex-1">{busy ? 'Uploading…' : `${actionLabel} ${rows.length} rows`}</Button>
            <Button variant="secondary" onClick={reset} disabled={busy}>Cancel</Button>
          </div>
        </div>
      )}
    </Card>
  );
}
