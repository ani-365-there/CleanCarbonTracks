import { FleetUnit, FleetTelemetryAggregate } from './types';

export const initialFleetData: FleetUnit[] = [
  {
    id: 'FLEET-UNIT-01',
    unitCode: 'TRUCK-KA-05-9214',
    operatorName: 'Ramesh Kumar',
    assignedZone: 'North Sector Metro Loop',
    status: 'active',
    batteryOrFuelPercent: 84,
    currentStopsCompleted: 14,
    totalStops: 20,
    coordinates: { lat: 12.9716, lng: 77.5946, headingDeg: 45 },
    metrics: {
      fuelSavedPercent: 16.5,
      timeSavedPercent: 21.0,
      distanceTraveledKm: 42.8,
      etaMinutes: 12,
    },
  },
  {
    id: 'FLEET-UNIT-02',
    unitCode: 'TRUCK-MH-12-4411',
    operatorName: 'Suresh Patil',
    assignedZone: 'East Residential High-Density',
    status: 'en_route',
    batteryOrFuelPercent: 67,
    currentStopsCompleted: 9,
    totalStops: 18,
    coordinates: { lat: 18.5204, lng: 73.8567, headingDeg: 110 },
    metrics: {
      fuelSavedPercent: 18.2,
      timeSavedPercent: 23.5,
      distanceTraveledKm: 31.4,
      etaMinutes: 8,
    },
  },
  {
    id: 'FLEET-UNIT-03',
    unitCode: 'TRUCK-DL-01-3829',
    operatorName: 'Mohan Singh',
    assignedZone: 'Commercial Hub Central',
    status: 'idle',
    batteryOrFuelPercent: 96,
    currentStopsCompleted: 22,
    totalStops: 22,
    coordinates: { lat: 28.6139, lng: 77.209, headingDeg: 0 },
    metrics: {
      fuelSavedPercent: 14.8,
      timeSavedPercent: 19.2,
      distanceTraveledKm: 58.1,
      etaMinutes: 0,
    },
  },
];

export function computeFleetAggregate(units: FleetUnit[]): FleetTelemetryAggregate {
  if (!units.length) {
    return {
      activeUnitsCount: 0,
      averageFuelSavedPercent: 0,
      averageTimeSavedPercent: 0,
      totalCompletedStops: 0,
      totalRouteStops: 0,
      overallHealthScore: 100,
    };
  }

  const activeCount = units.filter((u) => u.status === 'active' || u.status === 'en_route').length;
  const avgFuel = units.reduce((acc, u) => acc + u.metrics.fuelSavedPercent, 0) / units.length;
  const avgTime = units.reduce((acc, u) => acc + u.metrics.timeSavedPercent, 0) / units.length;
  const completed = units.reduce((acc, u) => acc + u.currentStopsCompleted, 0);
  const total = units.reduce((acc, u) => acc + u.totalStops, 0);

  return {
    activeUnitsCount: activeCount,
    averageFuelSavedPercent: Number(avgFuel.toFixed(1)),
    averageTimeSavedPercent: Number(avgTime.toFixed(1)),
    totalCompletedStops: completed,
    totalRouteStops: total,
    overallHealthScore: 98,
  };
}

export function simulateFleetTick(units: FleetUnit[]): FleetUnit[] {
  return units.map((unit) => {
    if (unit.status === 'active' || unit.status === 'en_route') {
      const willProgress = Math.random() > 0.65;
      const nextStops = willProgress && unit.currentStopsCompleted < unit.totalStops
        ? unit.currentStopsCompleted + 1
        : unit.currentStopsCompleted;

      const fuelDec = Math.random() > 0.7 ? 1 : 0;

      return {
        ...unit,
        currentStopsCompleted: nextStops,
        batteryOrFuelPercent: Math.max(12, unit.batteryOrFuelPercent - fuelDec),
        status: nextStops >= unit.totalStops ? 'idle' : unit.status,
      };
    }
    return unit;
  });
}
