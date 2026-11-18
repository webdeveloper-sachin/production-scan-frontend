const PATHS = {
  grid: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z',
  box: 'M21 8l-9-5-9 5v8l9 5 9-5V8z M3 8l9 5 9-5 M12 13v8',
  upload: 'M12 16V4 M7 9l5-5 5 5 M4 20h16',
  tag: 'M3 12V3h9l9 9-9 9-9-9z M7.5 7.5h.01',
  layers: 'M12 3l9 5-9 5-9-5 9-5z M3 13l9 5 9-5',
  users: 'M16 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1 M9.5 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7z M21 20v-1a4 4 0 00-3-3.9 M16 4.1a3.5 3.5 0 010 6.8',
  file: 'M14 3H6a1 1 0 00-1 1v16a1 1 0 001 1h12a1 1 0 001-1V8l-5-5z M14 3v5h5 M9 13h6 M9 17h6',
  logout: 'M9 21H5a1 1 0 01-1-1V4a1 1 0 011-1h4 M16 17l5-5-5-5 M21 12H9',
  scan: 'M4 8V5a1 1 0 011-1h3 M16 4h3a1 1 0 011 1v3 M20 16v3a1 1 0 01-1 1h-3 M8 20H5a1 1 0 01-1-1v-3 M8 12h8',
  coins: 'M12 2v20 M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
  lock: 'M5 11h14v10H5z M8 11V7a4 4 0 018 0v4',
  menu: 'M4 6h16 M4 12h16 M4 18h16',
  x: 'M6 6l12 12 M18 6L6 18',
};

export default function Icon({ name, className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {PATHS[name].split(' M').map((d, i) => <path key={i} d={i ? 'M' + d : d} />)}
    </svg>
  );
}
