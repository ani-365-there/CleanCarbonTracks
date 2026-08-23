'use client';

import React, { useState } from 'react';
import { Calendar, User, MapPin, Sparkles, CheckCircle2, AlertCircle, Clock, Info } from 'lucide-react';
import { ServiceSchedulingConfig, ServiceBookingItem } from '../types';
import { defaultWasteSchedulingConfig } from '../stateMachine';
import { getTranslation } from '@/lib/i18n';

interface ServiceBookingFormProps {
  config?: ServiceSchedulingConfig;
  onBookingSubmitted?: (booking: ServiceBookingItem) => void;
  className?: string;
  selectedLang?: string;
}

export const ServiceBookingForm: React.FC<ServiceBookingFormProps> = ({
  config = defaultWasteSchedulingConfig,
  onBookingSubmitted,
  className = '',
  selectedLang = 'en',
}) => {
  const t = getTranslation(selectedLang);
  const [formData, setFormData] = useState({
    customerName: '',
    contactAddress: '',
    categoryId: config.categories[0]?.id || 'plastic',
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    specialNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<ServiceBookingItem | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedCategory = config.categories.find((c) => c.id === formData.categoryId) || config.categories[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.contactAddress.trim()) {
      setErrorMsg('Please enter customer name and destination address.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      const newBooking: ServiceBookingItem = {
        id: `SRV-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: formData.customerName,
        contactAddress: formData.contactAddress,
        categoryId: formData.categoryId,
        scheduledDate: formData.scheduledDate,
        specialNotes: formData.specialNotes,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
      };

      setSubmittedBooking(newBooking);
      setIsSubmitting(false);
      if (onBookingSubmitted) onBookingSubmitted(newBooking);
    }, 500);
  };

  const handleReset = () => {
    setSubmittedBooking(null);
    setFormData({
      customerName: '',
      contactAddress: '',
      categoryId: config.categories[0]?.id || 'plastic',
      scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      specialNotes: '',
    });
  };

  return (
    <div className={`glass-panel p-6 sm:p-8 rounded-3xl border border-green-100 shadow-xl transition-all ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-green-100 rounded-2xl text-green-700">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{t.doorstepPickupTitle}</h3>
          <p className="text-sm text-gray-500">{t.doorstepPickupSubtitle}</p>
        </div>
      </div>

      {submittedBooking ? (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center animate-fadeIn">
          <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h4 className="text-2xl font-bold text-green-900 mb-1">{t.bookingSuccessTitle}</h4>
          <p className="text-sm text-green-700 mb-4">
            {t.bookingRef} <span className="font-mono font-bold bg-green-200/70 px-2 py-0.5 rounded text-green-900">{submittedBooking.id}</span>
          </p>

          <div className="bg-white/80 rounded-xl p-4 text-left text-sm text-gray-700 max-w-md mx-auto space-y-2 border border-green-100 shadow-sm mb-6">
            <div className="flex justify-between">
              <span className="text-gray-500">Customer:</span>
              <span className="font-semibold text-gray-900">{submittedBooking.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Address:</span>
              <span className="font-semibold text-gray-900 truncate max-w-[200px]">{submittedBooking.contactAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{config.serviceTypeLabel}:</span>
              <span className="font-semibold capitalize text-green-700">{submittedBooking.categoryId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Scheduled Date:</span>
              <span className="font-semibold text-gray-900">{submittedBooking.scheduledDate}</span>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-xl transition shadow-md hover:shadow-lg"
          >
            <Sparkles className="w-4 h-4" /> Book Another Request
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
                <User className="w-4 h-4 text-green-600" /> {t.customerNameLabel}
              </label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder={t.customerNamePlaceholder}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-white/80 text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-green-600" /> {t.preferredDateLabel}
              </label>
              <input
                type="date"
                required
                value={formData.scheduledDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-white/80 text-gray-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-green-600" /> {t.addressLabel}
            </label>
            <input
              type="text"
              required
              value={formData.contactAddress}
              onChange={(e) => setFormData({ ...formData, contactAddress: e.target.value })}
              placeholder={t.addressPlaceholder}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-white/80 text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.wasteStreamLabel}</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-white/80 text-gray-800 font-medium capitalize"
            >
              {config.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {selectedLang === 'hi' ? (c.id === 'plastic' ? 'प्लास्टिक और पैकेजिंग (ब्लू ड्राई बिन)' : c.label) : c.label} {c.badge ? `(${c.badge})` : ''}
                </option>
              ))}
            </select>
          </div>

          {selectedCategory?.preparationTip && (
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 transition-all">
              <div className="flex items-start gap-3 text-xs">
                <span className="text-2xl">💡</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-emerald-900 uppercase tracking-wide">{t.prepTipHeader}</span>
                    {selectedCategory.guidanceBin && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 font-semibold text-[10px]">
                        {selectedLang === 'hi' ? t.dryRecyclablesTag : selectedCategory.guidanceBin}
                      </span>
                    )}
                  </div>
                  <p className="text-emerald-800 leading-relaxed">
                    {selectedLang === 'hi' ? 'बोतलों को धोएं और समतल करें।' : selectedCategory.preparationTip}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-gray-400" /> {t.notesLabel}
            </label>
            <input
              type="text"
              value={formData.specialNotes}
              onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
              placeholder={t.notesPlaceholder}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-white/80 text-gray-800 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-2xl transition duration-200 shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Clock className="w-5 h-5 animate-spin" /> {t.confirmingMsg}
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" /> {t.confirmBookingBtn}
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
