import { Button } from "@/components/ui/button";
import { getThemeToggler } from "@/lib/theme/get-theme-button";
import { getCurrentWebsite } from "@/app/actions/setWebsite";
import { getAvailableWebsites } from "@/app/actions/getWebsites";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { WebsiteSelector } from "@/components/dashboard/website-selector";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink, Globe, AlertCircle, Info } from "lucide-react";
import { auth } from "@/server/auth";

export const runtime = "edge";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const urlParams = new URLSearchParams();
  
  // Convert searchParams to URLSearchParams
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (typeof value === 'string') {
        urlParams.set(key, value);
      } else if (Array.isArray(value)) {
        value.forEach(v => urlParams.append(key, v));
      }
    });
  }
  
  // Get current website from URL only (localStorage handled client-side)
  const currentWebsite = await getCurrentWebsite(urlParams);
  
  // Get list of available websites
  const availableWebsites = await getAvailableWebsites();
  
  const session = await auth();
  const userName = session?.user?.name || "User";
  
  // No more cookie checks
  const isRecentWebsiteUsed = false;

  return (
    <div className="px-8 py-6 w-full">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your business settings
          </p>
        </div>

        {/* Business Settings */}
        <Card className="w-full dark:bg-background border-border/40">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  value={userName}
                  readOnly
                  className="mt-1.5 bg-muted/50 cursor-not-allowed border-border/40"
                />
              </div>

              <div>
                <Label
                  htmlFor="website"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Website URL
                </Label>
                <div className="flex items-center mt-1.5">
                  <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    id="website"
                    value={currentWebsite ? `${currentWebsite}.com` : "No website selected"}
                    readOnly
                    className="bg-muted/50 cursor-not-allowed border-border/40"
                  />
                </div>
              </div>

              {!currentWebsite && (
                <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 p-3 rounded-md text-sm">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Please select a website</p>
                      <p className="text-xs mt-1">
                        Select a website to configure your settings. Your selection will be saved for future visits.
                      </p>
                      <div className="mt-2">
                        <WebsiteSelector websites={availableWebsites} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {currentWebsite && (
                <div className="bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 p-3 rounded-md text-sm">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Currently selected website</p>
                      <p className="text-xs mt-1">
                        You can change websites at any time using the selector in the top navigation bar.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label
                  htmlFor="niche"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Niche
                </Label>
                <Input
                  id="niche"
                  value=""
                  placeholder="No niche specified"
                  readOnly
                  className="mt-1.5 bg-muted/50 cursor-not-allowed border-border/40"
                />
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              These settings are locked for this specific website. If you wish
              to change your niche or domain name, please contact support.
            </div>
          </CardContent>
        </Card>

        {/* Content Settings */}
        {/* <div className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold">Content Settings</h2>
              <p className="text-sm text-muted-foreground">Configure how your content is generated</p>
            </div>

            <Card className="w-full bg-[#fafafa] dark:bg-background border-border/40">
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    className="mt-1.5 min-h-[120px]"
                    defaultValue="Pathpages offers a comprehensive range of Notion templates designed to help individuals organize their personal and professional lives efficiently. Their premium Notion systems include various templates such as the Second Brain, Finance Tracker, and Complete Bundle, each crafted to enhance productivity and streamline tasks. With over 120,000 satisfied customers, Pathpages provides tutorials and resources to help users maximize the potential of Notion's all-in-one organizational tool."
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    A brief description of what your business does and who you serve
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="english">
                      <SelectTrigger id="language" className="mt-1.5">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Select the primary language of your content
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="sitemap">Sitemap URL</Label>
                    <div className="flex items-center mt-1.5">
                      <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input id="sitemap" defaultValue="https://pathpages.com/sitemap.xml" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      The link that points to your sitemap.xml file
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="tone">Tone of Voice</Label>
                  <Select defaultValue="professional">
                    <SelectTrigger id="tone" className="mt-1.5">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional (recommended)</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="authoritative">Authoritative</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    The writing style that will be used in your content
                  </p>
                </div>
              </CardContent>
            </Card>
          </div> */}

        {/* Call-to-Actions */}
        {/* <div className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold">Call-to-Actions</h2>
              <p className="text-sm text-muted-foreground">Add call-to-action that will be used as suggestions when generating content</p>
            </div>

            <Card className="w-full bg-[#fafafa] dark:bg-background border-border/40">
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cta-text">Text (e.g., 'Start free trial')</Label>
                    <Input id="cta-text" placeholder="Enter CTA text" className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="cta-link">Link (e.g., 'example.com/trial')</Label>
                    <div className="flex items-center mt-1.5">
                      <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input id="cta-link" placeholder="Enter URL" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/40 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Added CTAs (4)</h3>
                      <p className="text-xs text-muted-foreground">6 slots remaining</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="bg-background rounded border p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Get Notion Second Brain</p>
                        <p className="text-xs text-muted-foreground">https://www.pathpages.com/products/notion-second-brain</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <span className="sr-only">Delete</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </Button>
                    </div>
                    
                    <div className="bg-background rounded border p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Get free Notion templates</p>
                        <p className="text-xs text-muted-foreground">https://www.pathpages.com/free-notion-templates</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <span className="sr-only">Delete</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </Button>
                    </div>
                    
                    <div className="bg-background rounded border p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Get premium Notion templates</p>
                        <p className="text-xs text-muted-foreground">https://www.pathpages.com/notion-templates</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <span className="sr-only">Delete</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </Button>
                    </div>
                    
                    <div className="bg-background rounded border p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Get organized with Notion</p>
                        <p className="text-xs text-muted-foreground">https://www.pathpages.com</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <span className="sr-only">Delete</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div> */}
      </div>
    </div>
  );
}
