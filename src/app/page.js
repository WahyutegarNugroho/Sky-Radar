'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useRadarData } from '@/hooks/useRadarData';
import { useAnimation } from '@/hooks/useAnimation';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useWeather } from '@/hooks/useWeather';
import { useMultiWeather } from '@/hooks/useMultiWeather';
import { useReverseGeocode } from '@/hooks/useReverseGeocode';
import { useMap } from '@/contexts/MapContext';
import { useAuth } from '@/contexts/AuthContext';
import Legend from '@/components/map/Legend';
import GeoLocationButton from '@/components/controls/GeoLocationButton';
import OpacitySlider from '@/components/controls/OpacitySlider';
import MapStyleSelector from '@/components/controls/MapStyleSelector';
import LayerToggle from '@/components/controls/LayerToggle';
import ColorSchemePicker from '@/components/controls/ColorSchemePicker';
import ThemeToggle from '@/components/controls/ThemeToggle';
import TimelinePlayer from '@/components/controls/TimelinePlayer';
import SearchBar from '@/components/controls/SearchBar';
import BookmarkMenu from '@/components/controls/BookmarkMenu';
import AuthModal from '@/components/auth/AuthModal';
import LandingPage from '@/components/landing/LandingPage';
import LoginPage from '@/components/auth/LoginPage';
import RegisterPage from '@/components/auth/RegisterPage';
import OpenMeteoCard from '@/components/controls/OpenMeteoCard';
import MultiLocationWeather from '@/components/weather/MultiLocationWeather';
import AlertThresholdEditor from '@/components/controls/AlertThresholdEditor';

import { getRadarError, getGeoError } from '@/lib/errors';
import { GEO_ZOOM, SEARCH_ZOOM } from '@/utils/constants';
import { CloudRain, RefreshCw, AlertTriangle, Info, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MapView = dynamic(() => import('../components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-50 flex items-center justify-center text-neutral-500 text-sm">
      Memuat peta...
    </div>
  ),
});

function Page() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState('weather');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const {
    mapCenter, mapZoom, mapStyle, opacity, colorSchemeId, layerType,
    setMapCenter, setMapZoom, handleMapStateChange, setLayerType,
  } = useMap();
  const {
    currentUser, setCurrentUser, view, setView, savedLocs,
    savePrefsToCloud, handleSaveLocation, handleDeleteLocation,
    alertConfig, updateAlertConfig,
  } = useAuth();
  const { radarData, loading: radarLoading, error: radarError, refresh } = useRadarData();
  const activeList = layerType === 'radar' ? (radarData?.radar || []) : (radarData?.satellite || []);
  const { currentIndex, isPlaying, setCurrentIndex, setIsPlaying, nextFrame, prevFrame } = useAnimation(activeList.length);
  const { location: geoLocation, error: geoError, loading: geoLoading, getMyLocation } = useGeolocation();
  const activeWeatherCoords = selectedLocation || mapCenter;
  const { weather, loading: weatherLoading, error: weatherError } = useWeather(activeWeatherCoords[0], activeWeatherCoords[1]);
  const multiLocations = useMemo(() => {
  return currentUser && savedLocs.length > 0 ? savedLocs.map((l) => ({ lat: l.lat, lng: l.lng, name: l.name })) : [];
}, [currentUser, savedLocs]);
  const { weatherData: multiWeatherData, loading: multiWeatherLoading } = useMultiWeather(multiLocations);
  const { locationName, fetchLocationName, error: geoNameError } = useReverseGeocode();

  useEffect(() => { setIsMounted(true); }, []);
  useEffect(() => {
    savePrefsToCloud(mapCenter, mapZoom, mapStyle, opacity, colorSchemeId);
  }, [mapCenter, mapZoom, mapStyle, opacity, colorSchemeId, savePrefsToCloud]);
  useEffect(() => {
    fetchLocationName(mapCenter[0], mapCenter[1], true);
  }, [fetchLocationName]);
  useEffect(() => {
    if (geoLocation) {
      setMapCenter(geoLocation);
      setMapZoom(GEO_ZOOM);
      setSelectedLocation(geoLocation);
      fetchLocationName(geoLocation[0], geoLocation[1], true);
    }
  }, [geoLocation, setMapCenter, setMapZoom, fetchLocationName]);
  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, [layerType, setCurrentIndex, setIsPlaying]);

  const handleLocationSelect = useCallback((coords, name) => {
    setMapCenter(coords);
    setMapZoom(SEARCH_ZOOM);
    setSelectedLocation(coords);
    fetchLocationName(coords[0], coords[1], true);
  }, [setMapCenter, fetchLocationName]);

  const handleMapClick = useCallback((coords) => {
    setSelectedLocation(coords);
    fetchLocationName(coords[0], coords[1], true);
  }, [fetchLocationName]);

  const handleBookmarkSave = async (name) => {
    if (!currentUser) return;
    await handleSaveLocation(name, mapCenter, mapZoom);
  };

  const handleSaveClickedLocation = useCallback(async (name, coords) => {
    if (!currentUser) return;
    await handleSaveLocation(name, coords, mapZoom);
  }, [currentUser, handleSaveLocation, mapZoom]);

  const handleBookmarkNavigate = (lat, lng, zoom) => {
    setMapCenter([lat, lng]);
    setMapZoom(zoom);
  };

  const handleDashboardLocationClick = useCallback((lat, lng, name) => {
    setMapCenter([lat, lng]);
    setMapZoom(SEARCH_ZOOM);
    setSelectedLocation([lat, lng]);
    fetchLocationName(lat, lng, true);
  }, [setMapCenter, fetchLocationName]);

  if (!isMounted) {
    return (
      <div className="w-screen h-screen bg-white flex flex-col items-center justify-center text-neutral-700 gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-accent-brand" />
        <span className="text-sm font-semibold">Menyiapkan SkyRadar...</span>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {view === 'landing' && (
        <motion.div
          key="landing"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <LandingPage
            onGuestAccess={() => setView('map')}
            onLoginClick={() => setView('login')}
            onRegisterClick={() => setView('register')}
          />
        </motion.div>
      )}
      {view === 'login' && (
        <motion.div
          key="login"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <LoginPage
            onAuthSuccess={setCurrentUser}
            onBack={() => setView('landing')}
            onRegisterClick={() => setView('register')}
            onGuestAccess={() => setView('map')}
          />
        </motion.div>
      )}
      {view === 'register' && (
        <motion.div
          key="register"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <RegisterPage
            onAuthSuccess={setCurrentUser}
            onBack={() => setView('landing')}
            onLoginClick={() => setView('login')}
            onGuestAccess={() => setView('map')}
          />
        </motion.div>
      )}
      {view === 'map' && (
        <motion.div
          key="map"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
    <div className="relative w-screen h-screen overflow-hidden font-sans select-none bg-gray-50 transition-colors duration-300">
      {/* ============================================================ */}
      {/* LAYER 1: Top Panel (z-1100)                                  */}
      {/* Mobile: full width minus 68px right margin for GeoLocation   */}
      {/* Desktop: max-w-md, right margin restored                     */}
      {/* ============================================================ */}
      <div className="absolute top-4 left-4 right-4 sm:max-w-md z-[1100] bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-gray-100 dark:border-neutral-800 p-2.5 sm:p-3.5 rounded-2xl shadow-lg flex flex-col gap-2 sm:gap-3 pointer-events-auto transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CloudRain className="w-5 h-5 text-accent-brand shrink-0" />
            <div>
              <h1 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 tracking-tight leading-none">SkyRadar</h1>
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">Real-time Weather</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <AuthModal onAuthSuccess={setCurrentUser} />
            {currentUser && (
              <BookmarkMenu
                savedLocs={savedLocs}
                onNavigateTo={handleBookmarkNavigate}
                onSave={handleBookmarkSave}
                onDelete={handleDeleteLocation}
              />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <SearchBar onLocationSelect={handleLocationSelect} currentUser={currentUser} />
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* LAYER 2: Toast / Error Banners (z-1200)                      */}
      {/* Stacked below top panel, above all controls                  */}
      {/* Mobile: full-width, Desktop: centered                        */}
      {/* ============================================================ */}
      {radarError && (
        <div className="absolute top-16 left-4 right-4 mx-auto max-w-md z-[1200] flex items-center gap-3 px-3 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl shadow-md pointer-events-auto">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          <div className="flex flex-col gap-0.5 text-xs">
            <span className="font-semibold">{getRadarError(typeof radarError === 'object' ? radarError?.status : null).title}</span>
            <span className="text-red-600">{getRadarError(typeof radarError === 'object' ? radarError?.status : null).detail}</span>
          </div>
          <Button onClick={refresh} size="sm" className="h-8 bg-red-100 hover:bg-red-200 border border-red-300 ml-auto text-red-700 text-xs rounded-xl shrink-0">
            {getRadarError(typeof radarError === 'object' ? radarError?.status : null).action}
          </Button>
        </div>
      )}

      {geoError && (
        <div className="absolute top-[80px] left-4 right-4 mx-auto max-w-md z-[1200] flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-xl shadow-sm pointer-events-auto">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <span className="text-xs font-semibold">{getGeoError(geoError).title}</span>
            <span className="text-amber-600 ml-1">{getGeoError(geoError).detail}</span>
          </div>
        </div>
      )}

      {geoNameError && (
        <div className="absolute top-16 left-4 right-4 mx-auto max-w-md z-[1200] flex items-center gap-2 px-3 py-2 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 text-neutral-500 text-xs rounded-xl shadow-sm pointer-events-auto">
          <Info className="w-3 h-3 text-neutral-400 shrink-0" />
          <span>{geoNameError}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* LAYER 3: Map View (base layer)                              */}
      {/* ============================================================ */}
      <MapView
        center={mapCenter}
        zoom={mapZoom}
        mapStyle={mapStyle}
        opacity={opacity}
        colorSchemeId={colorSchemeId}
        host={radarData?.host}
        activeList={activeList}
        currentIndex={currentIndex}
        onMapStateChange={handleMapStateChange}
        onMapClick={handleMapClick}
        userLocation={geoLocation}
        selectedLocation={selectedLocation}
        layerType={layerType}
        locationName={locationName}
        currentUser={currentUser}
        onSaveLocation={handleSaveClickedLocation}
        savedLocs={currentUser ? savedLocs : []}
      />

      {/* ============================================================ */}
      {/* LAYER 4: Floating Controls (z-1100)                          */}
      {/* ============================================================ */}

      {/* GeoLocation Button */}
      {/* Desktop: top-right. Mobile: bottom-right above controls */}
      <div className="absolute bottom-[216px] right-4 sm:top-4 sm:bottom-auto z-[1100] pointer-events-auto">
        <GeoLocationButton onClick={getMyLocation} loading={geoLoading} />
      </div>

      {/* Right Side Weather Widgets (Desktop Only) */}
      <div className="hidden sm:flex absolute sm:top-20 sm:right-4 sm:left-auto sm:max-w-[280px] sm:max-h-[calc(100vh-160px)] sm:overflow-y-auto flex-col gap-3 pointer-events-auto">
        <OpenMeteoCard
          weather={weather}
          loading={weatherLoading}
          error={weatherError}
          latitude={activeWeatherCoords[0]}
          longitude={activeWeatherCoords[1]}
          locationName={locationName}
          customThresholds={currentUser ? alertConfig : null}
        />
        {currentUser && savedLocs.length > 0 && (
          <MultiLocationWeather
            weatherData={multiWeatherData}
            loading={multiWeatherLoading}
            onLocationClick={handleDashboardLocationClick}
          />
        )}
      </div>

      {/* ============================================================ */}
      {/* LAYER 5: Bottom Controls (z-1100)                            */}
      {/* ============================================================ */}

      {/* Timeline Player / Radar Loading / Satellite Status */}
      <div className="absolute bottom-[88px] left-4 right-4 sm:bottom-4 sm:left-[300px] sm:right-4 sm:max-w-3xl z-[1100] pointer-events-auto">
        {radarLoading && !radarData ? (
          <div className="flex items-center justify-center gap-3 p-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm rounded-2xl shadow-sm">
            <RefreshCw className="w-5 h-5 animate-spin text-accent-brand shrink-0" />
            <span className="font-medium">Mengambil data radar cuaca terbaru...</span>
          </div>
        ) : layerType === 'satellite' ? (
          <div className="flex items-center justify-between p-3 bg-white/95 dark:bg-neutral-900/95 backdrop-blur border border-gray-100 dark:border-neutral-800 w-full max-w-md mx-auto rounded-2xl shadow-md transition-colors duration-300">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">Satelit Himawari-9 Aktif</span>
            </div>
            <span className="text-xs text-neutral-400 dark:text-neutral-300 bg-gray-50/80 dark:bg-neutral-800/80 border border-gray-100 dark:border-neutral-750 px-2 py-1 rounded-lg">NASA GIBS (IR Clean)</span>
          </div>
        ) : (
          <TimelinePlayer
            radarList={activeList}
            currentIndex={currentIndex}
            isPlaying={isPlaying}
            onPlayToggle={() => setIsPlaying(!isPlaying)}
            onIndexChange={setCurrentIndex}
            onNext={nextFrame}
            onPrev={prevFrame}
          />
        )}
      </div>

      {/* MOBILE: compact horizontal bar */}
      <div className="sm:hidden absolute bottom-4 left-4 right-4 z-[1100] pointer-events-auto">
        <div className="flex items-center justify-between p-1.5 bg-white/95 dark:bg-neutral-900/95 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-md">
          <Legend layerType={layerType} compact />
          <LayerToggle compact />
          <button
            onClick={() => {
              setActiveMobileTab('weather');
              setMobileMenuOpen(true);
            }}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors shrink-0 ${
              mobileMenuOpen && activeMobileTab === 'weather'
                ? 'bg-accent-brand/10 text-accent-brand'
                : 'text-neutral-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
            }`}
            title="Info Cuaca"
          >
            <CloudRain className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => {
              setActiveMobileTab('settings');
              setMobileMenuOpen(true);
            }}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors shrink-0 ${
              mobileMenuOpen && activeMobileTab === 'settings'
                ? 'bg-accent-brand/10 text-accent-brand'
                : 'text-neutral-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
            }`}
            title="Pengaturan Peta"
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE Control Center Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-[1250] sm:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* MOBILE Control Center Drawer Sheet */}
      <div className={`fixed bottom-0 left-0 right-0 z-[1300] bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800 rounded-t-3xl p-5 flex flex-col gap-4 shadow-2xl transition-transform duration-300 sm:hidden pointer-events-auto max-h-[75vh] overflow-y-auto
        ${mobileMenuOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* Handle bar */}
        <div className="flex justify-center mb-1 shrink-0">
          <div className="w-8 h-1 bg-neutral-300 dark:bg-neutral-600 rounded-full" />
        </div>

        {/* Tab Headers */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-neutral-800 pb-2.5 shrink-0">
          <div className="flex gap-1 bg-gray-50 dark:bg-neutral-850 p-1 rounded-xl">
            <button
              onClick={() => setActiveMobileTab('weather')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeMobileTab === 'weather'
                  ? 'bg-accent-brand text-white'
                  : 'text-neutral-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              Cuaca
            </button>
            {currentUser && savedLocs.length > 0 && (
              <button
                onClick={() => setActiveMobileTab('locations')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeMobileTab === 'locations'
                    ? 'bg-accent-brand text-white'
                    : 'text-neutral-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                Lokasi
              </button>
            )}
            <button
              onClick={() => setActiveMobileTab('settings')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeMobileTab === 'settings'
                  ? 'bg-accent-brand text-white'
                  : 'text-neutral-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Peta
            </button>
          </div>
          <Button
            onClick={() => setMobileMenuOpen(false)}
            variant="ghost"
            size="sm"
            className="h-8 px-2.5 rounded-xl text-neutral-500 hover:text-neutral-700"
          >
            Tutup
          </Button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto min-h-0 pt-2 custom-scrollbar">
          {activeMobileTab === 'weather' && (
            <OpenMeteoCard
              weather={weather}
              loading={weatherLoading}
              error={weatherError}
              latitude={activeWeatherCoords[0]}
              longitude={activeWeatherCoords[1]}
              locationName={locationName}
              customThresholds={currentUser ? alertConfig : null}
            />
          )}

          {activeMobileTab === 'locations' && currentUser && savedLocs.length > 0 && (
            <MultiLocationWeather
              weatherData={multiWeatherData}
              loading={multiWeatherLoading}
              onLocationClick={(lat, lng, name) => {
                handleDashboardLocationClick(lat, lng, name);
                setMobileMenuOpen(false);
              }}
            />
          )}

          {activeMobileTab === 'settings' && (
            <div className="flex flex-col gap-4.5 pb-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Gaya Peta</span>
                <MapStyleSelector />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Skema Warna Radar</span>
                <ColorSchemePicker inline />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Transparansi Lapisan</span>
                <OpacitySlider />
              </div>
              {currentUser && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Konfigurasi Peringatan Cuaca</span>
                  <AlertThresholdEditor alertConfig={alertConfig} onSave={updateAlertConfig} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* DESKTOP: vertical panel */}
      <div className="hidden sm:flex absolute bottom-4 left-4 sm:right-auto sm:max-w-[280px] z-[1100] flex-col gap-2.5 pointer-events-auto">
        <Legend layerType={layerType} />
        <div className="flex flex-wrap items-center gap-2">
          <MapStyleSelector />
          <LayerToggle />
          <ColorSchemePicker />
          {currentUser && (
            <AlertThresholdEditor alertConfig={alertConfig} onSave={updateAlertConfig} />
          )}
        </div>
        <OpacitySlider />
      </div>
    </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Page;
