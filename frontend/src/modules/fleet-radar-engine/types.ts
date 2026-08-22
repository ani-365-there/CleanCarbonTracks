export type VehicleOperationalStatus = 'active' | 'en_route' | 'idle' | 'charging' | 'maintenance';

export interface FleetUnit {
  id: string;
  unitCode: string;
  operatorName: string;
  assignedZone: string;
  status: VehicleOperationalStatus;
  batteryOrFuelPercent: number;
  currentStopsCompleted: number;
  totalStops: number;
  coordinates: {
    lat: number;
    lng: number;
    headingDeg?: number;
  };
  metrics: {
    fuelSavedPercent: number;
    timeSavedPercent: number;
    distanceTraveledKm: number;
    etaMinutes: number;
  };
}

export interface FleetTelemetryAggregate {
  activeUnitsCount: number;
  averageFuelSavedPercent: number;
  averageTimeSavedPercent: number;
  totalCompletedStops: number;
  totalRouteStops: number;
  overallHealthScore: number;
}

export interface FleetEngineConfig {
  sectorName: string;
  radarRefreshIntervalMs?: number;
  autoSimulateMovement?: boolean;
  enableAISavingsTelemetry?: boolean;
  radarRadiusKm?: number;
}
