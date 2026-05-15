import { useMapStore } from '../store/mapStore';
import { mapService } from '../services/mapService';
import { useUIStore } from '../store/uiStore';
import type { LeafletMouseEvent } from 'leaflet';

/**
 * Returns a handler for Leaflet map click events that fetches
 * feature info at the clicked coordinates and stores it in mapStore.
 */
export function useMapClick() {
  const setSelectedFeature = useMapStore(s => s.setSelectedFeature);
  const setLoading = useUIStore(s => s.setLoading);
  const setError = useUIStore(s => s.setError);

  const handleMapClick = async (e: LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    setLoading(true);
    setError(null);
    try {
      const feature = await mapService.getFeatureInfo(lat, lng);
      setSelectedFeature(feature);
    } catch {
      setError('Failed to load feature information. Please try again.');
      setSelectedFeature(null);
    } finally {
      setLoading(false);
    }
  };

  return { handleMapClick };
}
