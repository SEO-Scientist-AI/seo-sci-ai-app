import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./prosemirror.css";
import { ThemeScript } from "@/lib/theme/theme-script";
import { SidebarProvider } from "@/store/sidebar-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SEO Sci AI - AI-Powered SEO Content Optimization",
  description: "Optimize your website content with AI-powered SEO analysis, content scoring, and automated improvements. Get actionable insights to improve your search rankings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ThemeScript />
      </head>
      <body className={inter.className}>
        <SidebarProvider>{children}</SidebarProvider>
      </body>
    </html>
  );
}
