"use server";

import { cookies } from "next/headers";

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
    // Use the provided site or get from cookies
    const targetSite = site || cookies().get("currentWebsite")?.value;
    
    if (!targetSite) {
      return { error: "No website selected", keywords: [] };
    }

    const { limit = 50, offset = 0, language_code = "en", location_code = 2840 } = options;

    // First try to get existing keywords
    const existingKeywords = await fetchExistingKeywords(targetSite, limit, offset);

    // If we have keywords and don't need to refresh, return them
    if (existingKeywords.total > 0 && !forceRefresh) {
      return {
        total: existingKeywords.total,
        keywords: mapApiKeywordsToUIFormat(existingKeywords.results),
      };
    }

    // If no keywords exist or force refresh is requested, upsert keywords
    if (existingKeywords.total === 0 || forceRefresh) {
      const upsertResult = await upsertKeywords(targetSite, language_code, location_code, limit);
      
      if (upsertResult.error) {
        return { error: upsertResult.error, keywords: [] };
      }
      
      // After upserting, fetch the keywords again
      const freshKeywords = await fetchExistingKeywords(targetSite, limit, offset);
      
      return {
        total: freshKeywords.total,
        keywords: mapApiKeywordsToUIFormat(freshKeywords.results),
      };
    }

    return { error: "Failed to get keywords", keywords: [] };
  } catch (error) {
    console.error("Error fetching keywords:", error);
    return { error: "Failed to fetch keywords", keywords: [] };
  }
}

/**
 * Fetch existing keywords for a site
 */
async function fetchExistingKeywords(site: string, limit: number, offset: number): Promise<KeywordsResponse> {
  const params = new URLSearchParams({
    site,
    limit: limit.toString(),
    offset: offset.toString(),
  });

  // Check for API credentials
  if (!API_USER || !API_PASSWORD) {
    console.error("API credentials not found in environment variables");
    return { total: 0, results: [] };
  }

  // Create credentials for authentication
  const credentials = Buffer.from(
    `${API_USER}:${API_PASSWORD}`
  ).toString('base64');

  const response = await fetch(`${API_BASE}/keywords/site?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${credentials}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Failed to fetch keywords:", response.status, response.statusText);
    return { total: 0, results: [] };
  }

  const data = await response.json();
  return data as KeywordsResponse;
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
      console.error("API credentials not found in environment variables");
      return { error: "API credentials not configured" };
    }
    
    // Create credentials for authentication
    const credentials = Buffer.from(
      `${API_USER}:${API_PASSWORD}`
    ).toString('base64');

    const response = await fetch(`${API_BASE}/keywords/site`, {
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

    if (!response.ok) {
      console.error("Failed to upsert keywords:", response.status, response.statusText);
      const errorData = await response.json() as { detail?: string };
      return { error: errorData.detail || "Failed to upsert keywords" };
    }

    const data = await response.json();
    return data as UpsertResponse;
  } catch (error) {
    console.error("Error upserting keywords:", error);
    return { error: "Failed to upsert keywords" };
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