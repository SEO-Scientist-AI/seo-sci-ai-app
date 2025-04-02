# SEO Scientist API Documentation

## External API Integrations

### Google Search Console API

The application integrates with Google Search Console API to fetch website performance data.

**Authentication:**
- OAuth 2.0 with refresh token rotation
- Required scopes:
  - `https://www.googleapis.com/auth/webmasters.readonly`
  - `https://www.googleapis.com/auth/indexing`

**Endpoints Used:**

1. **List Properties**
   - Retrieves all websites the authenticated user has access to in Google Search Console
   - Implemented in: `src/app/actions/getGSCProperties.ts`

2. **Search Analytics**
   - Fetches performance metrics for pages like position, clicks, impressions, and CTR
   - Supports filtering by date range, page, query, and country
   - Implemented in: `src/app/actions/getSearchAnalytics.ts`

**Rate Limits:**
- The API has quotas that need to be managed to prevent reaching limits
- The application implements caching strategies to minimize API calls

### Content Scraping API

A third-party API service used to fetch and analyze content from existing web pages.

**Authentication:**
- Basic authentication using API key and secret
- Environment variables:
  - `NEXT_PUBLIC_API_USER`
  - `NEXT_PUBLIC_API_PASSWORD`
  - `NEXT_PUBLIC_API_BASE`

**Endpoints Used:**

1. **Page Scrape**
   - URL: `${NEXT_PUBLIC_API_BASE}/scrape/page`
   - Method: POST
   - Retrieves the content, metadata, links, and images from a web page
   - Supports markdown conversion
   - Implemented in: `src/app/(main)/ai-writer/page.tsx`

**Request Parameters:**
```json
{
  "url": "https://example.com",
  "include_markdown": true,
  "include_links": true,
  "include_images": true,
  "force_refresh": false
}
```

**Response Format:**
```json
{
  "url": "https://example.com",
  "title": "Page Title",
  "description": "Meta description",
  "content": "Markdown content...",
  "links": ["https://example.com/page1", "https://example.com/page2"],
  "images": ["https://example.com/image1.jpg"],
  "metadata": {
    "title": "Page Title",
    "description": "Meta description",
    "author": "Author name",
    "date": "Publication date",
    "sitename": "Site name",
    "url": "https://example.com"
  }
}
```

### Content Analysis APIs

The application uses several specialized APIs for content analysis and optimization.

1. **Keyword Extraction API**
   - Extracts main and related keywords from content
   - Used in: Keywords Section of AI Writer

2. **Keyword Usage Analysis API**
   - Analyzes keyword placement and usage
   - Evaluates:
     - Title tag keyword presence
     - Meta description keyword presence
     - H1 keyword presence
     - First 100 words keyword presence
   - Contributes 30% to overall content score

3. **Title & Meta Analysis API**
   - Analyzes metadata from scraped content
   - Evaluates:
     - Title length (optimal: 55-60 characters)
     - Meta description length (optimal: 150-160 characters)
   - Uses actual page metadata from scraping
   - Contributes 20% to overall content score

4. **Readability Analysis API**
   - Evaluates content readability and engagement
   - Analyzes:
     - Paragraph structure
     - Writing tone
     - Passive voice usage
     - User intent matching
     - Emotional storytelling
   - Contributes 50% to overall content score

### Content Score Calculation

The content score is calculated based on real-time analysis data from multiple APIs:

```typescript
interface ContentScore {
  score: number; // 0-100
  breakdown: {
    keyword_usage: number; // 0-30
    title_meta: number; // 0-20
    readability: number; // 0-50
  }
}
```

**Calculation Method:**
- Keyword Usage: 7.5 points per criterion (30% total)
- Title & Meta: 10 points per criterion (20% total)
- Readability: 10 points per criterion (50% total)

## Internal API Endpoints

### Authentication

**NextAuth Endpoints:**
- `/api/auth/[...nextauth]` - Handles all authentication flows
- Supports Google OAuth provider
- Implements JWT session strategy with token refresh

### Server Actions

The application uses Next.js Server Actions for data fetching and state management:

1. **Get GSC Properties**
   - Location: `src/app/actions/getGSCProperties.ts`
   - Function: Fetches the list of websites from Google Search Console
   - Used in: Dashboard page

2. **Get Search Analytics**
   - Location: `src/app/actions/getSearchAnalytics.ts`
   - Function: Retrieves performance data for pages
   - Supports filtering and sorting
   - Used in: Page Audit feature

3. **Set Website**
   - Location: `src/app/actions/setWebsite.ts`
   - Function: Manages the currently selected website
   - Uses cookies for persistence
   - Used in: Website selector component

## Database Schema

The application uses Drizzle ORM with Cloudflare D1 database. The schema includes:

1. **User Tables**
   - `user` - Stores user information
   - `account` - Stores OAuth account connections
   - `session` - Manages active sessions
   - `verificationToken` - Handles email verification

2. **Authenticator**
   - Manages WebAuthn credentials if implemented

The schema is defined in `src/server/db/schema.ts` and migrations are in the `drizzle` directory.

## Error Handling

All API integrations implement proper error handling with:
- Appropriate HTTP status code responses
- Informative error messages
- Fallback behavior when services are unavailable
- Rate limiting protection 