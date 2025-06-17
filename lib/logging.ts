import type { NextRequest } from "next/server"

export async function logRequest(req: NextRequest, metadata: any = {}) {
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    userAgent: req.headers.get("user-agent"),
    ip: req.ip || req.headers.get("x-forwarded-for"),
    ...metadata,
  }

  // In production, send to your logging service
  console.log("Request:", JSON.stringify(logData))
}

export async function logCompletion(result: any, sentiment: any) {
  const logData = {
    timestamp: new Date().toISOString(),
    type: "completion",
    tokens: result.usage,
    sentiment,
    model: result.model,
  }

  // In production, send to your analytics service
  console.log("Completion:", JSON.stringify(logData))
}
