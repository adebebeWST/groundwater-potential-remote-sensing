import { useEffect, useCallback } from 'react';
import { useMapStore } from '../store/mapStore';
import { useScenarioStore } from '../store/scenarioStore';
import type { ScenarioId, ScenarioYear, LayerVisibility } from '../types';

/**
 * Syncs the current map state (viewport, layers, scenario, year) with the URL
 * query string so users can copy and share the link to restore the exact view.
 */
export function useUrlState() {
  const viewport      = useMapStore(s => s.viewport);
  const layers        = useMapStore(s => s.layers);
  const setCenter     = useMapStore(s => s.setCenter);
  const setLayerVisibility = useMapStore(s => s.setLayerVisibility);
  const scenarioId    = useScenarioStore(s => s.scenarioId);
  const year          = useScenarioStore(s => s.year);
  const setScenario   = useScenarioStore(s => s.setScenario);
  const setYear       = useScenarioStore(s => s.setYear);

  // Read state from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lat  = parseFloat(params.get('lat')  ?? '');
    const lng  = parseFloat(params.get('lng')  ?? '');
    const zoom = parseInt  (params.get('zoom') ?? '');
    const sc   = params.get('scenario') as ScenarioId | null;
    const yr   = parseInt  (params.get('year') ?? '') as ScenarioYear;
    const layerStr = params.get('layers');

    if (!isNaN(lat) && !isNaN(lng)) setCenter(lat, lng, isNaN(zoom) ? undefined : zoom);
    if (sc && ['ssp126', 'ssp245', 'ssp370', 'ssp585'].includes(sc)) setScenario(sc);
    if ([2030, 2050, 2080].includes(yr)) setYear(yr);
    if (layerStr) {
      const activeIds = layerStr.split(',');
      const update: Partial<LayerVisibility> = {
        gwp_map:         activeIds.includes('gwp_map'),
        candidate_areas: activeIds.includes('candidate_areas'),
        boreholes:       activeIds.includes('boreholes'),
        ves_points:      activeIds.includes('ves_points'),
        uncertainty:     activeIds.includes('uncertainty')
      };
      setLayerVisibility(update);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build the shareable URL from current state
  const buildShareUrl = useCallback((): string => {
    const params = new URLSearchParams({
      lat:      viewport.center.lat.toFixed(6),
      lng:      viewport.center.lng.toFixed(6),
      zoom:     String(viewport.zoom),
      scenario: scenarioId,
      year:     String(year),
      layers:   Object.entries(layers)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(',')
    });
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }, [viewport, layers, scenarioId, year]);

  // Update URL whenever relevant state changes (without causing a reload)
  useEffect(() => {
    const url = buildShareUrl();
    window.history.replaceState(null, '', url);
  }, [buildShareUrl]);

  return { buildShareUrl };
}
