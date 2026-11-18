export default function Card({ as: Tag = 'div', className = '', ...props }) {
  return <Tag className={`rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink/10 ${className}`} {...props} />;
}
