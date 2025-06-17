import type { NextRequest } from "next/server"

interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number
}

// Simple in-memory rate limiting (use Redis in production)
const requests = new Map<string, { count: number; reset: number }>()

export async function rateLimit(req: NextRequest, limit = 100): Promise<RateLimitResult> {
  const ip = req.ip || req.headers.get("x-forwarded-for") || "anonymous"
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute window

  const key = `${ip}:${Math.floor(now / windowMs)}`
  const current = requests.get(key) || { count: 0, reset: now + windowMs }

  if (current.count >= limit) {
    return {
      success: false,
      remaining: 0,
      reset: current.reset,
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
    reset: current.reset,
  }
}
