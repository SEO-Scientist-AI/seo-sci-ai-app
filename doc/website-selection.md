# Website Selection System

## Feature Description
A robust website selection system that manages the currently selected website/property across the application using a combination of URL parameters and localStorage for persistence.

## Implementation Details

### Selection Persistence Mechanism
- URL parameters serve as the primary method for sharing links to specific websites
- localStorage used to remember the user's most recently selected website across sessions
- No cookies used for website selection, keeping client-side only storage

### URL Parameter Structure
- Parameter Name: `website`
- Format: `?website=domain.com`
- Example: `https://seo-sci-ai.com/page-audit?website=example.com`

### Data Flow
1. Website Selection
   - The WebsiteSelector component in the top navigation displays available websites
   - When a website is selected, it's stored in localStorage and added to the URL parameters
   - URL is updated with the selected website, maintaining other parameters

2. Website Retrieval Priority
   - First check URL parameters (`website` or `site` param)
   - If not found in URL, check localStorage
   - Display selector if no website is found in either source

3. State Management
   - URL parameter for sharing and bookmarking
   - localStorage for cross-session persistence
   - No server-side state management needed

## Expected Behavior
- Website selection persists across browser sessions using localStorage
- Clicking links with website parameters updates localStorage with the selected website
- Direct URL access to specific website data works through URL parameters
- Consistent UI showing WebsiteSelector in navigation bar
- When no website is selected, appropriate UI shows website selector prominently

## Edge Cases
- Invalid website IDs in URL
- Non-existent websites
- User access revocation mid-session
- Multiple website parameters
- First-time users with no localStorage data

## Security Considerations
- Validation of website access rights
- Sanitization of URL parameters
- Prevention of unauthorized website access
- No sensitive data stored in localStorage

## Dependencies
- Client-side localStorage handling
- WebsiteSelector component
- Next.js URL handling (useSearchParams, usePathname)
- Dashboard layout

## Code Examples

### Saving Website Selection
```typescript
// Store in localStorage
function saveWebsiteToLocalStorage(website: string): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('selectedWebsite', website)
    } catch (error) {
      console.error('Failed to save website to localStorage:', error)
    }
  }
}
```

### Loading Selected Website
```typescript
// Check URL first, then localStorage
function getSelectedWebsite() {
  // First try from URL
  const websiteFromURL = getWebsiteFromURL(window.location.href);
  if (websiteFromURL) return websiteFromURL;
  
  // Then check localStorage
  return getWebsiteFromLocalStorage();
}
```

### WebsiteSelector Component
```typescript
<WebsiteSelector websites={availableWebsites} />
```

## Error States
1. Invalid Website ID
   - Show "Website not found" message
   - Present selector to choose a valid website
   
2. Unauthorized Access
   - Redirect to dashboard
   - Display appropriate error message
   
3. API Failures
   - Show error state UI
   - Provide retry mechanism

## Testing Considerations
- URL parameter validation
- localStorage persistence across sessions
- Navigation flow testing
- Error state handling
- Incognito mode behavior (no localStorage) 