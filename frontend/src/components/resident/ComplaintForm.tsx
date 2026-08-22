'use client';

import React, { useState } from 'react';
import { AlertTriangle, Send, CheckCircle2, User, MapPin, MessageSquare, ShieldAlert } from 'lucide-react';
import { Complaint } from '@/lib/types';

export const ComplaintForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    issueType: 'missed_pickup' as Complaint['issueType'],
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [complaintTicket, setComplaintTicket] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim() || !formData.description.trim()) {
      return;
    }
    setIsSubmitting(true);

    setTimeout(() => {
      const ticketId = `CMP-${Math.floor(100 + Math.random() * 900)}`;
      setComplaintTicket(ticketId);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-red-100 shadow-xl transition-all duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-red-100 rounded-2xl text-red-700">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Report Missed Pickup or Sanitation Issue</h3>
          <p className="text-sm text-gray-500">Direct escalation to the municipal ward officer</p>
        </div>
      </div>

      {complaintTicket ? (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center animate-fadeIn">
          <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h4 className="text-2xl font-bold text-green-900 mb-1">Grievance Registered</h4>
          <p className="text-sm text-green-700 mb-3">
            Ticket ID: <span className="font-mono font-bold bg-green-200/70 px-2 py-0.5 rounded text-green-900">{complaintTicket}</span>
          </p>
          <p className="text-xs text-gray-600 max-w-sm mx-auto mb-5">
            Your complaint has been dispatched to the local zonal route coordinator. An inspection vehicle will be routed within 4 hours.
          </p>
          <button
            onClick={() => {
              setComplaintTicket(null);
              setFormData({
                name: '',
                address: '',
                issueType: 'missed_pickup',
                description: '',
              });
            }}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition"
          >
            Submit Another Report
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-red-600" /> Resident Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Vikram Mehta"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition bg-white/80 text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Issue Category</label>
              <select
                value={formData.issueType}
                onChange={(e) => setFormData({ ...formData, issueType: e.target.value as Complaint['issueType'] })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition bg-white/80 text-gray-800 font-medium"
              >
                <option value="missed_pickup">🚫 Missed Scheduled Pickup</option>
                <option value="overflowing_bin">🗑️ Overflowing Community Bin</option>
                <option value="spill_or_damage">⚠️ Spilled Waste / Bin Damaged</option>
                <option value="irregular_schedule">⏰ Irregular Vehicle Timing</option>
                <option value="other">💬 Other Sanitation Feedback</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-600" /> Location / Bin Identifier
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. Plot 88, Jubilee Hills Road No. 36"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition bg-white/80 text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-gray-500" /> Description of Grievance
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide details such as time elapsed, exact spot, or photo reference notes..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition bg-white/80 text-gray-800 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-3 px-6 rounded-2xl transition duration-200 shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> {isSubmitting ? 'Registering with Ward Desk...' : 'Submit Grievance to Municipality'}
          </button>
        </form>
      )}
    </div>
  );
};
