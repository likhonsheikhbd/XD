export interface SentimentResult {
  label: "positive" | "negative" | "neutral"
  confidence: number
  emotions?: {
    joy?: number
    anger?: number
    fear?: number
    sadness?: number
    surprise?: number
  }
}

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  try {
    // In a real implementation, you would use Google Cloud Natural Language API
    // or integrate with Google's sentiment analysis models
    const response = await fetch("/api/sentiment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      throw new Error("Sentiment analysis failed")
    }

    return await response.json()
  } catch (error) {
    console.error("Sentiment analysis error:", error)
    // Fallback to simple heuristic
    return simpleHeuristicSentiment(text)
  }
}

function simpleHeuristicSentiment(text: string): SentimentResult {
  const positiveWords = [
    "good",
    "great",
    "excellent",
    "amazing",
    "wonderful",
    "fantastic",
    "love",
    "like",
    "happy",
    "pleased",
  ]
  const negativeWords = [
    "bad",
    "terrible",
    "awful",
    "horrible",
    "hate",
    "dislike",
    "angry",
    "frustrated",
    "disappointed",
    "sad",
  ]

  const words = text.toLowerCase().split(/\s+/)
  const positiveCount = words.filter((word) => positiveWords.includes(word)).length
  const negativeCount = words.filter((word) => negativeWords.includes(word)).length

  if (positiveCount > negativeCount) {
    return { label: "positive", confidence: 0.7 }
  } else if (negativeCount > positiveCount) {
    return { label: "negative", confidence: 0.7 }
  } else {
    return { label: "neutral", confidence: 0.6 }
  }
}
