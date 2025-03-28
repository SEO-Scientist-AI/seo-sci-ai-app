# Website Selection System

## Feature Description
A robust website selection system that manages the currently selected website/property across the application using URL parameters and state management.

## Implementation Details

### URL Parameter Structure
- Parameter Name: `propertyId`
- Format: `https://seo-sci-ai.com/dashboard/[propertyId]`
- Example: `https://seo-sci-ai.com/dashboard/sc-domain:example.com`

### Data Flow
1. Initial Property List
   - Properties fetched from Google Search Console API
   - Displayed on dashboard using PropertyCard components
   - Each card links to property-specific dashboard

2. Property Selection
   - User clicks on a property card
   - URL updates with property ID parameter
   - Dashboard layout updates to show property-specific data
   - Selection persists across navigation

3. State Management
   - URL parameter serves as source of truth
   - Server components read propertyId from URL
   - Client components access current property through URL
   - No additional client-side state management needed

## Expected Behavior
- Clean URLs with property identification
- Persistent selection across page navigation
- Direct URL access to specific properties
- Proper handling of property switching
- Maintenance of selection during session

## Edge Cases
- Invalid property IDs in URL
- Non-existent properties
- User access revocation mid-session
- Multiple property parameters
- URL encoding/decoding of special characters

## Security Considerations
- Validation of property access rights
- Sanitization of URL parameters
- Prevention of unauthorized property access
- Proper error handling for invalid selections

## Dependencies
- Next.js App Router
- Dynamic route segments
- Google Search Console API
- PropertyCard component
- Dashboard layout

## Code Examples

### URL Pattern (app/dashboard/[propertyId]/page.tsx)
```typescript
export default async function PropertyDashboard({ 
  params: { propertyId } 
}: { 
  params: { propertyId: string } 
}) {
  // Validate and use propertyId
}
```

### Property Card Navigation
```typescript
<Link href={`/dashboard/${property.id}`}>
  <PropertyCard property={property} />
</Link>
```

## Error States
1. Invalid Property ID
   - Show 404 error page
   - Provide link back to property selection
   
2. Unauthorized Access
   - Redirect to dashboard
   - Display appropriate error message
   
3. API Failures
   - Show error state UI
   - Provide retry mechanism

## Testing Considerations
- URL parameter validation
- Property access verification
- Navigation flow testing
- Error state handling
- Performance impact of URL-based state 