import { NextResponse } from 'next/server';
import { initialBookingsState } from '@/modules/service-scheduling-engine';
import { ServiceBookingItem } from '@/modules/service-scheduling-engine/types';

let bookings = [...initialBookingsState];

export async function GET() {
  return NextResponse.json(bookings);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newBooking: ServiceBookingItem = {
      id: `SRV-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: body.customerName || 'Anonymous Customer',
      contactAddress: body.contactAddress || 'Address Not Provided',
      categoryId: body.categoryId || 'default',
      scheduledDate: body.scheduledDate || new Date().toISOString().split('T')[0],
      specialNotes: body.specialNotes || '',
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };

    bookings.unshift(newBooking);
    return NextResponse.json(newBooking, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to record service booking' }, { status: 500 });
  }
}
