export interface TaxonomyCategory {
  id: string;
  name: string;
  badgeLabel: string;
  badgeColor: 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'gray';
  keywords: string[];
  handlingInstructions: string;
  impactMetricLabel?: string;
  impactMultiplier?: number;
  dos?: string[];
  donts?: string[];
  lifecycleFact?: string;
}

export interface TaxonomyConfig {
  taxonomyName: string;
  domain: string;
  categories: TaxonomyCategory[];
  defaultCategory?: TaxonomyCategory;
  searchPlaceholder?: string;
  title?: string;
  subtitle?: string;
  sampleQueries?: string[];
}

export interface ClassificationMatch {
  matchedCategory: TaxonomyCategory;
  query: string;
  matchedKeyword?: string;
  confidence: number;
  calculatedImpact?: number;
  timestamp: string;
}
