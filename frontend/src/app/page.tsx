'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MetricsGrid } from '@/components/analytics/MetricsGrid';
import { getTranslation } from '@/lib/i18n';

// 🚀 Generalized Modular Engines
import {
  ClassificationWidget,
  TaxonomyKnowledgeBase,
  wasteTaxonomy,
} from '@/modules/classification-engine';

import {
  FleetRadarCanvas,
  FleetTelemetryBanner,
  VehicleUnitCard,
  initialFleetData,
  computeFleetAggregate,
  simulateFleetTick,
} from '@/modules/fleet-radar-engine';

import {
  ServiceBookingForm,
  IncidentReportForm,
  AdminDispatchQueue,
  FieldWorkerChecklist,
  defaultWasteSchedulingConfig,
  initialBookingsState,
  initialIncidentsState,
} from '@/modules/service-scheduling-engine';
import { ServiceBookingItem, IncidentReport } from '@/modules/service-scheduling-engine/types';

import { mockAnalytics } from '@/lib/mockData';
import {
  Sparkles,
  ArrowRight,
  Layers,
  Cpu,
  Navigation,
  CalendarCheck,
  ExternalLink,
  ChevronRight,
  Shield,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>('resident');
  const [selectedLang, setSelectedLang] = useState<string>('en');
  const [bookings, setBookings] = useState<ServiceBookingItem[]>(initialBookingsState);
  const [incidents, setIncidents] = useState<IncidentReport[]>(initialIncidentsState);
  const [fleetUnits, setFleetUnits] = useState(initialFleetData);
  const [selectedUnitId, setSelectedUnitId] = useState(initialFleetData[0].id);
  const [metrics, setMetrics] = useState(mockAnalytics);

  // Live simulation tick for fleet movement
  useEffect(() => {
    const timer = setInterval(() => {
      setFleetUnits((prev) => simulateFleetTick(prev));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const fleetTelemetry = computeFleetAggregate(fleetUnits);
  const selectedVehicle = fleetUnits.find((u) => u.id === selectedUnitId) || fleetUnits[0];

  const handleBookingCreated = (newBooking: ServiceBookingItem) => {
    setBookings((prev) => [newBooking, ...prev]);
    setMetrics((prev) => ({
      ...prev,
      pickupsThisWeek: prev.pickupsThisWeek + 1,
      co2SavedKg: Number((prev.co2SavedKg + 1.2).toFixed(1)),
    }));
  };

  const t = getTranslation(selectedLang);

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen relative">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedLang={selectedLang}
        onLanguageChange={setSelectedLang}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 w-full flex-1">
        {/* Environmental Telemetry Header (Hidden in Modules Hub) */}
        {activeTab !== 'modules-hub' && <MetricsGrid metrics={metrics} selectedLang={selectedLang} />}

        {/* Tab 1: Resident Portal (Default Home) */}
        {activeTab === 'resident' && (
          <div className="space-y-12 animate-fadeIn">
            {/* Hero Card */}
            <div className="bg-gradient-to-r from-green-800 via-emerald-800 to-teal-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold border border-white/20 text-green-200">
                  <Sparkles className="w-4 h-4 text-green-300" /> {t.integratedSolution}
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  {t.heroTitle}
                </h2>
                <p className="text-green-100 text-sm sm:text-base leading-relaxed">
                  {t.heroSubtitle}
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => {
                      const el = document.getElementById('booking-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-white text-green-900 hover:bg-green-50 font-bold px-6 py-3 rounded-2xl text-sm transition shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    {t.schedulePickupBtn} <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('fleet')}
                    className="bg-green-700/60 hover:bg-green-700 text-white border border-green-400/30 font-semibold px-5 py-3 rounded-2xl text-sm transition backdrop-blur-md cursor-pointer"
                  >
                    {t.liveTruckRadarBtn}
                  </button>
                </div>
              </div>
            </div>

            {/* Resident Booking & Smart Categorizer Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="booking-section">
              <ServiceBookingForm
                config={defaultWasteSchedulingConfig}
                onBookingSubmitted={handleBookingCreated}
                selectedLang={selectedLang}
              />
              <ClassificationWidget config={wasteTaxonomy} selectedLang={selectedLang} />
            </div>

            {/* Fleet Radar Snapshot */}
            <div className="space-y-4">
              <FleetTelemetryBanner telemetry={fleetTelemetry} />
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
                    unit={selectedVehicle}
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
            </div>

            {/* Know Your Waste Knowledge Base */}
            <div>
              <TaxonomyKnowledgeBase config={wasteTaxonomy} />
            </div>
          </div>
        )}

        {/* Tab 2: Smart Categorizer Deep Dive */}
        {activeTab === 'categorizer' && (
          <div className="space-y-8 animate-fadeIn">
            <ClassificationWidget config={wasteTaxonomy} selectedLang={selectedLang} />
            <TaxonomyKnowledgeBase config={wasteTaxonomy} />
          </div>
        )}

        {/* Tab 3: Fleet Tracking Radar */}
        {activeTab === 'fleet' && (
          <div className="space-y-8 animate-fadeIn">
            <FleetTelemetryBanner telemetry={fleetTelemetry} />
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
                  unit={selectedVehicle}
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
          </div>
        )}

        {/* Tab 4: Citizen Grievance & Missed Pickup Report */}
        {activeTab === 'complaints' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
            <IncidentReportForm onIncidentLogged={(inc) => setIncidents((prev) => [inc, ...prev])} />
          </div>
        )}

        {/* Tab 5: Municipality Admin Dashboard */}
        {activeTab === 'admin' && (
          <div className="space-y-8 animate-fadeIn">
            <AdminDispatchQueue
              bookings={bookings}
              incidents={incidents}
              onStatusChanged={setBookings}
              onIncidentResolved={setIncidents}
            />
          </div>
        )}

        {/* Tab 6: Driver Mobile View */}
        {activeTab === 'driver' && (
          <div className="space-y-8 animate-fadeIn">
            <FieldWorkerChecklist bookings={bookings} />
          </div>
        )}

        {/* Tab 7: Enterprise Modular Engines Hub (Accessed via Bottom Button) */}
        {activeTab === 'modules-hub' && (
          <div className="space-y-10 animate-fadeIn">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-900 via-green-900 to-teal-950 text-white p-8 sm:p-10 rounded-3xl shadow-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-mono text-emerald-200 border border-white/20 mb-3">
                <Layers className="w-3.5 h-3.5" /> ENTERPRISE STANDALONE MODULES
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Pluggable Platform Engines
              </h2>
              <p className="text-emerald-100 text-sm max-w-2xl mt-2 leading-relaxed">
                Self-contained, production-grade micro-engines decoupled for independent licensing, distribution, and cross-team integration.
              </p>
            </div>

            {/* 3 Engine Showcase Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Module 1 */}
              <div className="glass-panel p-6 rounded-3xl border border-emerald-200 shadow-lg flex flex-col justify-between space-y-6 hover:shadow-xl transition">
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-700 w-fit">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Module 1: AI Classification-as-a-Service</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Universal domain item classifier with token matching, confidence estimation, and custom taxonomy handling for waste, inventory, and retail returns.
                  </p>
                </div>
                <Link
                  href="/modules/categorizer"
                  className="inline-flex items-center justify-between w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-3 rounded-xl transition shadow-md"
                >
                  <span>Launch Live Product View</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Module 2 */}
              <div className="glass-panel p-6 rounded-3xl border border-blue-200 shadow-lg flex flex-col justify-between space-y-6 hover:shadow-xl transition">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-100 rounded-2xl text-blue-700 w-fit">
                    <Navigation className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Module 2: Fleet Radar & Optimization</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Universal telemetry, dynamic route congestion avoidance, stop manifests, and live radar canvas tracking fuel & turnaround savings.
                  </p>
                </div>
                <Link
                  href="/modules/fleet"
                  className="inline-flex items-center justify-between w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-3 rounded-xl transition shadow-md"
                >
                  <span>Launch Live Product View</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Module 3 */}
              <div className="glass-panel p-6 rounded-3xl border border-amber-200 shadow-lg flex flex-col justify-between space-y-6 hover:shadow-xl transition">
                <div className="space-y-3">
                  <div className="p-3 bg-amber-100 rounded-2xl text-amber-700 w-fit">
                    <CalendarCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Module 3: Service Scheduling Infrastructure</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Universal multi-role appointment booking, incident escalation desk, operations dispatch queue, and mobile field worker checklist.
                  </p>
                </div>
                <Link
                  href="/modules/scheduling"
                  className="inline-flex items-center justify-between w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-3 rounded-xl transition shadow-md"
                >
                  <span>Launch Live Product View</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 🚀 Floating Bottom Access Button */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
        <button
          onClick={() => setActiveTab(activeTab === 'modules-hub' ? 'resident' : 'modules-hub')}
          className={`flex items-center gap-2.5 px-5 py-3.5 rounded-full shadow-2xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 transform hover:scale-105 border ${
            activeTab === 'modules-hub'
              ? 'bg-emerald-950 text-white border-emerald-600 ring-4 ring-emerald-500/30'
              : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white border-emerald-400/40 ring-4 ring-emerald-400/20'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-200 animate-pulse" />
          <span>{activeTab === 'modules-hub' ? 'Return to Application' : '⚡ Enterprise Modules Hub'}</span>
        </button>
      </div>

      <Footer />
    </div>
  );
}
