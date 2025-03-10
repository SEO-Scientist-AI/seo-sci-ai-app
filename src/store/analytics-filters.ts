import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AnalyticsFilters, SortField } from '@/types/analytics';

interface AnalyticsFiltersStore {
  filters: AnalyticsFilters;
  setLimit: (limit: number) => void;
  setSort: (field: SortField, order: 'asc' | 'desc') => void;
}

export const useAnalyticsFilters = create<AnalyticsFiltersStore>()(
  persist(
    (set) => ({
      filters: {
        limit: 100,
        sortBy: 'position',
        sortOrder: 'asc',
      },
      setLimit: (limit) =>
        set((state) => ({
          filters: { ...state.filters, limit },
        })),
      setSort: (sortBy: SortField, sortOrder: 'asc' | 'desc') =>
        set((state) => ({
          filters: { ...state.filters, sortBy, sortOrder },
        })),
    }),
    {
      name: 'analytics-filters',
    }
  )
); 