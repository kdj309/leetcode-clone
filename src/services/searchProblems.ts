import api from '../API/Index';
import { parseElasticsearchResponse, SearchResultHit } from '../utils/elasticsearchMapper';

export const searchProblems = async (page: number, limit: number, query?: string, difficulty?: string) => {
  try {
    // Allow API call if either query exists OR difficulty filter is set (not 'all')
    if ((!query || query.trim().length === 0) && (!difficulty || difficulty === 'all')) {
      // Return empty arrays only if both query is empty AND difficulty is 'all'
      return {
        topResults: [],
        allResults: [],
        totalResults: 0,
      };
    }

    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (query && query.trim().length > 0) {
      params.append('query', query);
    }

    // Add difficulty to query params if provided and not 'all'
    if (difficulty && difficulty !== 'all') {
      params.append('difficulty', difficulty);
    }

    const response = await api.get(`problems/search/filters?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // The response from ES is already wrapped by backend
    // Extract the hits from the response
    const hits: SearchResultHit[] = response.data?.data.results || [];
    const total: number = response.data?.data.total || 0;
    // Parse and return both top 5 and all results
    return parseElasticsearchResponse(hits, total);
  } catch (error) {
    console.error('Error searching problems:', error);
    throw error;
  }
};
