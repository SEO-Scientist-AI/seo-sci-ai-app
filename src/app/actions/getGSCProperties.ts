import { auth } from "@/server/auth";

type GSCProperty = {
  siteUrl: string;
  permissionLevel: string;
  clicks: string | number;
  impressions: string | number;
}

interface StatsResponse {
  rows?: {
    clicks: number;
    impressions: number;
    ctr: number;
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
        const statsResponse = await fetch(
          `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site.siteUrl)}/searchAnalytics/query`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              endDate: new Date().toISOString().split('T')[0],
            })
          }
        );

        const statsData = (await statsResponse.json()) as StatsResponse;
        
        const clicks = statsData.rows?.[0]?.clicks 
          ? Math.round(statsData.rows[0].clicks / 7) 
          : '0';
        const impressions = statsData.rows?.[0]?.impressions 
          ? Math.round(statsData.rows[0].impressions / 7)
          : '0';

        return {
          siteUrl: site.siteUrl,
          permissionLevel: site.permissionLevel,
          clicks: clicks.toString(),
          impressions: impressions.toString(),
        };
      })
    );

    return propertiesWithStats;

  } catch (error) {
    console.error('Error fetching GSC properties:', error);
    return [];
  }
} 