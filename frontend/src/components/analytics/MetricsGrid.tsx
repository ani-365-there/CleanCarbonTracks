'use client';

import React from 'react';
import { CalendarCheck, Recycle, CloudRain, Truck, ShieldAlert } from 'lucide-react';
import { AnalyticsMetrics } from '@/lib/types';
import { getTranslation } from '@/lib/i18n';

interface MetricsGridProps {
  metrics: AnalyticsMetrics;
  selectedLang?: string;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics, selectedLang = 'en' }) => {
  const t = getTranslation(selectedLang);

  const cards = [
    {
      title: t.pickupsThisWeek,
      value: metrics.pickupsThisWeek,
      unit: 'Completed',
      icon: CalendarCheck,
      color: 'from-emerald-500 to-green-600',
      textColor: 'text-emerald-700',
      bgLight: 'bg-emerald-50',
      border: 'border-emerald-200',
      change: '+14% vs last week',
    },
    {
      title: t.wasteDiverted,
      value: `${metrics.wasteDivertedPercentage}%`,
      unit: t.fromLandfills,
      icon: Recycle,
      color: 'from-teal-500 to-cyan-600',
      textColor: 'text-teal-700',
      bgLight: 'bg-teal-50',
      border: 'border-teal-200',
      change: 'Target: 80% by Q4',
    },
    {
      title: t.co2Saved,
      value: `${metrics.co2SavedKg} kg`,
      unit: t.netOffset,
      icon: CloudRain,
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-700',
      bgLight: 'bg-blue-50',
      border: 'border-blue-200',
      change: 'Equivalent to 2.1 trees',
    },
    {
      title: t.activeSmartFleet,
      value: metrics.activeVehicles,
      unit: t.electricTrucks,
      icon: Truck,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-700',
      bgLight: 'bg-amber-50',
      border: 'border-amber-200',
      change: 'Avg ETA: 12 mins',
    },
  ];

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t.pulseTitle}</h2>
          <p className="text-sm text-gray-500">{t.pulseSubtitle}</p>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300">
          <span className="w-2 h-2 mr-1.5 bg-green-500 rounded-full animate-pulse"></span>
          {t.liveSync}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl bg-white/90 backdrop-blur-md border ${card.border} shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl ${card.bgLight} ${card.textColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {card.value}
                </span>
                <span className="text-xs font-medium text-gray-500">{card.unit}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center text-xs font-medium text-gray-500">
                <span>{card.change}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
