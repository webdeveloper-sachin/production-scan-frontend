export const Spinner = () => <p className="py-10 text-center text-ink/60">Loading…</p>;

export const EmptyState = ({ children }) => (
  <p className="rounded-2xl border border-dashed border-ink/20 p-6 text-center text-ink/60">{children}</p>
);

export const ErrorBox = ({ error, onRetry }) => (
  <div className="rounded-2xl bg-red-50 p-4 text-red-700">
    <p className="font-bold">Could not load this page</p>
    <p className="text-sm">{error?.message}</p>
    {onRetry && <button onClick={onRetry} className="mt-2 text-sm font-bold underline">Try again</button>}
  </div>
);

// loading / error / data teeno states ek jagah handle karta hai
export function Async({ state, children }) {
  if (state.loading && !state.data) return <Spinner />;
  if (state.error) return <ErrorBox error={state.error} onRetry={state.refetch} />;
  return children(state.data);
}
