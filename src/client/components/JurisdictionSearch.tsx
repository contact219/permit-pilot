import { useState, useEffect, useRef } from 'react';
import { get } from '../lib/api';

interface Props { onSelect: (jur: any) => void; selectedId?: string; }

export default function JurisdictionSearch({ onSelect, selectedId }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (query.length < 2) { setResults([]); return; }
      setLoading(true);
      try { const data = await get<any[]>('/api/jurisdictions/search', { q: query }); setResults(data); setOpen(true); }
      catch { setResults([]); }
      finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div ref={wrapperRef} className="relative">
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => results.length > 0 && setOpen(true)}
        placeholder="Search for city, county, or jurisdiction"
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
      {loading && <div className="absolute right-3 top-2.5 text-sm text-gray-500">Loading...</div>}
      {open && results.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {results.map((jur) => (
            <li key={jur.id} onClick={() => { onSelect(jur); setQuery(jur.name); setOpen(false); }}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${selectedId === jur.id ? 'bg-blue-100' : ''}`}>
              <div className="font-medium">{jur.name}</div>
              <div className="text-xs text-gray-500">{jur.state} · {jur.county || 'No county'} · {jur.submissionMethod}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
