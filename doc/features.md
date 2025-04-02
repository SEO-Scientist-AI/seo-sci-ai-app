# SEO Scientist Features

## Authentication System

### Feature Description
A secure authentication system using Google OAuth through NextAuth.js.

### Expected Behavior
- Users can sign in using their Google account
- Authentication provides access to Google Search Console API with appropriate scopes
- JWT tokens with automatic refresh functionality
- Proper session management and security

### Edge Cases
- Handling token expiration and refresh failures
- Managing permissions when users revoke access
- Fallback behavior when authentication API is unavailable

### Dependencies
- NextAuth.js
- Google OAuth Provider
- Drizzle ORM adapter for database storage

## Dashboard

### Feature Description
A central dashboard that displays website properties from Google Search Console and provides navigation to other features.

### Expected Behavior
- Lists all websites the user has access to in Google Search Console via the WebsiteSelector
- Persists website selection in localStorage for cross-session memory
- Shows website selector in the navigation bar for easy switching
- Properly handles cases when no website is selected by presenting website selection UI
- Provides navigation to page audit and AI writer features
- Responsive design that works across device sizes

### Edge Cases
- Handling users with no website properties
- Managing API rate limits for Google Search Console
- Loading states during data fetching
- Gracefully handling the first visit when no website is saved in localStorage
- Handling incognito mode where localStorage may be cleared on session end

### Dependencies
- Google Search Console API
- WebsiteSelector component
- localStorage utilities
- Dashboard layout component

## Website Selection System

### Feature Description
A system for selecting, saving, and retrieving the user's chosen website across sessions.

### Expected Behavior
- Persists selected website in localStorage
- Uses URL parameters for shareable links and bookmarking
- WebsiteSelector component in navigation shows available websites
- Automatically restores previously selected website when returning to the app
- Updates URL parameters when selection changes for consistent navigation

### Edge Cases
- First time users with no stored website
- Invalid saved websites that are no longer accessible
- Cross-device usage where localStorage isn't shared

### Dependencies
- localStorage browser API
- URL parameter handling (useSearchParams)
- WebsiteSelector component

## Page Audit System

### Feature Description
A performance analysis tool that shows SEO metrics for pages from the selected website.

### Expected Behavior
- Displays key metrics like position, clicks, impressions and CTR
- Allows filtering and sorting of page data
- Shows performance trends over time
- Identifies underperforming pages that need optimization
- Provides direct access to edit content in AI Writer from the page list

### Edge Cases
- Handling large datasets with pagination
- Addressing API limitations and quotas
- Managing data for websites with limited history

### Dependencies
- Google Search Console API
- Analytics filters component
- Data table component with sorting/filtering

## AI Writer Tool

### Feature Description
A comprehensive content creation and optimization tool with real-time AI-powered analysis and scoring.

### Expected Behavior
- Rich text editor for content creation and editing using Novel.js
- Content import from URLs via scraping API
- Real-time content analysis with three main components:
  1. Keyword Usage Analysis (30% of score)
     - Title tag keyword presence
     - Meta description keyword presence
     - H1 keyword presence
     - First 100 words keyword presence
  2. Title & Meta Analysis (20% of score)
     - Title length optimization (55-60 characters)
     - Meta description length optimization (150-160 characters)
  3. Readability Analysis (50% of score)
     - Paragraph structure
     - Writing tone
     - Passive voice usage
     - User intent matching
     - Emotional appeal
- Dynamic content score calculation based on real analysis data
- Loading states and progress indicators for all analyses
- Copy-to-clipboard functionality for keywords
- Auto-optimization suggestions
- Internal linking recommendations

### Edge Cases
- Handling large content imports
- Managing API errors during content scraping
- Graceful degradation when analyses are incomplete
- Proper state management during concurrent analyses
- Handling metadata extraction failures
- Recovery from API timeouts or failures

### Dependencies
- Novel.js editor
- Content scraping API integration
- Real-time analysis APIs
- CircularProgress component for score visualization
- Skeleton loading components
- Toast notifications for user feedback

## Theme System

### Feature Description
A complete theming system that supports both light and dark modes.

### Expected Behavior
- Automatic detection of user's system preference
- Manual toggle between light and dark modes
- Persistent preference storage
- Smooth transition between themes

### Edge Cases
- Handling theme inconsistencies across components
- Managing theme during server-side rendering
- Supporting system preference changes

### Dependencies
- next-themes package
- TailwindCSS dark mode configuration
- Theme toggle component 