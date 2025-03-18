'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { SearchAnalyticsPage } from '@/types/searchConsole';
import { IndexingStatus } from '@/app/actions/checkIndexingStatus';

interface SidebarState {
  pageData: Record<string, {
    indexStatus: IndexingStatus | null;
    isIndexing: boolean;
    lastChecked?: number;
  }>;
}

interface SidebarContextType extends SidebarState {
  updatePageStatus: (url: string, status: IndexingStatus) => void;
  setPageIndexing: (url: string, isIndexing: boolean) => void;
  getPageState: (url: string) => SidebarState['pageData'][string] | undefined;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SidebarState>({
    pageData: {}
  });

  const updatePageStatus = useCallback((url: string, status: IndexingStatus) => {
    setState(prev => ({
      ...prev,
      pageData: {
        ...prev.pageData,
        [url]: {
          ...prev.pageData[url],
          indexStatus: status,
          lastChecked: Date.now()
        }
      }
    }));
  }, []);

  const setPageIndexing = useCallback((url: string, isIndexing: boolean) => {
    setState(prev => ({
      ...prev,
      pageData: {
        ...prev.pageData,
        [url]: {
          ...prev.pageData[url],
          isIndexing
        }
      }
    }));
  }, []);

  const getPageState = useCallback((url: string) => {
    return state.pageData[url];
  }, [state.pageData]);

  return (
    <SidebarContext.Provider value={{
      ...state,
      updatePageStatus,
      setPageIndexing,
      getPageState
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
} 