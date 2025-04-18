# SEO Scientist Updates

## April 17, 2024

### Loading States and API Integration Enhancements

#### Changes Implemented
- **Granular loading skeletons**: Replaced full-page skeletons with targeted component-level skeletons in Overview and Issues tabs
- **Real API integration for page counts**: Implemented real API data for the "Pages Affected" count in the Issues tab
- **Optimized API call strategy**: Added caching and tracking to minimize redundant API calls
- **Improved error handling**: Implemented isolated error handling for individual API requests

#### Implementation Details
- Enhanced `OverviewTab` component to show individual skeletons for each section instead of a complete tab skeleton
- Modified `IssuesTab` component to fetch and display real data for "Pages Affected" column
- Implemented a caching system using `Map<string, Record<string, number>>` for storing API responses
- Used React's `useRef` with `Set<string>` to track which audit IDs have been fetched
- Implemented conditional skeleton rendering in table cells while data is loading
- Integrated with the `/api/performance/issues/count` endpoint for retrieving affected page counts
- Used `Promise.allSettled()` for parallel API requests with independent error handling
- Added proper dependencies to effect hooks to prevent unnecessary re-fetching

#### Technical Details
- Modified files:
  - `src/components/dashboard/seo-audit/tabs/overview-tab.tsx`
  - `src/components/dashboard/seo-audit/tabs/issues-tab.tsx`
  - `src/app/(main)/seo-audit/page.tsx`
- Added documentation in `doc/loading-states-and-api-integration.md`

#### User Experience Improvements
- Faster perceived loading times with skeleton UI structures
- Reduced layout shifts during data loading
- More accurate data representation with real API values
- Smoother transitions between loading and loaded states

## July 23, 2023

### Website Selection System Enhancements

#### Changes Implemented
- **Added localStorage persistence**: The application now remembers the user's selected website across browser sessions using localStorage
- **Removed cookie-based storage**: Eliminated server-side cookies for website selection in favor of client-side only storage
- **Improved WebsiteSelector UI**: Enhanced the website selector to always display in the navigation bar
- **Better user experience for first-time users**: Added clear UI for selecting a website when none is selected

#### Implementation Details
- Added `saveWebsiteToLocalStorage()` and `getWebsiteFromLocalStorage()` utility functions
- Updated the WebsiteSelector component to use localStorage for persistence
- Modified the server-side `getCurrentWebsite()` function to rely only on URL parameters
- Website selection now follows a clear priority:
  1. URL parameters (for direct links and bookmarks)
  2. localStorage (for returning users)
  3. Prompt to select a website (for new users)

### UI/UX Improvements

#### Changes Implemented
- **Fixed AI Writer link behavior**: Modified the AI Writer link in page audit to open in the same tab instead of a new tab
- **Enhanced website selection UI**: Added clearer messaging when no website is selected
- **Improved navigation experience**: Ensured consistent navigation patterns throughout the application

#### Technical Details
- Changed `window.open()` with `_blank` target to `window.location.href` for in-app navigation
- Updated all website selection UI components to provide clearer user guidance
- Added descriptive messages about persistence to inform users their selection will be remembered 

## August 15, 2023

### Advanced Content Tools Implementation

#### Changes Implemented
- **Added Advanced Content Tools section**: Implemented a new collapsible section in the AI Writer sidebar
- **Organized tools by category**: Grouped tools into Content Enhancement, Style & Tone, Conversion Tools, and SEO Optimization
- **Responsive design**: Created a grid layout that adapts to different screen sizes
- **Theme-aware styling**: Ensured the section looks good in both light and dark themes
- **Visual indicators**: Added badges to indicate tool status (Premium, Popular, New, Essential, Free)

#### Technical Details
- Created a new component at `src/components/dashboard/ai-writter/advanced-content-tools-section.tsx`
- Used the Collapsible component from the UI library for toggle functionality
- Implemented responsive grid layout with `grid-cols-1 sm:grid-cols-2`
- Used theme-aware colors with dark mode support using Tailwind's dark mode variants
- Added hover effects for better user interaction
- Positioned the section after the Keywords section in the sidebar for logical flow

#### UI/UX Improvements
- Consistent spacing and alignment throughout the section
- Clear visual hierarchy with section headers and badges
- Intuitive button layout with descriptive icons and text
- Smooth transitions for collapsible functionality
- Proper contrast for text and icons in both light and dark themes 