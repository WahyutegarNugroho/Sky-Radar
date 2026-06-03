import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MAP_TILES, MARKER_ICON_CONFIG, MAP_MIN_ZOOM } from '@/utils/constants';
import RadarLayer from './RadarLayer'; // Fix for default Leaflet icon urls (webpack/Next.js import)
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png'; const DefaultIcon = L.icon({ iconUrl: typeof markerIcon === 'object' ? markerIcon.src : markerIcon, shadowUrl: typeof markerShadow === 'object' ? markerShadow.src : markerShadow, iconSize: MARKER_ICON_CONFIG.size, iconAnchor: MARKER_ICON_CONFIG.anchor, popupAnchor: MARKER_ICON_CONFIG.popupAnchor
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
  onMapStateChange, onMapClick, userLocation, selectedLocation, layerType, locationName
}) {
  const activeTile = MAP_TILES[mapStyle] || MAP_TILES.dark;
  const maxZoomLimit = mapStyle === 'satellite' ? 22 : 18;
  const safeZoom = Math.min(zoom, maxZoomLimit);

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
              <div className="text-xs font-semibold text-neutral-800">{locationName || 'Titik Koordinat Terpilih'}</div>
            </Popup>
          </Marker>
        )}
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
  locationName: PropTypes.string
};
MapView.defaultProps = {
  host: '',
  activeList: [],
  userLocation: null,
  selectedLocation: null,
  onMapClick: null,
  locationName: ''
};
export default MapView;
