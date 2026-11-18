export const fmtDateTime = (d) =>
  new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

export const money = (n) => '₹' + Number(n || 0).toFixed(2);

export const todayIST = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

export const monthStartIST = () => todayIST().slice(0, 8) + '01';

export const prettyStatus = (s = '') => s.replaceAll('_', ' ');

// 'YYYY-MM-DD' -> '16 Nov 2026' (timezone shift se bachne ke liye string se parse)
export const fmtDate = (ymd) => {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const safeName = (s = '') => s.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '');
