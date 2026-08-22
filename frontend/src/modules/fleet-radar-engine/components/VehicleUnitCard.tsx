'use client';

import React from 'react';
import { BatteryCharging, Gauge, CheckCircle, RefreshCw, User, MapPin } from 'lucide-react';
import { FleetUnit } from '../types';

interface VehicleUnitCardProps {
  unit: FleetUnit;
  onAdvanceStop?: (unitId: string) => void;
  className?: string;
}

export const VehicleUnitCard: React.FC<VehicleUnitCardProps> = ({
  unit,
  onAdvanceStop,
  className = '',
}) => {
  const completionPercentage = Math.round((unit.currentStopsCompleted / unit.totalStops) * 100) || 0;

  const getStatusBadge = (status: FleetUnit['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'en_route':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'idle':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'charging':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  return (
    <div className={`bg-white/90 rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between space-y-4 ${className}`}>
      <div>
        <div className="flex justify-between items-start pb-3 border-b border-gray-100">
          <div>
            <span className="text-xs font-mono text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded">
              {unit.unitCode}
            </span>
            <h4 className="text-lg font-bold text-gray-900 mt-1 flex items-center gap-1.5">
              <User className="w-4 h-4 text-gray-400" /> {unit.operatorName}
            </h4>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400" /> {unit.assignedZone}
            </p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${getStatusBadge(unit.status)}`}>
            {unit.status.replace('_', ' ')}
          </span>
        </div>

        <div className="mt-4 space-y-3.5 text-xs">
          <div>
            <div className="flex justify-between font-semibold text-gray-700 mb-1.5">
              <span>Trip Progress</span>
              <span className="text-green-700 font-bold">
                {unit.currentStopsCompleted} / {unit.totalStops} stops ({completionPercentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
            <span className="text-gray-600 flex items-center gap-1.5">
              <BatteryCharging className="w-4 h-4 text-emerald-600" /> Fuel / Power Level:
            </span>
            <span className="font-bold text-gray-900">{unit.batteryOrFuelPercent}%</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100">
            <span className="text-emerald-800 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-emerald-600" /> AI Route Efficiency:
            </span>
            <span className="font-bold text-emerald-800">+{unit.metrics.fuelSavedPercent}% Saved</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-green-600" /> Live GPS Ping
        </span>
        {onAdvanceStop && (
          <button
            onClick={() => onAdvanceStop(unit.id)}
            className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 hover:underline"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Next Waypoint
          </button>
        )}
      </div>
    </div>
  );
};
