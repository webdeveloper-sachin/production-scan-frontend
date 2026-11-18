const VARIANTS = {
  primary: 'bg-ink text-white hover:bg-ink/90',
  accent: 'bg-tape text-ink hover:brightness-95',
  secondary: 'border border-ink/15 bg-white hover:bg-ink/5',
  danger: '!px-2 !py-1 text-sm text-red-600 hover:bg-red-50',
};

export default function Button({ variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={`rounded-xl px-4 py-3 font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-tape active:scale-95 disabled:pointer-events-none disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}
