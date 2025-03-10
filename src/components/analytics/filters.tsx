'use client';

import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useAnalyticsFilters } from "@/store/analytics-filters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const limitOptions = [10, 25, 50, 100, 250, 500];

export function AnalyticsFilters() {
  const { filters, setLimit } = useAnalyticsFilters();

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs">
              Top pages <span className="ml-1 text-muted-foreground">{filters.limit}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {limitOptions.map((limit) => (
              <DropdownMenuItem
                key={limit}
                onClick={() => setLimit(limit)}
              >
                Show top {limit}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Button variant="outline" size="sm" className="text-xs">
        <Filter className="h-3 w-3 mr-1" /> Filters
      </Button>
    </div>
  );
} 