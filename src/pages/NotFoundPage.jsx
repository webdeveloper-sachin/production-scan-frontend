import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="py-24 text-center">
      <p className="font-display text-4xl font-extrabold">Page not found</p>
      <Link to="/scan" className="mt-3 inline-block font-bold underline">Go to Scan</Link>
    </div>
  );
}
