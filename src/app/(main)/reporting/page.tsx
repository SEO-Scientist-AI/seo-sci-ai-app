import { Metadata } from "next";
import SeoPerformanceDashboard from "@/components/dashboard/reporting/reporting-header-and-tabs";

export const runtime = 'edge';

export const metadata: Metadata = {
  title: "Reporting | SEO Scientist",
  description: "Analytics and reporting dashboard for your SEO data",
};

export default function ReportingPage() {
  return <SeoPerformanceDashboard />;
}
