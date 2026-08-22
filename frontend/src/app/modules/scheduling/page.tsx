'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarCheck, ShieldCheck, User, Truck, AlertTriangle } from 'lucide-react';
import {
  ServiceBookingForm,
  IncidentReportForm,
  AdminDispatchQueue,
  FieldWorkerChecklist,
  initialBookingsState,
  initialIncidentsState,
  defaultWasteSchedulingConfig,
} from '@/modules/service-scheduling-engine';
import { ServiceBookingItem, IncidentReport } from '@/modules/service-scheduling-engine/types';

export default function SchedulingModulePage() {
  const [activeSubTab, setActiveSubTab] = useState<'booking' | 'dispatch' | 'worker' | 'incidents'>('booking');
  const [bookings, setBookings] = useState<ServiceBookingItem[]>(initialBookingsState);
  const [incidents, setIncidents] = useState<IncidentReport[]>(initialIncidentsState);

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
          <span className="text-xs font-mono font-semibold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200">
            ENTERPRISE SCHEDULING INFRASTRUCTURE
          </span>
        </div>

        {/* Commercial Banner */}
        <div className="bg-gradient-to-r from-green-800 via-emerald-800 to-teal-900 text-white p-8 rounded-3xl shadow-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-mono text-emerald-200 border border-white/20">
            <CalendarCheck className="w-3.5 h-3.5" /> MODULE 3: SERVICE SCHEDULING & INCIDENT MANAGEMENT
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Multi-Role On-Demand Booking & Dispatch Infrastructure
          </h1>
          <p className="text-emerald-100 text-sm max-w-2xl leading-relaxed">
            End-to-end appointment lifecycle management: customer booking portal, incident ticketing, administrative dispatch desk, and mobile field worker checklist.
          </p>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-white/90 p-2 rounded-2xl border border-gray-200 shadow-sm text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('booking')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeSubTab === 'booking' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Customer Booking View
          </button>
          <button
            onClick={() => setActiveSubTab('dispatch')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeSubTab === 'dispatch' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Operations Dispatch Desk
          </button>
          <button
            onClick={() => setActiveSubTab('worker')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeSubTab === 'worker' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Truck className="w-3.5 h-3.5" /> Mobile Field Worker Terminal
          </button>
          <button
            onClick={() => setActiveSubTab('incidents')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeSubTab === 'incidents' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Incident Ticketing
          </button>
        </div>

        {/* Active Component View */}
        <div className="animate-fadeIn">
          {activeSubTab === 'booking' && (
            <div className="max-w-2xl mx-auto">
              <ServiceBookingForm
                config={defaultWasteSchedulingConfig}
                onBookingSubmitted={(b) => setBookings((prev) => [b, ...prev])}
              />
            </div>
          )}

          {activeSubTab === 'dispatch' && (
            <AdminDispatchQueue
              bookings={bookings}
              incidents={incidents}
              onStatusChanged={setBookings}
              onIncidentResolved={setIncidents}
            />
          )}

          {activeSubTab === 'worker' && (
            <FieldWorkerChecklist bookings={bookings} />
          )}

          {activeSubTab === 'incidents' && (
            <div className="max-w-2xl mx-auto">
              <IncidentReportForm onIncidentLogged={(inc) => setIncidents((prev) => [inc, ...prev])} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
