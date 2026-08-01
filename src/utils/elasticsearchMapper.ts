/**
 * Elasticsearch Response Parser & Mapper
 * Transforms ES search results into typed format for UI consumption
 */

export interface SearchResultHit {
  _index: string;
  _id: string;
  _score: number;
  _source: {
    title: string;
    description?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
  };
}

export interface MappedSearchResult {
  id: string;
  title: string;
  score: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  description?: string;
}

/**
 * Maps Elasticsearch hit object to MappedSearchResult
 * @param hit - ES search hit
 * @returns Mapped result with proper types
 */
const mapHitToResult = (hit: SearchResultHit): MappedSearchResult => ({
  id: hit._id,
  title: hit._source.title,
  score: hit._score,
  difficulty: hit._source.difficulty,
  description: hit._source.description,
});

/**
 * Parses Elasticsearch search response
 * Returns both top 5 results (for dropdown) and all results (for table)
 * @param hits - Array of ES search hits
 * @returns Object with topResults (5) and allResults (all)
 */
export const parseElasticsearchResponse = (
  hits: SearchResultHit[],
  total: number
): {
  topResults: MappedSearchResult[];
  allResults: MappedSearchResult[];
  totalResults: number;
} => {
  // Map and sort by score (ES already returns sorted, but we ensure it)
  const mappedResults = hits.map(mapHitToResult).sort((a, b) => b.score - a.score);

  return {
    topResults: mappedResults.slice(0, 5), // Top 5 for dropdown
    allResults: mappedResults, // All for table
    totalResults: total, // Total hits for pagination
  };
};
