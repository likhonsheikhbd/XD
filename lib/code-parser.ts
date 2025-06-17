import { CodeRequest, EditorContext } from './types'

export function parseCodeRequest(content: string, context?: EditorContext): CodeRequest {
  const lowerContent = content.toLowerCase()
  
  // Determine request type
  let type: CodeRequest['type'] = 'generate'
  
  if (lowerContent.includes('explain') || lowerContent.includes('what does')) {
    type = 'explain'
  } else if (lowerContent.includes('debug') || lowerContent.includes('fix') || lowerContent.includes('error')) {
    type = 'debug'
  } else if (lowerContent.includes('optimize') || lowerContent.includes('improve') || lowerContent.includes('performance')) {
    type = 'optimize'
  } else if (lowerContent.includes('modify') || lowerContent.includes('change') || lowerContent.includes('update')) {
    type = 'modify'
  }

  // Extract language
  const language = extractLanguage(content, context)
  
  // Extract framework
  const framework = extractFramework(content)
  
  // Extract requirements
  const requirements = extractRequirements(content)
  
  // Extract constraints
  const constraints = extractConstraints(content)

  return {
    type,
    language,
    framework,
    description: content,
    existingCode: context?.files[context.currentFile]?.code,
    requirements,
    constraints,
  }
}

function extractLanguage(content: string, context?: EditorContext): string {
  // Check context first
  if (context?.language) {
    return context.language
  }

  const languagePatterns = {
    javascript: /\b(javascript|js|node\.?js|react|vue|angular)\b/i,
    typescript: /\b(typescript|ts)\b/i,
    python: /\b(python|py|django|flask|fastapi)\b/i,
    java: /\b(java|spring|maven|gradle)\b/i,
    csharp: /\b(c#|csharp|\.net|dotnet)\b/i,
    cpp: /\b(c\+\+|cpp|c plus plus)\b/i,
    c: /\b(c language|c programming)\b/i,
    go: /\b(go|golang)\b/i,
    rust: /\b(rust|cargo)\b/i,
    php: /\b(php|laravel|symfony)\b/i,
    ruby: /\b(ruby|rails|gem)\b/i,
    swift: /\b(swift|ios|xcode)\b/i,
    kotlin: /\b(kotlin|android)\b/i,
    html: /\b(html|markup)\b/i,
    css: /\b(css|sass|scss|less|stylus)\b/i,
    sql: /\b(sql|mysql|postgresql|sqlite|database)\b/i,
    shell: /\b(bash|shell|zsh|fish|terminal)\b/i,
  }

  for (const [lang, pattern] of Object.entries(languagePatterns)) {
    if (pattern.test(content)) {
      return lang
    }
  }

  return 'javascript' // Default
}

function extractFramework(content: string): string | undefined {
  const frameworkPatterns = {
    react: /\b(react|jsx|next\.?js)\b/i,
    vue: /\b(vue|nuxt)\b/i,
    angular: /\b(angular|ng)\b/i,
    svelte: /\b(svelte|sveltekit)\b/i,
    express: /\b(express|express\.js)\b/i,
    fastify: /\b(fastify)\b/i,
    django: /\b(django)\b/i,
    flask: /\b(flask)\b/i,
    spring: /\b(spring|spring boot)\b/i,
    laravel: /\b(laravel)\b/i,
    rails: /\b(rails|ruby on rails)\b/i,
  }

  for (const [framework, pattern] of Object.entries(frameworkPatterns)) {
    if (pattern.test(content)) {
      return framework
    }
  }

  return undefined
}

function extractRequirements(content: string): string[] {
  const requirements: string[] = []
  
  // Look for explicit requirements
  const requirementPatterns = [
    /requirements?:?\s*(.+)/i,
    /needs? to:?\s*(.+)/i,
    /should:?\s*(.+)/i,
    /must:?\s*(.+)/i,
  ]

  for (const pattern of requirementPatterns) {
    const match = content.match(pattern)
    if (match) {
      requirements.push(match[1].trim())
    }
  }

  // Extract implicit requirements
  if (content.includes('responsive')) {
    requirements.push('Make it responsive')
  }
  if (content.includes('accessible')) {
    requirements.push('Ensure accessibility')
  }
  if (content.includes('performance')) {
    requirements.push('Optimize for performance')
  }
  if (content.includes('mobile')) {
    requirements.push('Mobile-friendly')
  }

  return requirements
}

function extractConstraints(content: string): string[] {
  const constraints: string[] = []
  
  // Look for explicit constraints
  const constraintPatterns = [
    /constraints?:?\s*(.+)/i,
    /limitations?:?\s*(.+)/i,
    /don't use:?\s*(.+)/i,
    /avoid:?\s*(.+)/i,
    /without:?\s*(.+)/i,
  ]

  for (const pattern of constraintPatterns) {
    const match = content.match(pattern)
    if (match) {
      constraints.push(match[1].trim())
    }
  }

  return constraints
}

export function extractCodeBlocks(content: string): Array<{ language: string; code: string }> {
  const codeBlockPattern = /```(\w+)?\n([\s\S]*?)```/g
  const blocks: Array<{ language: string; code: string }> = []
  
  let match
  while ((match = codeBlockPattern.exec(content)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2].trim(),
    })
  }
  
  return blocks
}

export function generateFileStructure(codeBlocks: Array<{ language: string; code: string }>): Record<string, string> {
  const files: Record<string, string> = {}
  
  for (const [index, block] of codeBlocks.entries()) {
    const extension = getFileExtension(block.language)
    const filename = `file${index + 1}.${extension}`
    files[filename] = block.code
  }
  
  return files
}

function getFileExtension(language: string): string {
  const extensions: Record<string, string> = {
    javascript: 'js',
    typescript: 'ts',
    python: 'py',
    java: 'java',
    csharp: 'cs',
    cpp: 'cpp',
    c: 'c',
    go: 'go',
    rust: 'rs',
    php: 'php',
    ruby: 'rb',
    swift: 'swift',
    kotlin: 'kt',
    html: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'sass',
    sql: 'sql',
    shell: 'sh',
    bash: 'sh',
    json: 'json',
    yaml: 'yml',
    xml: 'xml',
    markdown: 'md',
  }
  
  return extensions[language.toLowerCase()] || 'txt'
}