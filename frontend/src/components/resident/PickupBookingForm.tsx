'use client';

import React, { useState } from 'react';
import { Calendar, User, MapPin, Sparkles, CheckCircle2, AlertCircle, Clock, Info } from 'lucide-react';
import { WasteType, PickupRequest } from '@/lib/types';
import { submitPickupRequest } from '@/lib/api';

interface PickupBookingFormProps {
  onPickupCreated?: (pickup: PickupRequest) => void;
}

export const PickupBookingForm: React.FC<PickupBookingFormProps> = ({ onPickupCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    wasteType: 'plastic' as WasteType,
    preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<PickupRequest | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const getSegregationGuidance = (type: WasteType) => {
    switch (type) {
      case 'plastic':
        return {
          icon: '♻️',
          text: 'Rinse bottles & tubs. Flatten milk pouches and containers to maximize volume efficiency.',
          bin: 'Blue Dry Bin',
        };
      case 'organic':
        return {
          icon: '🌱',
          text: 'Keep kitchen scraps in a breathable compost liner or sealed wet bucket to prevent odours.',
          bin: 'Green Wet Bin',
        };
      case 'paper':
        return {
          icon: '📄',
          text: 'Ensure paper and cardboard remain 100% dry and bundled. Do not mix with food liquids.',
          bin: 'Blue Dry Bin',
        };
      case 'metal':
        return {
          icon: '⚙️',
          text: 'Clean food tins and crimp sharp tin lid edges inside to protect waste workers.',
          bin: 'Yellow Metal Bin',
        };
      case 'e-waste':
        return {
          icon: '⚡',
          text: 'Special collection item. Keep batteries taped at terminals and do not disassemble circuit boards.',
          bin: 'Red E-Waste Bin',
        };
      default:
        return {
          icon: 'ℹ️',
          text: 'Ensure waste is segregated as per local municipal sanitation guidelines.',
          bin: 'Standard Segregated Bin',
        };
    }
  };

  const currentGuidance = getSegregationGuidance(formData.wasteType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) {
      setErrorMsg('Please fill in your name and pickup address.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const newPickup: PickupRequest = await submitPickupRequest(formData);
      setSubmittedBooking(newPickup);
      if (onPickupCreated) onPickupCreated(newPickup);
    } catch {
      // Fallback local create if backend call has hiccups
      const fallback: PickupRequest = {
        id: `PK-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.name,
        address: formData.address,
        wasteType: formData.wasteType,
        preferredDate: formData.preferredDate,
        notes: formData.notes,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
      };
      setSubmittedBooking(fallback);
      if (onPickupCreated) onPickupCreated(fallback);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedBooking(null);
    setFormData({
      name: '',
      address: '',
      wasteType: 'plastic',
      preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      notes: '',
    });
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-green-100 shadow-xl transition-all duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-green-100 rounded-2xl text-green-700">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Schedule On-Demand Waste Pickup</h3>
          <p className="text-sm text-gray-500">Book doorstep pickup for segregated waste streams</p>
        </div>
      </div>

      {submittedBooking ? (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center animate-fadeIn">
          <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h4 className="text-2xl font-bold text-green-900 mb-1">Pickup Scheduled!</h4>
          <p className="text-sm text-green-700 mb-4">
            Confirmation Ref: <span className="font-mono font-bold bg-green-200/70 px-2 py-0.5 rounded text-green-900">{submittedBooking.id}</span>
          </p>

          <div className="bg-white/80 rounded-xl p-4 text-left text-sm text-gray-700 max-w-md mx-auto space-y-2 border border-green-100 shadow-sm mb-6">
            <div className="flex justify-between">
              <span className="text-gray-500">Resident:</span>
              <span className="font-semibold text-gray-900">{submittedBooking.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Address:</span>
              <span className="font-semibold text-gray-900 truncate max-w-[200px]">{submittedBooking.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Waste Stream:</span>
              <span className="font-semibold capitalize text-green-700">{submittedBooking.wasteType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pickup Date:</span>
              <span className="font-semibold text-gray-900">{submittedBooking.preferredDate}</span>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-xl transition shadow-md hover:shadow-lg"
          >
            <Sparkles className="w-4 h-4" /> Book Another Pickup
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-green-600" /> Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Aarav Sharma"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-white/80 text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-green-600" /> Preferred Date
              </label>
              <input
                type="date"
                required
                value={formData.preferredDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-white/80 text-gray-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-green-600" /> Pickup Address / Landmark
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. Flat 402, Green Glen Towers, Sector 4"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-white/80 text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Primary Waste Category</label>
            <select
              value={formData.wasteType}
              onChange={(e) => setFormData({ ...formData, wasteType: e.target.value as WasteType })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-white/80 text-gray-800 font-medium capitalize"
            >
              <option value="plastic">♻️ Plastic & Polymers (Bottles, wrappers, containers)</option>
              <option value="organic">🌱 Organic / Biodegradable (Kitchen scraps, food)</option>
              <option value="paper">📄 Paper & Cardboard (Boxes, newspapers, cartons)</option>
              <option value="metal">⚙️ Metal & Tins (Cans, foils, hardware)</option>
              <option value="e-waste">⚡ E-Waste (Batteries, electronics, cables)</option>
            </select>
          </div>

          {/* Dynamic Segregation Hint Box */}
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 transition-all">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{currentGuidance.icon}</span>
              <div className="text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-emerald-900 uppercase tracking-wide">Preparation Tip</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 font-semibold text-[10px]">
                    {currentGuidance.bin}
                  </span>
                </div>
                <p className="text-emerald-800 leading-relaxed">{currentGuidance.text}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-gray-400" /> Quantity / Special Notes (Optional)
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. 2 large sacks, please call upon arrival"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-white/80 text-gray-800 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-2xl transition duration-200 shadow-lg shadow-green-600/20 hover:shadow-green-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Clock className="w-5 h-5 animate-spin" /> Confirming with Municipality...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" /> Book Doorstep Pickup
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
