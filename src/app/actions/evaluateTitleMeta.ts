"use server"

interface TitleMetaAnalysis {
  title_within_55_60_chars: boolean
  meta_description_within_150_160_chars: boolean
  title_length?: number
  meta_description_length?: number
}

interface PageMetadata {
  title: string
  description: string
}

export async function evaluateTitleMeta(metadata: PageMetadata): Promise<TitleMetaAnalysis> {
  try {
    const titleLength = metadata.title?.length || 0;
    const metaDescLength = metadata.description?.length || 0;

    // Title should be between 55-60 characters
    const titleWithinRange = titleLength >= 55 && titleLength <= 60;

    // Meta description should be between 150-160 characters
    const metaWithinRange = metaDescLength >= 150 && metaDescLength <= 160;

    return {
      title_within_55_60_chars: titleWithinRange,
      meta_description_within_150_160_chars: metaWithinRange,
      title_length: titleLength,
      meta_description_length: metaDescLength
    };
  } catch (error) {
    console.error("Error evaluating title and meta:", error);
    throw error;
  }
} 