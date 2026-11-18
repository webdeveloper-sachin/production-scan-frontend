const base = 'w-full rounded-xl border border-ink/20 bg-white px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-tape';

export function Input({ className = '', ...props }) {
  return <input className={`${base} ${className}`} {...props} />;
}
export function Select({ className = '', ...props }) {
  return <select className={`${base} ${className}`} {...props} />;
}
export function Textarea({ className = '', ...props }) {
  return <textarea className={`${base} ${className}`} {...props} />;
}
