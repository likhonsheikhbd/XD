import { google } from '@ai-sdk/google'
import { streamText, convertToCoreMessages } from 'ai'
import { NextRequest } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { validateInput } from '@/lib/validation'
import { parseCodeRequest } from '@/lib/code-parser'
import { generateSystemPrompt } from '@/lib/prompts'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(req)
    if (!rateLimitResult.success) {
      return new Response('Rate limit exceeded. Please try again later.', { 
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(Date.now() + 60000).toISOString(),
        }
      })
    }

    const { messages, context } = await req.json()

    // Validate input
    const validation = validateInput(messages)
    if (!validation.isValid) {
      return new Response(JSON.stringify({ 
        error: 'Invalid input', 
        details: validation.errors 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Parse the latest message for code-specific requests
    const latestMessage = messages[messages.length - 1]
    const codeRequest = parseCodeRequest(latestMessage.content, context)

    // Generate system prompt based on context
    const systemPrompt = generateSystemPrompt(codeRequest, context)

    const result = streamText({
      model: google('gemini-1.5-pro-latest'),
      system: systemPrompt,
      messages: convertToCoreMessages(messages),
      maxTokens: 4096,
      temperature: 0.7,
      topP: 0.9,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1,
      onFinish: async (result) => {
        // Log completion for analytics
        console.log('Completion finished:', {
          tokens: result.usage,
          finishReason: result.finishReason,
          timestamp: new Date().toISOString(),
        })
      },
    })

    return result.toDataStreamResponse({
      headers: {
        'X-Request-ID': crypto.randomUUID(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    })
  } catch (error) {
    console.error('Chat API Error:', error)
    
    // Return appropriate error response
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return new Response(JSON.stringify({ 
          error: 'API configuration error',
          message: 'Please check your API key configuration'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
      if (error.message.includes('quota')) {
        return new Response(JSON.stringify({ 
          error: 'Quota exceeded',
          message: 'API quota has been exceeded. Please try again later.'
        }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }

    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred. Please try again.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}