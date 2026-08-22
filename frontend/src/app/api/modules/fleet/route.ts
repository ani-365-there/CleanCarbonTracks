import { NextResponse } from 'next/server';
import { initialFleetData, computeFleetAggregate } from '@/modules/fleet-radar-engine';

export async function GET() {
  const telemetry = computeFleetAggregate(initialFleetData);
  return NextResponse.json({
    units: initialFleetData,
    telemetry,
  });
}
