import { auth } from "@/server/auth";
import { SearchAnalyticsPage, SearchConsoleResponse } from "@/types/searchConsole";
import { getCurrentWebsite } from "./setWebsite";
import { AnalyticsFilters } from "@/types/analytics";

interface GSCResponse {
  rows?: {
    keys: string[];
    position: number;
    clicks: number;
    impressions: number;
    ctr: number;
  }[];
}

export async function getSearchAnalytics(filters: AnalyticsFilters): Promise<SearchAnalyticsPage[]> {
  try {
    const session = await auth();
    const currentWebsite = await getCurrentWebsite();
    
    if (!session?.user || !session.accessToken) throw new Error("Unauthorized");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 28); // Last 28 days

    // First try with sc-domain
    const siteUrl = `sc-domain:${currentWebsite}`;
    
    const response = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: startDate.toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          dimensions: ['page', 'query'],
          rowLimit: 100,
          startRow: 0
        })
      }
    );

    if (!response.ok) {
      console.error('Search Console API Error:', await response.text());
      
      // If no data, return empty array instead of throwing
      if (response.status === 400) {
        return [{
          page: currentWebsite,
          mainKeyword: "No data available",
          contentScore: "N/A",
          position: "0",
          traffic: "0",
          impressions: "0%",
          ctr: "0%",
        }];
      }
      
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const data = (await response.json()) as GSCResponse;

    if (!data.rows || data.rows.length === 0) {
      return [{
        page: currentWebsite,
        mainKeyword: "No data available",
        contentScore: "N/A",
        position: "0",
        traffic: "0",
        impressions: "0%",
        ctr: "0%",
      }];
    }

    // Sort the data based on filters
    return data.rows
      .map((row) => ({
        page: row.keys[0],
        mainKeyword: row.keys[1],
        contentScore: "Analyzing...",
        position: formatNumber(row.position),
        traffic: formatNumber(row.clicks),
        impressions: `${Number(row.ctr * 100).toFixed(1)}%`,
        ctr: `${Number(row.ctr * 100).toFixed(1)}%`,
        // Add raw values for sorting
        _position: row.position,
        _traffic: row.clicks,
        _impressions: row.impressions,
        _ctr: row.ctr,
      }))
      .sort((a, b) => {
        const field = `_${filters.sortBy}` as keyof typeof a;
        const modifier = filters.sortOrder === 'asc' ? 1 : -1;
        // Convert string values to numbers before arithmetic
        const aVal = Number(a[field]);
        const bVal = Number(b[field]);
        return (aVal - bVal) * modifier;
      })
      .slice(0, filters.limit);

  } catch (error) {
    console.error('Error fetching search analytics:', error);
    // Return a fallback state instead of throwing
    return [{
      page: await getCurrentWebsite(),
      mainKeyword: "Error loading data",
      contentScore: "Error",
      position: "0",
      traffic: "0",
      impressions: "0%",
      ctr: "0%",
    }];
  }
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  // Format decimal numbers to 1 decimal place
  return Number.isInteger(num) ? num.toString() : num.toFixed(1);
} 