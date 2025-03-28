import Link from "next/link";
import { ExternalLink, Globe, TrendingUp } from "lucide-react";
import { TrendIndicator } from "@/components/dashboard/trend-indicator";

interface PropertyCardProps {
  property: {
    siteUrl: string;
    permissionLevel: string;
    clicks: string | number;
    impressions: string | number;
    clicksTrend: number;
    impressionsTrend: number;
  };
  userName?: string | null;
}

export function PropertyCard({ property, userName }: PropertyCardProps) {
  return (
    <Link
      href={`/page-audit?site=${encodeURIComponent(property.siteUrl)}`}
      className="block group"
    >
      <div className="border rounded-xl p-6 hover:border-primary hover:shadow-sm transition-all duration-200 bg-card">
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
              {property.siteUrl
                .replace(/^(https?:\/\/)?(www\.)?/, "")
                .replace(/^sc-/, "")}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <p className="text-sm text-muted-foreground font-medium">
                {property.permissionLevel}
                <span className="mx-1.5 opacity-50">•</span>
                {userName}
              </p>
            </div>
          </div>
          <div className="p-2 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors">
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">
                Clicks/day
              </p>
            </div>
            <div className="flex items-center">
              <p className="text-2xl font-bold">{property.clicks}</p>
              <div className="ml-2">
                <TrendIndicator trend={property.clicksTrend} />
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">
                Impressions
              </p>
            </div>
            <div className="flex items-center">
              <p className="text-2xl font-bold">{property.impressions}</p>
              <div className="ml-2">
                <TrendIndicator trend={property.impressionsTrend} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 