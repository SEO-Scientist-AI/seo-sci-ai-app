"use client";

import { auth } from "@/server/auth";

export interface AuditIssueCount {
  audit_id: string;
  title: string;
  affected_pages_count: number;
}

// Helper function to extract domain from URL
function extractDomain(url: string): string {
  // Remove protocol (http:// or https://)
  let domain = url.replace(/^(https?:\/\/)?(www\.)?/i, "");

  // Remove path, query parameters, etc.
  domain = domain.split("/")[0];

  // Remove any port number if present
  domain = domain.split(":")[0];

  return domain;
}

// Mock data for development or when API is unavailable
const mockIssueData: AuditIssueCount[] = [
  {
    audit_id: "error_missing_title",
    title: "Missing Title Tags",
    affected_pages_count: 5,
  },
  {
    audit_id: "error_duplicate_content",
    title: "Duplicate Content",
    affected_pages_count: 3,
  },
  {
    audit_id: "warning_meta_description",
    title: "Missing Meta Descriptions",
    affected_pages_count: 8,
  },
  {
    audit_id: "warning_img_alt",
    title: "Images Missing Alt Text",
    affected_pages_count: 12,
  },
];

export async function getIssuesCount(
  website: string
): Promise<AuditIssueCount[]> {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    if (!website) {
      throw new Error("Website is required");
    }

    // Extract just the domain name
    const domain = extractDomain(website);
    console.log(`Extracted domain: ${domain} from website: ${website}`);

    // Hard-coded API URL as fallback if environment variable is not set
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    console.log(`Using API URL: ${apiUrl}`);

    // Build the full request URL
    const requestUrl = `${apiUrl}/performance/issues/count?domain=${encodeURIComponent(
      domain
    )}`;
    console.log(`Making API request to: ${requestUrl}`);

    try {
      const response = await fetch(requestUrl, {
        headers: {
          Authorization: "Basic c2VvLXNjaS1hZ2VudHM6czMwLXNjMS1hZzNudDU=",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const issueData: AuditIssueCount[] = await response.json();
      return issueData;
    } catch (fetchError) {
      console.error("Fetch error:", fetchError);
      return mockIssueData;
    }
  } catch (error) {
    console.error("Error in getIssuesCount:", error);
    return mockIssueData;
  }
}
