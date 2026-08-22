import React from 'react';
import { Leaf, Heart, Shield, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 bg-gradient-to-b from-gray-900 to-emerald-950 text-gray-300 py-12 border-t border-emerald-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2">
              <Leaf className="w-6 h-6 text-green-400" />
              <span className="text-xl font-bold text-white tracking-tight">CleanCarbonTracks</span>
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              Real-time municipal waste tracking, resident pickup scheduling, and carbon-reduction analytics. Designed to help cities achieve zero-landfill milestones.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-green-400 mb-3">Key Modules</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-green-300 cursor-pointer transition">Resident On-Demand Pickup</li>
              <li className="hover:text-green-300 cursor-pointer transition">AI Smart Waste Categorizer</li>
              <li className="hover:text-green-300 cursor-pointer transition">GPS Fleet Optimization</li>
              <li className="hover:text-green-300 cursor-pointer transition">Municipal Reporting Dashboard</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-green-400 mb-3">Impact Goals</h4>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" /> 100% Segregated Source Collection
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" /> 20%+ Route Fleet Fuel Reduction
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" /> Empowering Sanitation Heroes
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} CleanCarbonTracks. Open Source Eco-Tech Initiative.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Built with Next.js, React, Tailwind & TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
};
