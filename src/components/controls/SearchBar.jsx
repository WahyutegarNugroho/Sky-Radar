import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Search, Loader2, MapPin, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

function SearchBar({ onLocationSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setIsOpen(true);
    setSearchError(null);
    setHasSearched(false);
    setResults([]);
    try {
      const response = await fetch(`/api/geocode/search?q=${encodeURIComponent(query)}&limit=5`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        setSearchError('Gagal mencari lokasi. Silakan coba lagi.');
      }
    } catch (err) {
      setSearchError('Gagal mencari lokasi. Periksa koneksi Anda.');
      console.error('Error during geocoding search:', err);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  const handleSelect = (item) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    onLocationSelect([lat, lon], item.display_name.split(',')[0]);
    setIsOpen(false);
    setQuery(item.display_name.split(',')[0]);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSearchError(null);
    setHasSearched(false);
  };

  return (
    <div className="relative w-full pointer-events-auto" ref={dropdownRef}>
      <form onSubmit={handleSearch} className="flex items-center gap-1.5 p-1 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-sm transition-colors duration-300">
        <div className="flex-1 flex items-center px-3 gap-2">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari lokasi..."
            className="w-full bg-transparent border-none outline-none text-xs text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 py-2"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 hover:bg-gray-100 dark:hover:bg-neutral-800 text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <Button
          type="submit"
          disabled={loading || !query.trim()}
          size="sm"
          className="h-8 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-3 rounded-lg"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Cari'}
        </Button>
      </form>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-12 left-0 right-0 z-[1100] bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-lg max-h-60 overflow-y-auto custom-scrollbar overflow-hidden transition-colors duration-300"
          >
            {loading && (
              <div className="flex items-center justify-center gap-2 p-4 text-neutral-400 text-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-700 dark:text-blue-400" />
                <span>Mencari lokasi...</span>
              </div>
            )}
            {!loading && searchError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{searchError}</span>
              </div>
            )}
            {!loading && !searchError && results.length === 0 && hasSearched && (
              <span className="flex items-center justify-center p-4 text-xs text-neutral-400 dark:text-neutral-500">
                Lokasi tidak ditemukan.
              </span>
            )}
            {!loading && !searchError && results.length > 0 && (
              <div className="flex flex-col py-1">
                {results.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="flex items-start gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-neutral-800 text-left transition-colors group"
                  >
                    <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate">
                        {item.display_name.split(',')[0]}
                      </span>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate">{item.display_name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

SearchBar.propTypes = {
  onLocationSelect: PropTypes.func.isRequired,
};

export default SearchBar;
