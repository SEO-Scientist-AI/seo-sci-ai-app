"use server"

interface KeywordUsageResponse {
  title_tag_contains_keyword: boolean
  meta_description_contains_keyword: boolean
  h1_contains_keyword: boolean
  first_100_words_contains_keyword: boolean
}

export async function evaluateKeywordUsage(markdown: string, keyword: string): Promise<KeywordUsageResponse> {
  if (!markdown || !keyword) {
    throw new Error("Markdown content and keyword are required")
  }

  try {
    // Create base64 encoded credentials for server environment
    const credentials = Buffer.from(
      `${process.env.NEXT_PUBLIC_API_USER}:${process.env.NEXT_PUBLIC_API_PASSWORD}`
    ).toString('base64')

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/content/evaluate/keyword-usage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify({
          markdown,
          keyword,
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Keyword usage evaluation failed:", errorText)
      throw new Error(`Failed to evaluate keyword usage: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    return data as KeywordUsageResponse
  } catch (error) {
    console.error("Error evaluating keyword usage:", error)
    throw error
  }
} 