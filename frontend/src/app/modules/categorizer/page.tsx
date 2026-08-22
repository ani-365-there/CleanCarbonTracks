'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Cpu, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import {
  ClassificationWidget,
  TaxonomyKnowledgeBase,
  wasteTaxonomy,
  warehouseInventoryTaxonomy,
} from '@/modules/classification-engine';

export default function CategorizerModulePage() {
  const [selectedDomain, setSelectedDomain] = useState<'waste' | 'warehouse'>('waste');
  const activeTaxonomy = selectedDomain === 'waste' ? wasteTaxonomy : warehouseInventoryTaxonomy;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-slate-50 to-white text-gray-800 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950 bg-white/90 px-4 py-2 rounded-xl shadow-sm border border-emerald-100 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Application Hub
          </Link>

          <div className="flex items-center gap-2 bg-white/90 p-1.5 rounded-2xl border border-gray-200 shadow-sm text-xs font-semibold">
            <span className="px-2 text-gray-500">Live Taxonomy:</span>
            <button
              onClick={() => setSelectedDomain('waste')}
              className={`px-3 py-1.5 rounded-xl transition ${
                selectedDomain === 'waste'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🌱 Municipal Waste
            </button>
            <button
              onClick={() => setSelectedDomain('warehouse')}
              className={`px-3 py-1.5 rounded-xl transition ${
                selectedDomain === 'warehouse'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📦 Warehouse Inventory
            </button>
          </div>
        </div>

        {/* Commercial Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-8 rounded-3xl shadow-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-mono text-emerald-200 border border-white/20">
            <Cpu className="w-3.5 h-3.5" /> MODULE 1: AI CLASSIFICATION-AS-A-SERVICE
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Universal Item Classification & Routing Engine
          </h1>
          <p className="text-emerald-100 text-sm max-w-2xl leading-relaxed">
            Real-time multi-class item identification with confidence scoring, handling guidelines, and automated environmental impact metrics.
          </p>
        </div>

        {/* Live Interactive Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ClassificationWidget config={activeTaxonomy} />
          </div>

          {/* Value Props Card */}
          <div className="bg-white/90 rounded-3xl p-6 border border-emerald-100 shadow-md space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 text-base">Key Capabilities</h3>
              <ul className="space-y-3 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Multi-Domain Ready:</strong> Pluggable taxonomies for waste, logistics, and retail.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Instant Tokenization:</strong> Sub-millisecond keyword matching & confidence ranking.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Actionable Instructions:</strong> Returns exact bin destination & safety precautions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Carbon Offset Telemetry:</strong> Automatic CO₂ and energy mitigation multipliers.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 font-medium">
              <Zap className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Ready for seamless integration into any client portal.</span>
            </div>
          </div>
        </div>

        {/* Knowledge Hub */}
        <TaxonomyKnowledgeBase config={activeTaxonomy} />
      </div>
    </div>
  );
}
