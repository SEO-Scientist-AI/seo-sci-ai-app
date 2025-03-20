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

interface KeywordData {
  keyword: string;
  clicks: number;
  impressions: number;
  position: number;
  ctr: number;
}

export async function getSearchAnalytics(filters: AnalyticsFilters): Promise<SearchAnalyticsPage[]> {
  try {
    const session = await auth();
    const currentWebsite = await getCurrentWebsite();
    
    if (!session?.user || !session.accessToken) throw new Error("Unauthorized");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 28); // Last 28 days

    // Calculate previous period dates
    const currentEndDate = new Date();
    const currentStartDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const previousEndDate = new Date(currentStartDate);
    previousEndDate.setDate(previousEndDate.getDate() - 1);
    const previousStartDate = new Date(previousEndDate);
    previousStartDate.setDate(previousStartDate.getDate() - 7);

    // First try with sc-domain
    const siteUrl = `sc-domain:${currentWebsite}`;
    
    // Fetch current period data
    const currentResponse = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: currentStartDate.toISOString().split('T')[0],
          endDate: currentEndDate.toISOString().split('T')[0],
          dimensions: ['page', 'query'],
          rowLimit: 100,
          startRow: 0
        })
      }
    );

    // Fetch previous period data
    const previousResponse = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: previousStartDate.toISOString().split('T')[0],
          endDate: previousEndDate.toISOString().split('T')[0],
          dimensions: ['page', 'query'],
          rowLimit: 100,
          startRow: 0
        })
      }
    );

    const currentData = (await currentResponse.json()) as GSCResponse;
    const previousData = (await previousResponse.json()) as GSCResponse;

    if (!currentData.rows || currentData.rows.length === 0) {
      return [{
        page: currentWebsite,
        mainKeyword: "No data available",
        contentScore: 45, // Test value
        position: 0,
        traffic: 0,
        impressions: 0,
        ctr: 0,
        clicks: 0,
        positionTrend: 0,
        trafficTrend: 0,
        impressionsTrend: 0,
        ctrTrend: 0,
        _position: 0,
        _traffic: 0,
        _impressions: 0,
        _ctr: 0
      }];
    }

    // Create a map of previous period data for easy lookup
    const previousDataMap = new Map(
      previousData.rows?.map(row => [row.keys[0], row]) || []
    );

    // Group data by page and find main keyword for each
    const pageData = new Map<string, {
      keywords: KeywordData[];
      mainKeyword: string;
      totalClicks: number;
      totalImpressions: number;
      avgPosition: number;
      avgCtr: number;
    }>();

    // Process rows to group by page
    currentData.rows?.forEach(row => {
      const page = row.keys[0];
      const keyword = row.keys[1];
      
      if (!pageData.has(page)) {
        pageData.set(page, {
          keywords: [],
          mainKeyword: '',
          totalClicks: 0,
          totalImpressions: 0,
          avgPosition: 0,
          avgCtr: 0
        });
      }

      const pageInfo = pageData.get(page)!;
      pageInfo.keywords.push({
        keyword,
        clicks: row.clicks,
        impressions: row.impressions,
        position: row.position,
        ctr: row.ctr
      });

      pageInfo.totalClicks += row.clicks;
      pageInfo.totalImpressions += row.impressions;
      pageInfo.avgPosition += row.position;
      pageInfo.avgCtr += row.ctr;
    });

    // Find main keyword for each page
    pageData.forEach((data, page) => {
      // Sort keywords by clicks, then impressions, then position
      const sortedKeywords = data.keywords.sort((a, b) => {
        if (a.clicks !== b.clicks) return b.clicks - a.clicks;
        if (a.impressions !== b.impressions) return b.impressions - a.impressions;
        return a.position - b.position;
      });

      data.mainKeyword = sortedKeywords[0]?.keyword || 'No keyword data';
      data.avgPosition = data.avgPosition / data.keywords.length;
      data.avgCtr = data.avgCtr / data.keywords.length;
    });

    // Map the data to SearchAnalyticsPage[]
    return Array.from(pageData.entries())
      .map(([page, data]) => ({
        page,
        mainKeyword: data.mainKeyword,
        contentScore: Math.floor(Math.random() * 100),
        position: Math.round(data.avgPosition),
        traffic: Math.round(data.totalClicks),
        impressions: Math.round(data.totalImpressions),
        ctr: Math.round(data.avgCtr * 100),
        clicks: Math.round(data.totalClicks),
        positionTrend: previousDataMap.get(page)?.position 
          ? ((previousDataMap.get(page)!.position - data.avgPosition) / previousDataMap.get(page)!.position) * 100 
          : 0,
        trafficTrend: previousDataMap.get(page)?.clicks 
          ? ((data.totalClicks - previousDataMap.get(page)!.clicks) / previousDataMap.get(page)!.clicks) * 100 
          : 0,
        impressionsTrend: previousDataMap.get(page)?.impressions 
          ? ((data.totalImpressions - previousDataMap.get(page)!.impressions) / previousDataMap.get(page)!.impressions) * 100 
          : 0,
        ctrTrend: previousDataMap.get(page)?.ctr 
          ? ((data.avgCtr - previousDataMap.get(page)!.ctr) / previousDataMap.get(page)!.ctr) * 100 
          : 0,
        _position: data.avgPosition,
        _traffic: data.totalClicks,
        _impressions: data.totalImpressions,
        _ctr: data.avgCtr,
      }))
      .sort((a, b) => {
        let valueA, valueB;
        
        switch (filters.sortBy) {
          case 'contentScore':
          case 'traffic':
          case 'impressions':
          case 'ctr':
            // Invert the modifier for these metrics - higher values should be at top
            const invertedModifier = filters.sortOrder === 'asc' ? -1 : 1;
            valueA = filters.sortBy === 'contentScore' ? a.contentScore : a[`_${filters.sortBy}`];
            valueB = filters.sortBy === 'contentScore' ? b.contentScore : b[`_${filters.sortBy}`];
            return (Number(valueA) - Number(valueB)) * invertedModifier;
          case 'position':
            // Position keeps original sort (lower is better)
            valueA = a._position;
            valueB = b._position;
            const modifier = filters.sortOrder === 'asc' ? 1 : -1;
            return (Number(valueA) - Number(valueB)) * modifier;
          default:
            valueA = a[filters.sortBy];
            valueB = b[filters.sortBy];
            return (Number(valueA) - Number(valueB)) * (filters.sortOrder === 'asc' ? 1 : -1);
        }
      })
      .slice(0, filters.limit);

  } catch (error) {
    console.error('Error fetching search analytics:', error);
    // Return a fallback state instead of throwing
    return [{
      page: await getCurrentWebsite(),
      mainKeyword: "Error loading data",
      contentScore: 0,
      position: 0,
      traffic: 0,
      impressions: 0,
      ctr: 0,
      clicks: 0,
      positionTrend: 0,
      trafficTrend: 0,
      impressionsTrend: 0,
      ctrTrend: 0,
      _position: 0,
      _traffic: 0,
      _impressions: 0,
      _ctr: 0
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