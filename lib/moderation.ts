export interface ModerationResult {
  safe: boolean
  reasons: string[]
  categories: {
    hate: number
    harassment: number
    violence: number
    sexual: number
    dangerous: number
  }
}

export async function moderateContent(content: string): Promise<ModerationResult> {
  try {
    // In production, integrate with Google Cloud AI content moderation
    const response = await fetch("/api/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })

    if (!response.ok) {
      throw new Error("Content moderation failed")
    }

    return await response.json()
  } catch (error) {
    console.error("Content moderation error:", error)
    // Fallback to basic keyword filtering
    return basicContentFilter(content)
  }
}

function basicContentFilter(content: string): ModerationResult {
  const flaggedKeywords = ["hate", "violence", "harassment", "abuse", "threat"]

  const lowerContent = content.toLowerCase()
  const foundKeywords = flaggedKeywords.filter((keyword) => lowerContent.includes(keyword))

  return {
    safe: foundKeywords.length === 0,
    reasons: foundKeywords.length > 0 ? ["Contains flagged keywords"] : [],
    categories: {
      hate: foundKeywords.includes("hate") ? 0.8 : 0.1,
      harassment: foundKeywords.includes("harassment") ? 0.8 : 0.1,
      violence: foundKeywords.includes("violence") ? 0.8 : 0.1,
      sexual: 0.1,
      dangerous: foundKeywords.includes("threat") ? 0.8 : 0.1,
    },
  }
}
