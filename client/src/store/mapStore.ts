import { create } from 'zustand';
import type { MapViewport, LayerVisibility, FeatureInfoResult } from '../types';

interface MapState {
  viewport: MapViewport;
  layers: LayerVisibility;
  selectedFeature: FeatureInfoResult | null;
  setViewport: (viewport: MapViewport) => void;
  setCenter: (lat: number, lng: number, zoom?: number) => void;
  toggleLayer: (layer: keyof LayerVisibility) => void;
  setLayerVisibility: (layers: Partial<LayerVisibility>) => void;
  setSelectedFeature: (feature: FeatureInfoResult | null) => void;
}

export const useMapStore = create<MapState>(set => ({
  viewport: {
    center: { lat: 9.03, lng: 38.74 }, // Addis Ababa, Ethiopia
    zoom: 10
  },
  layers: {
    gwp_map:         true,
    candidate_areas: true,
    boreholes:       true,
    ves_points:      false,
    uncertainty:     false
  },
  selectedFeature: null,

  setViewport: viewport => set({ viewport }),

  setCenter: (lat, lng, zoom) =>
    set(state => ({
      viewport: {
        center: { lat, lng },
        zoom: zoom ?? state.viewport.zoom
      }
    })),

  toggleLayer: layer =>
    set(state => ({
      layers: {
        ...state.layers,
        [layer]: !state.layers[layer]
      }
    })),

  setLayerVisibility: layers =>
    set(state => ({
      layers: { ...state.layers, ...layers }
    })),

  setSelectedFeature: selectedFeature => set({ selectedFeature })
}));
