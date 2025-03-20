import { auth } from "@/server/auth";

type GSCProperty = {
  siteUrl: string;
  permissionLevel: string;
  clicks: string | number;
  impressions: string | number;
  position: number;
  ctr: number;
  clicksTrend: number;
  impressionsTrend: number;
  positionTrend: number;
  ctrTrend: number;
}

interface StatsResponse {
  rows?: {
    clicks: number;
    impressions: number;
    ctr: number;
    position?: number;
  }[];
}

interface GSCSitesResponse {
  siteEntry: {
    siteUrl: string;
    permissionLevel: string;
  }[];
}

export async function getGSCProperties(): Promise<GSCProperty[]> {
  try {
    const session = await auth();
    
    if (!session?.user || !session.accessToken) {
      throw new Error("Unauthorized");
    }

    // Fetch sites from Google Search Console API
    const response = await fetch(
      'https://www.googleapis.com/webmasters/v3/sites',
      {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch GSC properties');
    }

    const data = await response.json() as GSCSitesResponse;
    
    // Get analytics data for each site
    const propertiesWithStats = await Promise.all(
      data.siteEntry.map(async (site) => {
        // Current period (last 7 days)
        const currentEndDate = new Date();
        const currentStartDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        // Previous period (7 days before the current period)
        const previousEndDate = new Date(currentStartDate);
        previousEndDate.setDate(previousEndDate.getDate() - 1);
        const previousStartDate = new Date(previousEndDate);
        previousStartDate.setDate(previousStartDate.getDate() - 7);

        // Fetch current period stats
        const currentStatsResponse = await fetch(
          `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site.siteUrl)}/searchAnalytics/query`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              startDate: currentStartDate.toISOString().split('T')[0],
              endDate: currentEndDate.toISOString().split('T')[0],
            })
          }
        );

        // Fetch previous period stats
        const previousStatsResponse = await fetch(
          `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site.siteUrl)}/searchAnalytics/query`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              startDate: previousStartDate.toISOString().split('T')[0],
              endDate: previousEndDate.toISOString().split('T')[0],
            })
          }
        );

        const currentStatsData = (await currentStatsResponse.json()) as StatsResponse;
        const previousStatsData = (await previousStatsResponse.json()) as StatsResponse;
        
        // Calculate current metrics
        const currentClicks = currentStatsData.rows?.[0]?.clicks 
          ? Math.round(currentStatsData.rows[0].clicks / 7) 
          : 0;
        const currentImpressions = currentStatsData.rows?.[0]?.impressions 
          ? Math.round(currentStatsData.rows[0].impressions / 7)
          : 0;
        const currentPosition = currentStatsData.rows?.[0]?.position ?? 0;
        const currentCtr = currentStatsData.rows?.[0]?.ctr ?? 0;

        // Calculate previous metrics
        const previousClicks = previousStatsData.rows?.[0]?.clicks 
          ? Math.round(previousStatsData.rows[0].clicks / 7) 
          : 0;
        const previousImpressions = previousStatsData.rows?.[0]?.impressions 
          ? Math.round(previousStatsData.rows[0].impressions / 7)
          : 0;
        const previousPosition = previousStatsData.rows?.[0]?.position ?? 0;
        const previousCtr = previousStatsData.rows?.[0]?.ctr ?? 0;

        // Calculate trends (percentage change)
        // For position, negative is good (moving up in rankings)
        const clicksTrend = previousClicks === 0 
          ? 0 
          : Math.round(((currentClicks - previousClicks) / previousClicks) * 100);
        
        const impressionsTrend = previousImpressions === 0 
          ? 0 
          : Math.round(((currentImpressions - previousImpressions) / previousImpressions) * 100);
        
        const positionTrend = previousPosition === 0 
          ? 0 
          : Math.round(((previousPosition - currentPosition) / previousPosition) * 100);
        
        const ctrTrend = previousCtr === 0 
          ? 0 
          : Math.round(((currentCtr - previousCtr) / previousCtr) * 100);

        return {
          siteUrl: site.siteUrl,
          permissionLevel: site.permissionLevel,
          clicks: currentClicks.toString(),
          impressions: currentImpressions.toString(),
          position: currentPosition,
          ctr: Math.round(currentCtr * 100),
          clicksTrend,
          impressionsTrend,
          positionTrend,
          ctrTrend
        };
      })
    );

    return propertiesWithStats;

  } catch (error) {
    console.error('Error fetching GSC properties:', error);
    return [];
  }
} 