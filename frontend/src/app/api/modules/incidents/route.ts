import { NextResponse } from 'next/server';
import { initialIncidentsState } from '@/modules/service-scheduling-engine';
import { IncidentReport } from '@/modules/service-scheduling-engine/types';

let incidents = [...initialIncidentsState];

export async function GET() {
  return NextResponse.json(incidents);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newIncident: IncidentReport = {
      id: `INC-${Math.floor(100 + Math.random() * 900)}`,
      reporterName: body.reporterName || 'Anonymous Citizen',
      location: body.location || 'Location Not Specified',
      incidentType: body.incidentType || 'general_exception',
      severity: body.severity || 'medium',
      description: body.description || '',
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    incidents.unshift(newIncident);
    return NextResponse.json(newIncident, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to record incident report' }, { status: 500 });
  }
}
