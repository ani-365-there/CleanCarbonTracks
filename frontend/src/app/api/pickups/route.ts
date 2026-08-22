import { NextResponse } from 'next/server';
import { mockPickups } from '@/lib/mockData';
import { PickupRequest } from '@/lib/types';

export async function GET() {
  return NextResponse.json(mockPickups);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newPickup: PickupRequest = {
      id: `PK-${Math.floor(1000 + Math.random() * 9000)}`,
      name: body.name || 'Anonymous Resident',
      address: body.address || 'Address Not Provided',
      wasteType: body.wasteType || 'plastic',
      preferredDate: body.preferredDate || new Date().toISOString().split('T')[0],
      notes: body.notes || '',
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };

    mockPickups.unshift(newPickup);
    return NextResponse.json(newPickup, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create pickup request' }, { status: 500 });
  }
}
