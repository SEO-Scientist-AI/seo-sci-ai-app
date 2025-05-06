import { redirect } from "next/navigation";

export const runtime = 'edge';

export default function OnboardingPage() {
  // Redirect to the first step of onboarding
  redirect("/onboarding/signup");
} 