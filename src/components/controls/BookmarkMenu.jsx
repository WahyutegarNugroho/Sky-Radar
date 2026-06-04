'use client';
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Bookmark, MapPin, Trash2, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function BookmarkMenu({ savedLocs, onNavigateTo, onSave, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!showMenu) return;
    function handleEscape(e) { if (e.key === 'Escape') setShowMenu(false); }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showMenu]);

  const handleKeyNav = (e, loc) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onNavigateTo(loc.lat, loc.lng, loc.zoom);
      setShowMenu(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await onSave(newName.trim());
      setNewName('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div ref={menuRef}>
      <Button
        onClick={() => setShowMenu(!showMenu)}
        size="icon"
        className="w-10 h-10 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 shadow-sm transition-colors duration-300"
      >
        <Bookmark className={`w-4 h-4 ${savedLocs.length > 0 ? 'fill-accent-brand text-accent-brand' : 'text-neutral-500 dark:text-neutral-400'}`} />
      </Button>

      {showMenu && (
        <div className="absolute top-full right-0 mt-3 w-64 max-w-[calc(100vw-48px)] p-4 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-xl flex flex-col gap-3 max-h-80 overflow-y-auto custom-scrollbar overflow-hidden transition-colors duration-300">
          <span className="text-xs text-neutral-400 dark:text-neutral-300 font-medium">Lokasi Tersimpan</span>

          {savedLocs.length === 0 ? (
            <span className="text-xs text-neutral-400 dark:text-neutral-300 text-center py-2">Belum ada lokasi tersimpan.</span>
          ) : (
            <div className="flex flex-col gap-1 pr-1 max-h-40 overflow-y-auto custom-scrollbar rounded-lg">
              {savedLocs.map((loc) => (
                <div key={loc.id} className="group flex items-center justify-between p-1.5 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors rounded-lg">
                  <button
                     onClick={() => { onNavigateTo(loc.lat, loc.lng, loc.zoom); setShowMenu(false); }}
                     onKeyDown={(e) => handleKeyNav(e, loc)}
                     className="flex items-center gap-2 min-w-0 flex-1 text-left"
                     tabIndex={0}
                     role="button"
                  >
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-400 shrink-0" />
                    <span className="text-xs text-neutral-700 dark:text-neutral-300 truncate">{loc.name}</span>
                  </button>
                  <button
                    onClick={() => onDelete(loc.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-sm"
                    title="Hapus"
                  >
                    <Trash2 className="w-3 h-3 text-red-500 dark:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSave} className="flex items-center gap-1.5 pt-2 border-t border-gray-100 dark:border-neutral-800">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nama lokasi..."
              className="flex-1 px-2 py-1.5 text-xs bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 outline-none text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 rounded-lg"
            />
            <Button
              type="submit"
              disabled={saving || !newName.trim()}
              size="icon"
              className="h-7 w-7 bg-accent-brand hover:brightness-110 text-white rounded-lg"
            >
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

BookmarkMenu.propTypes = {
  savedLocs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    zoom: PropTypes.number.isRequired,
  })).isRequired,
  onNavigateTo: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BookmarkMenu;
