import { NextRequest } from 'next/server'
import { RateLimitResult } from './types'

// Simple in-memory rate limiter (use Redis in production)
const requests = new Map<string, { count: number; reset: number }>()

export async function rateLimit(
  req: NextRequest,
  limit = 10,
  windowMs = 60 * 1000 // 1 minute
): Promise<RateLimitResult> {
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'anonymous'
  const now = Date.now()
  const windowStart = Math.floor(now / windowMs) * windowMs
  const key = `${ip}:${windowStart}`

  const current = requests.get(key) || { count: 0, reset: windowStart + windowMs }

  if (current.count >= limit) {
    return {
      success: false,
      remaining: 0,
      reset: new Date(current.reset),
      limit,
    }
  }

  current.count++
  requests.set(key, current)

  // Cleanup old entries
  for (const [k, v] of requests.entries()) {
    if (v.reset < now) {
      requests.delete(k)
    }
  }

  return {
    success: true,
    remaining: limit - current.count,
    reset: new Date(current.reset),
    limit,
  }
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toISOString(),
  }
}