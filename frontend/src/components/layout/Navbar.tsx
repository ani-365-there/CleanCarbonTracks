'use client';

import React from 'react';
import { Truck, Home, Search, ShieldCheck, MapPin, AlertCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const mainTabs = [
    { id: 'resident', label: 'Resident Portal', icon: Home },
    { id: 'categorizer', label: 'Smart Categorizer', icon: Search },
    { id: 'fleet', label: 'Fleet Radar', icon: MapPin },
    { id: 'complaints', label: 'Report Issue', icon: AlertCircle },
    { id: 'admin', label: 'Municipal Admin', icon: ShieldCheck },
    { id: 'driver', label: 'Driver View', icon: Truck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-700 text-white shadow-md backdrop-blur-md bg-opacity-95 border-b border-emerald-600/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('resident')}
          >
            <div className="bg-white/15 group-hover:bg-white/25 p-2 sm:p-2.5 rounded-2xl backdrop-blur-sm border border-white/20 transition">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                CleanCarbon<span className="text-green-200">Tracks</span>
              </h1>
              <p className="text-[11px] text-green-100/90 font-medium hidden sm:block">
                Smart Municipal Waste & Circular Telematics
              </p>
            </div>
          </div>

          {/* Clean Desktop Navigation Tabs */}
          <nav className="hidden md:flex space-x-1">
            {mainTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-emerald-900 shadow-md font-bold'
                      : 'text-green-50 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-green-200'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Tab Bar */}
        <div className="flex md:hidden overflow-x-auto pb-2.5 pt-1 space-x-1.5 scrollbar-none">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition-all ${
                  isActive
                    ? 'bg-white text-emerald-900 shadow-sm font-bold'
                    : 'bg-emerald-900/40 text-green-100 hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
