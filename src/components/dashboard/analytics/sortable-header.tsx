'use client';

import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { useAnalyticsFilters } from "@/store/analytics-filters";
import { Button } from "@/components/ui/button";
import { SortField } from "@/types/analytics";

interface SortableHeaderProps {
  field: SortField;
  children: React.ReactNode;
}

export function SortableHeader({ field, children }: SortableHeaderProps) {
  const { filters, setSort } = useAnalyticsFilters();
  const isActive = filters.sortBy === field;

  const handleSort = () => {
    setSort(
      field,
      isActive && filters.sortOrder === "asc" ? "desc" : "asc"
    );
  };

  return (
    <Button
      variant="ghost"
      className="h-auto p-0 font-medium hover:bg-transparent hover:text-primary"
      onClick={handleSort}
    >
      <span className="flex items-center gap-1">
        {children}
        {isActive ? (
          filters.sortOrder === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )
        ) : (
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
        )}
      </span>
    </Button>
  );
} 