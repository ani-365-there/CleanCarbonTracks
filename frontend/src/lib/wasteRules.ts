import { WasteItemRule, WasteType } from './types';

export const wasteDatabase: WasteItemRule[] = [
  {
    keywords: ['plastic', 'bottle', 'pet', 'wrapper', 'polythene', 'polybag', 'container', 'straw', 'cup'],
    category: 'Non-biodegradable (Plastic & Polymers)',
    type: 'plastic',
    binColor: 'blue',
    tip: '♻️ Rinse and flatten bottles or containers before disposal. Avoid burning — it releases toxic dioxins.',
    co2SavingsKgPerKg: 1.5,
  },
  {
    keywords: ['banana', 'food', 'peel', 'apple', 'vegetable', 'fruit', 'leaf', 'tea bag', 'egg shell', 'coffee', 'organic', 'leftover'],
    category: 'Biodegradable (Organic & Wet Waste)',
    type: 'organic',
    binColor: 'green',
    tip: '🌱 Ideal for home composting or biogas! Keep sealed in a biodegradable bag to prevent odor and insect breeding.',
    co2SavingsKgPerKg: 0.8,
  },
  {
    keywords: ['paper', 'box', 'cardboard', 'newspaper', 'carton', 'magazine', 'envelope', 'book', 'notebook'],
    category: 'Recyclable (Paper & Cardboard)',
    type: 'paper',
    binColor: 'blue',
    tip: '📄 Flatten boxes and keep completely dry. Do not mix wet items with paper recyclables.',
    co2SavingsKgPerKg: 1.1,
  },
  {
    keywords: ['metal', 'can', 'tin', 'aluminum', 'foil', 'iron', 'steel', 'copper', 'soda can'],
    category: 'Recyclable (Metals & Alloys)',
    type: 'metal',
    binColor: 'yellow',
    tip: '⚙️ Rinse metal cans and fold sharp edges inward to prevent injury to sanitation handlers.',
    co2SavingsKgPerKg: 3.2,
  },
  {
    keywords: ['battery', 'phone', 'laptop', 'charger', 'cable', 'circuit', 'bulb', 'led', 'electronic', 'e-waste', 'wire'],
    category: 'E-Waste & Electronics (Special Handling)',
    type: 'e-waste',
    binColor: 'red',
    tip: '⚡ Do NOT throw in regular bins. Contains heavy metals like lead and cadmium. Deposit at an authorized E-waste collection point.',
    co2SavingsKgPerKg: 4.5,
  },
  {
    keywords: ['paint', 'chemical', 'medicine', 'syringe', 'pesticide', 'cleaner', 'aerosol', 'mask', 'sanitary'],
    category: 'Hazardous / Biomedical Waste',
    type: 'hazardous',
    binColor: 'red',
    tip: '☣️ Wrap securely and label as hazardous. Requires specialized high-temperature incineration or medical disposal.',
    co2SavingsKgPerKg: 0.5,
  },
];

export function categorizeItem(query: string) {
  const clean = query.toLowerCase().trim();
  if (!clean) return null;

  for (const rule of wasteDatabase) {
    if (rule.keywords.some((kw) => clean.includes(kw))) {
      return rule;
    }
  }

  return {
    keywords: [],
    category: 'General Waste / Unclassified',
    type: 'other' as WasteType,
    binColor: 'black' as const,
    tip: 'ℹ️ Check municipal segregated collection guidelines or contact local waste collection support.',
    co2SavingsKgPerKg: 0.2,
  };
}
