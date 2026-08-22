import React from 'react';
import { Zap, Truck, ShieldCheck, Gauge, Clock } from 'lucide-react';
import { FleetTelemetryAggregate } from '../types';

interface FleetTelemetryBannerProps {
  telemetry: FleetTelemetryAggregate;
  className?: string;
}

export const FleetTelemetryBanner: React.FC<FleetTelemetryBannerProps> = ({
  telemetry,
  className = '',
}) => {
  return (
    <div className={`bg-gradient-to-r from-emerald-900 via-green-900 to-teal-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden ${className}`}>
      <div className="absolute right-0 top-0 translate-x-8 -translate-y-6 opacity-10 pointer-events-none">
        <Truck className="w-56 h-56" />
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-4 gap-6 text-center sm:text-left">
        <div className="sm:border-r border-emerald-800/80 sm:pr-4">
          <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">AI Route Optimization</span>
          <p className="text-2xl font-black mt-1 text-emerald-100 flex items-center justify-center sm:justify-start gap-1.5">
            <Zap className="w-6 h-6 text-yellow-400" /> Active Dynamic
          </p>
          <p className="text-xs text-emerald-200/80 mt-0.5">Automated congestion & detour bypass</p>
        </div>

        <div className="sm:border-r border-emerald-800/80 sm:pr-4">
          <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">Fleet Fuel Saved</span>
          <p className="text-2xl font-black mt-1 text-green-300 flex items-center justify-center sm:justify-start gap-1.5">
            <Gauge className="w-6 h-6 text-green-400" /> {telemetry.averageFuelSavedPercent}%
          </p>
          <p className="text-xs text-emerald-200/80 mt-0.5">Vs standard fixed-loop routing</p>
        </div>

        <div className="sm:border-r border-emerald-800/80 sm:pr-4">
          <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">Turnaround Time Saved</span>
          <p className="text-2xl font-black mt-1 text-teal-300 flex items-center justify-center sm:justify-start gap-1.5">
            <Clock className="w-6 h-6 text-teal-400" /> {telemetry.averageTimeSavedPercent}%
          </p>
          <p className="text-xs text-emerald-200/80 mt-0.5">Reduced idle waiting at collection gates</p>
        </div>

        <div>
          <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">Active Units Online</span>
          <p className="text-2xl font-black mt-1 text-white flex items-center justify-center sm:justify-start gap-1.5">
            <ShieldCheck className="w-6 h-6 text-emerald-400" /> {telemetry.activeUnitsCount} Units Active
          </p>
          <p className="text-xs text-emerald-200/80 mt-0.5">
            {telemetry.totalCompletedStops} / {telemetry.totalRouteStops} stops completed
          </p>
        </div>
      </div>
    </div>
  );
};
