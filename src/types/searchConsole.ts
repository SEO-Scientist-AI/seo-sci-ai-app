export interface SearchAnalyticsPage {
  page: string;
  mainKeyword: string;
  position: number;
  traffic: number;
  impressions: number;
  ctr: number;
  clicks: number;
  contentScore: number;
  keywords?: string[];
  _position: number;
  _traffic: number;
  _impressions: number;
  _ctr: number;
}

export type SearchConsoleResponse = {
  rows: {
    keys: string[];
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }[];
}; 