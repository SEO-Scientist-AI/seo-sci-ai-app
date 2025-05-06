// Create a server component wrapper
export const runtime = 'edge';

// Import the client component
import OverviewClient from "@/components/onboarding/overview-client";

export default function OnboardingOverviewPage() {
  // Server component returns the client component
  return <OverviewClient />;
} 