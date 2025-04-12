// // The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
// import React, { useState, useEffect, useRef } from "react";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import * as echarts from "echarts";
// const App: React.FC = () => {
//   const [activeTab, setActiveTab] = useState("crawled-pages");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [sortBy, setSortBy] = useState("url");
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
//   const [viewMode, setViewMode] = useState<"tile" | "graph">("tile");
//   const httpStatusChartRef = useRef<HTMLDivElement>(null);
//   const sitemapChartRef = useRef<HTMLDivElement>(null);
//   const crawlDepthChartRef = useRef<HTMLDivElement>(null);
//   const internalLinksChartRef = useRef<HTMLDivElement>(null);
//   const markupTypesChartRef = useRef<HTMLDivElement>(null);
//   const canonicalizationChartRef = useRef<HTMLDivElement>(null);
//   // Add click outside handler for visibility menu
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const menu = document.getElementById("visibility-menu");
//       const button = event.target as Element;
//       if (
//         menu &&
//         !menu.classList.contains("hidden") &&
//         !menu.contains(button) &&
//         !button.closest("button")?.contains(document.querySelector(".fa-eye"))
//       ) {
//         menu.classList.add("hidden");
//       }
//       // Close all visibility dropdown menus when clicking outside
//       const visibilityMenus = document.querySelectorAll(
//         ".visibility-dropdown-menu",
//       );
//       visibilityMenus.forEach((menu) => {
//         const menuElement = menu as HTMLElement;
//         const eyeButton = menuElement.previousElementSibling;
//         if (
//           menuElement &&
//           !menuElement.classList.contains("hidden") &&
//           !menuElement.contains(button) &&
//           !eyeButton?.contains(button)
//         ) {
//           menuElement.classList.add("hidden");
//         }
//       });
//       // Close all share dropdown menus when clicking outside
//       const shareMenus = document.querySelectorAll(".fa-share");
//       shareMenus.forEach((shareIcon) => {
//         const shareButton = shareIcon.closest("button");
//         const shareMenu = shareButton?.nextElementSibling as HTMLElement;
//         if (
//           shareMenu &&
//           !shareMenu.classList.contains("hidden") &&
//           !shareMenu.contains(button) &&
//           !shareButton?.contains(button)
//         ) {
//           shareMenu.classList.add("hidden");
//         }
//       });
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);
//   // Mock data for crawled pages
//   const crawledPages = [
//     {
//       id: 1,
//       url: "https://jvhconsulting.com/",
//       status: "healthy",
//       title: "JVH Consulting - Strategic Business Solutions",
//       metaDescription: "complete",
//       loadTime: "0.8s",
//       issues: 0,
//       lastCrawled: "2025-04-05",
//     },
//     {
//       id: 2,
//       url: "https://jvhconsulting.com/services",
//       status: "issues",
//       title: "Our Services - JVH Consulting",
//       metaDescription: "missing",
//       loadTime: "1.2s",
//       issues: 3,
//       lastCrawled: "2025-04-05",
//     },
//     {
//       id: 3,
//       url: "https://jvhconsulting.com/about-us",
//       status: "issues",
//       title: "About Us - JVH Consulting",
//       metaDescription: "too-short",
//       loadTime: "0.9s",
//       issues: 2,
//       lastCrawled: "2025-04-05",
//     },
//     {
//       id: 4,
//       url: "https://jvhconsulting.com/case-studies",
//       status: "issues",
//       title: "Case Studies - JVH Consulting",
//       metaDescription: "complete",
//       loadTime: "1.5s",
//       issues: 1,
//       lastCrawled: "2025-04-04",
//     },
//     {
//       id: 5,
//       url: "https://jvhconsulting.com/contact",
//       status: "issues",
//       title: "Contact Us - JVH Consulting",
//       metaDescription: "missing",
//       loadTime: "0.7s",
//       issues: 2,
//       lastCrawled: "2025-04-04",
//     },
//     {
//       id: 6,
//       url: "https://jvhconsulting.com/blog",
//       status: "redirected",
//       title: "Blog - JVH Consulting",
//       metaDescription: "complete",
//       loadTime: "1.1s",
//       issues: 1,
//       lastCrawled: "2025-04-04",
//     },
//     {
//       id: 7,
//       url: "https://jvhconsulting.com/resources",
//       status: "issues",
//       title: "Resources - JVH Consulting",
//       metaDescription: "missing",
//       loadTime: "1.3s",
//       issues: 4,
//       lastCrawled: "2025-04-03",
//     },
//     {
//       id: 8,
//       url: "https://jvhconsulting.com/testimonials",
//       status: "issues",
//       title: "Client Testimonials - JVH Consulting",
//       metaDescription: "complete",
//       loadTime: "0.9s",
//       issues: 1,
//       lastCrawled: "2025-04-03",
//     },
//     {
//       id: 9,
//       url: "https://jvhconsulting.com/team",
//       status: "issues",
//       title: "Our Team - JVH Consulting",
//       metaDescription: "missing",
//       loadTime: "1.0s",
//       issues: 3,
//       lastCrawled: "2025-04-03",
//     },
//     {
//       id: 10,
//       url: "https://jvhconsulting.com/careers",
//       status: "issues",
//       title: "Careers - JVH Consulting",
//       metaDescription: "complete",
//       loadTime: "0.8s",
//       issues: 2,
//       lastCrawled: "2025-04-02",
//     },
//     {
//       id: 11,
//       url: "https://jvhconsulting.com/blog/strategic-planning",
//       status: "issues",
//       title: "Strategic Planning for Business Growth",
//       metaDescription: "complete",
//       loadTime: "1.2s",
//       issues: 1,
//       lastCrawled: "2025-04-02",
//     },
//     {
//       id: 12,
//       url: "https://jvhconsulting.com/blog/market-analysis",
//       status: "issues",
//       title: "Market Analysis Techniques",
//       metaDescription: "missing",
//       loadTime: "1.4s",
//       issues: 3,
//       lastCrawled: "2025-04-01",
//     },
//     {
//       id: 13,
//       url: "https://jvhconsulting.com/404",
//       status: "broken",
//       title: "Page Not Found",
//       metaDescription: "missing",
//       loadTime: "0.5s",
//       issues: 5,
//       lastCrawled: "2025-04-01",
//     },
//     {
//       id: 14,
//       url: "https://jvhconsulting.com/services/strategy",
//       status: "issues",
//       title: "Strategic Consulting Services",
//       metaDescription: "complete",
//       loadTime: "1.1s",
//       issues: 2,
//       lastCrawled: "2025-04-01",
//     },
//     {
//       id: 15,
//       url: "https://jvhconsulting.com/services/operations",
//       status: "issues",
//       title: "Operations Consulting",
//       metaDescription: "too-short",
//       loadTime: "1.0s",
//       issues: 3,
//       lastCrawled: "2025-03-31",
//     },
//   ];
//   // Generate additional mock data to reach 159 pages
//   const generateMockData = () => {
//     const result = [...crawledPages];
//     for (let i = 16; i <= 159; i++) {
//       result.push({
//         id: i,
//         url: `https://jvhconsulting.com/page-${i}`,
//         status: [
//           "healthy",
//           "issues",
//           "issues",
//           "issues",
//           "redirected",
//           "blocked",
//         ][Math.floor(Math.random() * 6)],
//         title: `Page ${i} - JVH Consulting`,
//         metaDescription: ["complete", "missing", "too-short"][
//           Math.floor(Math.random() * 3)
//         ],
//         loadTime: `${(Math.random() * 2 + 0.5).toFixed(1)}s`,
//         issues: Math.floor(Math.random() * 6),
//         lastCrawled: `2025-${String(Math.floor(Math.random() * 3) + 2).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
//       });
//     }
//     return result;
//   };
//   const allPages = generateMockData();
//   // Filter and sort pages
//   const filteredPages = allPages.filter((page) => {
//     const matchesSearch =
//       page.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       page.title.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesStatus =
//       statusFilter === "all" || page.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });
//   const sortedPages = [...filteredPages].sort((a, b) => {
//     let comparison = 0;
//     switch (sortBy) {
//       case "url":
//         comparison = a.url.localeCompare(b.url);
//         break;
//       case "title":
//         comparison = a.title.localeCompare(b.title);
//         break;
//       case "loadTime":
//         comparison = parseFloat(a.loadTime) - parseFloat(b.loadTime);
//         break;
//       case "issues":
//         comparison = a.issues - b.issues;
//         break;
//       case "lastCrawled":
//         comparison =
//           new Date(a.lastCrawled).getTime() - new Date(b.lastCrawled).getTime();
//         break;
//       default:
//         comparison = 0;
//     }
//     return sortDirection === "asc" ? comparison : -comparison;
//   });
//   // Pagination
//   const totalPages = Math.ceil(sortedPages.length / itemsPerPage);
//   const paginatedPages = sortedPages.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage,
//   );
//   // Handle sort
//   const handleSort = (column: string) => {
//     if (sortBy === column) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc");
//     } else {
//       setSortBy(column);
//       setSortDirection("asc");
//     }
//   };
//   const getSortIcon = (column: string) => {
//     if (sortBy !== column) return <i className="fas fa-sort text-gray-300"></i>;
//     return sortDirection === "asc" ? (
//       <i className="fas fa-sort-up text-blue-500"></i>
//     ) : (
//       <i className="fas fa-sort-down text-blue-500"></i>
//     );
//   };
//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "healthy":
//         return (
//           <Badge className="bg-green-100 text-green-600 hover:bg-green-100">
//             Healthy
//           </Badge>
//         );
//       case "broken":
//         return (
//           <Badge className="bg-red-100 text-red-600 hover:bg-red-100">
//             Broken
//           </Badge>
//         );
//       case "redirected":
//         return (
//           <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100">
//             Redirected
//           </Badge>
//         );
//       case "blocked":
//         return (
//           <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">
//             Blocked
//           </Badge>
//         );
//       case "issues":
//         return (
//           <Badge className="bg-yellow-100 text-yellow-600 hover:bg-yellow-100">
//             Issues
//           </Badge>
//         );
//       default:
//         return <Badge variant="outline">Unknown</Badge>;
//     }
//   };
//   const getMetaDescriptionStatus = (status: string) => {
//     switch (status) {
//       case "complete":
//         return (
//           <Badge className="bg-green-100 text-green-600 hover:bg-green-100">
//             Complete
//           </Badge>
//         );
//       case "missing":
//         return (
//           <Badge className="bg-red-100 text-red-600 hover:bg-red-100">
//             Missing
//           </Badge>
//         );
//       case "too-short":
//         return (
//           <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100">
//             Too Short
//           </Badge>
//         );
//       default:
//         return <Badge variant="outline">Unknown</Badge>;
//     }
//   };
//   // Initialize charts
//   useEffect(() => {
//     if (activeTab === "statistics") {
//       // HTTP Status Code Chart
//       if (httpStatusChartRef.current) {
//         const httpStatusChart = echarts.init(httpStatusChartRef.current);
//         const httpStatusOption = {
//           animation: false,
//           tooltip: {
//             trigger: "item",
//             formatter: "{b}: {c} ({d}%)",
//           },
//           series: [
//             {
//               name: "HTTP Status",
//               type: "pie",
//               radius: ["50%", "70%"],
//               avoidLabelOverlap: false,
//               itemStyle: {
//                 borderRadius: 10,
//                 borderColor: "#fff",
//                 borderWidth: 2,
//               },
//               label: {
//                 show: false,
//                 position: "center",
//               },
//               emphasis: {
//                 label: {
//                   show: true,
//                   fontSize: "18",
//                   fontWeight: "bold",
//                 },
//               },
//               labelLine: {
//                 show: false,
//               },
//               data: [
//                 { value: 158, name: "2xx", itemStyle: { color: "#10b981" } },
//                 { value: 1, name: "3xx", itemStyle: { color: "#f59e0b" } },
//                 { value: 0, name: "4xx", itemStyle: { color: "#ef4444" } },
//                 { value: 0, name: "5xx", itemStyle: { color: "#6b7280" } },
//               ],
//             },
//           ],
//         };
//         httpStatusChart.setOption(httpStatusOption);
//       }
//       // Sitemap Chart
//       if (sitemapChartRef.current) {
//         const sitemapChart = echarts.init(sitemapChartRef.current);
//         const sitemapOption = {
//           animation: false,
//           tooltip: {
//             trigger: "item",
//             formatter: "{b}: {c} ({d}%)",
//           },
//           series: [
//             {
//               name: "Sitemap",
//               type: "pie",
//               radius: ["50%", "70%"],
//               avoidLabelOverlap: false,
//               itemStyle: {
//                 borderRadius: 10,
//                 borderColor: "#fff",
//                 borderWidth: 2,
//               },
//               label: {
//                 show: false,
//                 position: "center",
//               },
//               emphasis: {
//                 label: {
//                   show: true,
//                   fontSize: "18",
//                   fontWeight: "bold",
//                 },
//               },
//               labelLine: {
//                 show: false,
//               },
//               data: [
//                 {
//                   value: 39,
//                   name: "In Sitemap",
//                   itemStyle: { color: "#10b981" },
//                 },
//                 {
//                   value: 44,
//                   name: "Not in Sitemap",
//                   itemStyle: { color: "#ef4444" },
//                 },
//               ],
//             },
//           ],
//         };
//         sitemapChart.setOption(sitemapOption);
//       }
//       // Crawl Depth Chart
//       if (crawlDepthChartRef.current) {
//         const crawlDepthChart = echarts.init(crawlDepthChartRef.current);
//         const crawlDepthOption = {
//           animation: false,
//           tooltip: {
//             trigger: "axis",
//             axisPointer: {
//               type: "shadow",
//             },
//           },
//           grid: {
//             left: "3%",
//             right: "4%",
//             bottom: "3%",
//             containLabel: true,
//           },
//           xAxis: [
//             {
//               type: "category",
//               data: ["1 click", "2 clicks", "3 clicks", "4+ clicks"],
//               axisTick: {
//                 alignWithLabel: true,
//               },
//             },
//           ],
//           yAxis: [
//             {
//               type: "value",
//             },
//           ],
//           series: [
//             {
//               name: "Pages",
//               type: "bar",
//               barWidth: "60%",
//               data: [
//                 { value: 24, itemStyle: { color: "#10b981" } },
//                 { value: 62, itemStyle: { color: "#3b82f6" } },
//                 { value: 64, itemStyle: { color: "#f59e0b" } },
//                 { value: 9, itemStyle: { color: "#ef4444" } },
//               ],
//             },
//           ],
//         };
//         crawlDepthChart.setOption(crawlDepthOption);
//       }
//       // Internal Links Chart
//       if (internalLinksChartRef.current) {
//         const internalLinksChart = echarts.init(internalLinksChartRef.current);
//         const internalLinksOption = {
//           animation: false,
//           tooltip: {
//             trigger: "axis",
//             axisPointer: {
//               type: "shadow",
//             },
//           },
//           grid: {
//             left: "3%",
//             right: "4%",
//             bottom: "3%",
//             containLabel: true,
//           },
//           xAxis: [
//             {
//               type: "category",
//               data: ["2-5", "6-15", "16-50", "51-150", "151-500", "500+"],
//               axisTick: {
//                 alignWithLabel: true,
//               },
//             },
//           ],
//           yAxis: [
//             {
//               type: "value",
//             },
//           ],
//           series: [
//             {
//               name: "Pages",
//               type: "bar",
//               barWidth: "60%",
//               data: [
//                 { value: 59, itemStyle: { color: "#10b981" } },
//                 { value: 0, itemStyle: { color: "#3b82f6" } },
//                 { value: 0, itemStyle: { color: "#f59e0b" } },
//                 { value: 37, itemStyle: { color: "#8b5cf6" } },
//                 { value: 0, itemStyle: { color: "#ec4899" } },
//                 { value: 0, itemStyle: { color: "#ef4444" } },
//               ],
//             },
//           ],
//         };
//         internalLinksChart.setOption(internalLinksOption);
//       }
//       // Markup Types Chart
//       if (markupTypesChartRef.current) {
//         const markupTypesChart = echarts.init(markupTypesChartRef.current);
//         const markupTypesOption = {
//           animation: false,
//           tooltip: {
//             trigger: "item",
//             formatter: "{b}: {c} ({d}%)",
//           },
//           series: [
//             {
//               name: "Markup Types",
//               type: "pie",
//               radius: ["50%", "70%"],
//               avoidLabelOverlap: false,
//               itemStyle: {
//                 borderRadius: 10,
//                 borderColor: "#fff",
//                 borderWidth: 2,
//               },
//               label: {
//                 show: false,
//                 position: "center",
//               },
//               emphasis: {
//                 label: {
//                   show: true,
//                   fontSize: "18",
//                   fontWeight: "bold",
//                 },
//               },
//               labelLine: {
//                 show: false,
//               },
//               data: [
//                 {
//                   value: 0,
//                   name: "Schema.org (Microdata)",
//                   itemStyle: { color: "#10b981" },
//                 },
//                 {
//                   value: 159,
//                   name: "Schema.org (JSON-LD)",
//                   itemStyle: { color: "#3b82f6" },
//                 },
//                 {
//                   value: 159,
//                   name: "Open Graph",
//                   itemStyle: { color: "#f59e0b" },
//                 },
//                 {
//                   value: 159,
//                   name: "Twitter Cards",
//                   itemStyle: { color: "#8b5cf6" },
//                 },
//                 {
//                   value: 0,
//                   name: "Microformats",
//                   itemStyle: { color: "#ef4444" },
//                 },
//               ],
//             },
//           ],
//         };
//         markupTypesChart.setOption(markupTypesOption);
//       }
//       // Canonicalization Chart
//       if (canonicalizationChartRef.current) {
//         const canonicalizationChart = echarts.init(
//           canonicalizationChartRef.current,
//         );
//         const canonicalizationOption = {
//           animation: false,
//           tooltip: {
//             trigger: "item",
//             formatter: "{b}: {c} ({d}%)",
//           },
//           series: [
//             {
//               name: "Canonicalization",
//               type: "pie",
//               radius: ["50%", "70%"],
//               avoidLabelOverlap: false,
//               itemStyle: {
//                 borderRadius: 10,
//                 borderColor: "#fff",
//                 borderWidth: 2,
//               },
//               label: {
//                 show: false,
//                 position: "center",
//               },
//               emphasis: {
//                 label: {
//                   show: true,
//                   fontSize: "18",
//                   fontWeight: "bold",
//                 },
//               },
//               labelLine: {
//                 show: false,
//               },
//               data: [
//                 {
//                   value: 6,
//                   name: 'Without rel="canonical"',
//                   itemStyle: { color: "#ef4444" },
//                 },
//                 {
//                   value: 76,
//                   name: "Canonical to another page",
//                   itemStyle: { color: "#f59e0b" },
//                 },
//                 {
//                   value: 77,
//                   name: "Self-canonical",
//                   itemStyle: { color: "#10b981" },
//                 },
//               ],
//             },
//           ],
//         };
//         canonicalizationChart.setOption(canonicalizationOption);
//       }
//       // Resize handler
//       const handleResize = () => {
//         if (httpStatusChartRef.current) {
//           const httpStatusChart = echarts.getInstanceByDom(
//             httpStatusChartRef.current,
//           );
//           httpStatusChart?.resize();
//         }
//         if (sitemapChartRef.current) {
//           const sitemapChart = echarts.getInstanceByDom(
//             sitemapChartRef.current,
//           );
//           sitemapChart?.resize();
//         }
//         if (crawlDepthChartRef.current) {
//           const crawlDepthChart = echarts.getInstanceByDom(
//             crawlDepthChartRef.current,
//           );
//           crawlDepthChart?.resize();
//         }
//         if (internalLinksChartRef.current) {
//           const internalLinksChart = echarts.getInstanceByDom(
//             internalLinksChartRef.current,
//           );
//           internalLinksChart?.resize();
//         }
//         if (markupTypesChartRef.current) {
//           const markupTypesChart = echarts.getInstanceByDom(
//             markupTypesChartRef.current,
//           );
//           markupTypesChart?.resize();
//         }
//         if (canonicalizationChartRef.current) {
//           const canonicalizationChart = echarts.getInstanceByDom(
//             canonicalizationChartRef.current,
//           );
//           canonicalizationChart?.resize();
//         }
//       };
//       window.addEventListener("resize", handleResize);
//       return () => {
//         window.removeEventListener("resize", handleResize);
//       };
//     }
//   }, [activeTab, viewMode]);
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div
//         id="share-modal"
//         className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden"
//       >
//         <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
//           <div className="p-6">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center">
//                 <i
//                   id="share-modal-icon"
//                   className="fas fa-envelope text-blue-500 mr-3 text-xl"
//                 ></i>
//                 <h3 id="share-modal-title" className="text-lg font-semibold">
//                   Send via Email
//                 </h3>
//               </div>
//               <button
//                 className="text-gray-400 hover:text-gray-500"
//                 onClick={() => {
//                   document
//                     .getElementById("share-modal")
//                     .classList.add("hidden");
//                 }}
//               >
//                 <i className="fas fa-times"></i>
//               </button>
//             </div>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Recipient
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter email address"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Subject
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter subject"
//                   defaultValue="Site Audit Report: jvhconsulting.com"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Message
//                 </label>
//                 <textarea
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
//                   placeholder="Enter your message"
//                   defaultValue="Please find attached the site audit report for jvhconsulting.com. Let me know if you have any questions."
//                 ></textarea>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id="include-report"
//                   className="mr-2"
//                   defaultChecked
//                 />
//                 <label
//                   htmlFor="include-report"
//                   className="text-sm text-gray-700"
//                 >
//                   Include full report
//                 </label>
//               </div>
//             </div>
//             <div className="mt-6 flex justify-end gap-2">
//               <Button
//                 variant="outline"
//                 className="!rounded-button whitespace-nowrap cursor-pointer"
//                 onClick={() => {
//                   document
//                     .getElementById("share-modal")
//                     .classList.add("hidden");
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="default"
//                 className="!rounded-button whitespace-nowrap cursor-pointer"
//                 onClick={() => {
//                   document
//                     .getElementById("share-modal")
//                     .classList.add("hidden");
//                   document
//                     .getElementById("share-success-modal")
//                     .classList.remove("hidden");
//                 }}
//               >
//                 Send
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div
//         id="share-success-modal"
//         className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden"
//       >
//         <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
//           <div className="text-center">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <i className="fas fa-check text-2xl text-green-600"></i>
//             </div>
//             <h3 className="text-lg font-semibold mb-2">Sent Successfully!</h3>
//             <p className="text-gray-600 mb-6">
//               Your report has been sent successfully.
//             </p>
//             <Button
//               variant="default"
//               className="!rounded-button whitespace-nowrap cursor-pointer"
//               onClick={() => {
//                 document
//                   .getElementById("share-success-modal")
//                   .classList.add("hidden");
//               }}
//             >
//               Close
//             </Button>
//           </div>
//         </div>
//       </div>
//       <header className="bg-white border-b border-gray-200">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center space-x-4">
//               <h1 className="text-xl font-bold">
//                 Site Audit:{" "}
//                 <span className="text-blue-500">jvhconsulting.com</span>
//               </h1>
//               <span className="text-sm text-gray-500">
//                 Last updated: Sunday, April 6, 2025
//               </span>
//               <Badge variant="outline" className="flex items-center gap-1">
//                 <i className="fas fa-mobile-alt"></i> Mobile
//               </Badge>
//               <Badge variant="outline" className="flex items-center gap-1">
//                 JS Rendering: Disabled
//               </Badge>
//               <Badge variant="outline" className="flex items-center gap-1">
//                 Pages Crawled: 159/500
//               </Badge>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Button
//                 variant="default"
//                 className="flex items-center gap-2 !rounded-button whitespace-nowrap cursor-pointer"
//               >
//                 <i className="fas fa-sync-alt"></i> Run Again
//               </Button>
//               <Button
//                 variant="outline"
//                 className="flex items-center gap-2 !rounded-button whitespace-nowrap cursor-pointer"
//               >
//                 <i className="fas fa-eye"></i> Data Analysis
//               </Button>
//               <Button
//                 variant="outline"
//                 className="flex items-center gap-2 !rounded-button whitespace-nowrap cursor-pointer"
//               >
//                 <i className="fas fa-file-pdf"></i> PDF Export
//               </Button>
//               <Button
//                 variant="outline"
//                 className="flex items-center gap-2 !rounded-button whitespace-nowrap cursor-pointer"
//               >
//                 <i className="fas fa-download"></i> Export
//               </Button>
//               <Button
//                 variant="outline"
//                 className="flex items-center gap-2 !rounded-button whitespace-nowrap cursor-pointer"
//               >
//                 <i className="fas fa-share-alt"></i> Share
//               </Button>
//               <Button
//                 variant="outline"
//                 className="flex items-center gap-2 !rounded-button whitespace-nowrap cursor-pointer"
//               >
//                 <i className="fas fa-cog"></i>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>
//       <div className="container mx-auto px-4 py-6">
//         <Tabs
//           defaultValue="crawled-pages"
//           onValueChange={setActiveTab}
//           value={activeTab}
//         >
//           <TabsList className="mb-6">
//             <TabsTrigger
//               value="overview"
//               className="!rounded-button whitespace-nowrap cursor-pointer"
//             >
//               Overview
//             </TabsTrigger>
//             <TabsTrigger
//               value="issues"
//               className="!rounded-button whitespace-nowrap cursor-pointer"
//             >
//               Issues
//             </TabsTrigger>
//             <TabsTrigger
//               value="crawled-pages"
//               className="!rounded-button whitespace-nowrap cursor-pointer"
//             >
//               Crawled Pages
//             </TabsTrigger>
//             <TabsTrigger
//               value="statistics"
//               className="!rounded-button whitespace-nowrap cursor-pointer"
//             >
//               Statistics
//             </TabsTrigger>
//             <TabsTrigger
//               value="compare-crawls"
//               className="!rounded-button whitespace-nowrap cursor-pointer"
//             >
//               Compare Crawls
//             </TabsTrigger>
//             <TabsTrigger
//               value="progress"
//               className="!rounded-button whitespace-nowrap cursor-pointer"
//             >
//               Progress
//             </TabsTrigger>
//             <TabsTrigger
//               value="js-impact"
//               className="!rounded-button whitespace-nowrap cursor-pointer"
//             >
//               JS Impact
//             </TabsTrigger>
//             <TabsTrigger
//               value="keywords"
//               className="!rounded-button whitespace-nowrap cursor-pointer"
//             >
//               Keywords
//             </TabsTrigger>
//             <TabsTrigger
//               value="on-page"
//               className="!rounded-button whitespace-nowrap cursor-pointer"
//             >
//               On-Page
//             </TabsTrigger>
//             <TabsTrigger
//               value="technical"
//               className="!rounded-button whitespace-nowrap cursor-pointer"
//             >
//               Technical
//             </TabsTrigger>
//           </TabsList>
//           <TabsContent value="crawled-pages" className="space-y-6">
//             <Card>
//               <CardHeader className="pb-2">
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                   <CardTitle className="text-xl">
//                     Crawled Pages
//                     <a
//                       href="#"
//                       className="ml-2 text-blue-500 text-sm hover:underline cursor-pointer"
//                     >
//                       <i className="fas fa-external-link-alt"></i>
//                     </a>
//                   </CardTitle>
//                   <div className="flex flex-col md:flex-row gap-4">
//                     <div className="relative">
//                       <Input
//                         type="text"
//                         placeholder="Search URL or title..."
//                         className="pl-10 pr-4 h-10 w-full md:w-64 border-gray-200"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                       />
//                       <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
//                     </div>
//                     <div className="flex gap-2">
//                       <Select
//                         value={statusFilter}
//                         onValueChange={setStatusFilter}
//                       >
//                         <SelectTrigger className="w-[180px] h-10 !rounded-button">
//                           <SelectValue placeholder="Filter by status" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="all">All Statuses</SelectItem>
//                           <SelectItem value="healthy">Healthy</SelectItem>
//                           <SelectItem value="broken">Broken</SelectItem>
//                           <SelectItem value="redirected">Redirected</SelectItem>
//                           <SelectItem value="blocked">Blocked</SelectItem>
//                           <SelectItem value="issues">Issues</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <Select value={sortBy} onValueChange={setSortBy}>
//                         <SelectTrigger className="w-[180px] h-10 !rounded-button">
//                           <SelectValue placeholder="Sort by" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="url">URL</SelectItem>
//                           <SelectItem value="title">Page Title</SelectItem>
//                           <SelectItem value="loadTime">Load Time</SelectItem>
//                           <SelectItem value="issues">Issues</SelectItem>
//                           <SelectItem value="lastCrawled">
//                             Last Crawled
//                           </SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <Button
//                         variant="outline"
//                         className="h-10 !rounded-button whitespace-nowrap cursor-pointer"
//                         onClick={() =>
//                           setSortDirection(
//                             sortDirection === "asc" ? "desc" : "asc",
//                           )
//                         }
//                       >
//                         {sortDirection === "asc" ? (
//                           <i className="fas fa-sort-amount-up-alt mr-2"></i>
//                         ) : (
//                           <i className="fas fa-sort-amount-down-alt mr-2"></i>
//                         )}
//                         {sortDirection === "asc" ? "Ascending" : "Descending"}
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="mb-4 text-sm text-gray-500">
//                   Found{" "}
//                   <span className="font-medium text-gray-700">
//                     {filteredPages.length}
//                   </span>{" "}
//                   pages
//                 </div>
//                 <div className="border rounded-lg overflow-hidden">
//                   <div className="overflow-x-auto">
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead
//                             className="w-1/3 cursor-pointer"
//                             onClick={() => handleSort("url")}
//                           >
//                             URL {getSortIcon("url")}
//                           </TableHead>
//                           <TableHead
//                             className="cursor-pointer"
//                             onClick={() => handleSort("status")}
//                           >
//                             Status {getSortIcon("status")}
//                           </TableHead>
//                           <TableHead
//                             className="cursor-pointer"
//                             onClick={() => handleSort("title")}
//                           >
//                             Page Title {getSortIcon("title")}
//                           </TableHead>
//                           <TableHead>Meta Description</TableHead>
//                           <TableHead
//                             className="cursor-pointer"
//                             onClick={() => handleSort("loadTime")}
//                           >
//                             Load Time {getSortIcon("loadTime")}
//                           </TableHead>
//                           <TableHead
//                             className="cursor-pointer"
//                             onClick={() => handleSort("issues")}
//                           >
//                             Issues {getSortIcon("issues")}
//                           </TableHead>
//                           <TableHead
//                             className="cursor-pointer"
//                             onClick={() => handleSort("lastCrawled")}
//                           >
//                             Last Crawled {getSortIcon("lastCrawled")}
//                           </TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {paginatedPages.map((page) => (
//                           <TableRow
//                             key={page.id}
//                             className="cursor-pointer hover:bg-gray-50"
//                           >
//                             <TableCell className="font-medium text-blue-600 hover:underline">
//                               <a
//                                 href={page.url}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="block truncate max-w-xs"
//                               >
//                                 {page.url}
//                               </a>
//                             </TableCell>
//                             <TableCell>{getStatusBadge(page.status)}</TableCell>
//                             <TableCell className="truncate max-w-xs">
//                               {page.title}
//                             </TableCell>
//                             <TableCell>
//                               {getMetaDescriptionStatus(page.metaDescription)}
//                             </TableCell>
//                             <TableCell>
//                               <span
//                                 className={
//                                   parseFloat(page.loadTime) < 1.0
//                                     ? "text-green-600"
//                                     : parseFloat(page.loadTime) < 1.5
//                                       ? "text-orange-600"
//                                       : "text-red-600"
//                                 }
//                               >
//                                 {page.loadTime}
//                               </span>
//                             </TableCell>
//                             <TableCell>
//                               <span
//                                 className={
//                                   page.issues === 0
//                                     ? "text-green-600"
//                                     : page.issues < 3
//                                       ? "text-orange-600"
//                                       : "text-red-600"
//                                 }
//                               >
//                                 {page.issues}
//                               </span>
//                             </TableCell>
//                             <TableCell>{page.lastCrawled}</TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </div>
//                 </div>
//                 <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm text-gray-500">Show</span>
//                     <Select
//                       value={String(itemsPerPage)}
//                       onValueChange={(value) => {
//                         setItemsPerPage(Number(value));
//                         setCurrentPage(1);
//                       }}
//                     >
//                       <SelectTrigger className="w-[80px] h-9 !rounded-button">
//                         <SelectValue placeholder="10" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="10">10</SelectItem>
//                         <SelectItem value="25">25</SelectItem>
//                         <SelectItem value="50">50</SelectItem>
//                         <SelectItem value="100">100</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <span className="text-sm text-gray-500">per page</span>
//                   </div>
//                   <Pagination>
//                     <PaginationContent>
//                       <PaginationItem>
//                         <PaginationPrevious
//                           onClick={() =>
//                             setCurrentPage(Math.max(1, currentPage - 1))
//                           }
//                           className={
//                             currentPage === 1
//                               ? "pointer-events-none opacity-50"
//                               : "cursor-pointer"
//                           }
//                         />
//                       </PaginationItem>
//                       {Array.from(
//                         { length: Math.min(5, totalPages) },
//                         (_, i) => {
//                           let pageNum;
//                           if (totalPages <= 5) {
//                             pageNum = i + 1;
//                           } else if (currentPage <= 3) {
//                             pageNum = i + 1;
//                           } else if (currentPage >= totalPages - 2) {
//                             pageNum = totalPages - 4 + i;
//                           } else {
//                             pageNum = currentPage - 2 + i;
//                           }
//                           return (
//                             <PaginationItem key={i}>
//                               <PaginationLink
//                                 isActive={pageNum === currentPage}
//                                 onClick={() => setCurrentPage(pageNum)}
//                                 className="cursor-pointer"
//                               >
//                                 {pageNum}
//                               </PaginationLink>
//                             </PaginationItem>
//                           );
//                         },
//                       )}
//                       {totalPages > 5 && currentPage < totalPages - 2 && (
//                         <>
//                           <PaginationItem>
//                             <PaginationEllipsis />
//                           </PaginationItem>
//                           <PaginationItem>
//                             <PaginationLink
//                               onClick={() => setCurrentPage(totalPages)}
//                               className="cursor-pointer"
//                             >
//                               {totalPages}
//                             </PaginationLink>
//                           </PaginationItem>
//                         </>
//                       )}
//                       <PaginationItem>
//                         <PaginationNext
//                           onClick={() =>
//                             setCurrentPage(
//                               Math.min(totalPages, currentPage + 1),
//                             )
//                           }
//                           className={
//                             currentPage === totalPages
//                               ? "pointer-events-none opacity-50"
//                               : "cursor-pointer"
//                           }
//                         />
//                       </PaginationItem>
//                     </PaginationContent>
//                   </Pagination>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Page Status Summary</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//                   <div className="bg-green-50 p-4 rounded-lg border border-green-100">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-sm font-medium text-green-800">
//                         Healthy Pages
//                       </h3>
//                       <span className="w-3 h-3 bg-green-500 rounded-full"></span>
//                     </div>
//                     <p className="text-2xl font-bold text-green-600">2</p>
//                     <p className="text-xs text-green-700 mt-1">
//                       1.3% of total pages
//                     </p>
//                   </div>
//                   <div className="bg-red-50 p-4 rounded-lg border border-red-100">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-sm font-medium text-red-800">
//                         Broken Pages
//                       </h3>
//                       <span className="w-3 h-3 bg-red-500 rounded-full"></span>
//                     </div>
//                     <p className="text-2xl font-bold text-red-600">1</p>
//                     <p className="text-xs text-red-700 mt-1">
//                       0.6% of total pages
//                     </p>
//                   </div>
//                   <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-sm font-medium text-yellow-800">
//                         Pages with Issues
//                       </h3>
//                       <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
//                     </div>
//                     <p className="text-2xl font-bold text-yellow-600">156</p>
//                     <p className="text-xs text-yellow-700 mt-1">
//                       98.1% of total pages
//                     </p>
//                   </div>
//                   <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-sm font-medium text-orange-800">
//                         Redirected Pages
//                       </h3>
//                       <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
//                     </div>
//                     <p className="text-2xl font-bold text-orange-600">1</p>
//                     <p className="text-xs text-orange-700 mt-1">
//                       0.6% of total pages
//                     </p>
//                   </div>
//                   <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-sm font-medium text-gray-800">
//                         Blocked Pages
//                       </h3>
//                       <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
//                     </div>
//                     <p className="text-2xl font-bold text-gray-600">0</p>
//                     <p className="text-xs text-gray-700 mt-1">
//                       0% of total pages
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">
//                   Common Issues by Page Type
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <div>
//                     <h3 className="text-md font-medium mb-3 text-gray-700">
//                       Blog Pages
//                     </h3>
//                     <ul className="space-y-2">
//                       <li className="flex items-center justify-between p-2 bg-gray-50 rounded">
//                         <span className="text-sm">
//                           Missing meta descriptions
//                         </span>
//                         <Badge className="bg-red-100 text-red-600 hover:bg-red-100">
//                           42 pages
//                         </Badge>
//                       </li>
//                       <li className="flex items-center justify-between p-2 bg-gray-50 rounded">
//                         <span className="text-sm">Slow loading images</span>
//                         <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100">
//                           28 pages
//                         </Badge>
//                       </li>
//                       <li className="flex items-center justify-between p-2 bg-gray-50 rounded">
//                         <span className="text-sm">Missing alt text</span>
//                         <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100">
//                           35 pages
//                         </Badge>
//                       </li>
//                     </ul>
//                   </div>
//                   <div>
//                     <h3 className="text-md font-medium mb-3 text-gray-700">
//                       Service Pages
//                     </h3>
//                     <ul className="space-y-2">
//                       <li className="flex items-center justify-between p-2 bg-gray-50 rounded">
//                         <span className="text-sm">Duplicate content</span>
//                         <Badge className="bg-red-100 text-red-600 hover:bg-red-100">
//                           12 pages
//                         </Badge>
//                       </li>
//                       <li className="flex items-center justify-between p-2 bg-gray-50 rounded">
//                         <span className="text-sm">Missing schema markup</span>
//                         <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100">
//                           18 pages
//                         </Badge>
//                       </li>
//                       <li className="flex items-center justify-between p-2 bg-gray-50 rounded">
//                         <span className="text-sm">Low word count</span>
//                         <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100">
//                           15 pages
//                         </Badge>
//                       </li>
//                     </ul>
//                   </div>
//                   <div>
//                     <h3 className="text-md font-medium mb-3 text-gray-700">
//                       Resource Pages
//                     </h3>
//                     <ul className="space-y-2">
//                       <li className="flex items-center justify-between p-2 bg-gray-50 rounded">
//                         <span className="text-sm">Broken links</span>
//                         <Badge className="bg-red-100 text-red-600 hover:bg-red-100">
//                           8 pages
//                         </Badge>
//                       </li>
//                       <li className="flex items-center justify-between p-2 bg-gray-50 rounded">
//                         <span className="text-sm">Missing H1 tags</span>
//                         <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100">
//                           22 pages
//                         </Badge>
//                       </li>
//                       <li className="flex items-center justify-between p-2 bg-gray-50 rounded">
//                         <span className="text-sm">Unoptimized images</span>
//                         <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100">
//                           19 pages
//                         </Badge>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//                 <div className="mt-6">
//                   <Button
//                     variant="outline"
//                     className="!rounded-button whitespace-nowrap cursor-pointer"
//                   >
//                     <i className="fas fa-download mr-2"></i> Export Issues
//                     Report
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//           <TabsContent value="statistics" className="space-y-6">
//             <div className="flex justify-end mb-4">
//               <div className="inline-flex rounded-md shadow-sm">
//                 <Button
//                   variant={viewMode === "tile" ? "default" : "outline"}
//                   className="!rounded-l-md !rounded-r-none !rounded-button whitespace-nowrap cursor-pointer"
//                   onClick={() => setViewMode("tile")}
//                 >
//                   <i className="fas fa-th-large mr-2"></i> 卡片
//                 </Button>
//                 <Button
//                   variant={viewMode === "graph" ? "default" : "outline"}
//                   className="!rounded-r-md !rounded-l-none !rounded-button whitespace-nowrap cursor-pointer"
//                   onClick={() => setViewMode("graph")}
//                 >
//                   <i className="fas fa-chart-bar mr-2"></i> 图表
//                 </Button>
//               </div>
//             </div>
//             {viewMode === "tile" ? (
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <Card>
//                   <CardHeader className="pb-2">
//                     <CardTitle className="text-lg">HTTP 状态码</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       <div className="flex flex-col">
//                         <div className="text-3xl font-bold text-blue-600">
//                           0%
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           带有 4xx 和 5xx 状态码的页面
//                         </div>
//                       </div>
//                       <div className="space-y-2">
//                         <div className="flex justify-between items-center text-sm">
//                           <span>5xx: 0%</span>
//                           <span className="text-gray-500">0 个页面</span>
//                         </div>
//                         <div className="flex justify-between items-center text-sm">
//                           <span>4xx: 0%</span>
//                           <span className="text-gray-500">0 个页面</span>
//                         </div>
//                         <div className="flex justify-between items-center text-sm">
//                           <span>3xx: 1%</span>
//                           <span className="text-gray-500">1 个页面</span>
//                         </div>
//                         <div className="flex justify-between items-center text-sm">
//                           <span>2xx: 99%</span>
//                           <span className="text-gray-500">158 个页面</span>
//                         </div>
//                         <div className="flex justify-between items-center text-sm">
//                           <span>1xx: 0%</span>
//                           <span className="text-gray-500">0 个页面</span>
//                         </div>
//                         <div className="flex justify-between items-center text-sm">
//                           <span>无状态码: 0%</span>
//                           <span className="text-gray-500">0 个页面</span>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardHeader className="pb-2">
//                     <CardTitle className="text-lg">
//                       站点地图与已爬取页面对比
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       <div className="flex flex-col">
//                         <div className="text-3xl font-bold text-blue-600">
//                           83
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           站点地图中的页面
//                         </div>
//                       </div>
//                       <div className="space-y-2">
//                         <div className="flex justify-between items-center text-sm">
//                           <span>在站点地图中找到的已爬取页面: 47%</span>
//                           <span className="text-gray-500">39 个页面</span>
//                         </div>
//                         <div className="flex justify-between items-center text-sm">
//                           <span>未在站点地图中找到的已爬取页面: 53%</span>
//                           <span className="text-gray-500">44 个页面</span>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardHeader className="pb-2">
//                     <CardTitle className="text-lg">页面爬取深度</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       <div className="flex flex-col">
//                         <div className="text-3xl font-bold text-blue-600">
//                           6%
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           超过 3 次点击的页面
//                         </div>
//                       </div>
//                       <div className="space-y-2">
//                         <div className="flex justify-between items-center text-sm">
//                           <span>1 次点击: 15%</span>
//                           <span className="text-gray-500">24 个页面</span>
//                         </div>
//                         <div className="flex justify-between items-center text-sm">
//                           <span>2 次点击: 39%</span>
//                           <span className="text-gray-500">62 个页面</span>
//                         </div>
//                         <div className="flex justify-between items-center text-sm">
//                           <span>3 次点击: 40%</span>
//                           <span className="text-gray-500">64 个页面</span>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardHeader className="pb-2">
//                     <CardTitle className="text-lg">内部链接</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       <div className="flex flex-col">
//                         <div className="text-3xl font-bold text-blue-600">
//                           36%
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           只有 1 个内部链接的页面
//                         </div>
//                       </div>
//                       <div className="space-y-2">
//                         <div className="flex justify-between items-center text-sm">
//                           <span>2-5: 37%</span>
//                           <span className="text-gray-500">59 个页面</span>
//                         </div>
//                         <div className="flex justify-between items-center text-sm">
//                           <span>6-15: 0%</span>
//                           <span className="text-gray-500">0 个页面</span>
//                         </div>
//                         <div className="flex justify-between items-center text-sm">
//                           <span>16-50: 0%</span>
//                           <span className="text-gray-500">0 个页面</span>
//                         </div>
//                         <div className="flex justify-between items-center text-sm">
//                           <span>51-150: 23%</span>
//                           <span className="text-gray-500">37 个页面</span>
//                         </div>
//                         <div className="flex justify-between items-center text-sm">
//                           <span>151-500: 0%</span>
//                           <span className="text-gray-500">0 个页面</span>
//                         </div>
//                         <div className="flex justify-between items-center text-sm">
//                           <span>500+: 0%</span>
//                           <span className="text-gray-500">0 个页面</span>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardHeader className="pb-2">
//                     <CardTitle className="text-lg">标记类型</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       <div className="flex flex-col">
//                         <div className="text-3xl font-bold text-blue-600">
//                           0%
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           没有标记的页面
//                         </div>
//                       </div>
//                       <div className="space-y-2">
//                         <div className="flex justify-between items-center text-sm">
//                           <span>Schema.org (Microdata): 0%</span>
//                           <span className="text-gray-500">0 个页面</span>
//                         </div>
//                         <div className="flex justify-between items-center text-sm">
//                           <span>Schema.org (JSON-LD): 100%</span>
//                           <span className="text-gray-500">159 个页面</span>
//                         </div>
//                         <div className="flex justify-between items-center text-sm">
//                           <span>Open Graph: 100%</span>
//                           <span className="text-gray-500">159 个页面</span>
//                         </div>
//                         <div className="flex justify-between items-center text-sm">
//                           <span>Twitter Cards: 100%</span>
//                           <span className="text-gray-500">159 个页面</span>
//                         </div>
//                         <div className="flex justify-between items-center text-sm">
//                           <span>Microformats: 0%</span>
//                           <span className="text-gray-500">0 个页面</span>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardHeader className="pb-2">
//                     <CardTitle className="text-lg">规范化</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       <div className="flex flex-col">
//                         <div className="text-3xl font-bold text-blue-600">
//                           4%
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           没有 rel="canonical" 标签的页面
//                         </div>
//                       </div>
//                       <div className="space-y-2">
//                         <div className="flex justify-between items-center text-sm">
//                           <span>规范到其他页面: 48%</span>
//                           <span className="text-gray-500">76 个页面</span>
//                         </div>
//                         <div className="flex justify-between items-center text-sm">
//                           <span>自我规范: 48%</span>
//                           <span className="text-gray-500">77 个页面</span>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Card>
//                   <CardHeader className="pb-2">
//                     <CardTitle className="text-lg">HTTP 状态码</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div
//                       ref={httpStatusChartRef}
//                       style={{ height: "300px" }}
//                     ></div>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardHeader className="pb-2">
//                     <CardTitle className="text-lg">
//                       站点地图与已爬取页面对比
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div
//                       ref={sitemapChartRef}
//                       style={{ height: "300px" }}
//                     ></div>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardHeader className="pb-2">
//                     <CardTitle className="text-lg">页面爬取深度</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div
//                       ref={crawlDepthChartRef}
//                       style={{ height: "300px" }}
//                     ></div>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardHeader className="pb-2">
//                     <CardTitle className="text-lg">内部链接</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div
//                       ref={internalLinksChartRef}
//                       style={{ height: "300px" }}
//                     ></div>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardHeader className="pb-2">
//                     <CardTitle className="text-lg">标记类型</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div
//                       ref={markupTypesChartRef}
//                       style={{ height: "300px" }}
//                     ></div>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardHeader className="pb-2">
//                     <CardTitle className="text-lg">规范化</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div
//                       ref={canonicalizationChartRef}
//                       style={{ height: "300px" }}
//                     ></div>
//                   </CardContent>
//                 </Card>
//               </div>
//             )}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">性能指标</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                   <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-sm font-medium text-gray-700">
//                         平均页面加载时间
//                       </h3>
//                       <i className="fas fa-tachometer-alt text-blue-500"></i>
//                     </div>
//                     <p className="text-2xl font-bold text-blue-600">1.05s</p>
//                     <div className="flex items-center mt-2 text-xs text-green-600">
//                       <i className="fas fa-arrow-down mr-1"></i>
//                       <span>比上次爬取提升了 12%</span>
//                     </div>
//                   </div>
//                   <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-sm font-medium text-gray-700">
//                         平均页面大小
//                       </h3>
//                       <i className="fas fa-file text-blue-500"></i>
//                     </div>
//                     <p className="text-2xl font-bold text-blue-600">1.24 MB</p>
//                     <div className="flex items-center mt-2 text-xs text-red-600">
//                       <i className="fas fa-arrow-up mr-1"></i>
//                       <span>比上次爬取增加了 8%</span>
//                     </div>
//                   </div>
//                   <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-sm font-medium text-gray-700">
//                         平均图片大小
//                       </h3>
//                       <i className="fas fa-image text-blue-500"></i>
//                     </div>
//                     <p className="text-2xl font-bold text-blue-600">320 KB</p>
//                     <div className="flex items-center mt-2 text-xs text-red-600">
//                       <i className="fas fa-arrow-up mr-1"></i>
//                       <span>比上次爬取增加了 15%</span>
//                     </div>
//                   </div>
//                   <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-sm font-medium text-gray-700">
//                         平均 JS 大小
//                       </h3>
//                       <i className="fab fa-js text-blue-500"></i>
//                     </div>
//                     <p className="text-2xl font-bold text-blue-600">450 KB</p>
//                     <div className="flex items-center mt-2 text-xs text-green-600">
//                       <i className="fas fa-arrow-down mr-1"></i>
//                       <span>比上次爬取减少了 5%</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-6">
//                   <Button
//                     variant="outline"
//                     className="!rounded-button whitespace-nowrap cursor-pointer"
//                   >
//                     <i className="fas fa-download mr-2"></i> Export Performance
//                     Report
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//           <TabsContent value="overview">
//             <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
//               <p className="text-gray-500">
//                 <i className="fas fa-arrow-left mr-2"></i>
//                 Please click on "Crawled Pages" or "Statistics" tab to view data
//               </p>
//             </div>
//           </TabsContent>
//           <TabsContent value="issues" className="space-y-6">
//             <Card>
//               <CardHeader className="pb-2">
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                   <CardTitle className="text-xl">Issues</CardTitle>
//                   <div className="flex flex-wrap gap-2">
//                     <div className="relative">
//                       <Input
//                         type="text"
//                         placeholder="Search issues..."
//                         className="pl-10 pr-4 h-10 w-full md:w-64 border-gray-200"
//                       />
//                       <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
//                     </div>
//                     <div className="flex gap-2 flex-wrap">
//                       <Button
//                         variant="outline"
//                         className="h-10 !rounded-button whitespace-nowrap cursor-pointer"
//                       >
//                         All{" "}
//                         <Badge className="ml-1 bg-gray-100 text-gray-600">
//                           19
//                         </Badge>
//                       </Button>
//                       <Button
//                         variant="outline"
//                         className="h-10 !rounded-button whitespace-nowrap cursor-pointer"
//                       >
//                         Errors{" "}
//                         <Badge className="ml-1 bg-red-100 text-red-600">
//                           4
//                         </Badge>
//                       </Button>
//                       <Button
//                         variant="outline"
//                         className="h-10 !rounded-button whitespace-nowrap cursor-pointer"
//                       >
//                         Warnings{" "}
//                         <Badge className="ml-1 bg-yellow-100 text-yellow-600">
//                           8
//                         </Badge>
//                       </Button>
//                       <Button
//                         variant="outline"
//                         className="h-10 !rounded-button whitespace-nowrap cursor-pointer"
//                       >
//                         Notices{" "}
//                         <Badge className="ml-1 bg-blue-100 text-blue-600">
//                           7
//                         </Badge>
//                       </Button>
//                       <Select defaultValue="triggered">
//                         <SelectTrigger className="w-[180px] h-10 !rounded-button">
//                           <SelectValue placeholder="Triggered checks" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="triggered">
//                             Triggered checks
//                           </SelectItem>
//                           <SelectItem value="all">All checks</SelectItem>
//                           <SelectItem value="custom">Custom checks</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <Select defaultValue="category">
//                         <SelectTrigger className="w-[180px] h-10 !rounded-button">
//                           <SelectValue placeholder="Category" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="category">
//                             All Categories
//                           </SelectItem>
//                           <SelectItem value="seo">SEO</SelectItem>
//                           <SelectItem value="performance">
//                             Performance
//                           </SelectItem>
//                           <SelectItem value="accessibility">
//                             Accessibility
//                           </SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="border rounded-lg overflow-hidden">
//                   <div className="bg-gray-50 p-4 border-b">
//                     <h3 className="text-lg font-medium flex items-center">
//                       Errors{" "}
//                       <Badge className="ml-2 bg-red-100 text-red-600 hover:bg-red-100">
//                         4
//                       </Badge>
//                       <i className="fas fa-info-circle ml-2 text-gray-400"></i>
//                     </h3>
//                   </div>
//                   <div className="divide-y">
//                     <div className="p-4 hover:bg-gray-50">
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <div className="flex items-center mb-2">
//                             <a
//                               href="#"
//                               className="text-blue-600 font-medium hover:underline"
//                               onClick={(e) => {
//                                 e.preventDefault();
//                                 document
//                                   .getElementById("broken-js-css-modal")
//                                   .classList.remove("hidden");
//                               }}
//                             >
//                               459 issues
//                             </a>
//                             <span className="text-gray-600 ml-2">
//                               with broken internal JavaScript and CSS files
//                             </span>
//                             <a
//                               href="#"
//                               className="text-blue-500 text-sm ml-2 hover:underline"
//                             >
//                               Why and how to fix it
//                             </a>
//                           </div>
//                           <div className="flex items-center text-sm text-gray-500">
//                             <Badge className="mr-2 bg-blue-100 text-blue-600 hover:bg-blue-100">
//                               177 new issues
//                             </Badge>
//                             <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
//                               <div
//                                 className="bg-blue-500 h-full"
//                                 style={{ width: "70%" }}
//                               ></div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <div className="relative">
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               className="!rounded-button whitespace-nowrap cursor-pointer"
//                               onClick={(e) => {
//                                 const menu = e.currentTarget.nextElementSibling;
//                                 menu.classList.toggle("hidden");
//                                 e.stopPropagation();
//                               }}
//                             >
//                               <i className="fas fa-share mr-1"></i> Send to...
//                             </Button>
//                             <div className="absolute z-50 right-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 hidden">
//                               <div className="py-1">
//                                 <button
//                                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                   onClick={() => {
//                                     document
//                                       .getElementById("share-modal")
//                                       .classList.remove("hidden");
//                                     document.getElementById(
//                                       "share-modal-title",
//                                     ).textContent = "Send via Email";
//                                     document.getElementById(
//                                       "share-modal-icon",
//                                     ).className =
//                                       "fas fa-envelope text-blue-500";
//                                     document
//                                       .getElementById("share-modal")
//                                       .nextElementSibling.classList.toggle(
//                                         "hidden",
//                                       );
//                                   }}
//                                 >
//                                   <i className="fas fa-envelope mr-2 text-blue-500"></i>{" "}
//                                   Email
//                                 </button>
//                                 <button
//                                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                   onClick={() => {
//                                     document
//                                       .getElementById("share-modal")
//                                       .classList.remove("hidden");
//                                     document.getElementById(
//                                       "share-modal-title",
//                                     ).textContent = "Send to Slack";
//                                     document.getElementById(
//                                       "share-modal-icon",
//                                     ).className =
//                                       "fab fa-slack text-purple-500";
//                                     document
//                                       .getElementById("share-modal")
//                                       .nextElementSibling.classList.toggle(
//                                         "hidden",
//                                       );
//                                   }}
//                                 >
//                                   <i className="fab fa-slack mr-2 text-purple-500"></i>{" "}
//                                   Slack
//                                 </button>
//                                 <button
//                                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                   onClick={() => {
//                                     document
//                                       .getElementById("share-modal")
//                                       .classList.remove("hidden");
//                                     document.getElementById(
//                                       "share-modal-title",
//                                     ).textContent = "Send to Jira";
//                                     document.getElementById(
//                                       "share-modal-icon",
//                                     ).className = "fab fa-jira text-blue-600";
//                                     document
//                                       .getElementById("share-modal")
//                                       .nextElementSibling.classList.toggle(
//                                         "hidden",
//                                       );
//                                   }}
//                                 >
//                                   <i className="fab fa-jira mr-2 text-blue-600"></i>{" "}
//                                   Jira
//                                 </button>
//                                 <button
//                                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                   onClick={() => {
//                                     document
//                                       .getElementById("share-modal")
//                                       .classList.remove("hidden");
//                                     document.getElementById(
//                                       "share-modal-title",
//                                     ).textContent = "Send to Trello";
//                                     document.getElementById(
//                                       "share-modal-icon",
//                                     ).className = "fab fa-trello text-blue-400";
//                                     document
//                                       .getElementById("share-modal")
//                                       .nextElementSibling.classList.toggle(
//                                         "hidden",
//                                       );
//                                   }}
//                                 >
//                                   <i className="fab fa-trello mr-2 text-blue-400"></i>{" "}
//                                   Trello
//                                 </button>
//                                 <div className="border-t border-gray-100 my-1"></div>
//                                 <button
//                                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                   onClick={() => {
//                                     document
//                                       .getElementById("share-modal")
//                                       .classList.remove("hidden");
//                                     document.getElementById(
//                                       "share-modal-title",
//                                     ).textContent = "Export as CSV";
//                                     document.getElementById(
//                                       "share-modal-icon",
//                                     ).className =
//                                       "fas fa-file-csv text-green-500";
//                                     document
//                                       .getElementById("share-modal")
//                                       .nextElementSibling.classList.toggle(
//                                         "hidden",
//                                       );
//                                   }}
//                                 >
//                                   <i className="fas fa-file-csv mr-2 text-green-500"></i>{" "}
//                                   Export as CSV
//                                 </button>
//                                 <button
//                                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                   onClick={() => {
//                                     document
//                                       .getElementById("share-modal")
//                                       .classList.remove("hidden");
//                                     document.getElementById(
//                                       "share-modal-title",
//                                     ).textContent = "Export as PDF";
//                                     document.getElementById(
//                                       "share-modal-icon",
//                                     ).className =
//                                       "fas fa-file-pdf text-red-500";
//                                     document
//                                       .getElementById("share-modal")
//                                       .nextElementSibling.classList.toggle(
//                                         "hidden",
//                                       );
//                                   }}
//                                 >
//                                   <i className="fas fa-file-pdf mr-2 text-red-500"></i>{" "}
//                                   Export as PDF
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="!rounded-button whitespace-nowrap cursor-pointer"
//                             onClick={(e) => {
//                               const button = e.currentTarget;
//                               const existingMenu = document.querySelector(
//                                 ".visibility-dropdown-menu:not(.hidden)",
//                               );
//                               if (existingMenu) {
//                                 existingMenu.classList.add("hidden");
//                               }
//                               // Create menu if it doesn't exist
//                               let menu = button.nextElementSibling;
//                               if (
//                                 !menu ||
//                                 !menu.classList.contains(
//                                   "visibility-dropdown-menu",
//                                 )
//                               ) {
//                                 menu = document.createElement("div");
//                                 menu.className =
//                                   "visibility-dropdown-menu absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-64 p-2";
//                                 menu.innerHTML = `
// <div class="text-sm font-medium text-gray-700 mb-2 pb-1 border-b">Toggle Visibility</div>
// <div class="space-y-2">
// <label class="flex items-center gap-2 text-sm cursor-pointer">
// <input type="checkbox" checked />
// <span class="flex items-center gap-1">
// <span class="w-3 h-3 rounded-full bg-blue-500"></span>
// Primary data
// </span>
// </label>
// <label class="flex items-center gap-2 text-sm cursor-pointer">
// <input type="checkbox" checked />
// <span class="flex items-center gap-1">
// <span class="w-3 h-3 rounded-full bg-green-500"></span>
// Secondary metrics
// </span>
// </label>
// <label class="flex items-center gap-2 text-sm cursor-pointer">
// <input type="checkbox" checked />
// <span class="flex items-center gap-1">
// <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
// Warnings
// </span>
// </label>
// <label class="flex items-center gap-2 text-sm cursor-pointer">
// <input type="checkbox" checked />
// <span class="flex items-center gap-1">
// <span class="w-3 h-3 rounded-full bg-red-500"></span>
// Errors
// </span>
// </label>
// </div>
// `;
//                                 button.parentNode.insertBefore(
//                                   menu,
//                                   button.nextSibling,
//                                 );
//                                 // Add event listeners to checkboxes
//                                 const checkboxes = menu.querySelectorAll(
//                                   'input[type="checkbox"]',
//                                 );
//                                 checkboxes.forEach((checkbox, index) => {
//                                   checkbox.addEventListener("change", (e) => {
//                                     // In a real implementation, this would toggle visibility of specific elements
//                                     console.log(
//                                       `Toggled visibility of item ${index + 1}: ${e.target.checked}`,
//                                     );
//                                   });
//                                 });
//                               }
//                               // Toggle menu visibility
//                               menu.classList.toggle("hidden");
//                               e.stopPropagation();
//                             }}
//                           >
//                             <i className="fas fa-eye"></i>
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                     {/* Broken JS/CSS Issues Modal */}
//                     <div
//                       id="broken-js-css-modal"
//                       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden"
//                     >
//                       <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
//                         <div className="p-6 border-b border-gray-200 flex items-center justify-between">
//                           <div className="flex items-center">
//                             <i className="fas fa-exclamation-triangle text-red-500 mr-3 text-xl"></i>
//                             <h3 className="text-xl font-semibold">
//                               Broken Internal JavaScript and CSS Files (459
//                               issues)
//                             </h3>
//                           </div>
//                           <button
//                             className="text-gray-400 hover:text-gray-500"
//                             onClick={() => {
//                               document
//                                 .getElementById("broken-js-css-modal")
//                                 .classList.add("hidden");
//                             }}
//                           >
//                             <i className="fas fa-times"></i>
//                           </button>
//                         </div>
//                         <div className="p-6 border-b border-gray-200 bg-gray-50">
//                           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                             <div className="flex flex-wrap gap-2 items-center">
//                               <div className="relative">
//                                 <Input
//                                   type="text"
//                                   placeholder="Search issues..."
//                                   className="pl-10 pr-4 h-10 w-full md:w-64 border-gray-200"
//                                 />
//                                 <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
//                               </div>
//                               <Select defaultValue="all">
//                                 <SelectTrigger className="w-[180px] h-10 !rounded-button">
//                                   <SelectValue placeholder="File type" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   <SelectItem value="all">
//                                     All file types
//                                   </SelectItem>
//                                   <SelectItem value="js">
//                                     JavaScript (.js)
//                                   </SelectItem>
//                                   <SelectItem value="css">
//                                     CSS (.css)
//                                   </SelectItem>
//                                   <SelectItem value="map">
//                                     Source maps (.map)
//                                   </SelectItem>
//                                 </SelectContent>
//                               </Select>
//                               <Select defaultValue="all">
//                                 <SelectTrigger className="w-[180px] h-10 !rounded-button">
//                                   <SelectValue placeholder="Error type" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   <SelectItem value="all">
//                                     All error types
//                                   </SelectItem>
//                                   <SelectItem value="404">
//                                     404 Not Found
//                                   </SelectItem>
//                                   <SelectItem value="500">
//                                     500 Server Error
//                                   </SelectItem>
//                                   <SelectItem value="timeout">
//                                     Request Timeout
//                                   </SelectItem>
//                                   <SelectItem value="cors">
//                                     CORS Error
//                                   </SelectItem>
//                                 </SelectContent>
//                               </Select>
//                             </div>
//                             <div className="flex gap-2">
//                               <Button
//                                 variant="outline"
//                                 className="!rounded-button whitespace-nowrap cursor-pointer"
//                               >
//                                 <i className="fas fa-filter mr-2"></i> More
//                                 Filters
//                               </Button>
//                               <Button
//                                 variant="outline"
//                                 className="!rounded-button whitespace-nowrap cursor-pointer"
//                               >
//                                 <i className="fas fa-download mr-2"></i> Export
//                               </Button>
//                               <Button
//                                 variant="default"
//                                 className="!rounded-button whitespace-nowrap cursor-pointer"
//                               >
//                                 <i className="fas fa-tasks mr-2"></i> Create
//                                 Tasks
//                               </Button>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex-1 overflow-auto p-0">
//                           <div className="border-b">
//                             <div className="flex items-center justify-between p-4 bg-blue-50">
//                               <div className="flex items-center">
//                                 <i className="fas fa-info-circle text-blue-500 mr-2"></i>
//                                 <span className="text-sm text-blue-700">
//                                   These issues can significantly impact your
//                                   site's performance and user experience. Fix
//                                   them to improve page load times and SEO.
//                                 </span>
//                               </div>
//                               <Button
//                                 variant="link"
//                                 className="text-blue-600 !rounded-button whitespace-nowrap cursor-pointer"
//                               >
//                                 Learn more{" "}
//                                 <i className="fas fa-external-link-alt ml-1"></i>
//                               </Button>
//                             </div>
//                           </div>
//                           <div className="overflow-x-auto">
//                             <Table>
//                               <TableHeader>
//                                 <TableRow>
//                                   <TableHead className="w-12">
//                                     <input
//                                       type="checkbox"
//                                       className="rounded border-gray-300"
//                                     />
//                                   </TableHead>
//                                   <TableHead>File Path</TableHead>
//                                   <TableHead>Error</TableHead>
//                                   <TableHead>Affected Pages</TableHead>
//                                   <TableHead>First Detected</TableHead>
//                                   <TableHead>Impact</TableHead>
//                                   <TableHead className="w-20">
//                                     Actions
//                                   </TableHead>
//                                 </TableRow>
//                               </TableHeader>
//                               <TableBody>
//                                 {[
//                                   {
//                                     id: 1,
//                                     path: "/assets/js/main.min.js",
//                                     error: "404 Not Found",
//                                     pages: 124,
//                                     detected: "2025-04-03",
//                                     impact: "High",
//                                   },
//                                   {
//                                     id: 2,
//                                     path: "/assets/css/style.min.css",
//                                     error: "404 Not Found",
//                                     pages: 159,
//                                     detected: "2025-04-03",
//                                     impact: "Critical",
//                                   },
//                                   {
//                                     id: 3,
//                                     path: "/assets/js/vendor/jquery.min.js",
//                                     error: "404 Not Found",
//                                     pages: 87,
//                                     detected: "2025-04-04",
//                                     impact: "High",
//                                   },
//                                   {
//                                     id: 4,
//                                     path: "/assets/js/plugins/slider.js",
//                                     error: "404 Not Found",
//                                     pages: 12,
//                                     detected: "2025-04-04",
//                                     impact: "Medium",
//                                   },
//                                   {
//                                     id: 5,
//                                     path: "/assets/css/plugins/lightbox.css",
//                                     error: "404 Not Found",
//                                     pages: 28,
//                                     detected: "2025-04-05",
//                                     impact: "Medium",
//                                   },
//                                   {
//                                     id: 6,
//                                     path: "/assets/js/analytics.js",
//                                     error: "CORS Error",
//                                     pages: 159,
//                                     detected: "2025-04-05",
//                                     impact: "Low",
//                                   },
//                                   {
//                                     id: 7,
//                                     path: "/assets/js/main.min.js.map",
//                                     error: "404 Not Found",
//                                     pages: 124,
//                                     detected: "2025-04-05",
//                                     impact: "Low",
//                                   },
//                                 ].map((issue) => (
//                                   <TableRow key={issue.id}>
//                                     <TableCell>
//                                       <input
//                                         type="checkbox"
//                                         className="rounded border-gray-300"
//                                       />
//                                     </TableCell>
//                                     <TableCell className="font-medium">
//                                       <div className="flex items-center">
//                                         <i
//                                           className={`mr-2 ${issue.path.endsWith(".js") || issue.path.endsWith(".map") ? "fab fa-js text-yellow-500" : "fab fa-css3-alt text-blue-500"}`}
//                                         ></i>
//                                         {issue.path}
//                                       </div>
//                                     </TableCell>
//                                     <TableCell>
//                                       <Badge
//                                         className={`
// ${
//   issue.error === "404 Not Found"
//     ? "bg-red-100 text-red-600 hover:bg-red-100"
//     : issue.error === "CORS Error"
//       ? "bg-purple-100 text-purple-600 hover:bg-purple-100"
//       : "bg-orange-100 text-orange-600 hover:bg-orange-100"
// }
// `}
//                                       >
//                                         {issue.error}
//                                       </Badge>
//                                     </TableCell>
//                                     <TableCell>
//                                       <Button
//                                         variant="link"
//                                         className="p-0 h-auto text-blue-600 !rounded-button whitespace-nowrap cursor-pointer"
//                                       >
//                                         {issue.pages} pages
//                                       </Button>
//                                     </TableCell>
//                                     <TableCell>{issue.detected}</TableCell>
//                                     <TableCell>
//                                       <Badge
//                                         className={`
// ${
//   issue.impact === "Critical"
//     ? "bg-red-100 text-red-600 hover:bg-red-100"
//     : issue.impact === "High"
//       ? "bg-orange-100 text-orange-600 hover:bg-orange-100"
//       : issue.impact === "Medium"
//         ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-100"
//         : "bg-blue-100 text-blue-600 hover:bg-blue-100"
// }
// `}
//                                       >
//                                         {issue.impact}
//                                       </Badge>
//                                     </TableCell>
//                                     <TableCell>
//                                       <div className="flex items-center space-x-2">
//                                         <Button
//                                           variant="ghost"
//                                           size="sm"
//                                           className="h-8 w-8 p-0 !rounded-button cursor-pointer"
//                                         >
//                                           <i className="fas fa-eye text-gray-500"></i>
//                                         </Button>
//                                         <Button
//                                           variant="ghost"
//                                           size="sm"
//                                           className="h-8 w-8 p-0 !rounded-button cursor-pointer"
//                                         >
//                                           <i className="fas fa-edit text-blue-500"></i>
//                                         </Button>
//                                       </div>
//                                     </TableCell>
//                                   </TableRow>
//                                 ))}
//                               </TableBody>
//                             </Table>
//                           </div>
//                         </div>
//                         <div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
//                           <div className="text-sm text-gray-500">
//                             Showing 7 of 459 issues
//                           </div>
//                           <Pagination>
//                             <PaginationContent>
//                               <PaginationItem>
//                                 <PaginationPrevious className="cursor-pointer" />
//                               </PaginationItem>
//                               <PaginationItem>
//                                 <PaginationLink
//                                   isActive
//                                   className="cursor-pointer"
//                                 >
//                                   1
//                                 </PaginationLink>
//                               </PaginationItem>
//                               <PaginationItem>
//                                 <PaginationLink className="cursor-pointer">
//                                   2
//                                 </PaginationLink>
//                               </PaginationItem>
//                               <PaginationItem>
//                                 <PaginationLink className="cursor-pointer">
//                                   3
//                                 </PaginationLink>
//                               </PaginationItem>
//                               <PaginationItem>
//                                 <PaginationEllipsis />
//                               </PaginationItem>
//                               <PaginationItem>
//                                 <PaginationLink className="cursor-pointer">
//                                   66
//                                 </PaginationLink>
//                               </PaginationItem>
//                               <PaginationItem>
//                                 <PaginationNext className="cursor-pointer" />
//                               </PaginationItem>
//                             </PaginationContent>
//                           </Pagination>
//                           <div className="flex items-center gap-2">
//                             <span className="text-sm text-gray-500">Show</span>
//                             <Select defaultValue="7">
//                               <SelectTrigger className="w-[80px] h-9 !rounded-button">
//                                 <SelectValue placeholder="7" />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="7">7</SelectItem>
//                                 <SelectItem value="10">10</SelectItem>
//                                 <SelectItem value="25">25</SelectItem>
//                                 <SelectItem value="50">50</SelectItem>
//                               </SelectContent>
//                             </Select>
//                             <span className="text-sm text-gray-500">
//                               per page
//                             </span>
//                           </div>
//                         </div>
//                         <div className="p-6 border-t border-gray-200">
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div>
//                               <h4 className="text-lg font-medium mb-4">
//                                 Recommended Fixes
//                               </h4>
//                               <div className="space-y-3">
//                                 <div className="flex items-start">
//                                   <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-3">
//                                     <span className="text-blue-600 text-sm font-bold">
//                                       1
//                                     </span>
//                                   </div>
//                                   <p className="text-sm text-gray-700">
//                                     Check if the files exist in your project and
//                                     ensure they're in the correct location.
//                                   </p>
//                                 </div>
//                                 <div className="flex items-start">
//                                   <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-3">
//                                     <span className="text-blue-600 text-sm font-bold">
//                                       2
//                                     </span>
//                                   </div>
//                                   <p className="text-sm text-gray-700">
//                                     Update file references in your HTML to match
//                                     the actual file paths.
//                                   </p>
//                                 </div>
//                                 <div className="flex items-start">
//                                   <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-3">
//                                     <span className="text-blue-600 text-sm font-bold">
//                                       3
//                                     </span>
//                                   </div>
//                                   <p className="text-sm text-gray-700">
//                                     If using a build process, ensure all files
//                                     are being correctly compiled and deployed.
//                                   </p>
//                                 </div>
//                                 <div className="flex items-start">
//                                   <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-3">
//                                     <span className="text-blue-600 text-sm font-bold">
//                                       4
//                                     </span>
//                                   </div>
//                                   <p className="text-sm text-gray-700">
//                                     For CORS errors, configure your server to
//                                     allow cross-origin requests for these
//                                     resources.
//                                   </p>
//                                 </div>
//                               </div>
//                             </div>
//                             <div>
//                               <h4 className="text-lg font-medium mb-4">
//                                 Impact Analysis
//                               </h4>
//                               <div className="space-y-4">
//                                 <div>
//                                   <div className="flex justify-between items-center mb-1">
//                                     <span className="text-sm">
//                                       Page Load Time Impact
//                                     </span>
//                                     <span className="text-sm font-medium text-red-600">
//                                       +2.4s
//                                     </span>
//                                   </div>
//                                   <div className="w-full bg-gray-200 rounded-full h-2">
//                                     <div
//                                       className="bg-red-500 h-2 rounded-full"
//                                       style={{ width: "78%" }}
//                                     ></div>
//                                   </div>
//                                 </div>
//                                 <div>
//                                   <div className="flex justify-between items-center mb-1">
//                                     <span className="text-sm">
//                                       User Experience Impact
//                                     </span>
//                                     <span className="text-sm font-medium text-orange-600">
//                                       High
//                                     </span>
//                                   </div>
//                                   <div className="w-full bg-gray-200 rounded-full h-2">
//                                     <div
//                                       className="bg-orange-500 h-2 rounded-full"
//                                       style={{ width: "65%" }}
//                                     ></div>
//                                   </div>
//                                 </div>
//                                 <div>
//                                   <div className="flex justify-between items-center mb-1">
//                                     <span className="text-sm">SEO Impact</span>
//                                     <span className="text-sm font-medium text-yellow-600">
//                                       Medium
//                                     </span>
//                                   </div>
//                                   <div className="w-full bg-gray-200 rounded-full h-2">
//                                     <div
//                                       className="bg-yellow-500 h-2 rounded-full"
//                                       style={{ width: "45%" }}
//                                     ></div>
//                                   </div>
//                                 </div>
//                                 <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-4">
//                                   <p className="text-sm text-blue-700">
//                                     <i className="fas fa-info-circle mr-2"></i>
//                                     Fixing these issues could improve your
//                                     overall site performance score by
//                                     approximately 18%.
//                                   </p>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="p-4 hover:bg-gray-50">
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <div className="flex items-center mb-2">
//                             <a
//                               href="#"
//                               className="text-blue-600 font-medium hover:underline"
//                             >
//                               153 structured data items
//                             </a>
//                             <span className="text-gray-600 ml-2">
//                               are invalid
//                             </span>
//                             <a
//                               href="#"
//                               className="text-blue-500 text-sm ml-2 hover:underline"
//                             >
//                               Why and how to fix it
//                             </a>
//                           </div>
//                           <div className="flex items-center text-sm text-gray-500">
//                             <Badge className="mr-2 bg-blue-100 text-blue-600 hover:bg-blue-100">
//                               59 new issues
//                             </Badge>
//                             <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
//                               <div
//                                 className="bg-blue-500 h-full"
//                                 style={{ width: "50%" }}
//                               ></div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <div className="relative">
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               className="!rounded-button whitespace-nowrap cursor-pointer"
//                               onClick={(e) => {
//                                 const menu = e.currentTarget.nextElementSibling;
//                                 menu.classList.toggle("hidden");
//                                 e.stopPropagation();
//                               }}
//                             >
//                               <i className="fas fa-share mr-1"></i> Send to...
//                             </Button>
//                             <div className="absolute z-50 right-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 hidden">
//                               <div className="py-1">
//                                 <button
//                                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                   onClick={() => {
//                                     document
//                                       .getElementById("share-modal")
//                                       .classList.remove("hidden");
//                                     document.getElementById(
//                                       "share-modal-title",
//                                     ).textContent = "Send via Email";
//                                     document.getElementById(
//                                       "share-modal-icon",
//                                     ).className =
//                                       "fas fa-envelope text-blue-500";
//                                     document
//                                       .getElementById("share-modal")
//                                       .nextElementSibling.classList.toggle(
//                                         "hidden",
//                                       );
//                                   }}
//                                 >
//                                   <i className="fas fa-envelope mr-2 text-blue-500"></i>{" "}
//                                   Email
//                                 </button>
//                                 <button
//                                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                   onClick={() => {
//                                     document
//                                       .getElementById("share-modal")
//                                       .classList.remove("hidden");
//                                     document.getElementById(
//                                       "share-modal-title",
//                                     ).textContent = "Send to Slack";
//                                     document.getElementById(
//                                       "share-modal-icon",
//                                     ).className =
//                                       "fab fa-slack text-purple-500";
//                                     document
//                                       .getElementById("share-modal")
//                                       .nextElementSibling.classList.toggle(
//                                         "hidden",
//                                       );
//                                   }}
//                                 >
//                                   <i className="fab fa-slack mr-2 text-purple-500"></i>{" "}
//                                   Slack
//                                 </button>
//                                 <button
//                                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                   onClick={() => {
//                                     document
//                                       .getElementById("share-modal")
//                                       .classList.remove("hidden");
//                                     document.getElementById(
//                                       "share-modal-title",
//                                     ).textContent = "Send to Jira";
//                                     document.getElementById(
//                                       "share-modal-icon",
//                                     ).className = "fab fa-jira text-blue-600";
//                                     document
//                                       .getElementById("share-modal")
//                                       .nextElementSibling.classList.toggle(
//                                         "hidden",
//                                       );
//                                   }}
//                                 >
//                                   <i className="fab fa-jira mr-2 text-blue-600"></i>{" "}
//                                   Jira
//                                 </button>
//                                 <button
//                                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                   onClick={() => {
//                                     document
//                                       .getElementById("share-modal")
//                                       .classList.remove("hidden");
//                                     document.getElementById(
//                                       "share-modal-title",
//                                     ).textContent = "Send to Trello";
//                                     document.getElementById(
//                                       "share-modal-icon",
//                                     ).className = "fab fa-trello text-blue-400";
//                                     document
//                                       .getElementById("share-modal")
//                                       .nextElementSibling.classList.toggle(
//                                         "hidden",
//                                       );
//                                   }}
//                                 >
//                                   <i className="fab fa-trello mr-2 text-blue-400"></i>{" "}
//                                   Trello
//                                 </button>
//                                 <div className="border-t border-gray-100 my-1"></div>
//                                 <button
//                                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                   onClick={() => {
//                                     document
//                                       .getElementById("share-modal")
//                                       .classList.remove("hidden");
//                                     document.getElementById(
//                                       "share-modal-title",
//                                     ).textContent = "Export as CSV";
//                                     document.getElementById(
//                                       "share-modal-icon",
//                                     ).className =
//                                       "fas fa-file-csv text-green-500";
//                                     document
//                                       .getElementById("share-modal")
//                                       .nextElementSibling.classList.toggle(
//                                         "hidden",
//                                       );
//                                   }}
//                                 >
//                                   <i className="fas fa-file-csv mr-2 text-green-500"></i>{" "}
//                                   Export as CSV
//                                 </button>
//                                 <button
//                                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                   onClick={() => {
//                                     document
//                                       .getElementById("share-modal")
//                                       .classList.remove("hidden");
//                                     document.getElementById(
//                                       "share-modal-title",
//                                     ).textContent = "Export as PDF";
//                                     document.getElementById(
//                                       "share-modal-icon",
//                                     ).className =
//                                       "fas fa-file-pdf text-red-500";
//                                     document
//                                       .getElementById("share-modal")
//                                       .nextElementSibling.classList.toggle(
//                                         "hidden",
//                                       );
//                                   }}
//                                 >
//                                   <i className="fas fa-file-pdf mr-2 text-red-500"></i>{" "}
//                                   Export as PDF
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="!rounded-button whitespace-nowrap cursor-pointer"
//                             onClick={(e) => {
//                               const button = e.currentTarget;
//                               const existingMenu = document.querySelector(
//                                 ".visibility-dropdown-menu:not(.hidden)",
//                               );
//                               if (existingMenu) {
//                                 existingMenu.classList.add("hidden");
//                               }
//                               // Create menu if it doesn't exist
//                               let menu = button.nextElementSibling;
//                               if (
//                                 !menu ||
//                                 !menu.classList.contains(
//                                   "visibility-dropdown-menu",
//                                 )
//                               ) {
//                                 menu = document.createElement("div");
//                                 menu.className =
//                                   "visibility-dropdown-menu absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-64 p-2";
//                                 menu.innerHTML = `
// <div class="text-sm font-medium text-gray-700 mb-2 pb-1 border-b">Toggle Visibility</div>
// <div class="space-y-2">
// <label class="flex items-center gap-2 text-sm cursor-pointer">
// <input type="checkbox" checked />
// <span class="flex items-center gap-1">
// <span class="w-3 h-3 rounded-full bg-blue-500"></span>
// Primary data
// </span>
// </label>
// <label class="flex items-center gap-2 text-sm cursor-pointer">
// <input type="checkbox" checked />
// <span class="flex items-center gap-1">
// <span class="w-3 h-3 rounded-full bg-green-500"></span>
// Secondary metrics
// </span>
// </label>
// <label class="flex items-center gap-2 text-sm cursor-pointer">
// <input type="checkbox" checked />
// <span class="flex items-center gap-1">
// <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
// Warnings
// </span>
// </label>
// <label class="flex items-center gap-2 text-sm cursor-pointer">
// <input type="checkbox" checked />
// <span class="flex items-center gap-1">
// <span class="w-3 h-3 rounded-full bg-red-500"></span>
// Errors
// </span>
// </label>
// </div>
// `;
//                                 button.parentNode.insertBefore(
//                                   menu,
//                                   button.nextSibling,
//                                 );
//                                 // Add event listeners to checkboxes
//                                 const checkboxes = menu.querySelectorAll(
//                                   'input[type="checkbox"]',
//                                 );
//                                 checkboxes.forEach((checkbox, index) => {
//                                   checkbox.addEventListener("change", (e) => {
//                                     // In a real implementation, this would toggle visibility of specific elements
//                                     console.log(
//                                       `Toggled visibility of item ${index + 1}: ${e.target.checked}`,
//                                     );
//                                   });
//                                 });
//                               }
//                               // Toggle menu visibility
//                               menu.classList.toggle("hidden");
//                               e.stopPropagation();
//                             }}
//                           >
//                             <i className="fas fa-eye"></i>
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="p-4 hover:bg-gray-50">
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <div className="flex items-center mb-2">
//                             <a
//                               href="#"
//                               className="text-blue-600 font-medium hover:underline"
//                             >
//                               130 issues
//                             </a>
//                             <span className="text-gray-600 ml-2">
//                               with mixed content
//                             </span>
//                             <a
//                               href="#"
//                               className="text-blue-500 text-sm ml-2 hover:underline"
//                             >
//                               Why and how to fix it
//                             </a>
//                           </div>
//                           <div className="flex items-center text-sm text-gray-500">
//                             <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
//                               <div
//                                 className="bg-blue-500 h-full"
//                                 style={{ width: "40%" }}
//                               ></div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <div className="relative">
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               className="!rounded-button whitespace-nowrap cursor-pointer"
//                               onClick={(e) => {
//                                 const menu = e.currentTarget.nextElementSibling;
//                                 menu.classList.toggle("hidden");
//                                 e.stopPropagation();
//                               }}
//                             >
//                               <i className="fas fa-share mr-1"></i> Send to...
//                             </Button>
//                             <div className="absolute z-50 right-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 hidden">
//                               <div className="py-1">
//                                 <button
//                                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                   onClick={() => {
//                                     document
//                                       .getElementById("share-modal")
//                                       .classList.remove("hidden");
//                                     document.getElementById(
//                                       "share-modal-title",
//                                     ).textContent = "Send via Email";
//                                     document.getElementById(
//                                       "share-modal-icon",
//                                     ).className =
//                                       "fas fa-envelope text-blue-500";
//                                     document
//                                       .getElementById("share-modal")
//                                       .nextElementSibling.classList.toggle(
//                                         "hidden",
//                                       );
//                                   }}
//                                 >
//                                   <i className="fas fa-envelope mr-2 text-blue-500"></i>{" "}
//                                   Email
//                                 </button>
//                                 <button
//                                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                   onClick={() => {
//                                     document
//                                       .getElementById("share-modal")
//                                       .classList.remove("hidden");
//                                     document.getElementById(
//                                       "share-modal-title",
//                                     ).textContent = "Send to Slack";
//                                     document.getElementById(
//                                       "share-modal-icon",
//                                     ).className =
//                                       "fab fa-slack text-purple-500";
//                                     document
//                                       .getElementById("share-modal")
//                                       .nextElementSibling.classList.toggle(
//                                         "hidden",
//                                       );
//                                   }}
//                                 >
//                                   <i className="fab fa-slack mr-2 text-purple-500"></i>{" "}
//                                   Slack
//                                 </button>
//                                 <button
//                                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                   onClick={() => {
//                                     document
//                                       .getElementById("share-modal")
//                                       .classList.remove("hidden");
//                                     document.getElementById(
//                                       "share-modal-title",
//                                     ).textContent = "Send to Jira";
//                                     document.getElementById(
//                                       "share-modal-icon",
//                                     ).className = "fab fa-jira text-blue-600";
//                                     document
//                                       .getElementById("share-modal")
//                                       .nextElementSibling.classList.toggle(
//                                         "hidden",
//                                       );
//                                   }}
//                                 >
//                                   <i className="fab fa-jira mr-2 text-blue-600"></i>{" "}
//                                   Jira
//                                 </button>
//                                 <button
//                                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                   onClick={() => {
//                                     document
//                                       .getElementById("share-modal")
//                                       .classList.remove("hidden");
//                                     document.getElementById(
//                                       "share-modal-title",
//                                     ).textContent = "Send to Trello";
//                                     document.getElementById(
//                                       "share-modal-icon",
//                                     ).className = "fab fa-trello text-blue-400";
//                                     document
//                                       .getElementById("share-modal")
//                                       .nextElementSibling.classList.toggle(
//                                         "hidden",
//                                       );
//                                   }}
//                                 >
//                                   <i className="fab fa-trello mr-2 text-blue-400"></i>{" "}
//                                   Trello
//                                 </button>
//                                 <div className="border-t border-gray-100 my-1"></div>
//                                 <button
//                                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                   onClick={() => {
//                                     document
//                                       .getElementById("share-modal")
//                                       .classList.remove("hidden");
//                                     document.getElementById(
//                                       "share-modal-title",
//                                     ).textContent = "Export as CSV";
//                                     document.getElementById(
//                                       "share-modal-icon",
//                                     ).className =
//                                       "fas fa-file-csv text-green-500";
//                                     document
//                                       .getElementById("share-modal")
//                                       .nextElementSibling.classList.toggle(
//                                         "hidden",
//                                       );
//                                   }}
//                                 >
//                                   <i className="fas fa-file-csv mr-2 text-green-500"></i>{" "}
//                                   Export as CSV
//                                 </button>
//                                 <button
//                                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                   onClick={() => {
//                                     document
//                                       .getElementById("share-modal")
//                                       .classList.remove("hidden");
//                                     document.getElementById(
//                                       "share-modal-title",
//                                     ).textContent = "Export as PDF";
//                                     document.getElementById(
//                                       "share-modal-icon",
//                                     ).className =
//                                       "fas fa-file-pdf text-red-500";
//                                     document
//                                       .getElementById("share-modal")
//                                       .nextElementSibling.classList.toggle(
//                                         "hidden",
//                                       );
//                                   }}
//                                 >
//                                   <i className="fas fa-file-pdf mr-2 text-red-500"></i>{" "}
//                                   Export as PDF
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="!rounded-button whitespace-nowrap cursor-pointer"
//                             onClick={(e) => {
//                               const button = e.currentTarget;
//                               const existingMenu = document.querySelector(
//                                 ".visibility-dropdown-menu:not(.hidden)",
//                               );
//                               if (existingMenu) {
//                                 existingMenu.classList.add("hidden");
//                               }
//                               // Create menu if it doesn't exist
//                               let menu = button.nextElementSibling;
//                               if (
//                                 !menu ||
//                                 !menu.classList.contains(
//                                   "visibility-dropdown-menu",
//                                 )
//                               ) {
//                                 menu = document.createElement("div");
//                                 menu.className =
//                                   "visibility-dropdown-menu absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-64 p-2";
//                                 menu.innerHTML = `
// <div class="text-sm font-medium text-gray-700 mb-2 pb-1 border-b">Toggle Visibility</div>
// <div class="space-y-2">
// <label class="flex items-center gap-2 text-sm cursor-pointer">
// <input type="checkbox" checked />
// <span class="flex items-center gap-1">
// <span class="w-3 h-3 rounded-full bg-blue-500"></span>
// Primary data
// </span>
// </label>
// <label class="flex items-center gap-2 text-sm cursor-pointer">
// <input type="checkbox" checked />
// <span class="flex items-center gap-1">
// <span class="w-3 h-3 rounded-full bg-green-500"></span>
// Secondary metrics
// </span>
// </label>
// <label class="flex items-center gap-2 text-sm cursor-pointer">
// <input type="checkbox" checked />
// <span class="flex items-center gap-1">
// <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
// Warnings
// </span>
// </label>
// <label class="flex items-center gap-2 text-sm cursor-pointer">
// <input type="checkbox" checked />
// <span class="flex items-center gap-1">
// <span class="w-3 h-3 rounded-full bg-red-500"></span>
// Errors
// </span>
// </label>
// </div>
// `;
//                                 button.parentNode.insertBefore(
//                                   menu,
//                                   button.nextSibling,
//                                 );
//                                 // Add event listeners to checkboxes
//                                 const checkboxes = menu.querySelectorAll(
//                                   'input[type="checkbox"]',
//                                 );
//                                 checkboxes.forEach((checkbox, index) => {
//                                   checkbox.addEventListener("change", (e) => {
//                                     // In a real implementation, this would toggle visibility of specific elements
//                                     console.log(
//                                       `Toggled visibility of item ${index + 1}: ${e.target.checked}`,
//                                     );
//                                   });
//                                 });
//                               }
//                               // Toggle menu visibility
//                               menu.classList.toggle("hidden");
//                               e.stopPropagation();
//                             }}
//                           >
//                             <i className="fas fa-eye"></i>
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="p-4 hover:bg-gray-50">
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <div className="flex items-center mb-2">
//                             <a
//                               href="#"
//                               className="text-blue-600 font-medium hover:underline"
//                             >
//                               64 incorrect pages
//                             </a>
//                             <span className="text-gray-600 ml-2">
//                               found in sitemap.xml
//                             </span>
//                             <a
//                               href="#"
//                               className="text-blue-500 text-sm ml-2 hover:underline"
//                             >
//                               Why and how to fix it
//                             </a>
//                           </div>
//                           <div className="flex items-center text-sm text-gray-500">
//                             <Badge className="mr-2 bg-blue-100 text-blue-600 hover:bg-blue-100">
//                               54 new issues
//                             </Badge>
//                             <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
//                               <div
//                                 className="bg-blue-500 h-full"
//                                 style={{ width: "60%" }}
//                               ></div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <div className="relative">
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               className="!rounded-button whitespace-nowrap cursor-pointer"
//                               onClick={(e) => {
//                                 const menu = e.currentTarget.nextElementSibling;
//                                 menu.classList.toggle("hidden");
//                                 e.stopPropagation();
//                               }}
//                             >
//                               <i className="fas fa-share mr-1"></i> Send to...
//                             </Button>
//                             <div className="absolute z-50 right-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 hidden">
//                               <div className="py-1">
//                                 <button
//                                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                   onClick={() => {
//                                     document
//                                       .getElementById("share-modal")
//                                       .classList.remove("hidden");
//                                     document.getElementById(
//                                       "share-modal-title",
//                                     ).textContent = "Send via Email";
//                                     document.getElementById(
//                                       "share-modal-icon",
//                                     ).className =
//                                       "fas fa-envelope text-blue-500";
//                                     document
//                                       .getElementById("share-modal")
//                                       .nextElementSibling.classList.toggle(
//                                         "hidden",
//                                       );
//                                   }}
//                                 >
//                                   <i className="fas fa-envelope mr-2 text-blue-500"></i>{" "}
//                                   Email
//                                 </button>
//                                 <button
//                                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                   onClick={() => {
//                                     document
//                                       .getElementById("share-modal")
//                                       .classList.remove("hidden");
//                                     document.getElementById(
//                                       "share-modal-title",
//                                     ).textContent = "Send to Slack";
//                                     document.getElementById(
//                                       "share-modal-icon",
//                                     ).className =
//                                       "fab fa-slack text-purple-500";
//                                     document
//                                       .getElementById("share-modal")
//                                       .nextElementSibling.classList.toggle(
//                                         "hidden",
//                                       );
//                                   }}
//                                 >
//                                   <i className="fab fa-slack mr-2 text-purple-500"></i>{" "}
//                                   Slack
//                                 </button>
//                                 <button
//                                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                   onClick={() => {
//                                     document
//                                       .getElementById("share-modal")
//                                       .classList.remove("hidden");
//                                     document.getElementById(
//                                       "share-modal-title",
//                                     ).textContent = "Send to Jira";
//                                     document.getElementById(
//                                       "share-modal-icon",
//                                     ).className = "fab fa-jira text-blue-600";
//                                     document
//                                       .getElementById("share-modal")
//                                       .nextElementSibling.classList.toggle(
//                                         "hidden",
//                                       );
//                                   }}
//                                 >
//                                   <i className="fab fa-jira mr-2 text-blue-600"></i>{" "}
//                                   Jira
//                                 </button>
//                                 <button
//                                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                   onClick={() => {
//                                     document
//                                       .getElementById("share-modal")
//                                       .classList.remove("hidden");
//                                     document.getElementById(
//                                       "share-modal-title",
//                                     ).textContent = "Send to Trello";
//                                     document.getElementById(
//                                       "share-modal-icon",
//                                     ).className = "fab fa-trello text-blue-400";
//                                     document
//                                       .getElementById("share-modal")
//                                       .nextElementSibling.classList.toggle(
//                                         "hidden",
//                                       );
//                                   }}
//                                 >
//                                   <i className="fab fa-trello mr-2 text-blue-400"></i>{" "}
//                                   Trello
//                                 </button>
//                                 <div className="border-t border-gray-100 my-1"></div>
//                                 <button
//                                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                   onClick={() => {
//                                     document
//                                       .getElementById("share-modal")
//                                       .classList.remove("hidden");
//                                     document.getElementById(
//                                       "share-modal-title",
//                                     ).textContent = "Export as CSV";
//                                     document.getElementById(
//                                       "share-modal-icon",
//                                     ).className =
//                                       "fas fa-file-csv text-green-500";
//                                     document
//                                       .getElementById("share-modal")
//                                       .nextElementSibling.classList.toggle(
//                                         "hidden",
//                                       );
//                                   }}
//                                 >
//                                   <i className="fas fa-file-csv mr-2 text-green-500"></i>{" "}
//                                   Export as CSV
//                                 </button>
//                                 <button
//                                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                   onClick={() => {
//                                     document
//                                       .getElementById("share-modal")
//                                       .classList.remove("hidden");
//                                     document.getElementById(
//                                       "share-modal-title",
//                                     ).textContent = "Export as PDF";
//                                     document.getElementById(
//                                       "share-modal-icon",
//                                     ).className =
//                                       "fas fa-file-pdf text-red-500";
//                                     document
//                                       .getElementById("share-modal")
//                                       .nextElementSibling.classList.toggle(
//                                         "hidden",
//                                       );
//                                   }}
//                                 >
//                                   <i className="fas fa-file-pdf mr-2 text-red-500"></i>{" "}
//                                   Export as PDF
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="!rounded-button whitespace-nowrap cursor-pointer"
//                             onClick={(e) => {
//                               const button = e.currentTarget;
//                               const existingMenu = document.querySelector(
//                                 ".visibility-dropdown-menu:not(.hidden)",
//                               );
//                               if (existingMenu) {
//                                 existingMenu.classList.add("hidden");
//                               }
//                               // Create menu if it doesn't exist
//                               let menu = button.nextElementSibling;
//                               if (
//                                 !menu ||
//                                 !menu.classList.contains(
//                                   "visibility-dropdown-menu",
//                                 )
//                               ) {
//                                 menu = document.createElement("div");
//                                 menu.className =
//                                   "visibility-dropdown-menu absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-64 p-2";
//                                 menu.innerHTML = `
// <div class="text-sm font-medium text-gray-700 mb-2 pb-1 border-b">Toggle Visibility</div>
// <div class="space-y-2">
// <label class="flex items-center gap-2 text-sm cursor-pointer">
// <input type="checkbox" checked />
// <span class="flex items-center gap-1">
// <span class="w-3 h-3 rounded-full bg-blue-500"></span>
// Primary data
// </span>
// </label>
// <label class="flex items-center gap-2 text-sm cursor-pointer">
// <input type="checkbox" checked />
// <span class="flex items-center gap-1">
// <span class="w-3 h-3 rounded-full bg-green-500"></span>
// Secondary metrics
// </span>
// </label>
// <label class="flex items-center gap-2 text-sm cursor-pointer">
// <input type="checkbox" checked />
// <span class="flex items-center gap-1">
// <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
// Warnings
// </span>
// </label>
// <label class="flex items-center gap-2 text-sm cursor-pointer">
// <input type="checkbox" checked />
// <span class="flex items-center gap-1">
// <span class="w-3 h-3 rounded-full bg-red-500"></span>
// Errors
// </span>
// </label>
// </div>
// `;
//                                 button.parentNode.insertBefore(
//                                   menu,
//                                   button.nextSibling,
//                                 );
//                                 // Add event listeners to checkboxes
//                                 const checkboxes = menu.querySelectorAll(
//                                   'input[type="checkbox"]',
//                                 );
//                                 checkboxes.forEach((checkbox, index) => {
//                                   checkbox.addEventListener("change", (e) => {
//                                     // In a real implementation, this would toggle visibility of specific elements
//                                     console.log(
//                                       `Toggled visibility of item ${index + 1}: ${e.target.checked}`,
//                                     );
//                                   });
//                                 });
//                               }
//                               // Toggle menu visibility
//                               menu.classList.toggle("hidden");
//                               e.stopPropagation();
//                             }}
//                           >
//                             <i className="fas fa-eye"></i>
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="p-4 hover:bg-gray-50">
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <div className="flex items-center mb-2">
//                             <a
//                               href="#"
//                               className="text-blue-600 font-medium hover:underline"
//                             >
//                               A full list of AMP-related issues
//                             </a>
//                             <span className="text-gray-600 ml-2">
//                               is only available with a Business subscription
//                               plan
//                             </span>
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <Button
//                             variant="default"
//                             size="sm"
//                             className="!rounded-button whitespace-nowrap cursor-pointer bg-green-600 hover:bg-green-700"
//                           >
//                             Upgrade to Pro
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="!rounded-button whitespace-nowrap cursor-pointer"
//                             onClick={(e) => {
//                               const button = e.currentTarget;
//                               const existingMenu = document.querySelector(
//                                 ".visibility-dropdown-menu:not(.hidden)",
//                               );
//                               if (existingMenu) {
//                                 existingMenu.classList.add("hidden");
//                               }
//                               // Create menu if it doesn't exist
//                               let menu = button.nextElementSibling;
//                               if (
//                                 !menu ||
//                                 !menu.classList.contains(
//                                   "visibility-dropdown-menu",
//                                 )
//                               ) {
//                                 menu = document.createElement("div");
//                                 menu.className =
//                                   "visibility-dropdown-menu absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-64 p-2";
//                                 menu.innerHTML = `
// <div class="text-sm font-medium text-gray-700 mb-2 pb-1 border-b">Toggle Visibility</div>
// <div class="space-y-2">
// <label class="flex items-center gap-2 text-sm cursor-pointer">
// <input type="checkbox" checked />
// <span class="flex items-center gap-1">
// <span class="w-3 h-3 rounded-full bg-blue-500"></span>
// Primary data
// </span>
// </label>
// <label class="flex items-center gap-2 text-sm cursor-pointer">
// <input type="checkbox" checked />
// <span class="flex items-center gap-1">
// <span class="w-3 h-3 rounded-full bg-green-500"></span>
// Secondary metrics
// </span>
// </label>
// <label class="flex items-center gap-2 text-sm cursor-pointer">
// <input type="checkbox" checked />
// <span class="flex items-center gap-1">
// <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
// Warnings
// </span>
// </label>
// <label class="flex items-center gap-2 text-sm cursor-pointer">
// <input type="checkbox" checked />
// <span class="flex items-center gap-1">
// <span class="w-3 h-3 rounded-full bg-red-500"></span>
// Errors
// </span>
// </label>
// </div>
// `;
//                                 button.parentNode.insertBefore(
//                                   menu,
//                                   button.nextSibling,
//                                 );
//                                 // Add event listeners to checkboxes
//                                 const checkboxes = menu.querySelectorAll(
//                                   'input[type="checkbox"]',
//                                 );
//                                 checkboxes.forEach((checkbox, index) => {
//                                   checkbox.addEventListener("change", (e) => {
//                                     // In a real implementation, this would toggle visibility of specific elements
//                                     console.log(
//                                       `Toggled visibility of item ${index + 1}: ${e.target.checked}`,
//                                     );
//                                   });
//                                 });
//                               }
//                               // Toggle menu visibility
//                               menu.classList.toggle("hidden");
//                               e.stopPropagation();
//                             }}
//                           >
//                             <i className="fas fa-eye"></i>
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="p-4 hover:bg-gray-50">
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <div className="flex items-center mb-2">
//                             <a
//                               href="#"
//                               className="text-blue-600 font-medium hover:underline"
//                             >
//                               0 pages
//                             </a>
//                             <span className="text-gray-600 ml-2">
//                               returned 5XX status code
//                             </span>
//                             <a
//                               href="#"
//                               className="text-blue-500 text-sm ml-2 hover:underline"
//                             >
//                               Learn more
//                             </a>
//                           </div>
//                           <div className="flex items-center text-sm text-gray-500">
//                             <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
//                               <div
//                                 className="bg-blue-500 h-full"
//                                 style={{ width: "0%" }}
//                               ></div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="p-4 hover:bg-gray-50">
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <div className="flex items-center mb-2">
//                             <a
//                               href="#"
//                               className="text-blue-600 font-medium hover:underline"
//                             >
//                               0 pages
//                             </a>
//                             <span className="text-gray-600 ml-2">
//                               returned 4XX status code
//                             </span>
//                             <a
//                               href="#"
//                               className="text-blue-500 text-sm ml-2 hover:underline"
//                             >
//                               Learn more
//                             </a>
//                           </div>
//                           <div className="flex items-center text-sm text-gray-500">
//                             <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
//                               <div
//                                 className="bg-blue-500 h-full"
//                                 style={{ width: "0%" }}
//                               ></div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="p-4 hover:bg-gray-50">
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <div className="flex items-center mb-2">
//                             <a
//                               href="#"
//                               className="text-blue-600 font-medium hover:underline"
//                             >
//                               0 pages
//                             </a>
//                             <span className="text-gray-600 ml-2">
//                               don't have title tags
//                             </span>
//                             <a
//                               href="#"
//                               className="text-blue-500 text-sm ml-2 hover:underline"
//                             >
//                               Learn more
//                             </a>
//                           </div>
//                           <div className="flex items-center text-sm text-gray-500">
//                             <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
//                               <div
//                                 className="bg-blue-500 h-full"
//                                 style={{ width: "0%" }}
//                               ></div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">
//                   Issue Distribution by Category
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                   <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-sm font-medium text-gray-700">
//                         SEO Issues
//                       </h3>
//                       <i className="fas fa-search text-blue-500"></i>
//                     </div>
//                     <p className="text-2xl font-bold text-blue-600">8</p>
//                     <div className="flex items-center mt-2 text-xs text-red-600">
//                       <i className="fas fa-arrow-up mr-1"></i>
//                       <span>3 new since last crawl</span>
//                     </div>
//                   </div>
//                   <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-sm font-medium text-gray-700">
//                         Performance Issues
//                       </h3>
//                       <i className="fas fa-tachometer-alt text-blue-500"></i>
//                     </div>
//                     <p className="text-2xl font-bold text-blue-600">6</p>
//                     <div className="flex items-center mt-2 text-xs text-green-600">
//                       <i className="fas fa-arrow-down mr-1"></i>
//                       <span>2 fewer since last crawl</span>
//                     </div>
//                   </div>
//                   <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-sm font-medium text-gray-700">
//                         Content Issues
//                       </h3>
//                       <i className="fas fa-file-alt text-blue-500"></i>
//                     </div>
//                     <p className="text-2xl font-bold text-blue-600">3</p>
//                     <div className="flex items-center mt-2 text-xs text-gray-600">
//                       <i className="fas fa-minus mr-1"></i>
//                       <span>No change since last crawl</span>
//                     </div>
//                   </div>
//                   <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-sm font-medium text-gray-700">
//                         Security Issues
//                       </h3>
//                       <i className="fas fa-shield-alt text-blue-500"></i>
//                     </div>
//                     <p className="text-2xl font-bold text-blue-600">2</p>
//                     <div className="flex items-center mt-2 text-xs text-green-600">
//                       <i className="fas fa-arrow-down mr-1"></i>
//                       <span>1 fewer since last crawl</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-6">
//                   <Button
//                     variant="outline"
//                     className="!rounded-button whitespace-nowrap cursor-pointer"
//                   >
//                     <i className="fas fa-download mr-2"></i> Export Issues
//                     Report
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">
//                   Issue Severity Distribution
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex flex-col md:flex-row gap-6">
//                   <div className="flex-1">
//                     <div className="h-64 w-full">
//                       <img
//                         src="https://public.readdy.ai/ai/img_res/553bf737e3aa3dd9ad46dd2cd5e71529.jpg"
//                         alt="Issue severity distribution chart"
//                         className="w-full h-full object-contain"
//                       />
//                     </div>
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-md font-medium mb-4 text-gray-700">
//                       Issue Breakdown
//                     </h3>
//                     <div className="space-y-4">
//                       <div>
//                         <div className="flex justify-between items-center mb-1">
//                           <div className="flex items-center">
//                             <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
//                             <span className="text-sm">Errors</span>
//                           </div>
//                           <span className="text-sm font-medium">4 (21%)</span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2">
//                           <div
//                             className="bg-red-500 h-2 rounded-full"
//                             style={{ width: "21%" }}
//                           ></div>
//                         </div>
//                       </div>
//                       <div>
//                         <div className="flex justify-between items-center mb-1">
//                           <div className="flex items-center">
//                             <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
//                             <span className="text-sm">Warnings</span>
//                           </div>
//                           <span className="text-sm font-medium">8 (42%)</span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2">
//                           <div
//                             className="bg-yellow-500 h-2 rounded-full"
//                             style={{ width: "42%" }}
//                           ></div>
//                         </div>
//                       </div>
//                       <div>
//                         <div className="flex justify-between items-center mb-1">
//                           <div className="flex items-center">
//                             <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
//                             <span className="text-sm">Notices</span>
//                           </div>
//                           <span className="text-sm font-medium">7 (37%)</span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2">
//                           <div
//                             className="bg-blue-500 h-2 rounded-full"
//                             style={{ width: "37%" }}
//                           ></div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="mt-6">
//                       <p className="text-sm text-gray-600">
//                         <i className="fas fa-info-circle mr-1"></i>
//                         Prioritize fixing errors first, followed by warnings, to
//                         improve your site's health score.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//           <TabsContent value="compare-crawls">
//             <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
//               <p className="text-gray-500">
//                 <i className="fas fa-arrow-left mr-2"></i>
//                 Please click on "Crawled Pages" or "Statistics" tab to view data
//               </p>
//             </div>
//           </TabsContent>
//           <TabsContent value="progress" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">
//                   Historical Chart for Audits
//                 </CardTitle>
//                 <div className="flex items-center gap-4 text-sm text-gray-500">
//                   <div className="flex items-center gap-2">
//                     <span>FROM:</span>
//                     <Select defaultValue="3 Apr 2025 (13:14)">
//                       <SelectTrigger className="w-[180px] h-9 !rounded-button">
//                         <SelectValue placeholder="3 Apr 2025 (13:14)" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="3 Apr 2025 (13:14)">
//                           3 Apr 2025 (13:14)
//                         </SelectItem>
//                         <SelectItem value="2 Apr 2025 (13:14)">
//                           2 Apr 2025 (13:14)
//                         </SelectItem>
//                         <SelectItem value="1 Apr 2025 (13:14)">
//                           1 Apr 2025 (13:14)
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span>TO:</span>
//                     <Select defaultValue="6 Apr 2025 (05:54)">
//                       <SelectTrigger className="w-[180px] h-9 !rounded-button">
//                         <SelectValue placeholder="6 Apr 2025 (05:54)" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="6 Apr 2025 (05:54)">
//                           6 Apr 2025 (05:54)
//                         </SelectItem>
//                         <SelectItem value="5 Apr 2025 (05:54)">
//                           5 Apr 2025 (05:54)
//                         </SelectItem>
//                         <SelectItem value="4 Apr 2025 (05:54)">
//                           4 Apr 2025 (05:54)
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span>Notes:</span>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="!rounded-button whitespace-nowrap cursor-pointer"
//                     >
//                       <i className="fas fa-plus mr-1"></i> Add
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="!rounded-button whitespace-nowrap cursor-pointer"
//                       onClick={() => {
//                         document
//                           .getElementById("audit-notes-modal")
//                           .showModal();
//                       }}
//                     >
//                       View all
//                     </Button>
//                     <dialog
//                       id="audit-notes-modal"
//                       className="w-full max-w-3xl p-0 rounded-lg shadow-lg backdrop:bg-black backdrop:bg-opacity-50"
//                     >
//                       <div className="flex flex-col h-full">
//                         <div className="flex items-center justify-between p-4 border-b">
//                           <h2 className="text-xl font-semibold">
//                             Audit Notes History
//                           </h2>
//                           <div className="flex items-center gap-2">
//                             <div className="relative">
//                               <Input
//                                 type="text"
//                                 placeholder="Search notes..."
//                                 className="pl-10 pr-4 h-9 w-64 border-gray-200"
//                               />
//                               <i className="fas fa-search absolute left-3 top-2.5 text-gray-400"></i>
//                             </div>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               className="!rounded-button whitespace-nowrap cursor-pointer"
//                               onClick={() => {
//                                 document
//                                   .getElementById("add-note-modal")
//                                   .showModal();
//                               }}
//                             >
//                               <i className="fas fa-plus mr-1"></i> Add Note
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="!rounded-button whitespace-nowrap cursor-pointer"
//                               onClick={() => {
//                                 document
//                                   .getElementById("audit-notes-modal")
//                                   .close();
//                               }}
//                             >
//                               <i className="fas fa-times"></i>
//                             </Button>
//                           </div>
//                         </div>
//                         <div className="p-4 overflow-y-auto max-h-[70vh]">
//                           <div className="space-y-4">
//                             {[
//                               {
//                                 id: 1,
//                                 date: "2025-04-06",
//                                 time: "09:15 AM",
//                                 author: "John Smith",
//                                 content:
//                                   "Noticed significant improvement in page load times after CDN implementation.",
//                               },
//                               {
//                                 id: 2,
//                                 date: "2025-04-05",
//                                 time: "14:30 PM",
//                                 author: "Emily Johnson",
//                                 content:
//                                   "Fixed 3 broken links on the services page. Need to monitor for any additional 404s.",
//                               },
//                               {
//                                 id: 3,
//                                 date: "2025-04-04",
//                                 time: "11:45 AM",
//                                 author: "Michael Brown",
//                                 content:
//                                   "Implemented schema markup on all product pages. Should improve rich snippets in search results.",
//                               },
//                               {
//                                 id: 4,
//                                 date: "2025-04-03",
//                                 time: "16:20 PM",
//                                 author: "Sarah Davis",
//                                 content:
//                                   "Started migration to new hosting provider. Expect temporary fluctuations in site performance.",
//                               },
//                               {
//                                 id: 5,
//                                 date: "2025-04-02",
//                                 time: "10:05 AM",
//                                 author: "John Smith",
//                                 content:
//                                   "Completed meta description updates for all blog posts. Improved keyword targeting.",
//                               },
//                             ].map((note) => (
//                               <div
//                                 key={note.id}
//                                 className="bg-gray-50 p-4 rounded-lg border border-gray-200"
//                               >
//                                 <div className="flex justify-between items-start mb-2">
//                                   <div>
//                                     <span className="font-medium text-gray-900">
//                                       {note.date}
//                                     </span>
//                                     <span className="text-gray-500 ml-2">
//                                       {note.time}
//                                     </span>
//                                     <span className="text-gray-500 ml-2">
//                                       by {note.author}
//                                     </span>
//                                   </div>
//                                   <div className="flex gap-2">
//                                     <Button
//                                       variant="ghost"
//                                       size="sm"
//                                       className="h-8 w-8 p-0 !rounded-button cursor-pointer"
//                                       onClick={() => {
//                                         // Set up edit functionality
//                                         document
//                                           .getElementById("edit-note-modal")
//                                           .showModal();
//                                         // In a real app, you would populate the edit form with the note data
//                                       }}
//                                     >
//                                       <i className="fas fa-edit text-blue-500"></i>
//                                     </Button>
//                                     <Button
//                                       variant="ghost"
//                                       size="sm"
//                                       className="h-8 w-8 p-0 !rounded-button cursor-pointer"
//                                       onClick={() => {
//                                         document
//                                           .getElementById("delete-note-confirm")
//                                           .showModal();
//                                       }}
//                                     >
//                                       <i className="fas fa-trash-alt text-red-500"></i>
//                                     </Button>
//                                   </div>
//                                 </div>
//                                 <p className="text-gray-700">{note.content}</p>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     </dialog>
//                     <dialog
//                       id="add-note-modal"
//                       className="w-full max-w-md p-6 rounded-lg shadow-lg backdrop:bg-black backdrop:bg-opacity-50"
//                     >
//                       <h3 className="text-lg font-semibold mb-4">
//                         Add New Note
//                       </h3>
//                       <div className="space-y-4">
//                         <div>
//                           <label
//                             htmlFor="note-content"
//                             className="block text-sm font-medium text-gray-700 mb-1"
//                           >
//                             Note Content
//                           </label>
//                           <textarea
//                             id="note-content"
//                             className="w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             placeholder="Enter your note here..."
//                           ></textarea>
//                         </div>
//                         <div className="flex justify-end gap-2">
//                           <Button
//                             variant="outline"
//                             className="!rounded-button whitespace-nowrap cursor-pointer"
//                             onClick={() => {
//                               document.getElementById("add-note-modal").close();
//                             }}
//                           >
//                             Cancel
//                           </Button>
//                           <Button
//                             variant="default"
//                             className="!rounded-button whitespace-nowrap cursor-pointer"
//                             onClick={() => {
//                               // Add note logic would go here
//                               document.getElementById("add-note-modal").close();
//                             }}
//                           >
//                             Save Note
//                           </Button>
//                         </div>
//                       </div>
//                     </dialog>
//                     <dialog
//                       id="edit-note-modal"
//                       className="w-full max-w-md p-6 rounded-lg shadow-lg backdrop:bg-black backdrop:bg-opacity-50"
//                     >
//                       <h3 className="text-lg font-semibold mb-4">Edit Note</h3>
//                       <div className="space-y-4">
//                         <div>
//                           <label
//                             htmlFor="edit-note-content"
//                             className="block text-sm font-medium text-gray-700 mb-1"
//                           >
//                             Note Content
//                           </label>
//                           <textarea
//                             id="edit-note-content"
//                             className="w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             defaultValue="Noticed significant improvement in page load times after CDN implementation."
//                           ></textarea>
//                         </div>
//                         <div className="flex justify-end gap-2">
//                           <Button
//                             variant="outline"
//                             className="!rounded-button whitespace-nowrap cursor-pointer"
//                             onClick={() => {
//                               document
//                                 .getElementById("edit-note-modal")
//                                 .close();
//                             }}
//                           >
//                             Cancel
//                           </Button>
//                           <Button
//                             variant="default"
//                             className="!rounded-button whitespace-nowrap cursor-pointer"
//                             onClick={() => {
//                               // Edit note logic would go here
//                               document
//                                 .getElementById("edit-note-modal")
//                                 .close();
//                             }}
//                           >
//                             Update Note
//                           </Button>
//                         </div>
//                       </div>
//                     </dialog>
//                     <dialog
//                       id="delete-note-confirm"
//                       className="w-full max-w-sm p-6 rounded-lg shadow-lg backdrop:bg-black backdrop:bg-opacity-50"
//                     >
//                       <h3 className="text-lg font-semibold mb-4">
//                         Confirm Deletion
//                       </h3>
//                       <p className="text-gray-700 mb-6">
//                         Are you sure you want to delete this note? This action
//                         cannot be undone.
//                       </p>
//                       <div className="flex justify-end gap-2">
//                         <Button
//                           variant="outline"
//                           className="!rounded-button whitespace-nowrap cursor-pointer"
//                           onClick={() => {
//                             document
//                               .getElementById("delete-note-confirm")
//                               .close();
//                           }}
//                         >
//                           Cancel
//                         </Button>
//                         <Button
//                           variant="destructive"
//                           className="!rounded-button whitespace-nowrap cursor-pointer"
//                           onClick={() => {
//                             // Delete note logic would go here
//                             document
//                               .getElementById("delete-note-confirm")
//                               .close();
//                           }}
//                         >
//                           Delete
//                         </Button>
//                       </div>
//                     </dialog>
//                   </div>
//                   <div className="relative">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="!rounded-button whitespace-nowrap cursor-pointer"
//                       onClick={() => {
//                         const menu = document.getElementById("visibility-menu");
//                         menu.classList.toggle("hidden");
//                       }}
//                     >
//                       <i className="fas fa-eye"></i>
//                     </Button>
//                     <div
//                       id="visibility-menu"
//                       className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-64 p-2 hidden"
//                     >
//                       <div className="text-sm font-medium text-gray-700 mb-2 pb-1 border-b">
//                         Toggle Data Series
//                       </div>
//                       <div className="space-y-2">
//                         <label className="flex items-center gap-2 text-sm cursor-pointer">
//                           <input
//                             type="checkbox"
//                             defaultChecked={true}
//                             onChange={(e) => {
//                               // Toggle visibility of total issues series
//                               const chart =
//                                 document.querySelector(".h-[400px] img");
//                               if (chart) {
//                                 chart.style.opacity = e.target.checked
//                                   ? "1"
//                                   : "0.3";
//                               }
//                             }}
//                           />
//                           <span className="flex items-center gap-1">
//                             <span className="w-3 h-3 rounded-full bg-pink-500"></span>
//                             Total issues
//                           </span>
//                         </label>
//                         <label className="flex items-center gap-2 text-sm cursor-pointer">
//                           <input
//                             type="checkbox"
//                             defaultChecked={false}
//                             onChange={(e) => {
//                               // In a real implementation, this would toggle another data series
//                               console.log(
//                                 "Site health visibility:",
//                                 e.target.checked,
//                               );
//                             }}
//                           />
//                           <span className="flex items-center gap-1">
//                             <span className="w-3 h-3 rounded-full bg-blue-500"></span>
//                             Site health
//                           </span>
//                         </label>
//                         <label className="flex items-center gap-2 text-sm cursor-pointer">
//                           <input
//                             type="checkbox"
//                             defaultChecked={false}
//                             onChange={(e) => {
//                               // In a real implementation, this would toggle another data series
//                               console.log(
//                                 "Pages crawled visibility:",
//                                 e.target.checked,
//                               );
//                             }}
//                           />
//                           <span className="flex items-center gap-1">
//                             <span className="w-3 h-3 rounded-full bg-green-500"></span>
//                             Pages crawled
//                           </span>
//                         </label>
//                         <label className="flex items-center gap-2 text-sm cursor-pointer">
//                           <input
//                             type="checkbox"
//                             defaultChecked={false}
//                             onChange={(e) => {
//                               // In a real implementation, this would toggle another data series
//                               console.log(
//                                 "Total errors visibility:",
//                                 e.target.checked,
//                               );
//                             }}
//                           />
//                           <span className="flex items-center gap-1">
//                             <span className="w-3 h-3 rounded-full bg-red-500"></span>
//                             Total errors
//                           </span>
//                         </label>
//                         <label className="flex items-center gap-2 text-sm cursor-pointer">
//                           <input
//                             type="checkbox"
//                             defaultChecked={false}
//                             onChange={(e) => {
//                               // In a real implementation, this would toggle another data series
//                               console.log(
//                                 "Total warnings visibility:",
//                                 e.target.checked,
//                               );
//                             }}
//                           />
//                           <span className="flex items-center gap-1">
//                             <span className="w-3 h-3 rounded-full bg-orange-500"></span>
//                             Total warnings
//                           </span>
//                         </label>
//                       </div>
//                     </div>
//                   </div>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="!rounded-button whitespace-nowrap cursor-pointer"
//                   >
//                     <i className="fas fa-cog"></i>
//                   </Button>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="border rounded-lg p-4 bg-white">
//                   <div className="h-[400px] w-full">
//                     <img
//                       src="https://public.readdy.ai/ai/img_res/8b0324ee123e5d39aa14f37da07c26fd.jpg"
//                       alt="Historical chart for audits"
//                       className="w-full h-full object-contain"
//                     />
//                   </div>
//                   <div className="flex items-center mt-4 text-sm text-gray-600">
//                     <i className="fas fa-info-circle mr-2"></i>
//                     <span>LEGEND:</span>
//                     <Badge className="ml-2 bg-pink-100 text-pink-600 hover:bg-pink-100 flex items-center gap-1">
//                       <span className="w-3 h-3 rounded-full bg-pink-500"></span>
//                       Total issues
//                       <i className="fas fa-times ml-1"></i>
//                     </Badge>
//                   </div>
//                 </div>
//                 <div className="mt-6 grid grid-cols-4 gap-4">
//                   <div>
//                     <h3 className="text-md font-medium mb-3 text-gray-700 pb-2 border-b">
//                       General:
//                     </h3>
//                     <div className="space-y-2">
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           id="pages-crawled"
//                           name="general"
//                           className="text-blue-600"
//                         />
//                         <label htmlFor="pages-crawled" className="text-sm">
//                           Pages crawled
//                         </label>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           id="site-health"
//                           name="general"
//                           className="text-blue-600"
//                         />
//                         <label htmlFor="site-health" className="text-sm">
//                           Site Health
//                         </label>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           id="total-issues"
//                           name="general"
//                           className="text-blue-600"
//                           checked
//                         />
//                         <label
//                           htmlFor="total-issues"
//                           className="text-sm text-pink-600 font-medium"
//                         >
//                           Total issues
//                         </label>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           id="total-errors"
//                           name="general"
//                           className="text-blue-600"
//                         />
//                         <label htmlFor="total-errors" className="text-sm">
//                           Total errors
//                         </label>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           id="total-warnings"
//                           name="general"
//                           className="text-blue-600"
//                         />
//                         <label htmlFor="total-warnings" className="text-sm">
//                           Total warnings
//                         </label>
//                       </div>
//                     </div>
//                   </div>
//                   <div>
//                     <h3 className="text-md font-medium mb-3 text-gray-700 pb-2 border-b border-red-200">
//                       Errors:
//                     </h3>
//                     <div className="space-y-2">
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           id="5xx-errors"
//                           name="errors"
//                           className="text-red-600"
//                         />
//                         <label htmlFor="5xx-errors" className="text-sm">
//                           5xx errors
//                         </label>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           id="4xx-errors"
//                           name="errors"
//                           className="text-red-600"
//                         />
//                         <label htmlFor="4xx-errors" className="text-sm">
//                           4xx errors
//                         </label>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           id="missing-title-tags"
//                           name="errors"
//                           className="text-red-600"
//                         />
//                         <label htmlFor="missing-title-tags" className="text-sm">
//                           Missing title tags
//                         </label>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           id="duplicate-title-tags"
//                           name="errors"
//                           className="text-red-600"
//                         />
//                         <label
//                           htmlFor="duplicate-title-tags"
//                           className="text-sm"
//                         >
//                           Duplicate title tags
//                         </label>
//                       </div>
//                     </div>
//                   </div>
//                   <div>
//                     <h3 className="text-md font-medium mb-3 text-gray-700 pb-2 border-b border-orange-200">
//                       Warnings:
//                     </h3>
//                     <div className="space-y-2">
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           id="broken-external-links"
//                           name="warnings"
//                           className="text-orange-600"
//                         />
//                         <label
//                           htmlFor="broken-external-links"
//                           className="text-sm"
//                         >
//                           Broken external links
//                         </label>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           id="broken-external-images"
//                           name="warnings"
//                           className="text-orange-600"
//                         />
//                         <label
//                           htmlFor="broken-external-images"
//                           className="text-sm"
//                         >
//                           Broken external images
//                         </label>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           id="links-lead-to-http"
//                           name="warnings"
//                           className="text-orange-600"
//                         />
//                         <label htmlFor="links-lead-to-http" className="text-sm">
//                           Links lead to HTTP pages for HTTPS site
//                         </label>
//                       </div>
//                     </div>
//                   </div>
//                   <div>
//                     <h3 className="text-md font-medium mb-3 text-gray-700 pb-2 border-b border-blue-200">
//                       Notices:
//                     </h3>
//                     <div className="space-y-2">
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           id="multiple-h1-tags"
//                           name="notices"
//                           className="text-blue-600"
//                         />
//                         <label htmlFor="multiple-h1-tags" className="text-sm">
//                           Multiple h1 tags
//                         </label>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           id="blocked-from-crawling"
//                           name="notices"
//                           className="text-blue-600"
//                         />
//                         <label
//                           htmlFor="blocked-from-crawling"
//                           className="text-sm"
//                         >
//                           Blocked from crawling
//                         </label>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           id="urls-longer-than-200"
//                           name="notices"
//                           className="text-blue-600"
//                         />
//                         <label
//                           htmlFor="urls-longer-than-200"
//                           className="text-sm"
//                         >
//                           URLs longer than 200 characters
//                         </label>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Crawl Progress</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-6">
//                   <div>
//                     <div className="flex justify-between mb-2">
//                       <span className="text-sm font-medium">
//                         Overall Progress
//                       </span>
//                       <span className="text-sm font-medium">32% (159/500)</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2.5">
//                       <div
//                         className="bg-blue-600 h-2.5 rounded-full"
//                         style={{ width: "32%" }}
//                       ></div>
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <div>
//                       <h3 className="text-md font-medium mb-3 text-gray-700">
//                         Crawl Status
//                       </h3>
//                       <div className="space-y-4">
//                         <div>
//                           <div className="flex justify-between mb-1">
//                             <span className="text-sm">Pages Crawled</span>
//                             <span className="text-sm font-medium">159</span>
//                           </div>
//                           <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div
//                               className="bg-green-500 h-2 rounded-full"
//                               style={{ width: "32%" }}
//                             ></div>
//                           </div>
//                         </div>
//                         <div>
//                           <div className="flex justify-between mb-1">
//                             <span className="text-sm">Pages in Queue</span>
//                             <span className="text-sm font-medium">341</span>
//                           </div>
//                           <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div
//                               className="bg-yellow-500 h-2 rounded-full"
//                               style={{ width: "68%" }}
//                             ></div>
//                           </div>
//                         </div>
//                         <div>
//                           <div className="flex justify-between mb-1">
//                             <span className="text-sm">Pages with Errors</span>
//                             <span className="text-sm font-medium">1</span>
//                           </div>
//                           <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div
//                               className="bg-red-500 h-2 rounded-full"
//                               style={{ width: "0.2%" }}
//                             ></div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div>
//                       <h3 className="text-md font-medium mb-3 text-gray-700">
//                         Crawl Speed
//                       </h3>
//                       <div className="space-y-4">
//                         <div>
//                           <div className="flex justify-between mb-1">
//                             <span className="text-sm">Pages per Minute</span>
//                             <span className="text-sm font-medium">12.4</span>
//                           </div>
//                           <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div
//                               className="bg-blue-500 h-2 rounded-full"
//                               style={{ width: "62%" }}
//                             ></div>
//                           </div>
//                         </div>
//                         <div>
//                           <div className="flex justify-between mb-1">
//                             <span className="text-sm">
//                               Average Response Time
//                             </span>
//                             <span className="text-sm font-medium">0.82s</span>
//                           </div>
//                           <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div
//                               className="bg-green-500 h-2 rounded-full"
//                               style={{ width: "82%" }}
//                             ></div>
//                           </div>
//                         </div>
//                         <div>
//                           <div className="flex justify-between mb-1">
//                             <span className="text-sm">Bandwidth Usage</span>
//                             <span className="text-sm font-medium">
//                               2.4 MB/s
//                             </span>
//                           </div>
//                           <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div
//                               className="bg-purple-500 h-2 rounded-full"
//                               style={{ width: "48%" }}
//                             ></div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div>
//                       <h3 className="text-md font-medium mb-3 text-gray-700">
//                         Estimated Completion
//                       </h3>
//                       <div className="space-y-4">
//                         <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
//                           <div className="flex items-center justify-between mb-2">
//                             <h3 className="text-sm font-medium text-blue-800">
//                               Estimated Time Remaining
//                             </h3>
//                             <i className="fas fa-clock text-blue-500"></i>
//                           </div>
//                           <p className="text-2xl font-bold text-blue-600">
//                             28 minutes
//                           </p>
//                           <p className="text-xs text-blue-700 mt-1">
//                             Based on current crawl rate
//                           </p>
//                         </div>
//                         <div className="bg-green-50 p-4 rounded-lg border border-green-100">
//                           <div className="flex items-center justify-between mb-2">
//                             <h3 className="text-sm font-medium text-green-800">
//                               Expected Completion
//                             </h3>
//                             <i className="fas fa-calendar-check text-green-500"></i>
//                           </div>
//                           <p className="text-lg font-bold text-green-600">
//                             Sun, Apr 6, 2025 at 10:34 AM
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="mt-6">
//                     <Button
//                       variant="outline"
//                       className="!rounded-button whitespace-nowrap cursor-pointer"
//                     >
//                       <i className="fas fa-pause mr-2"></i> Pause Crawl
//                     </Button>
//                     <Button
//                       variant="outline"
//                       className="ml-2 !rounded-button whitespace-nowrap cursor-pointer"
//                     >
//                       <i className="fas fa-stop mr-2"></i> Stop Crawl
//                     </Button>
//                     <Button
//                       variant="default"
//                       className="ml-2 !rounded-button whitespace-nowrap cursor-pointer"
//                     >
//                       <i className="fas fa-download mr-2"></i> Export Progress
//                       Report
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//           <TabsContent value="js-impact">
//             <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
//               <p className="text-gray-500">
//                 <i className="fas fa-arrow-left mr-2"></i>
//                 Please click on "Crawled Pages" or "Statistics" tab to view data
//               </p>
//             </div>
//           </TabsContent>
//           <TabsContent value="keywords" className="space-y-6">
//             <Card>
//               <CardHeader className="pb-2">
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                   <CardTitle className="text-xl">
//                     Keyword Overview
//                     <a
//                       href="#"
//                       className="ml-2 text-blue-500 text-sm hover:underline cursor-pointer"
//                     >
//                       <i className="fas fa-external-link-alt"></i>
//                     </a>
//                   </CardTitle>
//                   <div className="flex flex-col md:flex-row gap-4">
//                     <div className="relative">
//                       <Input
//                         type="text"
//                         placeholder="Search keywords..."
//                         className="pl-10 pr-4 h-10 w-full md:w-64 border-gray-200"
//                       />
//                       <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
//                     </div>
//                     <div className="flex gap-2">
//                       <Select defaultValue="all">
//                         <SelectTrigger className="w-[180px] h-10 !rounded-button">
//                           <SelectValue placeholder="All keywords" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="all">All keywords</SelectItem>
//                           <SelectItem value="top10">Top 10</SelectItem>
//                           <SelectItem value="top50">Top 50</SelectItem>
//                           <SelectItem value="top100">Top 100</SelectItem>
//                           <SelectItem value="not-ranking">
//                             Not ranking
//                           </SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <Button
//                         variant="outline"
//                         className="h-10 !rounded-button whitespace-nowrap cursor-pointer"
//                       >
//                         <i className="fas fa-filter mr-2"></i> More Filters
//                       </Button>
//                       <Button
//                         variant="default"
//                         className="h-10 !rounded-button whitespace-nowrap cursor-pointer"
//                       >
//                         <i className="fas fa-plus mr-2"></i> Add Keywords
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                   <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-sm font-medium text-gray-700">
//                         Total Keywords
//                       </h3>
//                       <i className="fas fa-tag text-blue-500"></i>
//                     </div>
//                     <p className="text-2xl font-bold text-blue-600">247</p>
//                     <div className="flex items-center mt-2 text-xs text-green-600">
//                       <i className="fas fa-arrow-up mr-1"></i>
//                       <span>12 new since last month</span>
//                     </div>
//                   </div>
//                   <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-sm font-medium text-gray-700">
//                         Top 10 Rankings
//                       </h3>
//                       <i className="fas fa-trophy text-yellow-500"></i>
//                     </div>
//                     <p className="text-2xl font-bold text-blue-600">28</p>
//                     <div className="flex items-center mt-2 text-xs text-green-600">
//                       <i className="fas fa-arrow-up mr-1"></i>
//                       <span>5 more than last month</span>
//                     </div>
//                   </div>
//                   <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-sm font-medium text-gray-700">
//                         Avg. Search Volume
//                       </h3>
//                       <i className="fas fa-search text-blue-500"></i>
//                     </div>
//                     <p className="text-2xl font-bold text-blue-600">3,240</p>
//                     <div className="flex items-center mt-2 text-xs text-gray-600">
//                       <i className="fas fa-minus mr-1"></i>
//                       <span>No change since last month</span>
//                     </div>
//                   </div>
//                   <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-sm font-medium text-gray-700">
//                         Est. Monthly Traffic
//                       </h3>
//                       <i className="fas fa-users text-blue-500"></i>
//                     </div>
//                     <p className="text-2xl font-bold text-blue-600">12,845</p>
//                     <div className="flex items-center mt-2 text-xs text-green-600">
//                       <i className="fas fa-arrow-up mr-1"></i>
//                       <span>8% increase since last month</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="border rounded-lg overflow-hidden mb-6">
//                   <div className="bg-gray-50 p-4 border-b">
//                     <h3 className="text-lg font-medium">
//                       Ranking Distribution
//                     </h3>
//                   </div>
//                   <div className="p-4">
//                     <div className="h-64 w-full">
//                       <img
//                         src="https://public.readdy.ai/ai/img_res/363fc7cecbd52509c3b78e128bbbb449.jpg"
//                         alt="Keyword ranking distribution chart"
//                         className="w-full h-full object-contain"
//                       />
//                     </div>
//                     <div className="grid grid-cols-5 gap-2 mt-4">
//                       <div className="text-center">
//                         <div className="text-sm font-medium">Positions 1-3</div>
//                         <div className="text-lg font-bold text-blue-600">
//                           28
//                         </div>
//                         <div className="text-xs text-gray-500">11.3%</div>
//                       </div>
//                       <div className="text-center">
//                         <div className="text-sm font-medium">
//                           Positions 4-10
//                         </div>
//                         <div className="text-lg font-bold text-blue-600">
//                           42
//                         </div>
//                         <div className="text-xs text-gray-500">17.0%</div>
//                       </div>
//                       <div className="text-center">
//                         <div className="text-sm font-medium">
//                           Positions 11-20
//                         </div>
//                         <div className="text-lg font-bold text-blue-600">
//                           67
//                         </div>
//                         <div className="text-xs text-gray-500">27.1%</div>
//                       </div>
//                       <div className="text-center">
//                         <div className="text-sm font-medium">
//                           Positions 21-50
//                         </div>
//                         <div className="text-lg font-bold text-blue-600">
//                           85
//                         </div>
//                         <div className="text-xs text-gray-500">34.4%</div>
//                       </div>
//                       <div className="text-center">
//                         <div className="text-sm font-medium">
//                           Positions 51-100
//                         </div>
//                         <div className="text-lg font-bold text-blue-600">
//                           25
//                         </div>
//                         <div className="text-xs text-gray-500">10.1%</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="border rounded-lg overflow-hidden">
//                   <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
//                     <h3 className="text-lg font-medium">Keyword Performance</h3>
//                     <div className="flex items-center gap-2">
//                       <Select defaultValue="7days">
//                         <SelectTrigger className="w-[150px] h-9 !rounded-button">
//                           <SelectValue placeholder="Time period" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="7days">Last 7 days</SelectItem>
//                           <SelectItem value="30days">Last 30 days</SelectItem>
//                           <SelectItem value="90days">Last 90 days</SelectItem>
//                           <SelectItem value="6months">Last 6 months</SelectItem>
//                           <SelectItem value="12months">
//                             Last 12 months
//                           </SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="!rounded-button whitespace-nowrap cursor-pointer"
//                       >
//                         <i className="fas fa-download"></i>
//                       </Button>
//                     </div>
//                   </div>
//                   <div className="overflow-x-auto">
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead className="w-1/3">Keyword</TableHead>
//                           <TableHead>Position</TableHead>
//                           <TableHead>Trend</TableHead>
//                           <TableHead>Search Volume</TableHead>
//                           <TableHead>Traffic</TableHead>
//                           <TableHead>Difficulty</TableHead>
//                           <TableHead>Last Updated</TableHead>
//                           <TableHead className="w-20">Actions</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {[
//                           {
//                             id: 1,
//                             keyword: "business consulting services",
//                             position: 3,
//                             trend: "+2",
//                             searchVolume: 5400,
//                             traffic: 1250,
//                             difficulty: "Medium",
//                             lastUpdated: "2025-04-05",
//                           },
//                           {
//                             id: 2,
//                             keyword: "strategic business planning",
//                             position: 5,
//                             trend: "+1",
//                             searchVolume: 3200,
//                             traffic: 780,
//                             difficulty: "High",
//                             lastUpdated: "2025-04-05",
//                           },
//                           {
//                             id: 3,
//                             keyword: "operations consulting",
//                             position: 7,
//                             trend: "-2",
//                             searchVolume: 2800,
//                             traffic: 620,
//                             difficulty: "Medium",
//                             lastUpdated: "2025-04-05",
//                           },
//                           {
//                             id: 4,
//                             keyword: "business growth strategies",
//                             position: 9,
//                             trend: "+4",
//                             searchVolume: 4100,
//                             traffic: 890,
//                             difficulty: "High",
//                             lastUpdated: "2025-04-04",
//                           },
//                           {
//                             id: 5,
//                             keyword: "market analysis consulting",
//                             position: 12,
//                             trend: "-1",
//                             searchVolume: 1900,
//                             traffic: 320,
//                             difficulty: "Medium",
//                             lastUpdated: "2025-04-04",
//                           },
//                           {
//                             id: 6,
//                             keyword: "business efficiency improvement",
//                             position: 15,
//                             trend: "+3",
//                             searchVolume: 1600,
//                             traffic: 240,
//                             difficulty: "Low",
//                             lastUpdated: "2025-04-04",
//                           },
//                           {
//                             id: 7,
//                             keyword: "corporate strategy consulting",
//                             position: 18,
//                             trend: "+5",
//                             searchVolume: 2200,
//                             traffic: 310,
//                             difficulty: "High",
//                             lastUpdated: "2025-04-03",
//                           },
//                           {
//                             id: 8,
//                             keyword: "business process optimization",
//                             position: 22,
//                             trend: "-3",
//                             searchVolume: 1800,
//                             traffic: 210,
//                             difficulty: "Medium",
//                             lastUpdated: "2025-04-03",
//                           },
//                           {
//                             id: 9,
//                             keyword: "management consulting firms",
//                             position: 28,
//                             trend: "+2",
//                             searchVolume: 6200,
//                             traffic: 580,
//                             difficulty: "Very High",
//                             lastUpdated: "2025-04-03",
//                           },
//                           {
//                             id: 10,
//                             keyword: "small business consulting",
//                             position: 34,
//                             trend: "-5",
//                             searchVolume: 3800,
//                             traffic: 290,
//                             difficulty: "Medium",
//                             lastUpdated: "2025-04-02",
//                           },
//                         ].map((keyword) => (
//                           <TableRow
//                             key={keyword.id}
//                             className="cursor-pointer hover:bg-gray-50"
//                           >
//                             <TableCell className="font-medium">
//                               {keyword.keyword}
//                             </TableCell>
//                             <TableCell>
//                               <span
//                                 className={
//                                   keyword.position <= 3
//                                     ? "text-green-600 font-medium"
//                                     : keyword.position <= 10
//                                       ? "text-blue-600 font-medium"
//                                       : keyword.position <= 20
//                                         ? "text-yellow-600 font-medium"
//                                         : "text-gray-600 font-medium"
//                                 }
//                               >
//                                 {keyword.position}
//                               </span>
//                             </TableCell>
//                             <TableCell>
//                               {keyword.trend.startsWith("+") ? (
//                                 <span className="text-green-600 flex items-center">
//                                   <i className="fas fa-arrow-up mr-1"></i>{" "}
//                                   {keyword.trend.substring(1)}
//                                 </span>
//                               ) : (
//                                 <span className="text-red-600 flex items-center">
//                                   <i className="fas fa-arrow-down mr-1"></i>{" "}
//                                   {keyword.trend.substring(1)}
//                                 </span>
//                               )}
//                             </TableCell>
//                             <TableCell>
//                               {keyword.searchVolume.toLocaleString()}
//                             </TableCell>
//                             <TableCell>
//                               {keyword.traffic.toLocaleString()}
//                             </TableCell>
//                             <TableCell>
//                               <Badge
//                                 className={
//                                   keyword.difficulty === "Low"
//                                     ? "bg-green-100 text-green-600 hover:bg-green-100"
//                                     : keyword.difficulty === "Medium"
//                                       ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-100"
//                                       : keyword.difficulty === "High"
//                                         ? "bg-orange-100 text-orange-600 hover:bg-orange-100"
//                                         : "bg-red-100 text-red-600 hover:bg-red-100"
//                                 }
//                               >
//                                 {keyword.difficulty}
//                               </Badge>
//                             </TableCell>
//                             <TableCell>{keyword.lastUpdated}</TableCell>
//                             <TableCell>
//                               <div className="flex items-center space-x-2">
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   className="h-8 w-8 p-0 !rounded-button cursor-pointer"
//                                 >
//                                   <i className="fas fa-chart-line text-blue-500"></i>
//                                 </Button>
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   className="h-8 w-8 p-0 !rounded-button cursor-pointer"
//                                 >
//                                   <i className="fas fa-edit text-gray-500"></i>
//                                 </Button>
//                               </div>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </div>
//                   <div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
//                     <div className="text-sm text-gray-500">
//                       Showing 10 of 247 keywords
//                     </div>
//                     <Pagination>
//                       <PaginationContent>
//                         <PaginationItem>
//                           <PaginationPrevious className="cursor-pointer" />
//                         </PaginationItem>
//                         <PaginationItem>
//                           <PaginationLink isActive className="cursor-pointer">
//                             1
//                           </PaginationLink>
//                         </PaginationItem>
//                         <PaginationItem>
//                           <PaginationLink className="cursor-pointer">
//                             2
//                           </PaginationLink>
//                         </PaginationItem>
//                         <PaginationItem>
//                           <PaginationLink className="cursor-pointer">
//                             3
//                           </PaginationLink>
//                         </PaginationItem>
//                         <PaginationItem>
//                           <PaginationEllipsis />
//                         </PaginationItem>
//                         <PaginationItem>
//                           <PaginationLink className="cursor-pointer">
//                             25
//                           </PaginationLink>
//                         </PaginationItem>
//                         <PaginationItem>
//                           <PaginationNext className="cursor-pointer" />
//                         </PaginationItem>
//                       </PaginationContent>
//                     </Pagination>
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm text-gray-500">Show</span>
//                       <Select defaultValue="10">
//                         <SelectTrigger className="w-[80px] h-9 !rounded-button">
//                           <SelectValue placeholder="10" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="10">10</SelectItem>
//                           <SelectItem value="25">25</SelectItem>
//                           <SelectItem value="50">50</SelectItem>
//                           <SelectItem value="100">100</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <span className="text-sm text-gray-500">per page</span>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Keyword Groups</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex items-center justify-between mb-3">
//                       <h3 className="text-md font-medium text-gray-800">
//                         Business Strategy
//                       </h3>
//                       <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">
//                         42 keywords
//                       </Badge>
//                     </div>
//                     <div className="space-y-2">
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm">Avg. Position</span>
//                         <span className="text-sm font-medium text-blue-600">
//                           14.2
//                         </span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm">Top 10 Keywords</span>
//                         <span className="text-sm font-medium text-green-600">
//                           8
//                         </span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm">Total Search Volume</span>
//                         <span className="text-sm font-medium">24,500</span>
//                       </div>
//                     </div>
//                     <Button
//                       variant="outline"
//                       className="w-full mt-4 !rounded-button whitespace-nowrap cursor-pointer"
//                     >
//                       View Keywords
//                     </Button>
//                   </div>
//                   <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex items-center justify-between mb-3">
//                       <h3 className="text-md font-medium text-gray-800">
//                         Operations
//                       </h3>
//                       <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">
//                         38 keywords
//                       </Badge>
//                     </div>
//                     <div className="space-y-2">
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm">Avg. Position</span>
//                         <span className="text-sm font-medium text-blue-600">
//                           18.7
//                         </span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm">Top 10 Keywords</span>
//                         <span className="text-sm font-medium text-green-600">
//                           6
//                         </span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm">Total Search Volume</span>
//                         <span className="text-sm font-medium">18,200</span>
//                       </div>
//                     </div>
//                     <Button
//                       variant="outline"
//                       className="w-full mt-4 !rounded-button whitespace-nowrap cursor-pointer"
//                     >
//                       View Keywords
//                     </Button>
//                   </div>
//                   <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex items-center justify-between mb-3">
//                       <h3 className="text-md font-medium text-gray-800">
//                         Market Analysis
//                       </h3>
//                       <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">
//                         35 keywords
//                       </Badge>
//                     </div>
//                     <div className="space-y-2">
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm">Avg. Position</span>
//                         <span className="text-sm font-medium text-blue-600">
//                           22.3
//                         </span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm">Top 10 Keywords</span>
//                         <span className="text-sm font-medium text-green-600">
//                           4
//                         </span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm">Total Search Volume</span>
//                         <span className="text-sm font-medium">15,800</span>
//                       </div>
//                     </div>
//                     <Button
//                       variant="outline"
//                       className="w-full mt-4 !rounded-button whitespace-nowrap cursor-pointer"
//                     >
//                       View Keywords
//                     </Button>
//                   </div>
//                 </div>
//                 <div className="mt-6">
//                   <Button
//                     variant="outline"
//                     className="!rounded-button whitespace-nowrap cursor-pointer"
//                   >
//                     <i className="fas fa-plus mr-2"></i> Create New Group
//                   </Button>
//                   <Button
//                     variant="outline"
//                     className="ml-2 !rounded-button whitespace-nowrap cursor-pointer"
//                   >
//                     <i className="fas fa-cog mr-2"></i> Manage Groups
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">
//                   Competitor Keyword Comparison
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="mb-6">
//                   <div className="flex flex-wrap gap-2 mb-4">
//                     <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100 flex items-center gap-1">
//                       jvhconsulting.com
//                       <i className="fas fa-check-circle ml-1"></i>
//                     </Badge>
//                     <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 flex items-center gap-1">
//                       competitor1.com
//                       <i className="fas fa-check-circle ml-1"></i>
//                     </Badge>
//                     <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 flex items-center gap-1">
//                       competitor2.com
//                       <i className="fas fa-check-circle ml-1"></i>
//                     </Badge>
//                     <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 flex items-center gap-1">
//                       competitor3.com
//                       <i className="fas fa-times-circle ml-1"></i>
//                     </Badge>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="!rounded-button whitespace-nowrap cursor-pointer"
//                     >
//                       <i className="fas fa-plus mr-1"></i> Add Competitor
//                     </Button>
//                   </div>

//                   <div className="h-80 w-full">
//                     <img
//                       src="https://public.readdy.ai/ai/img_res/40697421795f45007f2adf5f32e4aaed.jpg"
//                       alt="Competitor keyword comparison chart"
//                       className="w-full h-full object-contain"
//                     />
//                   </div>
//                 </div>

//                 <div className="border rounded-lg overflow-hidden">
//                   <div className="bg-gray-50 p-4 border-b">
//                     <h3 className="text-lg font-medium">
//                       Keyword Gap Analysis
//                     </h3>
//                   </div>
//                   <div className="overflow-x-auto">
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>Keyword</TableHead>
//                           <TableHead>jvhconsulting.com</TableHead>
//                           <TableHead>competitor1.com</TableHead>
//                           <TableHead>competitor2.com</TableHead>
//                           <TableHead>Search Volume</TableHead>
//                           <TableHead>Difficulty</TableHead>
//                           <TableHead className="w-20">Actions</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {[
//                           {
//                             id: 1,
//                             keyword: "business consulting services",
//                             position: 3,
//                             competitor1: 5,
//                             competitor2: 2,
//                             searchVolume: 5400,
//                             difficulty: "Medium",
//                           },
//                           {
//                             id: 2,
//                             keyword: "strategic business planning",
//                             position: 5,
//                             competitor1: 1,
//                             competitor2: 8,
//                             searchVolume: 3200,
//                             difficulty: "High",
//                           },
//                           {
//                             id: 3,
//                             keyword: "operations consulting",
//                             position: 7,
//                             competitor1: 12,
//                             competitor2: 4,
//                             searchVolume: 2800,
//                             difficulty: "Medium",
//                           },
//                           {
//                             id: 4,
//                             keyword: "business growth strategies",
//                             position: 9,
//                             competitor1: 6,
//                             competitor2: 11,
//                             searchVolume: 4100,
//                             difficulty: "High",
//                           },
//                           {
//                             id: 5,
//                             keyword: "market analysis consulting",
//                             position: 12,
//                             competitor1: 8,
//                             competitor2: 15,
//                             searchVolume: 1900,
//                             difficulty: "Medium",
//                           },
//                         ].map((keyword) => (
//                           <TableRow
//                             key={keyword.id}
//                             className="cursor-pointer hover:bg-gray-50"
//                           >
//                             <TableCell className="font-medium">
//                               {keyword.keyword}
//                             </TableCell>
//                             <TableCell>
//                               <span
//                                 className={
//                                   keyword.position <= 3
//                                     ? "text-green-600 font-medium"
//                                     : keyword.position <= 10
//                                       ? "text-blue-600 font-medium"
//                                       : "text-gray-600 font-medium"
//                                 }
//                               >
//                                 {keyword.position}
//                               </span>
//                             </TableCell>
//                             <TableCell>
//                               <span
//                                 className={
//                                   keyword.competitor1 <= 3
//                                     ? "text-green-600 font-medium"
//                                     : keyword.competitor1 <= 10
//                                       ? "text-blue-600 font-medium"
//                                       : "text-gray-600 font-medium"
//                                 }
//                               >
//                                 {keyword.competitor1}
//                               </span>
//                             </TableCell>
//                             <TableCell>
//                               <span
//                                 className={
//                                   keyword.competitor2 <= 3
//                                     ? "text-green-600 font-medium"
//                                     : keyword.competitor2 <= 10
//                                       ? "text-blue-600 font-medium"
//                                       : "text-gray-600 font-medium"
//                                 }
//                               >
//                                 {keyword.competitor2}
//                               </span>
//                             </TableCell>
//                             <TableCell>
//                               {keyword.searchVolume.toLocaleString()}
//                             </TableCell>
//                             <TableCell>
//                               <Badge
//                                 className={
//                                   keyword.difficulty === "Low"
//                                     ? "bg-green-100 text-green-600 hover:bg-green-100"
//                                     : keyword.difficulty === "Medium"
//                                       ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-100"
//                                       : "bg-red-100 text-red-600 hover:bg-red-100"
//                                 }
//                               >
//                                 {keyword.difficulty}
//                               </Badge>
//                             </TableCell>
//                             <TableCell>
//                               <div className="flex items-center space-x-2">
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   className="h-8 w-8 p-0 !rounded-button cursor-pointer"
//                                 >
//                                   <i className="fas fa-chart-line text-blue-500"></i>
//                                 </Button>
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   className="h-8 w-8 p-0 !rounded-button cursor-pointer"
//                                 >
//                                   <i className="fas fa-crosshairs text-green-500"></i>
//                                 </Button>
//                               </div>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </div>
//                   <div className="p-4 border-t">
//                     <Button
//                       variant="outline"
//                       className="!rounded-button whitespace-nowrap cursor-pointer"
//                     >
//                       <i className="fas fa-download mr-2"></i> Export Comparison
//                     </Button>
//                     <Button
//                       variant="default"
//                       className="ml-2 !rounded-button whitespace-nowrap cursor-pointer"
//                     >
//                       <i className="fas fa-search mr-2"></i> Find Keyword
//                       Opportunities
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//           <TabsContent value="on-page">
//             <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
//               <p className="text-gray-500">
//                 <i className="fas fa-arrow-left mr-2"></i>
//                 Please click on "Crawled Pages" or "Statistics" tab to view data
//               </p>
//             </div>
//           </TabsContent>
//           <TabsContent value="technical">
//             <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
//               <p className="text-gray-500">
//                 <i className="fas fa-arrow-left mr-2"></i>
//                 Please click on "Crawled Pages" or "Statistics" tab to view data
//               </p>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// };
// export default App;
