import React, { useState } from 'react';
import { useMapStore } from '../../store/mapStore';
import { useScenarioStore } from '../../store/scenarioStore';
import { useLayerVisibility } from '../../hooks/useLayerVisibility';
import { useUrlState } from '../../hooks/useUrlState';
import { reportService } from '../../services/reportService';
import { LoadingSpinner } from '../Shared/LoadingSpinner';

/**
 * Bottom action bar — Generate Report, Share, and loading indicator.
 */
export const ActionBar: React.FC = () => {
  const viewport    = useMapStore(s => s.viewport);
  const { layers }  = useLayerVisibility();
  const { scenarioId, year } = useScenarioStore();
  const { buildShareUrl }    = useUrlState();
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied]         = useState(false);

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const result = await reportService.generateReport({
        mapState: {
          center: viewport.center,
          zoom: viewport.zoom,
          layers: Object.entries(layers).filter(([, v]) => v).map(([k]) => k)
        },
        scenario: scenarioId,
        year
      });
      // In production this would trigger a PDF download
      alert(`Report generated!\nDownload URL: ${result.reportUrl}\n\nNote: In production, a PDF is generated via Puppeteer and emailed or downloaded.`);
    } catch {
      alert('Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleShare = async () => {
    const url = buildShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: open share URL in a new prompt
      window.prompt('Copy this shareable link:', url);
    }
  };

  return (
    <div className="h-12 bg-white border-t border-gray-200 flex items-center px-4 gap-3 z-[1000] flex-shrink-0">
      <button
        onClick={handleGenerateReport}
        disabled={generating}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary-600 text-white
                   rounded-md hover:bg-primary-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {generating ? <LoadingSpinner size="sm" /> : (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
        {generating ? 'Generating…' : 'Generate Report'}
      </button>

      <button
        onClick={handleShare}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700
                   rounded-md hover:bg-gray-200 transition-colors"
      >
        {copied ? (
          <>
            <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-600">Copied!</span>
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </>
        )}
      </button>

      <div className="ml-auto text-xs text-gray-400">
        Scenario: <span className="font-medium text-gray-600">{scenarioId.toUpperCase()}</span>
        {' | '}Year: <span className="font-medium text-gray-600">{year}</span>
        {' | '}Zoom: <span className="font-medium text-gray-600">{viewport.zoom}</span>
      </div>
    </div>
  );
};
