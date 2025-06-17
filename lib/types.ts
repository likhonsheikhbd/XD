export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    tokens?: number
    model?: string
    finishReason?: string
  }
}

export interface CodeRequest {
  type: 'generate' | 'modify' | 'explain' | 'debug' | 'optimize'
  language: string
  framework?: string
  description: string
  existingCode?: string
  requirements?: string[]
  constraints?: string[]
}

export interface CodeSolution {
  code: string
  explanation: string
  files: SandpackFiles
  dependencies?: string[]
  instructions?: string[]
}

export interface SandpackFiles {
  [key: string]: {
    code: string
    hidden?: boolean
    active?: boolean
    readOnly?: boolean
  }
}

export interface EditorContext {
  currentFile: string
  cursorPosition: number
  selectedText?: string
  files: SandpackFiles
  language: string
}

export interface Suggestion {
  label: string
  kind: 'function' | 'variable' | 'class' | 'module' | 'keyword'
  insertText: string
  documentation?: string
  detail?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings?: string[]
}

export interface FileAction {
  type: 'create' | 'delete' | 'rename' | 'move'
  path: string
  newPath?: string
  content?: string
}

export interface CodeDiff {
  additions: string[]
  deletions: string[]
  modifications: Array<{
    line: number
    old: string
    new: string
  }>
}

export interface StreamingResponse {
  content: string
  isComplete: boolean
  metadata?: {
    tokens: number
    model: string
  }
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  reset: Date
  limit: number
}

export interface AssistantConfig {
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
  features: {
    codeGeneration: boolean
    codeExplanation: boolean
    debugging: boolean
    optimization: boolean
    autoComplete: boolean
  }
}

export interface ConversationHistory {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
  metadata?: {
    totalTokens: number
    language: string
    framework?: string
  }
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  fontSize: number
  tabSize: number
  wordWrap: boolean
  minimap: boolean
  autoSave: boolean
  keyBindings: 'default' | 'vim' | 'emacs'
  language: string
}

export interface PerformanceMetrics {
  responseTime: number
  tokensPerSecond: number
  memoryUsage: number
  cpuUsage: number
  timestamp: Date
}

export interface ErrorInfo {
  message: string
  stack?: string
  componentStack?: string
  timestamp: Date
  userAgent?: string
  url?: string
}