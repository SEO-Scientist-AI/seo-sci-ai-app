import { create } from 'zustand';

export interface SeoIssue {
  id: string;
  name: string;
  severity: "Warning" | "Error";
  pagesAffected: number;
  impact: "Low" | "Medium" | "High";
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
  
  // Actions
  setUrls: (urls: string[]) => void;
  startProcessing: (domain: string) => void;
  stopProcessing: () => void;
  updateProgress: (processed: number) => void;
  setIssues: (issues: SeoIssue[]) => void;
  addProcessedUrl: (url: string) => void;
  addFailedUrl: (url: string) => void;
  resetState: () => void;
}

export const useAuditStore = create<AuditState>((set, get) => ({
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

  resetState: () => set({
    urls: [],
    processedUrls: [],
    failedUrls: [],
    currentDomain: null,
    isProcessing: false,
    progress: { total: 0, processed: 0 },
    issues: { total: 0, items: [] },
  }),
})); 