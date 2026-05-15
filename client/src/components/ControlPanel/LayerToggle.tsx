import React from 'react';
import { useLayerVisibility } from '../../hooks/useLayerVisibility';
import type { LayerVisibility } from '../../types';

interface LayerConfig {
  id: keyof LayerVisibility;
  label: string;
  description: string;
  color: string;
}

const LAYERS: LayerConfig[] = [
  { id: 'gwp_map',         label: 'GWP Map',          description: 'Groundwater potential raster',    color: 'bg-blue-500'   },
  { id: 'candidate_areas', label: 'Candidate Areas',   description: 'Priority 1–3 polygons',           color: 'bg-green-500'  },
  { id: 'boreholes',       label: 'Boreholes',          description: 'Borehole survey locations',       color: 'bg-yellow-500' },
  { id: 'ves_points',      label: 'VES Points',         description: 'Vertical electrical sounding',   color: 'bg-purple-500' },
  { id: 'uncertainty',     label: 'Uncertainty',        description: 'Model uncertainty overlay',       color: 'bg-orange-400' }
];

export const LayerToggle: React.FC = () => {
  const { layers, toggleLayer } = useLayerVisibility();

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
        Layer Control
      </label>
      <ul className="space-y-1.5">
        {LAYERS.map(layer => (
          <li key={layer.id}>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className={`w-3 h-3 rounded-sm flex-shrink-0 ${layer.color}`} />
              <input
                type="checkbox"
                checked={layers[layer.id]}
                onChange={() => toggleLayer(layer.id)}
                className="sr-only"
                aria-label={`Toggle ${layer.label} layer`}
              />
              <div
                className={`flex-1 text-sm ${
                  layers[layer.id] ? 'text-gray-800 font-medium' : 'text-gray-400'
                }`}
              >
                <span>{layer.label}</span>
                <span className="block text-xs text-gray-400 font-normal leading-tight">
                  {layer.description}
                </span>
              </div>
              {/* Visual toggle switch */}
              <div
                className={`w-8 h-4 rounded-full transition-colors flex-shrink-0 ${
                  layers[layer.id] ? 'bg-primary-600' : 'bg-gray-200'
                }`}
                onClick={() => toggleLayer(layer.id)}
                role="switch"
                aria-checked={layers[layer.id]}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && toggleLayer(layer.id)}
              >
                <div
                  className={`w-3 h-3 rounded-full bg-white shadow-sm transform transition-transform mt-0.5 ${
                    layers[layer.id] ? 'translate-x-4 ml-0.5' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};
