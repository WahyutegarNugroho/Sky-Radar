'use client';
import { createContext, useContext, useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS, DEFAULT_CENTER, DEFAULT_ZOOM } from '@/utils/constants';

const MapContext = createContext(null);

export function MapProvider({ children }) {
  const [mapCenter, setMapCenter] = useLocalStorage(STORAGE_KEYS.CENTER, DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useLocalStorage(STORAGE_KEYS.ZOOM, DEFAULT_ZOOM);
  const [mapStyle, _setMapStyle] = useLocalStorage(STORAGE_KEYS.MAP_STYLE, 'satellite');
  const [opacity, setOpacity] = useLocalStorage(STORAGE_KEYS.OPACITY, 0.7);
  const [colorSchemeId, setColorSchemeId] = useLocalStorage(STORAGE_KEYS.COLOR_SCHEME, 1);
  const [layerType, setLayerType] = useLocalStorage(STORAGE_KEYS.LAYER_TYPE, 'radar');
  const [theme, setTheme] = useLocalStorage(STORAGE_KEYS.THEME, 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setMapStyle = useCallback((style) => {
    _setMapStyle(style);
    if (style === 'dark') {
      setTheme('dark');
    } else if (style === 'light') {
      setTheme('light');
    }
  }, [_setMapStyle, setTheme]);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (mapStyle !== 'satellite') {
      _setMapStyle(nextTheme);
    }
  }, [theme, setTheme, mapStyle, _setMapStyle]);

  const handleMapStateChange = useCallback((center, zoom) => {
    setMapCenter(center);
    setMapZoom(zoom);
  }, [setMapCenter, setMapZoom]);

  return (
    <MapContext.Provider value={{
      mapCenter, setMapCenter,
      mapZoom, setMapZoom,
      mapStyle, setMapStyle,
      opacity, setOpacity,
      colorSchemeId, setColorSchemeId,
      layerType, setLayerType,
      theme, setTheme, toggleTheme,
      handleMapStateChange,
    }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error('useMap must be used within MapProvider');
  return ctx;
}
