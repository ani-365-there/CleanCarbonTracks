import {
  ServiceBookingItem,
  IncidentReport,
  ServiceSchedulingConfig,
  ServiceRequestStatus,
} from './types';

export const defaultWasteSchedulingConfig: ServiceSchedulingConfig = {
  serviceName: 'Municipal Waste Doorstep Pickup',
  serviceTypeLabel: 'Waste Stream',
  minBookingDateOffsetDays: 1,
  confirmationMessage: 'Your pickup has been routed into the zonal dispatch queue.',
  categories: [
    {
      id: 'plastic',
      label: '♻️ Plastics & Packaging',
      badge: 'Blue Dry Bin',
      preparationTip: 'Rinse bottles and flatten jugs to maximize container density.',
      guidanceBin: 'Dry Recyclables',
    },
    {
      id: 'organic',
      label: '🌱 Organic & Food Scraps',
      badge: 'Green Wet Bin',
      preparationTip: 'Store in biodegradable liners or sealed aerated buckets to prevent odor.',
      guidanceBin: 'Compost Bin',
    },
    {
      id: 'paper',
      label: '📄 Paper & Cardboard',
      badge: 'Blue Dry Bin',
      preparationTip: 'Keep completely dry and flatten courier boxes.',
      guidanceBin: 'Dry Paper Bin',
    },
    {
      id: 'metal',
      label: '⚙️ Metals & Cans',
      badge: 'Yellow Bin',
      preparationTip: 'Rinse food cans and fold sharp flaps inwards.',
      guidanceBin: 'Metals Bin',
    },
    {
      id: 'ewaste',
      label: '⚡ E-Waste & Batteries',
      badge: 'Red E-Drop',
      preparationTip: 'Tape battery terminals and keep dry. Do not disassemble.',
      guidanceBin: 'Hazardous / E-Waste Bin',
    },
  ],
};

export const initialBookingsState: ServiceBookingItem[] = [
  {
    id: 'SRV-801',
    customerName: 'Aarav Sharma',
    contactAddress: 'Flat 402, Green Glen Layout, Outer Ring Rd, Bengaluru',
    categoryId: 'plastic',
    scheduledDate: '2026-08-22',
    specialNotes: '2 large sacks of segregated clean plastic containers',
    status: 'scheduled',
    assignedUnitId: 'TRUCK-KA-05-9214',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'SRV-802',
    customerName: 'Priya Mukherjee',
    contactAddress: 'B-12, Sector 5, Salt Lake, Kolkata',
    categoryId: 'organic',
    scheduledDate: '2026-08-21',
    specialNotes: 'Kitchen wet waste compost feedstock',
    status: 'in_progress',
    assignedUnitId: 'TRUCK-KA-05-9214',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'SRV-803',
    customerName: 'Rohan Deshmukh',
    contactAddress: '14/B Kalyani Nagar, Pune',
    categoryId: 'ewaste',
    scheduledDate: '2026-08-23',
    specialNotes: 'Old printer and dead lithium batteries',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'SRV-804',
    customerName: 'Sneha Patel',
    contactAddress: 'Block C, Vastrapur, Ahmedabad',
    categoryId: 'paper',
    scheduledDate: '2026-08-20',
    specialNotes: 'Stack of cardboard packaging cartons',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const initialIncidentsState: IncidentReport[] = [
  {
    id: 'INC-301',
    reporterName: 'Vikram Mehta',
    location: 'Plot 88, Jubilee Hills, Hyderabad',
    incidentType: 'missed_pickup',
    severity: 'medium',
    description: 'Scheduled morning pickup at 8:00 AM was not fulfilled by route vehicle.',
    status: 'investigating',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'INC-302',
    reporterName: 'Ananya Roy',
    location: 'Park Street Cross 3, Kolkata',
    incidentType: 'overflowing_bin',
    severity: 'high',
    description: 'Community wet waste bin overflowing onto the pedestrian pathway.',
    status: 'open',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

export function getNextServiceStatus(current: ServiceRequestStatus): ServiceRequestStatus {
  switch (current) {
    case 'pending':
      return 'scheduled';
    case 'scheduled':
      return 'in_progress';
    case 'in_progress':
      return 'completed';
    case 'completed':
      return 'scheduled';
    default:
      return 'scheduled';
  }
}
