# AI Writer Sidebar Documentation

## Overview
The AI Writer sidebar provides real-time content analysis and optimization suggestions through multiple specialized sections. Each section evaluates different aspects of the content and contributes to an overall content score based on real data from API integrations.

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
   - Efficient state management
   - Optimized re-renders
   - Smart loading states

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