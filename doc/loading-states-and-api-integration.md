# Loading States and API Integration

## Overview

This document outlines the implementation of enhanced loading states and real API data integration for the SEO Audit tool. The improvements focus on providing a better user experience during data loading and optimizing API calls for efficiency.

## Features

### 1. Granular Loading Skeletons

#### Implemented For:
- **Overview Tab:** Individual skeletons for each section of data instead of a full-page skeleton
- **Issues Tab:** Cell-level skeletons for the "Pages Affected" column

#### Benefits:
- Maintains page structure during data loading
- Reduces layout shifts when data loads
- Provides visual cues about which specific data is still loading
- Improves perceived performance by showing the UI structure immediately

### 2. Real API Data for "Pages Affected" Count

#### Implementation:
- Replaced mock random data with real counts from the dedicated API endpoint
- API Endpoint: `https://api.seoscientist.ai/api/performance/issues/count`
- Parameters:
  - `domain`: Current website domain (e.g., 'example.com')
  - `audit_id`: Specific Lighthouse audit ID (e.g., 'uses-passive-event-listeners')

#### Sample Response:
```json
[
  {
    "audit_id": "uses-passive-event-listeners",
    "title": "Does not use passive listeners to improve scrolling performance",
    "affected_pages_count": 1
  }
]
```

### 3. API Call Optimization

#### Strategies Implemented:
- **Caching:** Store previously fetched page counts to avoid redundant API calls
- **Tracking:** Keep record of which audit IDs have been fetched to avoid duplicate requests
- **Selective Fetching:** Only fetch data for new audit IDs not previously requested
- **Error Resilience:** Isolated error handling for individual API calls

#### Implementation Details:
- Global cache using `Map<string, Record<string, number>>` to store counts by domain
- React `useRef` to track fetched audit IDs across renders
- Promise.allSettled for parallel API calls with independent error handling

## Code Structure

### Overview Tab Loading State

The `OverviewTab` component now accepts an `isLoading` prop and conditionally renders skeleton components for each section while data is loading:

```tsx
export function OverviewTab({ siteHealth, metrics, crawledPages, isLoading = false }: OverviewTabProps) {
  return (
    <div className="space-y-8">
      {/* Components with conditional skeleton rendering */}
      {isLoading ? <Skeleton className="..." /> : <ActualContent />}
    </div>
  );
}
```

### Issues Tab with Real Pages Affected Count

The `IssuesTab` component fetches real data for the "Pages Affected" count:

```tsx
// Cache for storing page counts to avoid redundant API calls
const pageCountsCache = new Map<string, Record<string, number>>();

export function IssuesTab({ failedAudits, isLoading, error, currentWebsite }: IssuesTabProps) {
  const [pageCountsMap, setPageCountsMap] = useState<Record<string, number>>({});
  const fetchedAuditIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Fetch page counts for failed audits - optimized to avoid redundant calls
    // ...
  }, [failedAudits, currentWebsite, pageCountsMap]);

  // ...

  // Convert Web Vitals audits to issues
  const getIssuesFromAudits = () => {
    // ...
    return failedAudits.map((audit) => {
      // ...
      // If we have page count data, use it. Otherwise, set to null to show skeleton
      const pagesAffected = audit.id in pageCountsMap ? pageCountsMap[audit.id] : null;
      
      return {
        // ...
        pagesAffected,
        // ...
      };
    });
  };

  // ...render logic with skeleton in cells
}
```

## Main Page Integration

The `SeoAuditPage` component has been updated to pass the necessary props to child components:

```tsx
<TabsContent value="overview" className="mt-0">
  <OverviewTab
    siteHealth={mockData.siteHealth}
    metrics={mockData.metrics}
    crawledPages={mockData.crawledPages}
    isLoading={vitalsLoading}
  />
</TabsContent>

<TabsContent value="issues" className="mt-0">
  <IssuesTab 
    failedAudits={webVitalsData?.failed_audits || []} 
    isLoading={vitalsLoading}
    error={vitalsError}
    currentWebsite={currentWebsite}
  />
</TabsContent>
```

## Benefits and User Experience Improvements

1. **Faster Perceived Loading:** Users see the page structure immediately
2. **Reduced UI Jumps:** Layout stays consistent as data loads
3. **Targeted Visual Feedback:** Clear indication of what's still loading
4. **Real Data vs. Mock Data:** Accurate "Pages Affected" counts instead of random numbers
5. **Improved API Performance:** Fewer API calls through caching and tracking
6. **Better Error Resilience:** Individual cells can fail without affecting the entire view

## Future Improvements

1. **Batch API:** Consider implementing a batch endpoint that accepts multiple audit IDs
2. **Prefetching:** Load page counts for common issues before they're needed
3. **Progressive Loading:** Implement staggered loading for better perceived performance
4. **Local Storage Persistence:** Store cache between sessions for returning users 