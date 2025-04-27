"use server";

import { cookies } from "next/headers";

// Add TypeScript declaration at the top of the file
declare global {
  var keywordCache: {
    [key: string]: {
      total: number;
      keywords: KeywordResult[];
      timestamp: number;
    }
  };
}

// For better debugging in Cloudflare
function logDebug(message: string, data?: any) {
  console.log(`[KeywordAPI] ${message}`, data ? JSON.stringify(data).substring(0, 200) + "..." : "");
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.seoscientist.ai";
const API_USER = process.env.NEXT_PUBLIC_API_USER;
const API_PASSWORD = process.env.NEXT_PUBLIC_API_PASSWORD;

// Define API response interfaces
interface KeywordTrend {
  monthly?: number;
  quarterly?: number;
  yearly?: number;
}

interface ApiKeyword {
  site: string;
  keyword: string;
  position: number | null;
  search_volume: number;
  difficulty: number;
  cpc: number | null;
  trend?: KeywordTrend;
  last_updated: string;
}

interface KeywordsResponse {
  total: number;
  results: ApiKeyword[];
}

interface UpsertResponse {
  upserted?: number;
  site?: string;
  count?: number;
  error?: string;
}

interface KeywordResult {
  id: string;
  keyword: string;
  position: number | null;
  change: number;
  volume: number;
  difficulty: "easy" | "medium" | "hard";
  intent: "informational" | "transactional" | "navigational";
  cpc?: number | null;
  trends?: KeywordTrend;
}

/**
 * Get keywords for a website, fetching and upserting only if needed
 */
export async function getWebsiteKeywords(
  site?: string,
  forceRefresh: boolean = false,
  options: {
    limit?: number;
    offset?: number;
    language_code?: string;
    location_code?: number;
  } = {}
) {
  try {
    // Log environment info for debugging
    logDebug(`API Info: BASE=${API_BASE}, USER=${API_USER ? "SET" : "NOT SET"}, PASS=${API_PASSWORD ? "SET" : "NOT SET"}`);
    
    // Use the provided site or get from cookies
    const targetSite = site || cookies().get("currentWebsite")?.value;
    
    if (!targetSite) {
      return { error: "No website selected", keywords: [] };
    }
    
    logDebug(`Getting keywords for: ${targetSite}, forceRefresh: ${forceRefresh}`);
    const { limit = 50, offset = 0, language_code = "en", location_code = 2840 } = options;

    // Create cache key for this specific request
    const cacheKey = `keywords-${targetSite}-${limit}-${offset}-${language_code}-${location_code}`;
    
    // Initialize global.keywordCache if it doesn't exist (Cloudflare may not persist globals)
    if (typeof global.keywordCache === 'undefined') {
      logDebug("Initializing global keyword cache");
      global.keywordCache = {};
    }
    
    const cachedData = global.keywordCache?.[cacheKey];

    // Check for cached data (in memory cache)
    if (!forceRefresh && cachedData && (Date.now() - cachedData.timestamp) < 15 * 60 * 1000) {
      logDebug(`Using cached keywords for ${targetSite}`);
      return {
        total: cachedData.total,
        keywords: cachedData.keywords,
        cached: true
      };
    }

    // First try to get existing keywords
    logDebug("Fetching existing keywords");
    const existingKeywords = await fetchExistingKeywords(targetSite, limit, offset);
    logDebug(`Fetch result: total=${existingKeywords.total}, statusCode=${existingKeywords.statusCode}`);

    // If we have keywords and don't need to refresh, return them
    if (existingKeywords.total > 0 && !forceRefresh) {
      // Store in memory cache
      try {
        if (!global.keywordCache) global.keywordCache = {};
        global.keywordCache[cacheKey] = {
          total: existingKeywords.total,
          keywords: mapApiKeywordsToUIFormat(existingKeywords.results),
          timestamp: Date.now()
        };
        logDebug("Updated keyword cache");
      } catch (cacheError) {
        logDebug("Failed to update cache", cacheError);
      }

      return {
        total: existingKeywords.total,
        keywords: mapApiKeywordsToUIFormat(existingKeywords.results),
      };
    }

    // If no keywords exist (404) or force refresh is requested, upsert keywords
    if (existingKeywords.statusCode === 404 || existingKeywords.total === 0 || forceRefresh) {
      logDebug(`Upserting keywords for ${targetSite}`);
      const upsertResult = await upsertKeywords(targetSite, language_code, location_code, limit);
      
      if (upsertResult.error) {
        logDebug(`Upsert error: ${upsertResult.error}`);
        return { error: upsertResult.error, keywords: [] };
      }
      
      logDebug(`Upsert successful, fetching fresh keywords for ${targetSite}`);
      // After upserting, fetch the keywords again
      const freshKeywords = await fetchExistingKeywords(targetSite, limit, offset);
      
      // Store in memory cache
      try {
        if (!global.keywordCache) global.keywordCache = {};
        global.keywordCache[cacheKey] = {
          total: freshKeywords.total,
          keywords: mapApiKeywordsToUIFormat(freshKeywords.results),
          timestamp: Date.now()
        };
        logDebug("Updated keyword cache after upsert");
      } catch (cacheError) {
        logDebug("Failed to update cache after upsert", cacheError);
      }

      return {
        total: freshKeywords.total,
        keywords: mapApiKeywordsToUIFormat(freshKeywords.results),
      };
    }

    // If we get here, something unexpected happened
    logDebug(`Unexpected flow: statusCode=${existingKeywords.statusCode}, total=${existingKeywords.total}`);
    return { error: `Failed to get keywords (status ${existingKeywords.statusCode})`, keywords: [] };
  } catch (error) {
    logDebug("Error in getWebsiteKeywords:", error);
    return { error: "Failed to fetch keywords: " + (error instanceof Error ? error.message : String(error)), keywords: [] };
  }
}

/**
 * Fetch existing keywords for a site
 */
async function fetchExistingKeywords(site: string, limit: number, offset: number): Promise<{ total: number; results: ApiKeyword[]; statusCode?: number }> {
  const params = new URLSearchParams({
    site,
    limit: limit.toString(),
    offset: offset.toString(),
  });

  // Check for API credentials
  if (!API_USER || !API_PASSWORD) {
    logDebug("API credentials not found in environment variables");
    return { total: 0, results: [], statusCode: 500 };
  }

  // Create credentials for authentication
  const credentials = Buffer.from(
    `${API_USER}:${API_PASSWORD}`
  ).toString('base64');

  try {
    const url = `${API_BASE}/keywords/site?${params.toString()}`;
    logDebug(`Fetching keywords from: ${url}`);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${credentials}`,
      },
      cache: "no-store",
    });

    logDebug(`GET keywords response status: ${response.status} ${response.statusText}`);

    // Return status code for better flow control
    if (!response.ok) {
      if (response.status === 403) {
        logDebug("Authentication failed - check API credentials");
      }
      return { total: 0, results: [], statusCode: response.status };
    }

    const data = await response.json();
    return { ...data as KeywordsResponse, statusCode: response.status };
  } catch (error) {
    logDebug("Error fetching keywords:", error);
    return { total: 0, results: [], statusCode: 500 };
  }
}

/**
 * Upsert keywords for a site
 */
async function upsertKeywords(
  site: string, 
  language_code: string, 
  location_code: number, 
  limit: number
): Promise<UpsertResponse> {
  try {
    // Check for API credentials
    if (!API_USER || !API_PASSWORD) {
      logDebug("API credentials not found in environment variables");
      return { error: "API credentials not configured" };
    }
    
    // Create credentials for authentication
    const credentials = Buffer.from(
      `${API_USER}:${API_PASSWORD}`
    ).toString('base64');

    const url = `${API_BASE}/keywords/site`;
    logDebug(`POSTing to upsert keywords at ${url}`);
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${credentials}`,
      },
      body: JSON.stringify({
        site,
        language_code,
        location_code,
        limit,
      }),
    });

    logDebug(`POST keywords response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const responseText = await response.text();
      logDebug(`Failed to upsert keywords: ${response.status}`, responseText);
      
      try {
        const errorData = JSON.parse(responseText) as { detail?: string };
        return { error: errorData.detail || `HTTP error ${response.status}` };
      } catch (e) {
        return { error: `HTTP error ${response.status}: ${responseText.substring(0, 100)}` };
      }
    }

    const data = await response.json();
    logDebug(`Upsert response:`, data);
    return data as UpsertResponse;
  } catch (error) {
    logDebug("Error upserting keywords:", error);
    return { error: "Failed to upsert keywords: " + (error instanceof Error ? error.message : String(error)) };
  }
}

/**
 * Map API keyword format to UI format
 */
function mapApiKeywordsToUIFormat(apiKeywords: ApiKeyword[]): KeywordResult[] {
  return apiKeywords.map((kw) => {
    let difficulty: "easy" | "medium" | "hard" = "medium";
    
    // Map difficulty score to categorical value
    if (kw.difficulty <= 30) {
      difficulty = "easy";
    } else if (kw.difficulty >= 70) {
      difficulty = "hard";
    }
    
    // Determine intent based on keyword features (simplified approach)
    let intent: "informational" | "transactional" | "navigational" = "informational";
    
    // Simple heuristic - could be improved with better logic
    const keyword = kw.keyword.toLowerCase();
    if (keyword.includes("buy") || keyword.includes("price") || keyword.includes("cost") || 
        keyword.includes("purchase") || keyword.includes("shop") || keyword.includes("deal")) {
      intent = "transactional";
    } else if (keyword.includes("how") || keyword.includes("what") || keyword.includes("why") ||
              keyword.includes("when") || keyword.includes("guide") || keyword.includes("tutorial")) {
      intent = "informational";
    } else if (keyword.includes("login") || keyword.includes("sign in") || keyword.includes("account") ||
              keyword.includes("website") || keyword.includes("official")) {
      intent = "navigational";
    }
    
    return {
      id: kw.keyword,
      keyword: kw.keyword,
      position: kw.position,
      change: kw.trend?.monthly || 0,
      volume: kw.search_volume,
      difficulty,
      intent,
      cpc: kw.cpc,
      trends: kw.trend,
    };
  });
} 