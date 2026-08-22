export type ServiceRequestStatus = 'pending' | 'scheduled' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'open' | 'investigating' | 'dispatched' | 'resolved' | 'closed';

export interface ServiceCategoryOption {
  id: string;
  label: string;
  badge?: string;
  preparationTip?: string;
  guidanceBin?: string;
}

export interface ServiceSchedulingConfig {
  serviceName: string;
  serviceTypeLabel: string;
  categories: ServiceCategoryOption[];
  allowSpecialInstructions?: boolean;
  minBookingDateOffsetDays?: number;
  confirmationMessage?: string;
}

export interface ServiceBookingItem {
  id: string;
  customerName: string;
  contactAddress: string;
  categoryId: string;
  scheduledDate: string;
  specialNotes?: string;
  status: ServiceRequestStatus;
  assignedUnitId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IncidentReport {
  id: string;
  reporterName: string;
  location: string;
  incidentType: string;
  severity: IncidentSeverity;
  description: string;
  status: IncidentStatus;
  createdAt: string;
  resolvedAt?: string;
}
