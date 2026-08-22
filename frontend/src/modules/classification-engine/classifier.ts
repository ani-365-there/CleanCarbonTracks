import { TaxonomyConfig, TaxonomyCategory, ClassificationMatch } from './types';

export class ClassificationEngine {
  private config: TaxonomyConfig;

  constructor(config: TaxonomyConfig) {
    this.config = config;
  }

  public setTaxonomy(config: TaxonomyConfig) {
    this.config = config;
  }

  public getTaxonomy(): TaxonomyConfig {
    return this.config;
  }

  public classify(rawQuery: string): ClassificationMatch {
    const query = rawQuery.toLowerCase().trim();
    if (!query) {
      const fallback = this.getFallbackCategory();
      return {
        matchedCategory: fallback,
        query: '',
        confidence: 0,
        timestamp: new Date().toISOString(),
      };
    }

    let bestCategory: TaxonomyCategory | null = null;
    let bestMatchedKeyword: string | undefined;
    let highestConfidence = 0;

    for (const category of this.config.categories) {
      for (const kw of category.keywords) {
        const keyword = kw.toLowerCase();
        if (query === keyword) {
          bestCategory = category;
          bestMatchedKeyword = keyword;
          highestConfidence = 1.0;
          break;
        } else if (query.includes(keyword) || keyword.includes(query)) {
          const confidence = Math.min(0.95, keyword.length / Math.max(query.length, keyword.length));
          if (confidence > highestConfidence) {
            highestConfidence = confidence;
            bestCategory = category;
            bestMatchedKeyword = keyword;
          }
        }
      }
      if (highestConfidence === 1.0) break;
    }

    const matchedCategory = bestCategory || this.getFallbackCategory();
    const impact = matchedCategory.impactMultiplier
      ? Number((matchedCategory.impactMultiplier * 1.0).toFixed(2))
      : undefined;

    return {
      matchedCategory,
      query: rawQuery,
      matchedKeyword: bestMatchedKeyword,
      confidence: highestConfidence > 0 ? Number(highestConfidence.toFixed(2)) : 0.4,
      calculatedImpact: impact,
      timestamp: new Date().toISOString(),
    };
  }

  private getFallbackCategory(): TaxonomyCategory {
    return (
      this.config.defaultCategory || {
        id: 'unclassified',
        name: 'General / Unclassified',
        badgeLabel: 'General Stream',
        badgeColor: 'gray',
        keywords: [],
        handlingInstructions: 'No direct automated match found. Review standard guidelines or request manual inspection.',
      }
    );
  }
}

export function createClassifier(config: TaxonomyConfig) {
  return new ClassificationEngine(config);
}
