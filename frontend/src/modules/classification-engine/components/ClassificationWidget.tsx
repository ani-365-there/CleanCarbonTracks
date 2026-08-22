'use client';

import React, { useState } from 'react';
import { Search, Sparkles, CheckCircle, Flame, Leaf, ArrowRight } from 'lucide-react';
import { TaxonomyConfig, ClassificationMatch } from '../types';
import { ClassificationEngine } from '../classifier';
import { wasteTaxonomy } from '../defaultTaxonomies';

interface ClassificationWidgetProps {
  config?: TaxonomyConfig;
  onClassified?: (match: ClassificationMatch) => void;
  className?: string;
}

export const ClassificationWidget: React.FC<ClassificationWidgetProps> = ({
  config = wasteTaxonomy,
  onClassified,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<ClassificationMatch | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const engine = new ClassificationEngine(config);

  const handleClassify = (text?: string) => {
    const queryToSearch = text || query;
    if (!queryToSearch.trim()) return;

    const match = engine.classify(queryToSearch);
    setResult(match);
    setHasSearched(true);
    if (onClassified) onClassified(match);
  };

  const getBadgeStyle = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'red':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'purple':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className={`glass-panel p-6 sm:p-8 rounded-3xl border border-green-100 shadow-xl transition-all ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-700">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{config.title || 'AI Classification Engine'}</h3>
          <p className="text-sm text-gray-500">{config.subtitle || 'Real-time multi-class item categorization'}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleClassify();
              }
            }}
            placeholder={config.searchPlaceholder || 'Type item name to classify...'}
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl border-2 border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none text-gray-800 font-medium bg-white/90 text-sm sm:text-base transition"
          />
          <Search className="w-5 h-5 text-emerald-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <button
            onClick={() => handleClassify()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition shadow-sm"
          >
            Identify
          </button>
        </div>

        {/* Suggestion tags */}
        {config.sampleQueries && config.sampleQueries.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-gray-500">Quick tests:</span>
            {config.sampleQueries.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(item);
                  handleClassify(item);
                }}
                className="text-xs bg-white/80 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 px-2.5 py-1 rounded-lg border border-gray-200 hover:border-emerald-300 transition"
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {/* Output Card */}
        {hasSearched && result && (
          <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-white to-emerald-50/50 border border-emerald-200 shadow-md animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Classification Result</span>
                <h4 className="text-lg font-bold text-gray-900">{result.matchedCategory.name}</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase ${getBadgeStyle(result.matchedCategory.badgeColor)}`}>
                  {result.matchedCategory.badgeLabel}
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-mono font-semibold">
                  {Math.round(result.confidence * 100)}% Match
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-white/90 rounded-xl border border-emerald-100 flex items-start gap-3">
                <Leaf className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 font-medium leading-relaxed">
                  {result.matchedCategory.handlingInstructions}
                </p>
              </div>

              {result.calculatedImpact && result.matchedCategory.impactMetricLabel && (
                <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600 bg-emerald-100/40 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 font-medium text-emerald-900">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span>{result.matchedCategory.impactMetricLabel}: <strong>~{result.calculatedImpact} kg CO₂ / kg processed</strong></span>
                  </div>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    Verified Stream Processed <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
