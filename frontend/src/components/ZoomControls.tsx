import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  zoomLevel: number;
  minZoom: number;
  maxZoom: number;
}

const ZoomControls = ({ onZoomIn, onZoomOut, zoomLevel, minZoom, maxZoom }: ZoomControlsProps) => {
  return (
    <div className="flex items-center space-x-1 bg-white rounded-md shadow-sm border border-gray-200">
      <button
        onClick={onZoomOut}
        disabled={zoomLevel <= minZoom}
        className="p-1.5 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4 text-gray-600" />
      </button>
      <div className="text-xs text-gray-600 font-medium px-2 border-l border-r border-gray-200">
        {Math.round(zoomLevel * 100)}%
      </div>
      <button
        onClick={onZoomIn}
        disabled={zoomLevel >= maxZoom}
        className="p-1.5 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
};

export default ZoomControls;