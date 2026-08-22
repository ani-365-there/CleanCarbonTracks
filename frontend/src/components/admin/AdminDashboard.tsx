'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Clock, Truck, Users, AlertCircle, RefreshCw, Filter } from 'lucide-react';
import { PickupRequest, Vehicle, Complaint } from '@/lib/types';

interface AdminDashboardProps {
  pickups: PickupRequest[];
  vehicles: Vehicle[];
  complaints: Complaint[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  pickups: initialPickups,
  vehicles,
  complaints: initialComplaints,
}) => {
  const [pickups, setPickups] = useState<PickupRequest[]>(initialPickups);
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [filterType, setFilterType] = useState<string>('all');

  const togglePickupStatus = (id: string) => {
    setPickups((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus =
            p.status === 'scheduled' ? 'in_progress' : p.status === 'in_progress' ? 'completed' : 'scheduled';
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  const resolveComplaint = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'resolved' as const } : c))
    );
  };

  const filteredPickups = filterType === 'all' ? pickups : pickups.filter((p) => p.status === filterType);

  const getStatusBadge = (status: PickupRequest['status']) => {
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
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-green-100 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-700 rounded-2xl text-white">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">Municipal Command & Control Dashboard</h2>
              <p className="text-sm text-gray-500">Live operational oversight, fleet dispatch, and ward tickets</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-semibold text-gray-400 uppercase">Operational Zone</span>
              <p className="text-sm font-bold text-gray-800">Zone-04 Central Metro</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          </div>
        </div>
      </div>

      {/* Grid: Pickups Management & Complaints Resolution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pickup Dispatch Queue */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-green-100 shadow-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600" /> Doorstep Collection Requests
              </h3>
              <p className="text-xs text-gray-500">Click status to progress or reassign</p>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-gray-300 bg-white/90 outline-none"
              >
                <option value="all">All ({pickups.length})</option>
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredPickups.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-white/90 border border-gray-100 hover:border-emerald-200 transition shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {p.id}
                    </span>
                    <span className="text-sm font-bold text-gray-900">{p.name}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 capitalize">
                      {p.wasteType}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 truncate max-w-md">{p.address}</p>
                  {p.notes && <p className="text-[11px] text-gray-400 italic">“{p.notes}”</p>}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-xs text-gray-500">{p.preferredDate}</span>
                  <button
                    onClick={() => togglePickupStatus(p.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold uppercase border cursor-pointer transition hover:opacity-80 ${getStatusBadge(
                      p.status
                    )}`}
                  >
                    {p.status.replace('_', ' ')} ↻
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Complaints Panel */}
        <div className="glass-panel p-6 rounded-3xl border border-red-100 shadow-lg space-y-4">
          <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" /> Ward Grievance Queue
              </h3>
              <p className="text-xs text-gray-500">Citizen reported incidents</p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
              {complaints.filter((c) => c.status !== 'resolved').length} Open
            </span>
          </div>

          <div className="space-y-3">
            {complaints.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-2xl bg-white/90 border border-red-100 shadow-sm space-y-2 text-xs"
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-red-700">{c.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      c.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800 animate-pulse'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <p className="font-semibold text-gray-900">{c.name} — {c.issueType.replace('_', ' ')}</p>
                <p className="text-gray-600 text-[11px]">{c.description}</p>
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-gray-400 text-[10px] truncate max-w-[140px]">{c.address}</span>
                  {c.status !== 'resolved' ? (
                    <button
                      onClick={() => resolveComplaint(c.id)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold transition"
                    >
                      Resolve & Dispatch
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
