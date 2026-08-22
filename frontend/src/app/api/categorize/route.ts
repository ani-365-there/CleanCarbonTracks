import { NextResponse } from 'next/server';
import { categorizeItem } from '@/lib/wasteRules';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const item = searchParams.get('item');

  if (!item) {
    return NextResponse.json({ error: 'Please provide an item query param' }, { status: 400 });
  }

  const result = categorizeItem(item);
  return NextResponse.json(result);
}
