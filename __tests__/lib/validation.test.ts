import { validateInput, sanitizeInput, validateCodeRequest } from '@/lib/validation'
import type { ChatMessage } from '@/lib/types'

describe('validation', () => {
  describe('validateInput', () => {
    it('validates correct message format', () => {
      const messages: ChatMessage[] = [
        {
          id: '1',
          role: 'user',
          content: 'Hello, world!',
          timestamp: new Date(),
        },
      ]

      const result = validateInput(messages)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('rejects empty messages array', () => {
      const result = validateInput([])
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('At least one message is required')
    })

    it('rejects messages with invalid role', () => {
      const messages = [
        {
          id: '1',
          role: 'invalid' as any,
          content: 'Test',
          timestamp: new Date(),
        },
      ]

      const result = validateInput(messages)
      expect(result.isValid).toBe(false)
      expect(result.errors[0]).toContain('Role must be')
    })

    it('rejects messages without content', () => {
      const messages = [
        {
          id: '1',
          role: 'user' as const,
          content: '',
          timestamp: new Date(),
        },
      ]

      const result = validateInput(messages)
      expect(result.isValid).toBe(false)
      expect(result.errors[0]).toContain('Content is required')
    })

    it('warns about very long content', () => {
      const longContent = 'a'.repeat(15000)
      const messages: ChatMessage[] = [
        {
          id: '1',
          role: 'user',
          content: longContent,
          timestamp: new Date(),
        },
      ]

      const result = validateInput(messages)
      expect(result.isValid).toBe(true)
      expect(result.warnings?.[0]).toContain('Content is very long')
    })

    it('warns about suspicious content', () => {
      const messages: ChatMessage[] = [
        {
          id: '1',
          role: 'user',
          content: 'eval("malicious code")',
          timestamp: new Date(),
        },
      ]

      const result = validateInput(messages)
      expect(result.isValid).toBe(true)
      expect(result.warnings?.[0]).toContain('suspicious content')
    })
  })

  describe('sanitizeInput', () => {
    it('removes script tags', () => {
      const input = '<script>alert("xss")</script>Hello'
      const result = sanitizeInput(input)
      expect(result).toBe('Hello')
    })

    it('removes javascript: protocols', () => {
      const input = 'javascript:alert("xss")'
      const result = sanitizeInput(input)
      expect(result).toBe('')
    })

    it('removes event handlers', () => {
      const input = 'onclick="alert(1)" Hello'
      const result = sanitizeInput(input)
      expect(result).toBe('Hello')
    })

    it('preserves safe content', () => {
      const input = 'This is safe content with <em>emphasis</em>'
      const result = sanitizeInput(input)
      expect(result).toBe('This is safe content with <em>emphasis</em>')
    })
  })

  describe('validateCodeRequest', () => {
    it('validates correct code request', () => {
      const request = {
        type: 'generate',
        description: 'Create a React component',
        language: 'javascript',
      }

      const result = validateCodeRequest(request)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('rejects invalid request type', () => {
      const request = {
        type: 'invalid',
        description: 'Test',
      }

      const result = validateCodeRequest(request)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Invalid request type')
    })

    it('rejects missing description', () => {
      const request = {
        type: 'generate',
      }

      const result = validateCodeRequest(request)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Description is required')
    })

    it('warns about short description', () => {
      const request = {
        type: 'generate',
        description: 'Short',
      }

      const result = validateCodeRequest(request)
      expect(result.isValid).toBe(true)
      expect(result.warnings?.[0]).toContain('Description is very short')
    })
  })
})