export type WasteType = 'plastic' | 'organic' | 'paper' | 'metal' | 'e-waste' | 'hazardous' | 'other';

export interface PickupRequest {
  id: string;
  name: string;
  address: string;
  wasteType: WasteType;
  preferredDate: string;
  notes?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Complaint {
  id: string;
  name: string;
  address: string;
  issueType: 'missed_pickup' | 'overflowing_bin' | 'spill_or_damage' | 'irregular_schedule' | 'other';
  description: string;
  status: 'open' | 'investigating' | 'resolved';
  createdAt: string;
}

export interface Vehicle {
  id: string;
  code: string;
  driverName: string;
  zone: string;
  status: 'active' | 'en_route' | 'idle' | 'maintenance';
  batteryOrFuelPercent: number;
  currentStopsCompleted: number;
  totalStops: number;
  lat: number;
  lng: number;
  fuelSavedPercent: number;
  timeSavedPercent: number;
}

export interface WasteItemRule {
  keywords: string[];
  category: string;
  type: WasteType;
  binColor: 'green' | 'blue' | 'yellow' | 'red' | 'black';
  tip: string;
  co2SavingsKgPerKg: number;
}

export interface AnalyticsMetrics {
  pickupsThisWeek: number;
  wasteDivertedPercentage: number;
  co2SavedKg: number;
  activeVehicles: number;
  resolvedComplaints: number;
}
