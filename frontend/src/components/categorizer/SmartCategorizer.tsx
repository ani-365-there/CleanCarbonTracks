'use client';

import React, { useState } from 'react';
import { Search, Sparkles, AlertCircle, CheckCircle, Flame, Leaf, HelpCircle, ArrowRight } from 'lucide-react';
import { categorizeItem } from '@/lib/wasteRules';
import { categorizeWasteItem } from '@/lib/api';
import { WasteItemRule } from '@/lib/types';

interface SmartCategorizerProps {
  selectedLang?: string;
}

export const SmartCategorizer: React.FC<SmartCategorizerProps> = ({ selectedLang = 'en' }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<(WasteItemRule & { vernacular?: { category?: any; tip?: any } }) | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const sampleItems = [
    'Banana peel',
    'Plastic milk bottle',
    'Amazon cardboard box',
    'Old AAA battery',
    'Soda can',
    'Expired medicine blister pack',
  ];

  const [loading, setLoading] = useState(false);

  const handleCategorize = async (searchTerm?: string) => {
    const textToSearch = searchTerm || query;
    if (!textToSearch.trim()) return;

    setLoading(true);
    try {
      const data = await categorizeWasteItem(textToSearch, selectedLang);
      setResult({
        keywords: data.classification?.top?.matched || [],
        category: data.vernacular?.category?.translated_text || data.category,
        type: data.type,
        binColor: data.binColor,
        tip: data.vernacular?.tip?.translated_text || data.tip,
        co2SavingsKgPerKg: data.co2SavingsKgPerKg,
        vernacular: data.vernacular,
      });
    } catch (err) {
      const fallback = categorizeItem(textToSearch);
      setResult(fallback);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  // Automatically re-categorize and translate when user changes language dropdown
  React.useEffect(() => {
    if (query.trim() && hasSearched) {
      handleCategorize(query);
    }
  }, [selectedLang]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCategorize();
    }
  };

  const getBinBadge = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'red':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-green-100 shadow-xl transition-all duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-700">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">AI-Powered Smart Waste Categorizer</h3>
          <p className="text-sm text-gray-500">Instant segregation rules, bin mapping, and carbon offsets</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type any item (e.g. coffee grounds, bubble wrap, laptop charger)..."
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl border-2 border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none text-gray-800 font-medium bg-white/90 text-sm sm:text-base transition"
          />
          <Search className="w-5 h-5 text-emerald-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <button
            onClick={() => handleCategorize()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition shadow-sm"
          >
            Identify
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-gray-500">Try searching:</span>
          {sampleItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(item);
                handleCategorize(item);
              }}
              className="text-xs bg-white/80 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 px-2.5 py-1 rounded-lg border border-gray-200 hover:border-emerald-300 transition"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Search Result Display */}
        {hasSearched && result && (
          <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-white to-emerald-50/50 border border-emerald-200 shadow-md animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Identified Stream</span>
                <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  {result.category}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase ${getBinBadge(result.binColor)}`}>
                  {result.binColor} Bin Destination
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 bg-white/90 rounded-xl border border-emerald-100 flex items-start gap-3">
                <Leaf className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">
                    {result.tip}
                  </p>
                  {result.vernacular?.tip?.phonetic_romanized && result.vernacular?.tip?.phonetic_romanized !== result.tip && (
                    <p className="text-xs text-emerald-800 font-semibold mt-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 inline-block">
                      🗣️ Pronunciation: "{result.vernacular.tip.phonetic_romanized}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600 bg-emerald-100/40 p-3 rounded-xl">
                <div className="flex items-center gap-1.5 font-medium text-emerald-900">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>Carbon Offset potential: <strong>~{result.co2SavingsKgPerKg} kg CO₂ / kg recycled</strong></span>
                </div>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  100% Diverted from Landfill <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
