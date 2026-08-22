'use client';

import React, { useState, useEffect } from 'react';
import { Truck, Navigation, BatteryCharging, Zap, Gauge, CheckCircle, RefreshCw, Radio } from 'lucide-react';
import { Vehicle } from '@/lib/types';

interface FleetMapProps {
  vehicles: Vehicle[];
}

export const FleetMap: React.FC<FleetMapProps> = ({ vehicles }) => {
  const [activeVehicleId, setActiveVehicleId] = useState<string>(vehicles[0]?.id || 'VEH-01');
  const [simulatedVehicles, setSimulatedVehicles] = useState<Vehicle[]>(vehicles);
  const [pulseCount, setPulseCount] = useState(0);

  // Live simulation tick to update vehicle positions/progress
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedVehicles((prev) =>
        prev.map((v) => {
          if (v.status === 'active' || v.status === 'en_route') {
            const nextStops =
              v.currentStopsCompleted < v.totalStops
                ? v.currentStopsCompleted + (Math.random() > 0.6 ? 1 : 0)
                : v.currentStopsCompleted;
            return {
              ...v,
              currentStopsCompleted: nextStops,
              batteryOrFuelPercent: Math.max(15, v.batteryOrFuelPercent - (Math.random() > 0.7 ? 1 : 0)),
            };
          }
          return v;
        })
      );
      setPulseCount((c) => c + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const selectedVehicle = simulatedVehicles.find((v) => v.id === activeVehicleId) || simulatedVehicles[0];

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-green-100 shadow-xl transition-all duration-300">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-700">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Fleet Tracking & AI Route Optimization</h3>
            <p className="text-sm text-gray-500">Live GPS telemetry and dynamic fuel saving algorithm</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-800">
          <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>GPS Refresh: Pulse #{pulseCount}</span>
        </div>
      </div>

      {/* Optimization Telemetry Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-900 text-white rounded-2xl p-5 mb-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10">
          <Truck className="w-48 h-48" />
        </div>
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="sm:border-r border-emerald-700/60 sm:pr-4">
            <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">AI Route Optimization</span>
            <p className="text-2xl font-black mt-1 text-emerald-100 flex items-center justify-center sm:justify-start gap-1">
              <Zap className="w-6 h-6 text-yellow-400" /> Active Dynamic
            </p>
            <p className="text-xs text-emerald-200/80 mt-0.5">Automated congestion avoidance</p>
          </div>
          <div className="sm:border-r border-emerald-700/60 sm:pr-4">
            <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">Fleet Fuel Saved</span>
            <p className="text-2xl font-black mt-1 text-green-300">
              {selectedVehicle?.fuelSavedPercent || 15}%
            </p>
            <p className="text-xs text-emerald-200/80 mt-0.5">Vs standard static route schedules</p>
          </div>
          <div>
            <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">Time Saved</span>
            <p className="text-2xl font-black mt-1 text-teal-300">
              {selectedVehicle?.timeSavedPercent || 20}%
            </p>
            <p className="text-xs text-emerald-200/80 mt-0.5">Faster doorstep turnaround</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Radar Simulation Canvas */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 relative min-h-[340px] flex flex-col justify-between border border-slate-800 shadow-inner overflow-hidden">
          {/* Grid lines background */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* Radar center circle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <div className="w-64 h-64 border border-green-500 rounded-full animate-ping duration-1000 opacity-20" />
            <div className="w-48 h-48 border border-green-400 rounded-full" />
            <div className="w-24 h-24 border border-green-300 rounded-full" />
          </div>

          <div className="relative z-10 flex justify-between items-start">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-slate-800/90 text-green-400 border border-green-500/40">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              SECTOR GRID: ZONE 01 - BENGALURU NORTH
            </span>
            <span className="text-xs font-mono text-slate-400">FPS: 60 | GPS LOCK: 3/3 TRUCKS</span>
          </div>

          {/* Interactive Vehicle Nodes in Map */}
          <div className="relative z-10 my-8 flex items-center justify-around">
            {simulatedVehicles.map((v, i) => {
              const isSelected = v.id === activeVehicleId;
              return (
                <div
                  key={v.id}
                  onClick={() => setActiveVehicleId(v.id)}
                  className={`cursor-pointer group flex flex-col items-center transition-all ${
                    isSelected ? 'scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition ${
                      isSelected
                        ? 'bg-green-500 text-white ring-4 ring-green-400/40 animate-radar'
                        : 'bg-slate-800 text-green-400 border border-slate-700'
                    }`}
                  >
                    <Truck className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono text-white mt-2 font-bold px-2 py-0.5 bg-slate-800 rounded">
                    {v.code.split('-')[1] || v.id}
                  </span>
                  <span className="text-[10px] text-green-400 font-mono">
                    {v.currentStopsCompleted}/{v.totalStops} stops
                  </span>
                </div>
              );
            })}
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-between text-xs text-slate-400 bg-slate-800/80 p-3 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Active en-route</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>Optimized waypoint queue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Municipal Transfer Station</span>
            </div>
          </div>
        </div>

        {/* Selected Vehicle Telemetry Card */}
        {selectedVehicle && (
          <div className="bg-white/90 rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-start pb-3 border-b border-gray-100">
                <div>
                  <span className="text-xs font-mono text-green-600 font-bold">{selectedVehicle.code}</span>
                  <h4 className="text-base font-bold text-gray-900">{selectedVehicle.driverName}</h4>
                  <p className="text-xs text-gray-500">{selectedVehicle.zone}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-green-100 text-green-800 border border-green-200">
                  {selectedVehicle.status}
                </span>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-gray-700 mb-1">
                    <span>Route Completion</span>
                    <span>
                      {selectedVehicle.currentStopsCompleted} / {selectedVehicle.totalStops} ({Math.round(
                        (selectedVehicle.currentStopsCompleted / selectedVehicle.totalStops) * 100
                      )}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(selectedVehicle.currentStopsCompleted / selectedVehicle.totalStops) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                  <span className="text-gray-600 flex items-center gap-1.5">
                    <BatteryCharging className="w-4 h-4 text-emerald-600" /> Battery / Fuel Level:
                  </span>
                  <span className="font-bold text-gray-900">{selectedVehicle.batteryOrFuelPercent}%</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                  <span className="text-gray-600 flex items-center gap-1.5">
                    <Gauge className="w-4 h-4 text-emerald-600" /> Route Fuel Saved:
                  </span>
                  <span className="font-bold text-emerald-700">{selectedVehicle.fuelSavedPercent}%</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-green-600" /> Verified GPS Tracking
              </span>
              <button
                onClick={() => {
                  setSimulatedVehicles((prev) =>
                    prev.map((v) =>
                      v.id === selectedVehicle.id
                        ? { ...v, currentStopsCompleted: Math.min(v.totalStops, v.currentStopsCompleted + 1) }
                        : v
                    )
                  );
                }}
                className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 hover:underline"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Next Stop
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
