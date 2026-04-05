import { useState, useEffect, useRef, useCallback } from 'react';

interface Suggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

interface GeocodeResult {
  found: boolean;
  formattedAddress?: string;
  city?: string;
  state?: string;
  county?: string;
  zipCode?: string;
  lat?: number;
  lng?: number;
  jurisdictionName?: string;
  inFloodZone?: boolean;
  jurisdiction?: any;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  onGeocode?: (result: GeocodeResult) => void;
  placeholder?: string;
  className?: string;
}

export default function AddressAutocomplete({ value, onChange, onGeocode, placeholder, className }: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchSuggestions = useCallback(async (input: string) => {
    if (input.length < 4) { setSuggestions([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/jurisdictions/autocomplete?q=${encodeURIComponent(input)}`, { credentials: 'include' });
      const data = await res.json();
      setSuggestions(data || []);
      setOpen(data?.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 350);
  };

  const handleSelect = async (suggestion: Suggestion) => {
    onChange(suggestion.description);
    setOpen(false);
    setSuggestions([]);

    if (!onGeocode) return;
    setGeocoding(true);
    try {
      const res = await fetch(`/api/jurisdictions/geocode?address=${encodeURIComponent(suggestion.description)}`, { credentials: 'include' });
      const data = await res.json();
      onGeocode(data);
    } catch {
      onGeocode({ found: false });
    } finally {
      setGeocoding(false);
    }
  };

  const handleBlurGeocode = async () => {
    if (!onGeocode || !value || value.length < 10) return;
    setGeocoding(true);
    try {
      const res = await fetch(`/api/jurisdictions/geocode?address=${encodeURIComponent(value)}`, { credentials: 'include' });
      const data = await res.json();
      onGeocode(data);
    } catch {
      onGeocode({ found: false });
    } finally {
      setGeocoding(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlurGeocode}
          placeholder={placeholder || 'Start typing an address...'}
          className={className || 'w-full px-3 py-2 border border-white/20 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400'}
          autoComplete="off"
        />
        {(loading || geocoding) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 rounded-xl border border-white/10 bg-slate-800 shadow-2xl overflow-hidden">
          {suggestions.map((s) => (
            <li key={s.placeId}
              onClick={() => handleSelect(s)}
              className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-white/10 transition">
              <span className="text-slate-400 mt-0.5 shrink-0">📍</span>
              <div>
                <p className="text-sm font-medium text-white">{s.mainText}</p>
                <p className="text-xs text-slate-400">{s.secondaryText}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
