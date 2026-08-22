'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Navigation, Radio, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import {
  FleetRadarCanvas,
  FleetTelemetryBanner,
  VehicleUnitCard,
  initialFleetData,
  computeFleetAggregate,
  simulateFleetTick,
} from '@/modules/fleet-radar-engine';

export default function FleetModulePage() {
  const [fleetUnits, setFleetUnits] = useState(initialFleetData);
  const [selectedUnitId, setSelectedUnitId] = useState(initialFleetData[0].id);

  useEffect(() => {
    const timer = setInterval(() => {
      setFleetUnits((prev) => simulateFleetTick(prev));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const telemetry = computeFleetAggregate(fleetUnits);
  const selectedUnit = fleetUnits.find((u) => u.id === selectedUnitId) || fleetUnits[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-slate-50 to-white text-gray-800 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950 bg-white/90 px-4 py-2 rounded-xl shadow-sm border border-emerald-100 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Application Hub
          </Link>
          <span className="flex items-center gap-2 text-xs font-mono font-semibold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" /> LIVE TELEMETRY ENGINE
          </span>
        </div>

        {/* Commercial Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-green-900 to-teal-950 text-white p-8 rounded-3xl shadow-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-mono text-emerald-200 border border-white/20">
            <Navigation className="w-3.5 h-3.5" /> MODULE 2: FLEET RADAR & ROUTE OPTIMIZATION
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Universal Fleet Radar & Route Optimization Engine
          </h1>
          <p className="text-emerald-100 text-sm max-w-2xl leading-relaxed">
            Scalable telemetry and radar visualization for moving vehicle fleets with dynamic waypoint tracking, battery monitoring, and fuel optimization telemetry.
          </p>
        </div>

        {/* Aggregate Banner */}
        <FleetTelemetryBanner telemetry={telemetry} />

        {/* Radar & Unit View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FleetRadarCanvas
              units={fleetUnits}
              selectedUnitId={selectedUnitId}
              onSelectUnit={setSelectedUnitId}
            />
          </div>
          <div>
            <VehicleUnitCard
              unit={selectedUnit}
              onAdvanceStop={(id) => {
                setFleetUnits((prev) =>
                  prev.map((u) =>
                    u.id === id
                      ? { ...u, currentStopsCompleted: Math.min(u.totalStops, u.currentStopsCompleted + 1) }
                      : u
                  )
                );
              }}
            />
          </div>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/90 p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Fuel Reduction
            </h4>
            <p className="text-xs text-gray-600">
              Demonstrates real-time 15%+ fuel efficiency gains by dynamic waypoint ordering and congestion avoidance.
            </p>
          </div>

          <div className="bg-white/90 p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Turnaround Speed
            </h4>
            <p className="text-xs text-gray-600">
              Cuts turnaround delays by 20% through synchronized arrival times and waypoint progress monitoring.
            </p>
          </div>

          <div className="bg-white/90 p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" /> Universal Telematics
            </h4>
            <p className="text-xs text-gray-600">
              Easily connects with any GPS device, IoT tracking collar, or driver mobile terminal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
