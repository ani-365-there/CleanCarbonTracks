'use client';

import React, { useState } from 'react';
import { BookOpen, Check, X, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

export const WasteKnowledgeBase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('plastic');

  const categories = [
    { id: 'plastic', label: '♻️ Plastics & Polymers' },
    { id: 'organic', label: '🌱 Wet & Organic' },
    { id: 'paper', label: '📄 Paper & Cartons' },
    { id: 'metal', label: '⚙️ Metals & Cans' },
    { id: 'ewaste', label: '⚡ E-Waste & Batteries' },
    { id: 'hazardous', label: '☣️ Hazardous & Medical' },
  ];

  const guideDetails: Record<
    string,
    {
      title: string;
      bin: string;
      binClass: string;
      dos: string[];
      donts: string[];
      lifecycleFact: string;
    }
  > = {
    plastic: {
      title: 'Plastics, PET Bottles, Rigid & Flexible Packaging',
      bin: 'Blue Dry Waste Bin',
      binClass: 'bg-blue-100 text-blue-800 border-blue-300',
      dos: [
        'Rinse beverage bottles and milk sachets cleanly',
        'Flatten plastic packaging to save container space',
        'Group small bottle caps inside large containers',
      ],
      donts: [
        'Never burn plastic — produces carcinogenic smoke',
        'Do not mix with food or wet oil residues',
        'Avoid single-use thermocol / polystyrene cups',
      ],
      lifecycleFact: 'Recycling 1 ton of plastic saves ~5,774 kWh of energy and 16.3 barrels of petroleum.',
    },
    organic: {
      title: 'Kitchen Scraps, Cooked Leftovers, Garden Foliage',
      bin: 'Green Wet Waste Bin',
      binClass: 'bg-green-100 text-green-800 border-green-300',
      dos: [
        'Place in breathable compost bins or aerated containers',
        'Mix carbon browns (dry leaves) with nitrogen greens (fruit peels)',
        'Collect vegetable trimmings separately for biogas feed',
      ],
      donts: [
        'Never put plastic bags or cling wrap in the wet bin',
        'Do not throw chemically treated wood or synthetic chemicals',
        'Avoid letting liquid pool at the bottom for more than 48 hours',
      ],
      lifecycleFact: 'Composted organic waste reduces methane emissions by over 90% compared to open landfills.',
    },
    paper: {
      title: 'Cardboard Cartons, Books, Newspapers, Kraft Bags',
      bin: 'Blue Dry Waste Bin',
      binClass: 'bg-blue-100 text-blue-800 border-blue-300',
      dos: [
        'Flatten all e-commerce courier boxes before pickup',
        'Tie stacks of newspapers securely with biodegradable twine',
        'Keep shredded documents in a neat paper bag',
      ],
      donts: [
        'Do not recycle greasy pizza boxes or oil-stained paper',
        'Avoid waxed or plastic-laminated heat-sealed thermal receipts',
        'Never discard wet tissues or soiled napkins in the paper stream',
      ],
      lifecycleFact: 'Every ton of paper recycled saves 17 mature trees and 7,000 gallons of clean water.',
    },
    metal: {
      title: 'Beverage Cans, Food Tins, Aluminum Trays, Foil',
      bin: 'Yellow Recyclable Bin',
      binClass: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      dos: [
        'Rinse sauce or soup residues completely with warm water',
        'Fold sharp edges of tin cans inwards to protect waste handlers',
        'Ball up clean aluminum foil pieces together',
      ],
      donts: [
        'Do not include pressurized paint or chemical aerosol cans without venting',
        'Avoid mixing heavy industrial scrap with household tin collections',
      ],
      lifecycleFact: 'Recycled aluminum saves 95% of the energy needed to produce new metal from bauxite ore.',
    },
    ewaste: {
      title: 'Lithium Batteries, Old Phones, Chargers, PC Parts',
      bin: 'Special Red / Designated E-Drop Bin',
      binClass: 'bg-red-100 text-red-800 border-red-300',
      dos: [
        'Tape lithium-ion battery terminals to prevent short-circuit sparks',
        'Back up and factory reset personal storage devices',
        'Drop off at certified municipality e-waste centers',
      ],
      donts: [
        'Never toss batteries into household garbage bins',
        'Do not attempt to crush or puncture swollen battery cells',
      ],
      lifecycleFact: '1 million recycled mobile phones recover 35,000 lbs of copper and 772 lbs of silver.',
    },
    hazardous: {
      title: 'Sanitary Waste, Syringes, Expired Medicines, Solvents',
      bin: 'Red Hazardous Bio-Bin',
      binClass: 'bg-rose-100 text-rose-800 border-rose-300',
      dos: [
        'Wrap sanitary pads and diapers in newspaper marked with a red dot',
        'Store broken glass or blades inside a rigid punctured-proof plastic bottle',
        'Hand over biomedical items directly to designated municipal sanitation staff',
      ],
      donts: [
        'Never flush unused medicines or chemicals down the toilet',
        'Do not mix sharps with dry recyclable plastic streams',
      ],
      lifecycleFact: 'Strict biomedical isolation prevents severe water table contamination and pathogen exposure.',
    },
  };

  const active = guideDetails[selectedCategory] || guideDetails.plastic;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-green-100 shadow-xl transition-all duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-2xl text-blue-700">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Know Your Waste Knowledge Hub</h3>
          <p className="text-sm text-gray-500">Comprehensive municipal rules and best segregation practices</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto pb-2 mb-6 space-x-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Active Category Content Card */}
      <div className="p-6 rounded-2xl bg-white/90 border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <h4 className="text-lg font-bold text-gray-900">{active.title}</h4>
            <p className="text-xs text-gray-500 mt-0.5">Recommended Municipal Segregation Standard</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${active.binClass}`}>
            Target: {active.bin}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DOs */}
          <div className="bg-green-50/70 border border-green-200/80 rounded-2xl p-4">
            <h5 className="text-sm font-bold text-green-900 flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-green-200 text-green-800 flex items-center justify-center text-xs">✓</span>
              Recommended Best Practices (DO)
            </h5>
            <ul className="space-y-2 text-xs text-green-900">
              {active.dos.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* DONTs */}
          <div className="bg-red-50/70 border border-red-200/80 rounded-2xl p-4">
            <h5 className="text-sm font-bold text-red-900 flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-red-200 text-red-800 flex items-center justify-center text-xs">✕</span>
              Avoid & Prohibited (DON&apos;T)
            </h5>
            <ul className="space-y-2 text-xs text-red-900">
              {active.donts.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Fact Footer */}
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 flex items-center gap-3 text-xs text-emerald-900">
          <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p>
            <strong>Eco Fact:</strong> {active.lifecycleFact}
          </p>
        </div>
      </div>
    </div>
  );
};
