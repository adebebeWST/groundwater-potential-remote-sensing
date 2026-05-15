import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useMapStore } from '../../store/mapStore';
import { useLayerVisibility } from '../../hooks/useLayerVisibility';
import { useMapClick } from '../../hooks/useMapClick';
import { MapLegend } from './MapLegend';
import { LocationPopup } from './LocationPopup';

// Fix Leaflet default marker icons for Vite/bundler environments
delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

/** Syncs Leaflet map viewport with the Zustand store */
const ViewportSync: React.FC = () => {
  const setViewport = useMapStore(s => s.setViewport);
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      setViewport({ center: { lat: center.lat, lng: center.lng }, zoom });
    }
  });
  return null;
};

/** Handles map click to fetch feature info */
const ClickHandler: React.FC = () => {
  const { handleMapClick } = useMapClick();
  useMapEvents({ click: handleMapClick });
  return null;
};

/** Programmatically flies to viewport.center when selectedCandidateId changes */
const FlyController: React.FC = () => {
  const viewport = useMapStore(s => s.viewport);
  const map = useMap();
  const prevCenter = useRef(viewport.center);

  useEffect(() => {
    if (
      prevCenter.current.lat !== viewport.center.lat ||
      prevCenter.current.lng !== viewport.center.lng
    ) {
      map.flyTo([viewport.center.lat, viewport.center.lng], viewport.zoom, { duration: 1.2 });
      prevCenter.current = viewport.center;
    }
  }, [map, viewport]);

  return null;
};

export const MapView: React.FC = () => {
  const viewport = useMapStore(s => s.viewport);
  const { layers } = useLayerVisibility();

  const tileBase = import.meta.env.VITE_RASTER_TILE_BASE_URL ?? 'https://tiles.example.com';

  return (
    <div className="relative flex-1 h-full">
      <MapContainer
        center={[viewport.center.lat, viewport.center.lng]}
        zoom={viewport.zoom}
        className="w-full h-full"
        zoomControl
      >
        {/* OpenStreetMap basemap */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={19}
        />

        {/* GWP Map raster overlay */}
        {layers.gwp_map && (
          <TileLayer
            url={`${tileBase}/gwp/{z}/{x}/{y}.png`}
            opacity={0.75}
            attribution="GWP Map"
          />
        )}

        {/* Uncertainty overlay */}
        {layers.uncertainty && (
          <TileLayer
            url={`${tileBase}/uncertainty/{z}/{x}/{y}.png`}
            opacity={0.55}
            attribution="Uncertainty Layer"
          />
        )}

        <ViewportSync />
        <ClickHandler />
        <FlyController />
      </MapContainer>

      {/* Floating overlays (outside MapContainer so they render above the map) */}
      <LocationPopup />
      <MapLegend />
    </div>
  );
};
