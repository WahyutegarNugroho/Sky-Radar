import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MAP_TILES, MARKER_ICON_CONFIG, MAP_MIN_ZOOM } from '@/utils/constants';
import RadarLayer from './RadarLayer'; // Fix for default Leaflet icon urls (webpack/Next.js import)
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png'; const DefaultIcon = L.icon({ iconUrl: typeof markerIcon === 'object' ? markerIcon.src : markerIcon, shadowUrl: typeof markerShadow === 'object' ? markerShadow.src : markerShadow, iconSize: MARKER_ICON_CONFIG.size, iconAnchor: MARKER_ICON_CONFIG.anchor, popupAnchor: MARKER_ICON_CONFIG.popupAnchor
}); const bookmarkIcon = L.divIcon({
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -14],
  html: '<div style="width:20px;height:20px;background:#3b82f6;border:2px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><polygon points="12 2 15 9 22 9 16 14 18 22 12 17 6 22 8 14 2 9 9 9"/></svg></div>',
});
L.Marker.prototype.options.icon = DefaultIcon;
function ChangeView({ center, zoom, mapStyle }) {
  const map = useMap();
  const lat = center?.[0];
  const lng = center?.[1];

  useEffect(() => {
    const isSatellite = mapStyle === 'satellite';
    const nextMaxZoom = isSatellite ? 22 : 18;
    map.setMaxZoom(nextMaxZoom);
    
    // CRITICAL: Leaflet does NOT auto-zoom out when setMaxZoom is called.
    // If the map is currently at zoom 20 and maxZoom becomes 18, we must force-zoom out to 18.
    if (map.getZoom() > nextMaxZoom) {
      map.setZoom(nextMaxZoom);
    }
  }, [mapStyle, map]);

  useEffect(() => {
    if (lat !== undefined && lng !== undefined) {
      const currentCenter = map.getCenter();
      const currentZoom = map.getZoom();
      const latDiff = Math.abs(currentCenter.lat - lat);
      const lngDiff = Math.abs(currentCenter.lng - lng);
      
      const isSatellite = mapStyle === 'satellite';
      const targetZoom = Math.min(zoom, isSatellite ? 22 : 18);
      
      if (latDiff > 0.0005 || lngDiff > 0.0005 || currentZoom !== targetZoom) {
        map.setView([lat, lng], targetZoom, { animate: true, duration: 1 });
      }
    }
  }, [lat, lng, zoom, map, mapStyle]);

  return null;
}
ChangeView.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  zoom: PropTypes.number.isRequired,
  mapStyle: PropTypes.string.isRequired,
};

// Helper component to track drag, zoom and click events to save preferences
function MapEventsListener({ onStateChange, onMapClick }) { const map = useMap(); useEffect(() =>{ const handleMoveEnd = () =>{ const center = map.getCenter(); onStateChange([center.lat, center.lng], map.getZoom()); }; const handleMapClick = (e) =>{ if (onMapClick) { onMapClick([e.latlng.lat, e.latlng.lng]); } }; map.on('moveend', handleMoveEnd); map.on('click', handleMapClick); return () =>{ map.off('moveend', handleMoveEnd); map.off('click', handleMapClick); }; }, [map, onStateChange, onMapClick]); return null;
} MapEventsListener.propTypes = { onStateChange: PropTypes.func.isRequired, onMapClick: PropTypes.func,
}; function MapView({
  center, zoom, mapStyle, opacity, colorSchemeId, host, activeList, currentIndex,
  onMapStateChange, onMapClick, userLocation, selectedLocation, layerType, locationName, savedLocs,
  currentUser, onSaveLocation
}) {
  const activeTile = MAP_TILES[mapStyle] || MAP_TILES.dark;
  const maxZoomLimit = mapStyle === 'satellite' ? 22 : 18;
  const safeZoom = Math.min(zoom, maxZoomLimit);

  const isAlreadySaved = selectedLocation && savedLocs?.some(loc => {
    const dLat = Math.abs(loc.lat - selectedLocation[0]);
    const dLng = Math.abs(loc.lng - selectedLocation[1]);
    return dLat < 0.0001 && dLng < 0.0001;
  });

  return (
    <div className="relative w-full h-full bg-white overflow-hidden">
      <MapContainer
        center={center}
        zoom={safeZoom}
        minZoom={MAP_MIN_ZOOM}
        maxZoom={maxZoomLimit}
        zoomControl={false}
        className="w-full h-full"
        style={{ background: '#f0f0f0' }}
      >
        <ChangeView center={center} zoom={safeZoom} mapStyle={mapStyle} />
        <MapEventsListener onStateChange={onMapStateChange} onMapClick={onMapClick} />
        {/* Base Map Tile */}
        <TileLayer
          key={`base-${mapStyle}`}
          url={activeTile.url}
          attribution={activeTile.attribution}
          maxNativeZoom={activeTile.maxNative}
          maxZoom={maxZoomLimit}
        />
        {/* Label Overlay for Satellite mode */}
        {mapStyle === 'satellite' && (
          <TileLayer
            key="satellite-label"
            url={MAP_TILES.satellite_label.url}
            attribution={MAP_TILES.satellite_label.attribution}
            maxNativeZoom={MAP_TILES.satellite_label.maxNative}
            maxZoom={22}
          />
        )}
        {/* User GPS Marker */}
        {userLocation && (
          <Marker position={userLocation} icon={DefaultIcon}>
            <Popup>
              <div className="text-xs font-semibold text-neutral-800">Lokasi Anda Saat Ini</div>
            </Popup>
          </Marker>
        )}
        {/* Clicked/Selected Location Marker */}
        {selectedLocation && (
          <Marker position={selectedLocation} icon={DefaultIcon}>
            <Popup>
              <div className="flex flex-col gap-2 p-1 min-w-[140px] text-neutral-800 dark:text-neutral-100">
                <span className="text-xs font-bold leading-tight">{locationName || 'Titik Koordinat Terpilih'}</span>
                {currentUser && (
                  isAlreadySaved ? (
                    <Button
                      disabled
                      size="sm"
                      className="h-7 text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 rounded-lg px-2.5 flex items-center gap-1.5 font-medium border border-neutral-200 dark:border-neutral-700/50"
                    >
                      <Check className="w-3 h-3 text-emerald-500" /> Tersimpan
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onSaveLocation(locationName || 'Lokasi Terpilih', selectedLocation)}
                      size="sm"
                      className="h-7 text-[10px] bg-accent-brand hover:brightness-110 text-white rounded-lg px-2.5 flex items-center gap-1.5 font-medium cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Simpan Lokasi
                    </Button>
                  )
                )}
              </div>
            </Popup>
          </Marker>
        )}
        {/* Saved Bookmarks Markers */}
        {savedLocs?.map((loc) => (
          <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={bookmarkIcon}>
            <Popup>
              <div className="flex flex-col gap-1 min-w-[120px]">
                <div className="text-xs font-semibold text-neutral-800">{loc.name}</div>
                <div className="text-[10px] text-neutral-500">{loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</div>
              </div>
            </Popup>
          </Marker>
        ))}
        {/* Radar/Satellite Overlay Layer */}
        {(layerType === 'satellite' || (host && activeList && activeList.length > 0)) && (
          <RadarLayer
            host={host}
            radarList={activeList}
            currentIndex={currentIndex}
            opacity={opacity}
            colorSchemeId={colorSchemeId}
            layerType={layerType}
          />
        )}
      </MapContainer>
    </div>
  );
}
MapView.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  zoom: PropTypes.number.isRequired,
  mapStyle: PropTypes.oneOf(['dark', 'light', 'satellite']).isRequired,
  opacity: PropTypes.number.isRequired,
  colorSchemeId: PropTypes.number.isRequired,
  host: PropTypes.string,
  activeList: PropTypes.array,
  currentIndex: PropTypes.number.isRequired,
  onMapStateChange: PropTypes.func.isRequired,
  onMapClick: PropTypes.func,
  userLocation: PropTypes.arrayOf(PropTypes.number),
  selectedLocation: PropTypes.arrayOf(PropTypes.number),
  layerType: PropTypes.string.isRequired,
  locationName: PropTypes.string,
  savedLocs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    lat: PropTypes.number,
    lng: PropTypes.number,
  })),
  currentUser: PropTypes.object,
  onSaveLocation: PropTypes.func,
};
MapView.defaultProps = {
  host: '',
  activeList: [],
  userLocation: null,
  selectedLocation: null,
  onMapClick: null,
  locationName: '',
  savedLocs: [],
  currentUser: null,
  onSaveLocation: null,
};
export default MapView;
