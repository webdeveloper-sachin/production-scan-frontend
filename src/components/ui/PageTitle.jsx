export default function PageTitle({ children, aside }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{children}</h2>
      {aside}
    </div>
  );
}
