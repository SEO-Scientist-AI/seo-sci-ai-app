'use server'

import { useAuditStore } from '@/store/audit-store';
import { getWebVitals, WebVitalsResponse } from './performance/getWebVitals';
import { getIssuesCount, AuditIssueCount } from './performance/getIssuesCount';

export async function processUrlsInBatches(domain: string) {
  const store = useAuditStore.getState();
  const { urls, processedUrls } = store;
  
  // Start processing
  store.startProcessing(domain);
  
  try {
    // Get unprocessed URLs
    const remainingUrls = urls.filter(url => !processedUrls.includes(url));
    console.log('Starting URL processing with:', { remainingUrls, domain });
    
    // Process one URL at a time for testing
    for (let i = 0; i < remainingUrls.length; i++) {
      const url = remainingUrls[i];
      
      try {
        console.log(`Processing URL ${i + 1}/${remainingUrls.length}:`, url);
        
        // Process web vitals - pass the full URL from GSC
        const vitals = await getWebVitals(url);
        console.log('Web vitals result:', vitals);
        store.addProcessedUrl(url);
        store.updateUrlAnalysis(url, vitals);
        
        // Get updated issue stats after each URL - pass the domain
        console.log('Fetching issue stats for domain:', domain);
        const issueStats = await getIssuesCount(domain);
        console.log('Issue stats result:', issueStats);
        
        store.setIssues(issueStats.map(issue => ({
          id: issue.audit_id,
          name: issue.title,
          severity: issue.audit_id.includes('error') ? 'Error' : 'Warning',
          pagesAffected: issue.affected_pages_count,
          impact: issue.affected_pages_count > 100 ? 'High' : issue.affected_pages_count > 50 ? 'Medium' : 'Low'
        })));
        
        // Add a small delay before next URL
        if (i + 1 < remainingUrls.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Error processing URL ${url}:`, error);
        store.addFailedUrl(url);
      }
    }
  } catch (error) {
    console.error('Error in batch processing:', error);
  } finally {
    store.stopProcessing();
  }
} 