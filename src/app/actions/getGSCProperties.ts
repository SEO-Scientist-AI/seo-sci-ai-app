import { auth } from "@/server/auth";

type GSCProperty = {
  siteUrl: string;
  permissionLevel: string;
  clicks: string | number;
  impressions: string | number;
};

interface StatsResponse {
  rows?: {
    clicks: number;
    impressions: number;
  }[];
}

interface GSCSitesResponse {
  siteEntry: {
    siteUrl: string;
    permissionLevel: string;
  }[];
}

interface GoogleErrorResponse {
  error?: {
    message?: string;
    code?: number;
    status?: string;
  };
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 1
): Promise<Response> {
  let lastError;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return response;
      }

      const errorData = (await response.json()) as GoogleErrorResponse;

      // If unauthorized, try to refresh the token
      if (response.status === 401 && i < maxRetries) {
        // Force a new session to refresh the token
        await auth();
        continue;
      }

      throw new Error(errorData.error?.message || response.statusText);
    } catch (error) {
      lastError = error;
      if (i === maxRetries) {
        throw error;
      }
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }

  throw lastError;
}

export async function getGSCProperties(): Promise<GSCProperty[]> {
  try {
    const session = await auth();

    if (!session?.user || !session.accessToken) {
      throw new Error("Unauthorized");
    }

    if (session.error === "RefreshAccessTokenError") {
      throw new Error("Failed to refresh access token. Please sign in again.");
    }

    // Fetch sites from Google Search Console API
    const response = await fetchWithRetry(
      "https://www.googleapis.com/webmasters/v3/sites",
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    const data = (await response.json()) as GSCSitesResponse;

    // Get analytics data for each site
    const propertiesWithStats = await Promise.all(
      data.siteEntry.map(async (site) => {
        const statsResponse = await fetchWithRetry(
          `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
            site.siteUrl
          )}/searchAnalytics/query`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
              endDate: new Date().toISOString().split("T")[0],
            }),
          }
        );

        const statsData = (await statsResponse.json()) as StatsResponse;

        const clicks = statsData.rows?.[0]?.clicks
          ? Math.round(statsData.rows[0].clicks / 7)
          : "0";
        const impressions = statsData.rows?.[0]?.impressions
          ? Math.round(statsData.rows[0].impressions / 7)
          : "0";

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
    console.error("Error fetching GSC properties:", error);
    return [];
  }
}
