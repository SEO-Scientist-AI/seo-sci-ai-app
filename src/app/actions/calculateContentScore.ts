"use server"

interface ContentScoreRequest {
  title_tag_contains_keyword: boolean
  meta_description_contains_keyword: boolean
  h1_contains_keyword: boolean
  first_100_words_contains_keyword: boolean
  title_within_55_60_chars: boolean
  meta_description_within_150_160_chars: boolean
  has_short_paragraphs: boolean
  uses_conversational_tone: boolean
  passive_voice_under_10_percent: boolean
  matches_user_intent: boolean
  uses_emotion_and_storytelling: boolean
}

interface ContentScoreResponse {
  score: number
  breakdown: {
    keyword_usage: number
    title_meta: number
    readability: number
  }
}

export async function calculateContentScore(
  keywordUsage: any,
  titleMeta: any,
  readability: any
): Promise<ContentScoreResponse> {
  try {
    // Calculate Keyword Usage Score (30 points total - 7.5 each)
    const keywordScore = [
      keywordUsage?.title_tag_contains_keyword,
      keywordUsage?.meta_description_contains_keyword,
      keywordUsage?.h1_contains_keyword,
      keywordUsage?.first_100_words_contains_keyword
    ].filter(Boolean).length * 7.5;

    // Calculate Title & Meta Score (20 points total - 10 each)
    const titleMetaScore = [
      titleMeta?.title_within_55_60_chars,
      titleMeta?.meta_description_within_150_160_chars
    ].filter(Boolean).length * 10;

    // Calculate Readability Score (50 points total - 10 each)
    const readabilityScore = [
      readability?.has_short_paragraphs,
      readability?.uses_conversational_tone,
      readability?.passive_voice_under_10_percent,
      readability?.matches_user_intent,
      readability?.uses_emotion_and_storytelling
    ].filter(Boolean).length * 10;

    // Calculate total score
    const totalScore = Math.round(keywordScore + titleMetaScore + readabilityScore);

    // Calculate percentage scores for each category
    const keywordPercentage = Math.round((keywordScore / 30) * 100);
    const titleMetaPercentage = Math.round((titleMetaScore / 20) * 100);
    const readabilityPercentage = Math.round((readabilityScore / 50) * 100);

    return {
      score: totalScore,
      breakdown: {
        keyword_usage: keywordPercentage,
        title_meta: titleMetaPercentage,
        readability: readabilityPercentage
      }
    };
  } catch (error) {
    console.error("Error calculating content score:", error);
    throw error;
  }
} 