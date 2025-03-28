'use server';

import { AnalyticsFilters } from "@/types/analytics";
import { getSearchAnalytics } from "./getSearchAnalytics";
import { headers } from "next/headers";

export async function filterAnalytics(filters: AnalyticsFilters) {
  // Get URL parameters from the request headers
  const headersList = headers();
  const url = headersList.get("referer") || "";
  
  // Extract URLSearchParams from the URL
  let urlParams: URLSearchParams | undefined;
  try {
    const urlObj = new URL(url);
    urlParams = urlObj.searchParams;
  } catch (e) {
    // If URL parsing fails, continue without params
    console.error("Failed to parse URL for parameters:", e);
  }
  
  return getSearchAnalytics(filters, urlParams);
} 