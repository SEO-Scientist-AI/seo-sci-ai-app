import { Button } from "@/components/ui/button";
import { sql } from "drizzle-orm";
import { auth, signIn, signOut } from "@/server/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { getThemeToggler } from "@/lib/theme/get-theme-button";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  Search,
  LineChart,
  Brain,
} from "lucide-react";

export const runtime = "edge";

export default async function Page() {
  const session = await auth();
  const SetThemeButton = getThemeToggler();

  const userCount = await db
    .select({
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(users);

  return (
    <main className="flex flex-col min-h-screen">
      {/* Header */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="flex h-16 items-center px-4 justify-between max-w-7xl mx-auto">
          <div className="flex gap-2 items-center">
            <span className="font-semibold">SEO Scientist</span>
          </div>

          <div className="flex items-center gap-4">
            <SetThemeButton />
            {session?.user ? (
              <div className="flex gap-4 items-center">
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <Button variant="ghost">Sign out</Button>
                </form>
              </div>
            ) : (
              <form
                action={async () => {
                  "use server";
                  await signIn("google");
                }}
              >
                <Button>Sign in</Button>
              </form>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5" />
        <div className="container relative px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              AI-Powered SEO Optimization & A/B Testing
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Transform your website's performance with intelligent SEO
              recommendations and data-driven A/B testing. Let AI guide your
              optimization strategy.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  Start Optimizing <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border bg-card">
              <Brain className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                AI-Powered Insights
              </h3>
              <p className="text-muted-foreground">
                Get intelligent SEO recommendations based on advanced AI
                analysis of your content and competitors.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <LineChart className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">A/B Testing</h3>
              <p className="text-muted-foreground">
                Test different versions of your content and track performance
                with detailed analytics and insights.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Search className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Keyword Optimization
              </h3>
              <p className="text-muted-foreground">
                Discover high-value keywords and optimize your content for
                better search engine rankings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">
              Trusted by SEO Professionals
            </h2>
            <div className="p-6 rounded-lg border bg-card">
              <p className="text-2xl font-bold text-primary">
                {userCount[0]!.count} Active Users
              </p>
              <p className="text-muted-foreground mt-2">
                Optimizing their websites with AI-powered insights
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
