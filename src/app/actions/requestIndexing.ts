'use server';

import { auth } from "@/server/auth";

interface TokenInfo {
  scope: string;
  exp: string;
  email: string;
}

export async function requestIndexing(url: string) {
  try {
    const session = await auth();
    
    if (!session?.user || !session.accessToken) {
      throw new Error("You must be logged in to request indexing");
    }

    // First verify the scope includes indexing
    const tokenInfo = await fetch(
      'https://www.googleapis.com/oauth2/v3/tokeninfo',
      {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
        }
      }
    );

    const tokenData = await tokenInfo.json() as TokenInfo;
    
    if (!tokenData.scope?.includes('https://www.googleapis.com/auth/indexing')) {
      throw new Error(
        "Missing required permissions. Please reconnect your Google account with Indexing API permissions."
      );
    }

    const response = await fetch(
      'https://indexing.googleapis.com/v3/urlNotifications:publish',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          type: "URL_UPDATED"
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json() as { error?: { message: string } };
      throw new Error(
        errorData.error?.message || 
        `Failed to request indexing (${response.status})`
      );
    }

    return { 
      success: true,
      message: "Successfully requested indexing. It may take some time for Google to process your request."
    };

  } catch (error) {
    console.error('Error requesting indexing:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      helpText: "Make sure you have:\n1. Verified ownership of the site in Search Console\n2. Enabled the Indexing API in Google Cloud Console\n3. Proper OAuth2 scope (indexing)"
    };
  }
} 