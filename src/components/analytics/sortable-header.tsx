'use client';

import { ArrowUpDown } from "lucide-react";
import { useAnalyticsFilters } from "@/store/analytics-filters";
import { Button } from "@/components/ui/button";
import { SortField } from "@/types/analytics";

interface SortableHeaderProps {
  field: SortField;
  children: React.ReactNode;
}

export function SortableHeader({ field, children }: SortableHeaderProps) {
  const { filters, setSort } = useAnalyticsFilters();
  
  const toggleSort = () => {
    const newOrder = 
      filters.sortBy === field && filters.sortOrder === 'asc' 
        ? 'desc' 
        : 'asc';
    setSort(field, newOrder);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 font-medium hover:bg-transparent"
      onClick={toggleSort}
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className="h-3 w-3" />
      </div>
    </Button>
  );
} 