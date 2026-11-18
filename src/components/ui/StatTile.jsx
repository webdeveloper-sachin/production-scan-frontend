export default function StatTile({ label, value, hint, dark }) {
  return (
    <div className={`rounded-2xl p-4 ring-1 ${dark ? 'bg-ink text-white ring-ink' : 'bg-white ring-ink/10'}`}>
      <p className="text-[11px] font-bold uppercase tracking-wider opacity-60">{label}</p>
      <p className="mt-1 font-display text-2xl font-extrabold leading-tight sm:text-3xl">{value}</p>
      {hint && <p className="mt-0.5 text-xs opacity-60">{hint}</p>}
    </div>
  );
}
