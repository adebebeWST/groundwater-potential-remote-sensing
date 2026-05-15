import React, { useState, useCallback, useRef, useEffect } from 'react';
import { mapService } from '../../services/mapService';
import { useMapStore } from '../../store/mapStore';
import type { Woreda } from '../../types';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Woreda[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const setCenter = useMapStore(s => s.setCenter);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const data = await mapService.searchWoreda(q);
      setResults(data);
      setOpen(data.length > 0);
    } catch {
      setResults([]);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  };

  const handleSelect = (woreda: Woreda) => {
    setQuery(woreda.full_name);
    setOpen(false);
    // Zoom to approximate center of woreda region (placeholder: use a lookup table in production)
    const regionCenters: Record<string, [number, number]> = {
      'Addis Ababa': [9.03, 38.74],
      'Oromia':      [8.65, 39.55],
      'Amhara':      [11.5, 37.8],
      'Tigray':      [13.5, 39.5],
      'Sidama':      [6.9,  38.5],
      'Dire Dawa':   [9.6,  41.85]
    };
    const center = regionCenters[woreda.region ?? ''] ?? [9.03, 38.74];
    setCenter(center[0], center[1], 12);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div ref={containerRef} className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001] w-72">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search woreda (Ethiopian district)..."
          className="w-full pl-3 pr-10 py-2 text-sm bg-white border border-gray-200 rounded-lg shadow-md
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          aria-label="Search for a woreda"
          aria-autocomplete="list"
          aria-expanded={open}
        />
        {loading ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </span>
        ) : (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        )}
      </div>

      {open && results.length > 0 && (
        <ul
          className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50"
          role="listbox"
        >
          {results.map(woreda => (
            <li key={woreda.id} role="option" aria-selected={false}>
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-primary-50 transition-colors"
                onClick={() => handleSelect(woreda)}
              >
                <span className="font-medium text-gray-800">{woreda.name}</span>
                {woreda.region && (
                  <span className="ml-1.5 text-xs text-gray-500">{woreda.region}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
