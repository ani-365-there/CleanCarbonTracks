import { NextResponse } from 'next/server';
import { ClassificationEngine, wasteTaxonomy, warehouseInventoryTaxonomy } from '@/modules/classification-engine';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || searchParams.get('item');
  const domain = searchParams.get('domain') || 'waste';

  if (!query) {
    return NextResponse.json({ error: 'Missing required query param: q or item' }, { status: 400 });
  }

  const taxonomy = domain === 'warehouse' ? warehouseInventoryTaxonomy : wasteTaxonomy;
  const engine = new ClassificationEngine(taxonomy);
  const result = engine.classify(query);

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, taxonomy } = body;

    if (!query) {
      return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
    }

    const engine = new ClassificationEngine(taxonomy || wasteTaxonomy);
    const result = engine.classify(query);

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process classification request' }, { status: 500 });
  }
}
