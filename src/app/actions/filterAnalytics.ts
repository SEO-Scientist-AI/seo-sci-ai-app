'use server';

import { AnalyticsFilters } from "@/types/analytics";
import { getSearchAnalytics } from "./getSearchAnalytics";

export async function filterAnalytics(filters: AnalyticsFilters) {
  return getSearchAnalytics(filters);
} 