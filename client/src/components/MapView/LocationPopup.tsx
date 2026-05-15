import React from 'react';
import { useMapStore } from '../../store/mapStore';
import type { FeatureInfoResult } from '../../types';
import { GWP_COLORS, UNCERTAINTY_LABELS } from '../../types';

export const LocationPopup: React.FC = () => {
  const selectedFeature = useMapStore(s => s.selectedFeature);
  const setSelectedFeature = useMapStore(s => s.setSelectedFeature);

  if (!selectedFeature) return null;

  const f: FeatureInfoResult = selectedFeature;

  return (
    <div className="absolute top-4 right-4 z-[1002] w-72 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary-700 text-white">
        <h3 className="text-sm font-semibold">Location Info</h3>
        <button
          onClick={() => setSelectedFeature(null)}
          className="text-primary-200 hover:text-white transition-colors text-lg leading-none"
          aria-label="Close popup"
        >
          ×
        </button>
      </div>

      {/* Coordinates */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
        <p className="text-xs text-gray-500">
          {f.lat.toFixed(6)}°N, {f.lon.toFixed(6)}°E
          {f.woreda && (
            <span className="ml-1 font-medium text-gray-700">— {f.woreda}</span>
          )}
        </p>
      </div>

      <div className="px-4 py-3 space-y-2.5">
        {f.gwp_suitability ? (
          <>
            {/* GWP Suitability */}
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: GWP_COLORS[f.gwp_suitability] }}
              />
              <span className="text-sm font-medium text-gray-800 capitalize">
                {f.gwp_suitability} Groundwater Potential
              </span>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 rounded-md px-3 py-2">
                <span className="block text-gray-500">Yield Estimate</span>
                <span className="font-semibold text-gray-800">
                  {f.yield_lps != null ? `${f.yield_lps} L/s` : '—'}
                </span>
              </div>
              <div className="bg-gray-50 rounded-md px-3 py-2">
                <span className="block text-gray-500">Confidence</span>
                <span className="font-semibold text-gray-800">
                  {f.confidence != null ? `${f.confidence}%` : '—'}
                </span>
              </div>
              <div className="bg-gray-50 rounded-md px-3 py-2">
                <span className="block text-gray-500">Depth</span>
                <span className="font-semibold text-gray-800">
                  {f.depth_m != null ? `${f.depth_m} m` : '—'}
                </span>
              </div>
              <div className="bg-gray-50 rounded-md px-3 py-2">
                <span className="block text-gray-500">Priority</span>
                <span className="font-semibold text-gray-800">
                  {f.priority != null ? `P${f.priority}` : '—'}
                </span>
              </div>
            </div>

            {/* Uncertainty category */}
            {f.uncertainty_category && (
              <div className="text-xs text-gray-600 bg-blue-50 rounded-md px-3 py-2">
                <span className="font-medium">Assessment: </span>
                {UNCERTAINTY_LABELS[f.uncertainty_category]}
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-500 text-center py-2">
            No groundwater data found at this location.
          </p>
        )}
      </div>
    </div>
  );
};
