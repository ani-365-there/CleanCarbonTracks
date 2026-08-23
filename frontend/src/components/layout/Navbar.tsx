'use client';

import React from 'react';
import { Truck, Home, Search, ShieldCheck, MapPin, AlertCircle, Globe } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedLang?: string;
  onLanguageChange?: (lang: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedLang = 'en',
  onLanguageChange,
}) => {
  const mainTabs = [
    { id: 'resident', label: 'Resident Portal', icon: Home },
    { id: 'categorizer', label: 'Smart Categorizer', icon: Search },
    { id: 'fleet', label: 'Fleet Radar', icon: MapPin },
    { id: 'complaints', label: 'Report Issue', icon: AlertCircle },
    { id: 'admin', label: 'Municipal Admin', icon: ShieldCheck },
    { id: 'driver', label: 'Driver View', icon: Truck },
  ];

  const languages = [
    { code: 'en', label: '🌐 English' },
    { code: 'hi', label: '🇮🇳 हिन्दी (Hindi)' },
    { code: 'ta', label: '🇮🇳 தமிழ் (Tamil)' },
    { code: 'te', label: '🇮🇳 తెలుగు (Telugu)' },
    { code: 'kn', label: '🇮🇳 ಕನ್ನಡ (Kannada)' },
    { code: 'mr', label: '🇮🇳 मराठी (Marathi)' },
    { code: 'bn', label: '🇮🇳 বাংলা (Bengali)' },
    { code: 'gu', label: '🇮🇳 ગુજરાતી (Gujarati)' },
    { code: 'ml', label: '🇮🇳 മലയാളം (Malayalam)' },
    { code: 'pa', label: '🇮🇳 ਪੰਜਾਬੀ (Punjabi)' },
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

          {/* Clean Desktop Navigation Tabs & Language Dropdown */}
          <div className="hidden md:flex items-center space-x-3">
            <nav className="flex space-x-1">
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

            {/* Vernacular Language Selector */}
            <div className="relative">
              <select
                value={selectedLang}
                onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)}
                className="bg-emerald-900/60 hover:bg-emerald-900 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-emerald-400/40 focus:outline-none focus:ring-2 focus:ring-emerald-300 cursor-pointer backdrop-blur-sm transition"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code} className="bg-emerald-900 text-white font-medium">
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
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
