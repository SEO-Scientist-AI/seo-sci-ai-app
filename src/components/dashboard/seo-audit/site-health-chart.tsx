"use client";

import { CircularProgress } from "@/components/dashboard/circular-score";

interface SiteHealthChartProps {
  value: number;
}

export function SiteHealthChart({ value }: SiteHealthChartProps) {
  return (
    <div className="flex flex-col items-center">
      <CircularProgress 
        value={value} 
        size="large" 
        title="Site Health" 
      />
    </div>
  );
} 