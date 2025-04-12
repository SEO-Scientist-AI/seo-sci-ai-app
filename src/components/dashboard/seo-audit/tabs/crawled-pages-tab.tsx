"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Mock data for crawled pages
const crawledPages = [
  {
    id: 1,
    url: "https://jvhconsulting.com/",
    status: "healthy",
    title: "JVH Consulting - Strategic Business Solutions",
    metaDescription: "complete",
    loadTime: "0.8s",
    issues: 0,
    lastCrawled: "2025-04-05",
  },
  {
    id: 2,
    url: "https://jvhconsulting.com/services",
    status: "issues",
    title: "Our Services - JVH Consulting",
    metaDescription: "missing",
    loadTime: "1.2s",
    issues: 3,
    lastCrawled: "2025-04-05",
  },
  {
    id: 3,
    url: "https://jvhconsulting.com/about-us",
    status: "issues",
    title: "About Us - JVH Consulting",
    metaDescription: "too-short",
    loadTime: "0.9s",
    issues: 2,
    lastCrawled: "2025-04-05",
  },
  {
    id: 4,
    url: "https://jvhconsulting.com/case-studies",
    status: "issues",
    title: "Case Studies - JVH Consulting",
    metaDescription: "complete",
    loadTime: "1.5s",
    issues: 1,
    lastCrawled: "2025-04-04",
  },
  {
    id: 5,
    url: "https://jvhconsulting.com/contact",
    status: "issues",
    title: "Contact Us - JVH Consulting",
    metaDescription: "missing",
    loadTime: "0.7s",
    issues: 2,
    lastCrawled: "2025-04-04",
  },
];

// Add these statistics for the summary cards
const pageStatusSummary = {
  healthy: { count: 2, percentage: 1.3 },
  broken: { count: 1, percentage: 0.6 },
  withIssues: { count: 156, percentage: 98.1 },
  redirected: { count: 1, percentage: 0.6 },
  blocked: { count: 0, percentage: 0 },
};

const commonIssues = {
  blog: [
    { name: "Missing meta descriptions", count: 42, severity: "red" },
    { name: "Slow loading images", count: 28, severity: "orange" },
    { name: "Missing alt text", count: 35, severity: "orange" },
  ],
  service: [
    { name: "Duplicate content", count: 12, severity: "red" },
    { name: "Missing schema markup", count: 18, severity: "orange" },
    { name: "Low word count", count: 15, severity: "orange" },
  ],
  resource: [
    { name: "Broken links", count: 8, severity: "red" },
    { name: "Missing H1 tags", count: 22, severity: "orange" },
    { name: "Unoptimized images", count: 19, severity: "orange" },
  ],
};

export function CrawledPagesTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("url");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [itemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort pages
  const filteredPages = crawledPages.filter((page) => {
    const matchesSearch =
      page.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || page.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedPages = [...filteredPages].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "url":
        comparison = a.url.localeCompare(b.url);
        break;
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "loadTime":
        comparison = parseFloat(a.loadTime) - parseFloat(b.loadTime);
        break;
      case "issues":
        comparison = a.issues - b.issues;
        break;
      case "lastCrawled":
        comparison = new Date(a.lastCrawled).getTime() - new Date(b.lastCrawled).getTime();
        break;
      default:
        comparison = 0;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return (
          <Badge className="bg-green-100 text-green-600 hover:bg-green-100">
            Healthy
          </Badge>
        );
      case "broken":
        return (
          <Badge className="bg-red-100 text-red-600 hover:bg-red-100">
            Broken
          </Badge>
        );
      case "redirected":
        return (
          <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100">
            Redirected
          </Badge>
        );
      case "blocked":
        return (
          <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">
            Blocked
          </Badge>
        );
      case "issues":
        return (
          <Badge className="bg-yellow-100 text-yellow-600 hover:bg-yellow-100">
            Issues
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getMetaDescriptionStatus = (status: string) => {
    switch (status) {
      case "complete":
        return (
          <Badge className="bg-green-100 text-green-600 hover:bg-green-100">
            Complete
          </Badge>
        );
      case "missing":
        return (
          <Badge className="bg-red-100 text-red-600 hover:bg-red-100">
            Missing
          </Badge>
        );
      case "too-short":
        return (
          <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100">
            Too Short
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-xl">Crawled Pages</CardTitle>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search URL or title..."
                  className="pl-10 pr-4 h-10 w-full md:w-64 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div className="flex gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[180px] h-10">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="healthy">Healthy</SelectItem>
                    <SelectItem value="broken">Broken</SelectItem>
                    <SelectItem value="redirected">Redirected</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                    <SelectItem value="issues">Issues</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] h-10">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="url">URL</SelectItem>
                    <SelectItem value="title">Page Title</SelectItem>
                    <SelectItem value="loadTime">Load Time</SelectItem>
                    <SelectItem value="issues">Issues</SelectItem>
                    <SelectItem value="lastCrawled">Last Crawled</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  className="h-10 dark:border-gray-700 dark:hover:bg-gray-800"
                  onClick={() =>
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                  }
                >
                  {sortDirection === "asc" ? "↑" : "↓"}
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Found <span className="font-medium text-gray-700 dark:text-gray-200">{filteredPages.length}</span> pages
          </div>
          <div className="border rounded-lg overflow-hidden dark:border-gray-700">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="dark:hover:bg-gray-800">
                    <TableHead className="w-1/3">URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Page Title</TableHead>
                    <TableHead>Meta Description</TableHead>
                    <TableHead>Load Time</TableHead>
                    <TableHead>Issues</TableHead>
                    <TableHead>Last Crawled</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPages.map((page) => (
                    <TableRow
                      key={page.id}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <TableCell className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        <a
                          href={page.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block truncate max-w-xs"
                        >
                          {page.url}
                        </a>
                      </TableCell>
                      <TableCell>{getStatusBadge(page.status)}</TableCell>
                      <TableCell className="truncate max-w-xs dark:text-gray-300">
                        {page.title}
                      </TableCell>
                      <TableCell>
                        {getMetaDescriptionStatus(page.metaDescription)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            parseFloat(page.loadTime) < 1.0
                              ? "text-green-600 dark:text-green-400"
                              : parseFloat(page.loadTime) < 1.5
                              ? "text-orange-600 dark:text-orange-400"
                              : "text-red-600 dark:text-red-400"
                          }
                        >
                          {page.loadTime}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            page.issues === 0
                              ? "text-green-600 dark:text-green-400"
                              : page.issues < 3
                              ? "text-orange-600 dark:text-orange-400"
                              : "text-red-600 dark:text-red-400"
                          }
                        >
                          {page.issues}
                        </span>
                      </TableCell>
                      <TableCell className="dark:text-gray-300">{page.lastCrawled}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="flex items-center justify-end mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} dark:border-gray-700 dark:hover:bg-gray-800`}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink isActive className="dark:bg-gray-700 dark:text-white">{currentPage}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className={`${currentPage * itemsPerPage >= filteredPages.length ? "pointer-events-none opacity-50" : "cursor-pointer"} dark:border-gray-700 dark:hover:bg-gray-800`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Page Status Summary */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Page Status Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                  Healthy Pages
                </h3>
                <span className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full"></span>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-300">{pageStatusSummary.healthy.count}</p>
              <p className="text-xs text-green-700 dark:text-green-200 mt-1">
                {pageStatusSummary.healthy.percentage}% of total pages
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border border-red-100 dark:border-red-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Broken Pages
                </h3>
                <span className="w-3 h-3 bg-red-500 dark:bg-red-400 rounded-full"></span>
              </div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-300">{pageStatusSummary.broken.count}</p>
              <p className="text-xs text-red-700 dark:text-red-200 mt-1">
                {pageStatusSummary.broken.percentage}% of total pages
              </p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Pages with Issues
                </h3>
                <span className="w-3 h-3 bg-yellow-500 dark:bg-yellow-400 rounded-full"></span>
              </div>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">{pageStatusSummary.withIssues.count}</p>
              <p className="text-xs text-yellow-700 dark:text-yellow-200 mt-1">
                {pageStatusSummary.withIssues.percentage}% of total pages
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg border border-orange-100 dark:border-orange-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  Redirected Pages
                </h3>
                <span className="w-3 h-3 bg-orange-500 dark:bg-orange-400 rounded-full"></span>
              </div>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-300">{pageStatusSummary.redirected.count}</p>
              <p className="text-xs text-orange-700 dark:text-orange-200 mt-1">
                {pageStatusSummary.redirected.percentage}% of total pages
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Blocked Pages
                </h3>
                <span className="w-3 h-3 bg-gray-500 dark:bg-gray-400 rounded-full"></span>
              </div>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">{pageStatusSummary.blocked.count}</p>
              <p className="text-xs text-gray-700 dark:text-gray-200 mt-1">
                {pageStatusSummary.blocked.percentage}% of total pages
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common Issues by Page Type */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Common Issues by Page Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-200">Blog Pages</h3>
              <ul className="space-y-2">
                {commonIssues.blog.map((issue, index) => (
                  <li key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="text-sm dark:text-gray-300">{issue.name}</span>
                    <Badge className={
                      issue.severity === "red" 
                        ? "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400 hover:bg-red-100"
                        : "bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400 hover:bg-orange-100"
                    }>
                      {issue.count} pages
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-200">Service Pages</h3>
              <ul className="space-y-2">
                {commonIssues.service.map((issue, index) => (
                  <li key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="text-sm dark:text-gray-300">{issue.name}</span>
                    <Badge className={
                      issue.severity === "red" 
                        ? "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400 hover:bg-red-100"
                        : "bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400 hover:bg-orange-100"
                    }>
                      {issue.count} pages
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-200">Resource Pages</h3>
              <ul className="space-y-2">
                {commonIssues.resource.map((issue, index) => (
                  <li key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="text-sm dark:text-gray-300">{issue.name}</span>
                    <Badge className={
                      issue.severity === "red" 
                        ? "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400 hover:bg-red-100"
                        : "bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400 hover:bg-orange-100"
                    }>
                      {issue.count} pages
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <Button variant="outline" className="gap-1.5 dark:border-gray-700 dark:hover:bg-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export Issues Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
} 