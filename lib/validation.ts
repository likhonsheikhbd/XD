import { ChatMessage, ValidationResult } from './types'

export function validateInput(messages: ChatMessage[]): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!Array.isArray(messages)) {
    errors.push('Messages must be an array')
    return { isValid: false, errors, warnings }
  }

  if (messages.length === 0) {
    errors.push('At least one message is required')
    return { isValid: false, errors, warnings }
  }

  for (const [index, message] of messages.entries()) {
    if (!message.content || typeof message.content !== 'string') {
      errors.push(`Message ${index + 1}: Content is required and must be a string`)
    }

    if (!message.role || !['user', 'assistant', 'system'].includes(message.role)) {
      errors.push(`Message ${index + 1}: Role must be 'user', 'assistant', or 'system'`)
    }

    if (message.content && message.content.length > 10000) {
      warnings.push(`Message ${index + 1}: Content is very long (${message.content.length} characters)`)
    }

    // Check for potential security issues
    if (message.content && containsSuspiciousContent(message.content)) {
      warnings.push(`Message ${index + 1}: Contains potentially suspicious content`)
    }
  }

  // Check conversation length
  if (messages.length > 50) {
    warnings.push('Conversation is very long. Consider starting a new conversation for better performance.')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

function containsSuspiciousContent(content: string): boolean {
  const suspiciousPatterns = [
    /eval\s*\(/i,
    /document\.write/i,
    /innerHTML\s*=/i,
    /script\s*>/i,
    /javascript:/i,
    /data:text\/html/i,
    /vbscript:/i,
  ]

  return suspiciousPatterns.some(pattern => pattern.test(content))
}

export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters and patterns
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}

export function validateCodeRequest(request: any): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!request.type || !['generate', 'modify', 'explain', 'debug', 'optimize'].includes(request.type)) {
    errors.push('Invalid request type')
  }

  if (!request.description || typeof request.description !== 'string') {
    errors.push('Description is required')
  }

  if (request.description && request.description.length < 10) {
    warnings.push('Description is very short. More details would help generate better code.')
  }

  if (request.language && typeof request.language !== 'string') {
    errors.push('Language must be a string')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}