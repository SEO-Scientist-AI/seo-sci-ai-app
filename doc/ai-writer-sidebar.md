# AI Writer Sidebar Documentation

## Overview
The AI Writer sidebar provides real-time content analysis and optimization suggestions through multiple specialized sections. Each section evaluates different aspects of the content and contributes to an overall content score based on real data from API integrations. The analysis is triggered after a 5-second debounce to optimize API usage.

## Performance Optimization

### Debounced Content Analysis
- Content analysis only triggers after 5 seconds of user inactivity
- Prevents excessive API calls during continuous typing
- All analyses run in parallel for optimal performance
- Event-based architecture for minimal performance impact
- Guards against concurrent analyses to prevent duplicate API calls

### Event System
- `EDITOR_CONTENT_CHANGE_EVENT` - Fires when editor content changes (500ms debounce)
- `CONTENT_STRUCTURE_UPDATE_EVENT` - Fires when content structure metrics update
- Event listeners clean up properly to prevent memory leaks

### API Efficiency
- All analysis APIs (keywords, usage, readability, title/meta) run in parallel
- Analysis only runs when content actually changes
- Caching implemented for frequently used data
- Proper error handling with graceful degradation
- Reuses keyword data across analyses when possible

## Components Structure

### 1. Content Score Section
Located at: `src/components/dashboard/ai-writter/content-score-section.tsx`

#### Functionality
- Calculates overall content score (0-100) based on real-time analysis data
- Score breakdown:
  - Keyword Usage: 30% (7.5 points × 4 criteria)
  - Title & Meta: 20% (10 points × 2 criteria)
  - Readability: 50% (10 points × 5 criteria)

#### Features
- Real-time score calculation using actual analysis data
- Visual score representation using CircularProgress
- Loading skeleton during calculations
- Auto-recalculation when any analysis changes
- Manual refresh option
- Proper state handling for incomplete analyses
- Auto-Optimize and Insert Internal Links actions

#### Dependencies
```typescript
interface ContentScoreSectionProps {
  keywordUsageAnalysis?: {
    title_tag_contains_keyword: boolean
    meta_description_contains_keyword: boolean
    h1_contains_keyword: boolean
    first_100_words_contains_keyword: boolean
  }
  titleMetaAnalysis?: {
    title_within_55_60_chars: boolean
    meta_description_within_150_160_chars: boolean
  }
  readabilityAnalysis?: {
    has_short_paragraphs: boolean
    uses_conversational_tone: boolean
    passive_voice_under_10_percent: boolean
    matches_user_intent: boolean
    uses_emotion_and_storytelling: boolean
  }
  isLoading?: boolean
}
```

### 2. Keywords Section
Located at: `src/components/dashboard/ai-writter/keywords-section.tsx`

#### Features
- Displays extracted keywords with main keyword highlighted
- Copy-to-clipboard functionality for each keyword
- Loading state during keyword extraction
- Empty state handling
- Refresh capability

### 3. Title & Meta Section
Located at: `src/components/dashboard/ai-writter/title-meta-section.tsx`

#### Features
- Real-time character count for title and meta description
- Progress indicators for optimal length ranges
- Title optimal range: 55-60 characters
- Meta description optimal range: 150-160 characters
- Uses actual metadata from page scraping
- Loading states during analysis

### 4. Readability Section
Located at: `src/components/dashboard/ai-writter/readability-section.tsx`

#### Features
- Comprehensive readability analysis
- Visual checklist of completed criteria
- Collapsible section with completion badge
- Detailed tooltips for each criterion
- Loading state during analysis

## Data Flow

1. **Content Change Detection**
   - User edits content in the editor
   - Editor component saves to localStorage (500ms debounce)
   - Editor fires `EDITOR_CONTENT_CHANGE_EVENT`
   - AI Writer page detects change and updates editorContent state

2. **Debounced Analysis**
   - After 5 seconds of inactivity, runContentAnalysis executes
   - Analysis only runs if not already in progress (tracked via ref)
   - Keyword extraction runs first
   - Main keyword is selected if none is currently selected
   - Three analyses run in parallel:
     - Keyword usage analysis
     - Title & meta analysis (using scraped metadata)
     - Readability analysis
   - Results update UI state when all analyses complete

3. **UI Updates**
   - Loading states show during analysis
   - Sections update as results become available
   - Content score recalculates based on new analysis data
   - Focus keyword can be manually changed to recalculate relevant analyses

## Data Integration

### Content Score Calculation
- Uses real data from three separate analyses
- Score updates automatically when analyses complete
- Proper handling of incomplete or loading states
- Error handling with user feedback

### API Integration
- Keyword extraction API for identifying main and related keywords
- Title & Meta analysis using actual page metadata
- Readability analysis based on content structure and writing style
- Content scraping API for importing existing content

## Recent Updates

1. **Score Calculation**
   - Now uses real analysis data instead of mock data
   - Improved accuracy with weighted scoring system
   - Better handling of incomplete analyses

2. **UI Improvements**
   - Added loading skeleton for score circle
   - Removed redundant score breakdown text
   - Enhanced button states based on data availability
   - Improved error handling and user feedback

3. **Data Integration**
   - Connected to real APIs for all analyses
   - Proper TypeScript interfaces for type safety
   - Improved state management and data flow

## Best Practices

1. **Performance**
   - Efficient state management with React hooks
   - Optimized re-renders with appropriate dependencies
   - Smart loading states to prevent skeleton flicker
   - Properly debounced API calls and UI updates

2. **Error Handling**
   - Graceful handling of missing data
   - Clear user feedback
   - Proper error logging

3. **UI/UX**
   - Consistent loading states
   - Clear progress indicators
   - Intuitive interactions

## Future Improvements

1. **Analysis**
   - Enhanced real-time analysis
   - More detailed scoring breakdowns
   - Additional optimization metrics

2. **Optimization**
   - Implement auto-optimization functionality
   - Enhanced internal linking suggestions
   - Content structure recommendations

3. **Integration**
   - Deeper integration with content editor
   - Real-time content analysis
   - Automated improvement suggestions