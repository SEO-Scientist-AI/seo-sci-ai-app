// Create a server component wrapper
export const runtime = 'edge';

// Import the client component
import SignupClient from "@/components/onboarding/signup-client";

export default function SignupPage() {
  // Server component returns the client component
  return <SignupClient />;
} 