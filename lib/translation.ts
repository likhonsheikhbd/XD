export async function translateText(text: string, targetLanguage: string): Promise<string> {
  try {
    // In production, use Google Cloud Translation API
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        targetLanguage,
        sourceLanguage: "auto", // Auto-detect source language
      }),
    })

    if (!response.ok) {
      throw new Error("Translation failed")
    }

    const result = await response.json()
    return result.translatedText
  } catch (error) {
    console.error("Translation error:", error)
    return text // Return original text if translation fails
  }
}

export async function detectLanguage(text: string): Promise<string> {
  try {
    const response = await fetch("/api/detect-language", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      throw new Error("Language detection failed")
    }

    const result = await response.json()
    return result.language
  } catch (error) {
    console.error("Language detection error:", error)
    return "en" // Default to English
  }
}
