import React from 'react';
import { ClimateSelector } from './ClimateSelector';
import { YearSlider } from './YearSlider';
import { LayerToggle } from './LayerToggle';
import { useUIStore } from '../../store/uiStore';

export const ControlPanel: React.FC = () => {
  const { leftPanelOpen, setLeftPanelOpen } = useUIStore();

  return (
    <>
      {/* Collapse toggle */}
      <button
        onClick={() => setLeftPanelOpen(!leftPanelOpen)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-[1001] bg-white border border-gray-200
                   rounded-r-md px-1 py-3 shadow-md text-gray-500 hover:text-primary-600 transition-colors"
        style={{ left: leftPanelOpen ? '320px' : '0px' }}
        aria-label={leftPanelOpen ? 'Collapse control panel' : 'Expand control panel'}
        title={leftPanelOpen ? 'Collapse' : 'Expand'}
      >
        {leftPanelOpen ? '‹' : '›'}
      </button>

      {leftPanelOpen && (
        <aside className="w-80 h-full bg-white border-r border-gray-200 shadow-md flex flex-col overflow-hidden z-[1000]">
          {/* Header */}
          <div className="px-5 py-4 bg-primary-700 text-white flex-shrink-0">
            <h1 className="text-base font-bold tracking-tight leading-tight">
              Groundwater SDSS
            </h1>
            <p className="text-xs text-primary-200 mt-0.5">
              Ethiopia – Ministry of Water & Energy
            </p>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
            <section>
              <h2 className="text-xs font-semibold text-primary-700 uppercase tracking-widest mb-3">
                Climate Scenario
              </h2>
              <div className="space-y-3">
                <ClimateSelector />
                <YearSlider />
              </div>
            </section>

            <hr className="border-gray-100" />

            <section>
              <h2 className="text-xs font-semibold text-primary-700 uppercase tracking-widest mb-3">
                Map Layers
              </h2>
              <LayerToggle />
            </section>

            <hr className="border-gray-100" />

            {/* GWP Suitability Legend */}
            <section>
              <h2 className="text-xs font-semibold text-primary-700 uppercase tracking-widest mb-3">
                GWP Suitability
              </h2>
              <ul className="space-y-1.5 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-green-500 flex-shrink-0" />
                  <span className="text-gray-700">High Potential</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-yellow-400 flex-shrink-0" />
                  <span className="text-gray-700">Moderate Potential</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-red-500 flex-shrink-0" />
                  <span className="text-gray-700">Low Potential</span>
                </li>
              </ul>
            </section>
          </div>
        </aside>
      )}
    </>
  );
};
