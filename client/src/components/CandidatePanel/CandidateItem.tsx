import React from 'react';
import type { CandidateArea } from '../../types';
import { useMapStore } from '../../store/mapStore';
import { useUIStore } from '../../store/uiStore';

interface CandidateItemProps {
  area: CandidateArea;
}

export const CandidateItem: React.FC<CandidateItemProps> = ({ area }) => {
  const setCenter = useMapStore(s => s.setCenter);
  const { selectedCandidateId, setSelectedCandidateId } = useUIStore();

  const isSelected = selectedCandidateId === area.id;

  const handleClick = () => {
    setSelectedCandidateId(isSelected ? null : area.id);
    // Zoom to candidate area centroid if geometry is available
    if (area.geom?.coordinates) {
      // Simple centroid estimation (first coordinate ring)
      const coords = (area.geom.coordinates as number[][][])[0]?.[0];
      if (coords && Array.isArray(coords) && coords.length >= 2) {
        setCenter(coords[1] as number, coords[0] as number, 12);
      }
    }
  };

  return (
    <li>
      <button
        onClick={handleClick}
        className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors ${
          isSelected
            ? 'bg-primary-50 border border-primary-200 text-primary-800'
            : 'hover:bg-gray-50 text-gray-700'
        }`}
        aria-pressed={isSelected}
      >
        <div className="flex items-start justify-between gap-2">
          <span className="font-medium leading-snug">
            {area.woreda_name ?? `Area #${area.id}`}
          </span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${
            area.confidence >= 75 ? 'bg-green-100 text-green-700' :
            area.confidence >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
          }`}>
            {area.confidence}%
          </span>
        </div>
        <div className="mt-1 text-xs text-gray-500 flex gap-3">
          {area.avg_yield_lps != null && (
            <span>Yield: {area.avg_yield_lps} L/s</span>
          )}
          {area.borehole_count > 0 && (
            <span>{area.borehole_count} borehole{area.borehole_count !== 1 ? 's' : ''}</span>
          )}
          {area.area_km2 != null && (
            <span>{area.area_km2} km²</span>
          )}
        </div>
      </button>
    </li>
  );
};
