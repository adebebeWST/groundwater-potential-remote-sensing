import { useMapStore } from '../store/mapStore';
import type { LayerVisibility } from '../types';

/**
 * Convenience hook wrapping the layer visibility state and toggle action.
 */
export function useLayerVisibility() {
  const layers = useMapStore(s => s.layers);
  const toggleLayer = useMapStore(s => s.toggleLayer);
  const setLayerVisibility = useMapStore(s => s.setLayerVisibility);

  const isVisible = (layer: keyof LayerVisibility) => layers[layer];

  const showOnly = (layer: keyof LayerVisibility) => {
    const newLayers = Object.fromEntries(
      Object.keys(layers).map(k => [k, k === layer])
    ) as LayerVisibility;
    setLayerVisibility(newLayers);
  };

  return { layers, isVisible, toggleLayer, setLayerVisibility, showOnly };
}
