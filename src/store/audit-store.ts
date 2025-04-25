import { create } from 'zustand';

export interface SeoIssue {
  id: string;
  name: string;
  severity: "Warning" | "Error";
  pagesAffected: number;
  impact: "Low" | "Medium" | "High";
}

interface WebVitalsResponse {
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

interface AuditState {
  urls: string[];
  processedUrls: string[];
  failedUrls: string[];
  currentDomain: string | null;
  isProcessing: boolean;
  progress: {
    total: number;
    processed: number;
  };
  issues: {
    total: number;
    items: SeoIssue[];
  };
  urlAnalysis: Record<string, WebVitalsResponse>;
  
  // Actions
  setUrls: (urls: string[]) => void;
  startProcessing: (domain: string) => void;
  stopProcessing: () => void;
  updateProgress: (processed: number) => void;
  setIssues: (issues: SeoIssue[]) => void;
  addProcessedUrl: (url: string) => void;
  addFailedUrl: (url: string) => void;
  updateUrlAnalysis: (url: string, analysis: WebVitalsResponse) => void;
  resetState: () => void;
}

export const useAuditStore = create<AuditState>((set) => ({
  urls: [],
  processedUrls: [],
  failedUrls: [],
  currentDomain: null,
  isProcessing: false,
  progress: {
    total: 0,
    processed: 0,
  },
  issues: {
    total: 0,
    items: [],
  },
  urlAnalysis: {},

  setUrls: (urls) => set((state) => ({
    urls,
    progress: { ...state.progress, total: urls.length }
  })),

  startProcessing: (domain) => set({
    currentDomain: domain,
    isProcessing: true,
  }),

  stopProcessing: () => set({ isProcessing: false }),

  updateProgress: (processed) => set((state) => ({
    progress: { ...state.progress, processed }
  })),

  setIssues: (issues) => set({
    issues: {
      total: issues.length,
      items: issues
    }
  }),

  addProcessedUrl: (url) => set((state) => ({
    processedUrls: [...state.processedUrls, url],
    progress: {
      ...state.progress,
      processed: state.processedUrls.length + 1
    }
  })),

  addFailedUrl: (url) => set((state) => ({
    failedUrls: [...state.failedUrls, url]
  })),

  updateUrlAnalysis: (url, analysis) => set((state) => ({
    urlAnalysis: {
      ...state.urlAnalysis,
      [url]: analysis
    }
  })),

  resetState: () => set({
    urls: [],
    processedUrls: [],
    failedUrls: [],
    currentDomain: null,
    isProcessing: false,
    progress: { total: 0, processed: 0 },
    issues: { total: 0, items: [] },
    urlAnalysis: {},
  }),
})); 