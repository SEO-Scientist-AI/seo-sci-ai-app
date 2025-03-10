export type SearchAnalyticsPage = {
  page: string;
  mainKeyword: string;
  contentScore: string;
  position: string;
  traffic: string;
  impressions: string;
  ctr: string;
};

export type SearchConsoleResponse = {
  rows: {
    keys: string[];
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }[];
}; 