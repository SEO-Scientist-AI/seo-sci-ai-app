"use server"

interface ReadabilityResponse {
  has_short_paragraphs: boolean
  uses_conversational_tone: boolean
  passive_voice_under_10_percent: boolean
  matches_user_intent: boolean
  uses_emotion_and_storytelling: boolean
}

export async function evaluateReadability(markdown: string, keyword: string): Promise<ReadabilityResponse> {
  if (!markdown || !keyword) {
    throw new Error("Markdown content and keyword are required")
  }

  try {
    // Create base64 encoded credentials for server environment
    const credentials = Buffer.from(
      `${process.env.NEXT_PUBLIC_API_USER}:${process.env.NEXT_PUBLIC_API_PASSWORD}`
    ).toString('base64')

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/content/evaluate/readability`,
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
      console.error("Readability evaluation failed:", errorText)
      throw new Error(`Failed to evaluate readability: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    return data as ReadabilityResponse
  } catch (error) {
    console.error("Error evaluating readability:", error)
    throw error
  }
}