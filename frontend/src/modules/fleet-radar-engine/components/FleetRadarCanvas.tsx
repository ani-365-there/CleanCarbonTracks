'use client';

import React from 'react';
import { Truck, Radio, Zap } from 'lucide-react';
import { FleetUnit, FleetEngineConfig } from '../types';

interface FleetRadarCanvasProps {
  units: FleetUnit[];
  selectedUnitId?: string;
  onSelectUnit?: (unitId: string) => void;
  config?: FleetEngineConfig;
  className?: string;
}

export const FleetRadarCanvas: React.FC<FleetRadarCanvasProps> = ({
  units,
  selectedUnitId,
  onSelectUnit,
  config = { sectorName: 'NORTH ZONE SECTOR RADAR' },
  className = '',
}) => {
  return (
    <div className={`bg-slate-900 rounded-3xl p-6 relative min-h-[360px] flex flex-col justify-between border border-slate-800 shadow-2xl overflow-hidden ${className}`}>
      {/* Grid Pattern overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Pulsing Concentric Radar Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
        <div className="w-80 h-80 border border-green-500 rounded-full animate-ping duration-1000 opacity-20" />
        <div className="w-64 h-64 border border-green-400 rounded-full" />
        <div className="w-40 h-40 border border-green-300 rounded-full" />
        <div className="w-16 h-16 border border-green-200 rounded-full" />
      </div>

      {/* Top Telemetry Overlay */}
      <div className="relative z-10 flex flex-wrap justify-between items-start gap-2">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-slate-800/90 text-green-400 border border-green-500/40 shadow-sm backdrop-blur-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
          SECTOR: {config.sectorName.toUpperCase()}
        </span>
        <span className="text-xs font-mono text-slate-400 bg-slate-800/60 px-3 py-1 rounded-lg">
          GPS LOCK: {units.length}/{units.length} UNITS ONLINE
        </span>
      </div>

      {/* Moving Fleet Nodes */}
      <div className="relative z-10 my-10 flex items-center justify-around">
        {units.map((unit) => {
          const isSelected = unit.id === selectedUnitId;
          return (
            <div
              key={unit.id}
              onClick={() => onSelectUnit && onSelectUnit(unit.id)}
              className={`cursor-pointer group flex flex-col items-center transition-all duration-300 ${
                isSelected ? 'scale-115' : 'opacity-75 hover:opacity-100 hover:scale-105'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition duration-200 ${
                  isSelected
                    ? 'bg-green-500 text-white ring-4 ring-green-400/40 animate-radar'
                    : 'bg-slate-800 text-green-400 border border-slate-700'
                }`}
              >
                <Truck className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono text-white mt-2 font-bold px-2 py-0.5 bg-slate-800 rounded shadow">
                {unit.unitCode.split('-')[1] || unit.id}
              </span>
              <span className="text-[11px] text-green-400 font-mono">
                {unit.currentStopsCompleted}/{unit.totalStops} stops
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend Footer */}
      <div className="relative z-10 flex flex-wrap items-center justify-between text-xs text-slate-400 bg-slate-800/90 p-3 rounded-2xl backdrop-blur-md border border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Active In-Transit</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span>Dynamic Waypoints</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Central Depot Hub</span>
        </div>
      </div>
    </div>
  );
};
