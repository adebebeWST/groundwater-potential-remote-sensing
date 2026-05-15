import React from 'react';
import type { GWPSuitability } from '../../types';
import { GWP_COLORS } from '../../types';

export const MapLegend: React.FC = () => {
  const items: { suitability: GWPSuitability; label: string }[] = [
    { suitability: 'high',     label: 'High Potential'     },
    { suitability: 'moderate', label: 'Moderate Potential' },
    { suitability: 'low',      label: 'Low Potential'      }
  ];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-white rounded-lg shadow-md px-4 py-2 flex gap-4 text-xs">
      {items.map(item => (
        <div key={item.suitability} className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-full inline-block flex-shrink-0"
            style={{ backgroundColor: GWP_COLORS[item.suitability] }}
          />
          <span className="text-gray-700">{item.label}</span>
        </div>
      ))}
    </div>
  );
};
