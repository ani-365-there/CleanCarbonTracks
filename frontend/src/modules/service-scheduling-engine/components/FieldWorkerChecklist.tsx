'use client';

import React, { useState } from 'react';
import { Truck, Navigation, CheckCircle2, Circle, MapPin, Phone } from 'lucide-react';
import { ServiceBookingItem } from '../types';

interface FieldWorkerChecklistProps {
  bookings: ServiceBookingItem[];
  workerName?: string;
  vehicleUnitCode?: string;
  className?: string;
}

export const FieldWorkerChecklist: React.FC<FieldWorkerChecklistProps> = ({
  bookings: initialBookings,
  workerName = 'Ramesh Kumar',
  vehicleUnitCode = 'UNIT-KA-05-9214',
  className = '',
}) => {
  const [tasks, setTasks] = useState(
    initialBookings.map((b, idx) => ({
      ...b,
      stopSeq: idx + 1,
      isDone: b.status === 'completed',
    }))
  );

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isDone: !t.isDone } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.isDone).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100) || 0;

  return (
    <div className={`max-w-2xl mx-auto space-y-6 ${className}`}>
      {/* Mobile Manifest Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-900 text-white p-6 rounded-3xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Truck className="w-6 h-6 text-green-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Field Route Terminal — {vehicleUnitCode}</h2>
              <p className="text-xs text-green-200">Operator: {workerName} • Duty Active</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-green-400/20 border border-green-300/40 rounded-full text-xs font-mono text-green-300">
            ONLINE
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 pt-2 border-t border-emerald-700/60">
          <div className="flex justify-between text-xs font-medium">
            <span>Route Manifest Progress</span>
            <span className="text-green-300 font-bold">
              {completedCount} / {tasks.length} stops ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-emerald-950 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="glass-panel p-6 rounded-3xl border border-green-100 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-emerald-600" /> Service Stops Queue
          </h3>
          <span className="text-xs text-gray-500">Tap to toggle fulfillment</span>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                task.isDone
                  ? 'bg-emerald-50/60 border-emerald-200 opacity-75'
                  : 'bg-white border-gray-200 hover:border-emerald-400 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                <button type="button" className="mt-0.5 text-emerald-600 focus:outline-none">
                  {task.isDone ? (
                    <CheckCircle2 className="w-6 h-6 fill-emerald-600 text-white" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </button>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      Stop #{task.stopSeq}
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        task.isDone ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}
                    >
                      {task.customerName}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="truncate max-w-[260px] sm:max-w-md">{task.contactAddress}</span>
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] font-semibold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                      {task.categoryId}
                    </span>
                    {task.specialNotes && (
                      <span className="text-[11px] text-gray-500 italic">“{task.specialNotes}”</span>
                    )}
                  </div>
                </div>
              </div>

              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-lg">
                {task.isDone ? 'Fulfilled' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
