'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAnalyticsFilters } from '@/store/analytics-filters';
import { SearchAnalyticsPage } from '@/types/searchConsole';
import { SortableHeader } from './sortable-header';
import { filterAnalytics } from '@/app/actions/filterAnalytics';

interface PagesTableProps {
  initialPages: SearchAnalyticsPage[];
}

export function PagesTable({ initialPages }: PagesTableProps) {
  const { filters } = useAnalyticsFilters();
  const [pages, setPages] = useState(initialPages);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPages() {
      setLoading(true);
      try {
        const newPages = await filterAnalytics(filters);
        setPages(newPages);
      } catch (error) {
        console.error('Error fetching pages:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPages();
  }, [filters]);

  return (
    <div className="rounded-lg border w-full">
      <div className="overflow-x-auto">
        <div className="min-w-[950px]">
          <table className="w-full table-fixed text-sm divide-x divide-border">
            <colgroup>
              <col className="w-[400px]" />
              <col className="w-[150px]" />
              <col className="w-[100px]" />
              <col className="w-[100px]" />
              <col className="w-[100px]" />
              <col className="w-[100px]" />
            </colgroup>
            <thead>
              <tr className="border-b divide-x divide-border">
                <th className="py-2 px-4 text-left font-medium">
                  <SortableHeader field="page">Page</SortableHeader>
                </th>
                <th className="py-2 px-4 text-left font-medium">
                  Content Score
                </th>
                <th className="py-2 px-4 text-right font-medium">
                  <SortableHeader field="position">Position</SortableHeader>
                </th>
                <th className="py-2 px-4 text-right font-medium">
                  <SortableHeader field="traffic">Traffic</SortableHeader>
                </th>
                <th className="py-2 px-4 text-right font-medium">
                  <SortableHeader field="impressions">Impr.</SortableHeader>
                </th>
                <th className="py-2 px-4 text-right font-medium">
                  <SortableHeader field="ctr">CTR</SortableHeader>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pages.map((page, i) => (
                <tr key={i} className="divide-x divide-border">
                  <td className="py-2 px-4">
                    <div className="flex flex-col truncate">
                      {loading ? (
                        <>
                          <div className="h-4 bg-muted animate-pulse rounded w-[80%]" />
                          <div className="h-3 bg-muted animate-pulse rounded w-[60%] mt-1" />
                        </>
                      ) : (
                        <>
                          <Link href={page.page} className="text-blue-600 hover:underline truncate">
                            {page.page}
                          </Link>
                          <span className="text-xs text-muted-foreground truncate">
                            {page.mainKeyword}
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 animate-spin rounded-full border border-gray-300 border-t-gray-500" />
                      <span className="text-muted-foreground">Analyzing...</span>
                    </div>
                  </td>
                  <td className="py-2 px-4 text-right">
                    {loading ? (
                      <div className="h-4 bg-muted animate-pulse rounded w-12 ml-auto" />
                    ) : (
                      page.position
                    )}
                  </td>
                  <td className="py-2 px-4 text-right">
                    {loading ? (
                      <div className="h-4 bg-muted animate-pulse rounded w-12 ml-auto" />
                    ) : (
                      page.traffic
                    )}
                  </td>
                  <td className="py-2 px-4 text-right">
                    {loading ? (
                      <div className="h-4 bg-muted animate-pulse rounded w-12 ml-auto" />
                    ) : (
                      page.impressions
                    )}
                  </td>
                  <td className="py-2 px-4 text-right">
                    {loading ? (
                      <div className="h-4 bg-muted animate-pulse rounded w-12 ml-auto" />
                    ) : (
                      page.ctr
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 