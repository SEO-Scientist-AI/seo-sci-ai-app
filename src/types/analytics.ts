export type SortField = 'page' | 'position' | 'traffic' | 'impressions' | 'ctr';
export type SortOrder = 'asc' | 'desc';

export type AnalyticsFilters = {
  limit: number;
  sortBy: SortField;
  sortOrder: SortOrder;
} 