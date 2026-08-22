'use client';

import React, { useState } from 'react';
import { BookOpen, Check, X, Sparkles } from 'lucide-react';
import { TaxonomyConfig } from '../types';
import { wasteTaxonomy } from '../defaultTaxonomies';

interface TaxonomyKnowledgeBaseProps {
  config?: TaxonomyConfig;
  className?: string;
}

export const TaxonomyKnowledgeBase: React.FC<TaxonomyKnowledgeBaseProps> = ({
  config = wasteTaxonomy,
  className = '',
}) => {
  const [selectedId, setSelectedId] = useState<string>(config.categories[0]?.id || '');

  const activeCategory = config.categories.find((c) => c.id === selectedId) || config.categories[0];

  if (!activeCategory) return null;

  return (
    <div className={`glass-panel p-6 sm:p-8 rounded-3xl border border-green-100 shadow-xl transition-all ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-2xl text-blue-700">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{config.taxonomyName} Knowledge Hub</h3>
          <p className="text-sm text-gray-500">Standard operating guidelines and segregation benchmarks</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto pb-2 mb-6 space-x-2 scrollbar-none">
        {config.categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedId(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              activeCategory.id === cat.id
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.name.split('(')[0].trim()}
          </button>
        ))}
      </div>

      {/* Detail Content */}
      <div className="p-6 rounded-2xl bg-white/90 border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <h4 className="text-lg font-bold text-gray-900">{activeCategory.name}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{activeCategory.handlingInstructions}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold border uppercase bg-emerald-50 text-emerald-800 border-emerald-300">
            {activeCategory.badgeLabel}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeCategory.dos && activeCategory.dos.length > 0 && (
            <div className="bg-green-50/70 border border-green-200/80 rounded-2xl p-4">
              <h5 className="text-sm font-bold text-green-900 flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-green-200 text-green-800 flex items-center justify-center text-xs">✓</span>
                Standard Protocol (DO)
              </h5>
              <ul className="space-y-2 text-xs text-green-900">
                {activeCategory.dos.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeCategory.donts && activeCategory.donts.length > 0 && (
            <div className="bg-red-50/70 border border-red-200/80 rounded-2xl p-4">
              <h5 className="text-sm font-bold text-red-900 flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-red-200 text-red-800 flex items-center justify-center text-xs">✕</span>
                Prohibited Actions (DON&apos;T)
              </h5>
              <ul className="space-y-2 text-xs text-red-900">
                {activeCategory.donts.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {activeCategory.lifecycleFact && (
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 flex items-center gap-3 text-xs text-emerald-900">
            <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p>
              <strong>Impact Fact:</strong> {activeCategory.lifecycleFact}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
