import { toCsv, downloadFile } from './csv';
import { fmtDate, safeName, todayIST } from './format';

// jsPDF ka default font ₹ symbol nahi dikhata, isliye PDF mein "Rs." use hua hai
const rs = (n) => 'Rs. ' + Number(n || 0).toFixed(2);
const baseName = (d) => `earnings_${safeName(d.employee.name)}_${d.from}_to_${d.to}`;
const NOT_MAPPED = 'Not mapped';

/* ---------- CSV ---------- */
export function exportEarningsCsv(d, paymentDate) {
  const rows = [
    ['Employee name', d.employee.name],
    ['Employee ID', d.employee.id],
    ['Role', d.employee.role_name],
    ['Period from', d.from],
    ['Period to', d.to],
    [paymentDate ? 'Payment date' : 'Generated on', paymentDate || todayIST()],
    ['Total pcs scanned', d.total_pcs],
    ['Total amount (INR)', d.total_amount],
    ['Working days', d.working_days],
    ['Average per day (INR)', d.avg_per_day],
    [],
    ['Date', 'Style number', 'Pattern number', 'Rate (INR)', 'Pcs', 'Amount (INR)'],
  ];
  d.days.forEach((day) =>
    day.items.forEach((i) =>
      rows.push([day.date, i.style_number, i.pattern_number ?? NOT_MAPPED, i.rate, i.pcs, i.amount])
    )
  );
  rows.push([], ['Total', '', '', '', d.total_pcs, d.total_amount]);
  downloadFile(`${baseName(d)}.csv`, toCsv(rows), 'text/csv;charset=utf-8');
}

export function exportSummaryCsv(report, period) {
  const rows = [['Employee ID', 'Name', 'Role', 'Total pcs', 'Total amount (INR)']];
  report.forEach((r) => rows.push([r.employee_id, r.name, r.role_name, r.total_scans, r.total_earning]));
  downloadFile(`earnings_summary_${period.from}_to_${period.to}.csv`, toCsv(rows), 'text/csv;charset=utf-8');
}

/* ---------- PDF ---------- */
export async function buildEarningsPdf(d, paymentDate) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 40;
  const NAVY = [20, 33, 61];
  const SOFT = [234, 238, 243];

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Payment Statement', M, 50);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`${paymentDate ? 'Payment date' : 'Generated on'}: ${fmtDate(paymentDate || todayIST())}`, W - M, 50, { align: 'right' });

  const keyStyle = { 0: { fontStyle: 'bold', cellWidth: 100 } };
  const common = { theme: 'plain', startY: 72, styles: { fontSize: 10, cellPadding: 3 }, columnStyles: keyStyle };

  autoTable(doc, {
    ...common,
    margin: { left: M },
    tableWidth: 250,
    body: [
      ['Employee', d.employee.name],
      ['Employee ID', String(d.employee.id)],
      ['Role', d.employee.role_name],
      ['Period', `${fmtDate(d.from)} to ${fmtDate(d.to)}`],
    ],
  });
  autoTable(doc, {
    ...common,
    margin: { left: M + 270 },
    tableWidth: W - 2 * M - 270,
    body: [
      ['Total pcs scanned', String(d.total_pcs)],
      ['Total amount', rs(d.total_amount)],
      ['Working days', String(d.working_days)],
      ['Average per day', rs(d.avg_per_day)],
    ],
  });

  const body = [];
  d.days.forEach((day) => {
    day.items.forEach((i, idx) =>
      body.push([idx === 0 ? fmtDate(day.date) : '', i.style_number, i.pattern_number ?? NOT_MAPPED, rs(i.rate), String(i.pcs), rs(i.amount)])
    );
    const sub = { fontStyle: 'bold', fillColor: SOFT };
    body.push([
      { content: `Day total, ${fmtDate(day.date)}`, colSpan: 4, styles: { ...sub, halign: 'right' } },
      { content: String(day.pcs), styles: { ...sub, halign: 'right' } },
      { content: rs(day.amount), styles: { ...sub, halign: 'right' } },
    ]);
  });
  if (!body.length) body.push([{ content: 'No scans in this period', colSpan: 6, styles: { halign: 'center' } }]);

  autoTable(doc, {
    startY: Math.max(doc.lastAutoTable?.finalY ?? 0, 72 + 4 * 20) + 24,
    margin: { left: M, right: M, bottom: 40 },
    theme: 'grid',
    styles: { fontSize: 9 },
    head: [['Date', 'Style', 'Pattern', ...['Rate', 'Pcs', 'Amount'].map((content) => ({ content, styles: { halign: 'right' } }))]],
    headStyles: { fillColor: NAVY },
    body,
    foot: [[
      { content: 'Grand total', colSpan: 4, styles: { halign: 'right' } },
      { content: String(d.total_pcs), styles: { halign: 'right' } },
      { content: rs(d.total_amount), styles: { halign: 'right' } },
    ]],
    footStyles: { fillColor: NAVY },
    showFoot: 'lastPage',
    columnStyles: { 3: { halign: 'right' }, 4: { halign: 'right' }, 5: { halign: 'right' } },
    didDrawPage: () => {
      doc.setFontSize(8);
      doc.text(`Page ${doc.internal.getNumberOfPages()}`, W / 2, H - 20, { align: 'center' });
    },
  });
  return doc;
}

export async function exportEarningsPdf(d, paymentDate) {
  const doc = await buildEarningsPdf(d, paymentDate);
  doc.save(`${baseName(d)}.pdf`);
}
