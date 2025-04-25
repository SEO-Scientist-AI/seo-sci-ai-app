'use server'

import { auth } from "@/server/auth";

export interface WebVitalsResponse {
  requested_url: string;
  final_url: string;
  fetch_time: string;
  overall_performance_score: number | null;
  lab_data: {
    lcp: { value: number | null };
    cls: { value: number | null };
    tbt: { value: number | null };
    fcp: { value: number | null };
    si: { value: number | null };
    tti: { value: number | null };
  };
  error: string | null;
}

// Interface to match the API response format
interface ApiWebVitalsResponse {
  requested_url: string;
  final_url: string;
  fetch_time: string;
  overall_performance_score: number | null;
  lab_data: {
    'largest-contentful-paint'?: { value: number };
    'cumulative-layout-shift'?: { value: number };
    'total-blocking-time'?: { value: number };
    'first-contentful-paint'?: { value: number };
    'speed-index'?: { value: number };
    'interactive'?: { value: number };
  };
  error: string | null;
}

// Helper function to ensure URL has a protocol
function ensureUrlHasProtocol(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

// Mock data for development or when API is unavailable
function getMockWebVitals(url: string): WebVitalsResponse {
  return {
    requested_url: url,
    final_url: url,
    fetch_time: new Date().toISOString(),
    overall_performance_score: 85,
    lab_data: {
      lcp: { value: 2500 },
      cls: { value: 0.1 },
      tbt: { value: 300 },
      fcp: { value: 1800 },
      si: { value: 2200 },
      tti: { value: 3500 }
    },
    error: null
  };
}

// Helper function for Basic Auth encoding
function getBasicAuthHeader(): string {
  const username = process.env.NEXT_PUBLIC_API_USER;
  const password = process.env.NEXT_PUBLIC_API_PASSWORD;
  
  if (!username || !password) {
    throw new Error('API credentials are not configured');
  }
  
  const credentials = Buffer.from(`${username}:${password}`).toString('base64');
  return `Basic ${credentials}`;
}

export async function getWebVitals(url: string, strategy: string = 'desktop'): Promise<WebVitalsResponse> {
  try {
    const session = await auth();
    
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    if (!url) {
      throw new Error("URL is required");
    }

    // Ensure URL has a protocol
    const fullUrl = ensureUrlHasProtocol(url);
    console.log(`Processing Web Vitals for URL: ${fullUrl}`);

    // Use environment variable for API URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error('API URL is not configured');
    }
    
    // Build the full request URL
    const requestUrl = `${apiUrl}/performance/web-vitals?url=${encodeURIComponent(fullUrl)}&strategy=${strategy}`;
    
    try {
      const response = await fetch(requestUrl, {
        headers: {
          'Authorization': getBasicAuthHeader(),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      // Parse the API response and map to our interface
      const apiResponse = await response.json() as ApiWebVitalsResponse;
      
      // Map response to our WebVitalsResponse format
      const webVitals: WebVitalsResponse = {
        requested_url: apiResponse.requested_url,
        final_url: apiResponse.final_url,
        fetch_time: apiResponse.fetch_time,
        overall_performance_score: apiResponse.overall_performance_score,
        lab_data: {
          lcp: { value: apiResponse.lab_data?.['largest-contentful-paint']?.value || null },
          cls: { value: apiResponse.lab_data?.['cumulative-layout-shift']?.value || null },
          tbt: { value: apiResponse.lab_data?.['total-blocking-time']?.value || null },
          fcp: { value: apiResponse.lab_data?.['first-contentful-paint']?.value || null },
          si: { value: apiResponse.lab_data?.['speed-index']?.value || null },
          tti: { value: apiResponse.lab_data?.['interactive']?.value || null }
        },
        error: apiResponse.error
      };

      return webVitals;
    } catch (fetchError) {
      console.error("Fetch error:", fetchError);
      return getMockWebVitals(fullUrl);
    }
    
  } catch (error) {
    console.error("Error in getWebVitals:", error);
    return getMockWebVitals(url);
  }
} 