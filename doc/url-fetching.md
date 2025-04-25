# URL Fetching System Documentation

## Overview

The URL fetching system is a core component that integrates with Google Search Console (GSC) to discover and manage URLs for SEO auditing. This document explains how to use and extend the system.

## Architecture

### Core Components

1. **URL Store (`useAuditStore`)**
   ```typescript
   interface AuditState {
     urls: string[];              // All discovered URLs
     processedUrls: string[];     // URLs that have been crawled
     failedUrls: string[];        // URLs that failed during crawling
     isProcessing: boolean;       // Current processing state
     progress: {
       total: number;
       processed: number;
     };
   }
   ```

2. **GSC URL Fetcher (`getGSCUrls`)**
   ```typescript
   async function getGSCUrls(
     domain?: string | null,
     urlParams?: URLSearchParams
   ): Promise<string[]>
   ```

3. **URL Discovery Component (`UrlFetcher`)**
   - Handles automatic and manual URL fetching
   - Displays fetching progress and results
   - Integrates with the global store

## How to Use

### 1. Accessing URL Data

```typescript
import { useAuditStore } from '@/store/audit-store';

function YourComponent() {
  const { urls, processedUrls, failedUrls } = useAuditStore();
  
  // Access URL data
  const totalUrls = urls.length;
  const crawledUrls = processedUrls.length;
  const failedCount = failedUrls.length;
}
```

### 2. Fetching URLs Manually

```typescript
import { getGSCUrls } from '@/app/actions/getGscUrls';

async function fetchUrls(website: string) {
  try {
    const urls = await getGSCUrls(website);
    // Handle the URLs
  } catch (error) {
    // Handle errors
  }
}
```

### 3. Integrating with New APIs

```typescript
// Example: Integrating with a custom crawling API
async function customCrawlAPI(urls: string[]) {
  const { setProcessedUrls, addFailedUrl } = useAuditStore.getState();
  
  for (const url of urls) {
    try {
      // Your API call here
      await crawlUrl(url);
      setProcessedUrls([...processedUrls, url]);
    } catch (error) {
      addFailedUrl(url);
    }
  }
}
```

## Authentication

The system uses NextAuth for Google Search Console authentication:

1. Required Scopes:
   - `https://www.googleapis.com/auth/webmasters.readonly`
   - `https://www.googleapis.com/auth/indexing`

2. Token Management:
   ```typescript
   const session = await auth();
   const accessToken = session?.accessToken;
   ```

## Error Handling

The system includes built-in error handling for common scenarios:

1. Authentication Errors:
   - Unauthorized access
   - Invalid or expired tokens
   - Missing permissions

2. API Errors:
   - Rate limiting
   - Invalid requests
   - Network issues

3. Data Validation:
   - Invalid URL formats
   - Missing required fields
   - Malformed responses

## Best Practices

1. **URL Processing**
   - Process URLs in batches to avoid rate limits
   - Implement retry logic for failed requests
   - Cache results when appropriate

2. **State Management**
   ```typescript
   // Good: Update state atomically
   useAuditStore.setState(state => ({
     urls: [...state.urls, ...newUrls]
   }));

   // Avoid: Direct mutations
   const store = useAuditStore.getState();
   store.urls.push(...newUrls); // ❌
   ```

3. **Error Recovery**
   ```typescript
   try {
     await fetchUrls(website);
   } catch (error) {
     if (error.status === 429) {
       // Handle rate limiting
       await delay(1000);
       return retry(fetchUrls, website);
     }
     // Handle other errors
   }
   ```

## Extending the System

### 1. Adding New Data Sources

```typescript
// Example: Adding a Sitemap XML parser
async function getSitemapUrls(sitemapUrl: string): Promise<string[]> {
  const response = await fetch(sitemapUrl);
  const xml = await response.text();
  // Parse XML and extract URLs
  return extractedUrls;
}

// Integration with existing system
useAuditStore.setState(state => ({
  urls: [...state.urls, ...sitemapUrls]
}));
```

### 2. Custom URL Processing

```typescript
// Example: Adding custom URL validation
function validateUrls(urls: string[]): ValidatedUrl[] {
  return urls.map(url => ({
    url,
    isValid: isValidUrl(url),
    type: getUrlType(url),
    priority: calculatePriority(url)
  }));
}
```

### 3. Adding New Features

```typescript
// Example: URL categorization
interface UrlCategory {
  pattern: RegExp;
  name: string;
  priority: number;
}

const categories: UrlCategory[] = [
  { pattern: /\/blog\//, name: 'Blog', priority: 1 },
  { pattern: /\/products\//, name: 'Products', priority: 2 },
  // Add more categories
];

function categorizeUrls(urls: string[]): CategorizedUrl[] {
  return urls.map(url => ({
    url,
    category: findCategory(url, categories)
  }));
}
```

## Monitoring and Analytics

1. **Performance Metrics**
   - URL discovery time
   - Processing rates
   - Error rates
   - API latency

2. **Usage Statistics**
   ```typescript
   interface UrlStats {
     totalDiscovered: number;
     successRate: number;
     averageProcessingTime: number;
     errorDistribution: Record<string, number>;
   }
   ```

## Troubleshooting

Common issues and solutions:

1. **Rate Limiting**
   - Implement exponential backoff
   - Use request queuing
   - Cache responses

2. **Memory Management**
   - Batch process large URL sets
   - Implement pagination
   - Clean up unused data

3. **API Integration**
   - Verify API credentials
   - Check request formatting
   - Validate responses

## Future Enhancements

Planned improvements and features:

1. **URL Priority System**
   - Intelligent crawl ordering
   - Resource optimization
   - Custom priority rules

2. **Advanced Analytics**
   - URL patterns analysis
   - Performance insights
   - Error prediction

3. **Integration Options**
   - Additional data sources
   - Custom processors
   - Export capabilities

## Integration with Performance APIs

### Web Vitals Analysis

The system can integrate with the serverless performance API to analyze web vitals for fetched URLs:

```typescript
interface WebVitalsMetric {
  value: number | string | null;
  category: string | null;
}

interface WebVitalsResponse {
  requested_url: string;
  final_url: string;
  fetch_time: string;
  overall_performance_score: number | null;
  lab_data: {
    lcp: WebVitalsMetric;  // Largest Contentful Paint
    cls: WebVitalsMetric;  // Cumulative Layout Shift
    tbt: WebVitalsMetric;  // Total Blocking Time
    fcp: WebVitalsMetric;  // First Contentful Paint
    si: WebVitalsMetric;   // Speed Index
    tti: WebVitalsMetric;  // Time to Interactive
  };
  field_data: {
    lcp: WebVitalsMetric;
    cls: WebVitalsMetric;
    fid: WebVitalsMetric;  // First Input Delay
    inp: WebVitalsMetric;  // Interaction to Next Paint
    fcp: WebVitalsMetric;
  };
  diagnostics: {
    total_page_size_bytes: number;
    total_request_count: number;
    num_console_errors: number;
    server_response_time_ms: number;
    main_thread_work_ms: number;
    js_bootup_time_ms: number;
  };
  failed_audits: Array<{
    id: string;
    title: string;
    description: string;
    score: number | null;
    display_value: string | null;
    details_summary: any[] | null;
  }>;
  error: string | null;
}

// Example: Analyzing web vitals for fetched URLs
async function analyzeWebVitals(urls: string[]) {
  const results: WebVitalsResponse[] = [];
  
  for (const url of urls) {
    try {
      const response = await fetch(`/api/performance/web-vitals?url=${encodeURIComponent(url)}&strategy=desktop`);
      const data = await response.json();
      results.push(data);
      
      // Update store with results
      useAuditStore.getState().updateUrlAnalysis(url, data);
    } catch (error) {
      console.error(`Failed to analyze ${url}:`, error);
    }
  }
  
  return results;
}
```

### Issue Counting and Analysis

Track and analyze issues across all fetched URLs:

```typescript
interface AuditIssueCount {
  audit_id: string;
  title: string;
  affected_pages_count: number;
}

// Example: Getting issue counts for a domain
async function getIssueStats(domain: string) {
  try {
    const response = await fetch(`/api/performance/issues/count?domain=${domain}`);
    const issues: AuditIssueCount[] = await response.json();
    
    // Update store with issue statistics
    useAuditStore.getState().updateIssueStats(issues);
    
    return issues;
  } catch (error) {
    console.error(`Failed to get issue stats for ${domain}:`, error);
    return [];
  }
}

// Example: Processing URLs in batches for analysis
async function processUrlBatch(urls: string[], batchSize = 5) {
  const batches = [];
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(url => analyzeWebVitals([url]))
    );
    batches.push(results);
    
    // Allow time between batches to avoid rate limiting
    if (i + batchSize < urls.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return batches.flat();
}
```

### Store Integration

Extend the audit store to handle performance data:

```typescript
interface AuditState {
  // ... existing state ...
  urlAnalysis: Record<string, WebVitalsResponse>;
  issueStats: AuditIssueCount[];
  
  // New actions
  updateUrlAnalysis: (url: string, analysis: WebVitalsResponse) => void;
  updateIssueStats: (issues: AuditIssueCount[]) => void;
}

const useAuditStore = create<AuditState>((set) => ({
  // ... existing store setup ...
  urlAnalysis: {},
  issueStats: [],
  
  updateUrlAnalysis: (url, analysis) => 
    set(state => ({
      urlAnalysis: {
        ...state.urlAnalysis,
        [url]: analysis
      }
    })),
    
  updateIssueStats: (issues) =>
    set({ issueStats: issues }),
}));
```

### Best Practices for Performance Analysis

1. **Rate Limiting and Batching**
   - Process URLs in small batches (5-10 URLs at a time)
   - Implement delays between batches
   - Cache results to avoid redundant analysis

2. **Error Handling**
   ```typescript
   function handleAnalysisError(url: string, error: any) {
     const { addFailedUrl } = useAuditStore.getState();
     
     if (error.status === 429) {
       // Rate limit hit - add to retry queue
       addToRetryQueue(url);
     } else {
       // Other errors - mark as failed
       addFailedUrl(url);
     }
   }
   ```

3. **Progress Tracking**
   ```typescript
   interface AnalysisProgress {
     total: number;
     analyzed: number;
     failed: number;
     remaining: number;
   }
   
   function updateAnalysisProgress(progress: AnalysisProgress) {
     useAuditStore.setState(state => ({
       progress: {
         ...state.progress,
         ...progress
       }
     }));
   }
   ```

4. **Data Persistence**
   - Cache analysis results in localStorage
   - Implement data expiration
   - Track analysis timestamps

### Example Usage

```typescript
// Complete analysis workflow
async function analyzeSite(domain: string) {
  // 1. Fetch URLs
  const urls = await getGSCUrls(domain);
  useAuditStore.getState().setUrls(urls);
  
  // 2. Process URLs in batches
  const analysisResults = await processUrlBatch(urls);
  
  // 3. Get issue statistics
  const issueStats = await getIssueStats(domain);
  
  // 4. Update store with complete analysis
  useAuditStore.getState().updateIssueStats(issueStats);
  
  return {
    urls: urls.length,
    analyzed: analysisResults.length,
    issues: issueStats
  };
}
```

This integration provides a complete workflow for:
- Fetching URLs from Google Search Console
- Analyzing web vitals for each URL
- Tracking issues across the domain
- Managing analysis state and progress
- Handling errors and rate limiting
- Persisting analysis results 