'use client';

import React, { useState } from 'react';
import { ShieldCheck, Truck, AlertCircle, Filter, CheckCircle2, RefreshCw } from 'lucide-react';
import { ServiceBookingItem, IncidentReport } from '../types';
import { getNextServiceStatus } from '../stateMachine';

interface AdminDispatchQueueProps {
  bookings: ServiceBookingItem[];
  incidents: IncidentReport[];
  onStatusChanged?: (updatedBookings: ServiceBookingItem[]) => void;
  onIncidentResolved?: (updatedIncidents: IncidentReport[]) => void;
  className?: string;
}

export const AdminDispatchQueue: React.FC<AdminDispatchQueueProps> = ({
  bookings: initialBookings,
  incidents: initialIncidents,
  onStatusChanged,
  onIncidentResolved,
  className = '',
}) => {
  const [bookings, setBookings] = useState<ServiceBookingItem[]>(initialBookings);
  const [incidents, setIncidents] = useState<IncidentReport[]>(initialIncidents);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const advanceBookingStatus = (id: string) => {
    const updated = bookings.map((b) => {
      if (b.id === id) {
        return { ...b, status: getNextServiceStatus(b.status) };
      }
      return b;
    });
    setBookings(updated);
    if (onStatusChanged) onStatusChanged(updated);
  };

  const resolveIncident = (id: string) => {
    const updated = incidents.map((inc) =>
      inc.id === id ? { ...inc, status: 'resolved' as const, resolvedAt: new Date().toISOString() } : inc
    );
    setIncidents(updated);
    if (onIncidentResolved) onIncidentResolved(updated);
  };

  const filteredBookings =
    statusFilter === 'all' ? bookings : bookings.filter((b) => b.status === statusFilter);

  const getStatusBadge = (status: ServiceBookingItem['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'in_progress':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bookings Queue */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-green-100 shadow-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600" /> Operational Service Queue
              </h3>
              <p className="text-xs text-gray-500">Live booking dispatch & status state machine</p>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-gray-300 bg-white/90 outline-none"
              >
                <option value="all">All Statuses ({bookings.length})</option>
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl bg-white/90 border border-gray-100 hover:border-emerald-200 transition shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {b.id}
                    </span>
                    <span className="text-sm font-bold text-gray-900">{b.customerName}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 capitalize">
                      {b.categoryId}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 truncate max-w-md">{b.contactAddress}</p>
                  {b.specialNotes && <p className="text-[11px] text-gray-400 italic">“{b.specialNotes}”</p>}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-xs text-gray-500 font-medium">{b.scheduledDate}</span>
                  <button
                    onClick={() => advanceBookingStatus(b.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold uppercase border cursor-pointer transition hover:opacity-80 flex items-center gap-1 ${getStatusBadge(
                      b.status
                    )}`}
                  >
                    <span>{b.status.replace('_', ' ')}</span>
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Queue */}
        <div className="glass-panel p-6 rounded-3xl border border-red-100 shadow-lg space-y-4">
          <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" /> Exception Desk
              </h3>
              <p className="text-xs text-gray-500">Citizen reported incidents</p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
              {incidents.filter((i) => i.status !== 'resolved').length} Active
            </span>
          </div>

          <div className="space-y-3">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="p-3.5 rounded-2xl bg-white/90 border border-red-100 shadow-sm space-y-2 text-xs"
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-red-700">{inc.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      inc.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800 animate-pulse'
                    }`}
                  >
                    {inc.status}
                  </span>
                </div>
                <p className="font-semibold text-gray-900">{inc.reporterName} — {inc.incidentType.replace('_', ' ')}</p>
                <p className="text-gray-600 text-[11px]">{inc.description}</p>
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-gray-400 text-[10px] truncate max-w-[130px]">{inc.location}</span>
                  {inc.status !== 'resolved' ? (
                    <button
                      onClick={() => resolveIncident(inc.id)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold transition"
                    >
                      Resolve
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
