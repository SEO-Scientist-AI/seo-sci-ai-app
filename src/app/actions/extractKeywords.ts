"use server"

import { revalidatePath } from "next/cache"

interface KeywordResponse {
  keywords: string[]
}

export async function extractKeywords(markdown: string): Promise<string[]> {
  try {
    // Create base64 encoded credentials - using Buffer in Node.js environment 
    const credentials = Buffer.from(
      `${process.env.NEXT_PUBLIC_API_USER}:${process.env.NEXT_PUBLIC_API_PASSWORD}`
    ).toString('base64')
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/content/extract/keywords`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${credentials}`,
          "Accept": "application/json"
        },
        body: JSON.stringify({ markdown }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Keyword Extraction API Error:", errorText)
      throw new Error(`Failed to extract keywords: ${response.status} ${errorText}`)
    }

    const data = await response.json() as KeywordResponse
    console.log("Extracted keywords:", data.keywords)
    
    return data.keywords
  } catch (error) {
    console.error("Error extracting keywords:", error)
    return []
  }
} 