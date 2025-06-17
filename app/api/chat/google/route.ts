import { google } from "@ai-sdk/google"
import { streamText, convertToCoreMessages } from "ai"
import type { NextRequest } from "next/server"
import { rateLimit } from "@/lib/rate-limit"
import { moderateContent } from "@/lib/moderation"
import { translateText } from "@/lib/translation"
import { analyzeSentiment } from "@/lib/sentiment"
import { logRequest } from "@/lib/logging"

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(req)
    if (!rateLimitResult.success) {
      return new Response("Rate limit exceeded", { status: 429 })
    }

    const { messages, settings = {} } = await req.json()

    // Log the request
    await logRequest(req, { messageCount: messages.length })

    // Content moderation
    const lastMessage = messages[messages.length - 1]
    const moderationResult = await moderateContent(lastMessage.content)

    if (!moderationResult.safe) {
      return new Response(
        JSON.stringify({
          error: "Content violates safety guidelines",
          details: moderationResult.reasons,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      )
    }

    // Sentiment analysis for context awareness
    const sentiment = await analyzeSentiment(lastMessage.content)

    // Translation if needed
    let processedMessages = messages
    if (settings.autoTranslate && settings.targetLanguage !== "en") {
      processedMessages = await Promise.all(
        messages.map(async (msg: any) => ({
          ...msg,
          content:
            typeof msg.content === "string" ? await translateText(msg.content, settings.targetLanguage) : msg.content,
        })),
      )
    }

    // Enhanced system prompt with context awareness
    const systemPrompt = buildSystemPrompt(sentiment, settings)

    // Select appropriate model based on query complexity
    const modelId = selectOptimalModel(lastMessage.content, settings)

    const result = streamText({
      model: google(modelId, {
        safetySettings: [
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_LOW_AND_ABOVE" },
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_LOW_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" },
        ],
        useSearchGrounding: settings.useSearchGrounding || false,
        dynamicRetrievalConfig: settings.useSearchGrounding
          ? {
              mode: "MODE_DYNAMIC",
              dynamicThreshold: 0.7,
            }
          : undefined,
      }),
      system: systemPrompt,
      messages: convertToCoreMessages(processedMessages),
      maxTokens: settings.maxTokens || 2048,
      temperature: settings.temperature || 0.7,
      topP: settings.topP || 0.9,
      onFinish: async (result) => {
        // Log completion metrics
        await logCompletion(result, sentiment)
      },
    })

    return result.toDataStreamResponse({
      sendReasoning: true,
      sendSources: true,
    })
  } catch (error) {
    console.error("Chat API Error:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

function buildSystemPrompt(sentiment: any, settings: any): string {
  let prompt = `You are a sophisticated AI assistant powered by Google's advanced AI models. 
  
Key capabilities:
- Multi-modal understanding (text, images, documents)
- Real-time information access via search grounding
- Context-aware responses based on conversation history
- Multilingual support and translation

Current conversation context:
- User sentiment: ${sentiment.label} (confidence: ${sentiment.confidence})
- Language preference: ${settings.targetLanguage || "en"}
- Search grounding: ${settings.useSearchGrounding ? "enabled" : "disabled"}

Guidelines:
- Provide accurate, helpful, and contextually appropriate responses
- Maintain conversation continuity and reference previous messages when relevant
- Be sensitive to user sentiment and adjust tone accordingly
- Cite sources when using search grounding
- Respect cultural differences and maintain inclusivity
- Flag potentially harmful or biased content`

  if (sentiment.label === "negative") {
    prompt += "\n- The user seems frustrated or upset. Respond with empathy and offer constructive help."
  } else if (sentiment.label === "positive") {
    prompt += "\n- The user appears positive. Match their energy while remaining professional."
  }

  return prompt
}

function selectOptimalModel(content: string, settings: any): string {
  // Simple heuristics for model selection
  const isComplex = content.length > 500 || content.includes("analyze") || content.includes("explain")
  const needsReasoning = content.includes("why") || content.includes("how") || content.includes("compare")

  if (settings.forceModel) return settings.forceModel

  if (needsReasoning) return "gemini-2.0-flash-thinking-exp"
  if (isComplex) return "gemini-1.5-pro-latest"
  return "gemini-1.5-flash-latest"
}

async function logCompletion(result: any, sentiment: any) {
  try {
    await fetch("/api/analytics/completion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tokens: result.usage,
        sentiment,
        timestamp: new Date().toISOString(),
        model: result.model,
      }),
    })
  } catch (error) {
    console.error("Failed to log completion:", error)
  }
}
