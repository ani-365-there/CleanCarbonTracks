import { NextResponse } from 'next/server';
import { mockAnalytics } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(mockAnalytics);
}
