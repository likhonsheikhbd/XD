import { CodeRequest, EditorContext } from './types'

export function generateSystemPrompt(request: CodeRequest, context?: EditorContext): string {
  const basePrompt = `You are an expert AI coding assistant with deep knowledge of software development, best practices, and modern frameworks. You help developers by generating, explaining, debugging, and optimizing code.

Key capabilities:
- Generate clean, efficient, and well-documented code
- Explain complex programming concepts clearly
- Debug and fix code issues
- Optimize code for performance and maintainability
- Provide best practices and architectural guidance
- Support multiple programming languages and frameworks

Guidelines:
- Always write production-ready code with proper error handling
- Include clear comments and documentation
- Follow language-specific conventions and best practices
- Consider security, performance, and accessibility
- Provide explanations for your code choices
- Use modern syntax and features when appropriate`

  const requestSpecificPrompt = generateRequestSpecificPrompt(request)
  const contextPrompt = generateContextPrompt(context)
  
  return [basePrompt, requestSpecificPrompt, contextPrompt].filter(Boolean).join('\n\n')
}

function generateRequestSpecificPrompt(request: CodeRequest): string {
  switch (request.type) {
    case 'generate':
      return `Current task: Generate new code
Language: ${request.language}
${request.framework ? `Framework: ${request.framework}` : ''}
${request.requirements?.length ? `Requirements: ${request.requirements.join(', ')}` : ''}
${request.constraints?.length ? `Constraints: ${request.constraints.join(', ')}` : ''}

Please generate clean, well-structured code that meets the requirements. Include:
- Proper imports and dependencies
- Clear variable and function names
- Comprehensive error handling
- Inline comments explaining complex logic
- Type annotations where applicable`

    case 'modify':
      return `Current task: Modify existing code
Language: ${request.language}
${request.framework ? `Framework: ${request.framework}` : ''}

Existing code:
\`\`\`${request.language}
${request.existingCode || 'No existing code provided'}
\`\`\`

Please modify the code according to the request while:
- Maintaining existing functionality unless explicitly asked to change it
- Following the same coding style and patterns
- Adding proper error handling for new features
- Updating comments and documentation as needed`

    case 'explain':
      return `Current task: Explain code
Language: ${request.language}

Code to explain:
\`\`\`${request.language}
${request.existingCode || 'No code provided'}
\`\`\`

Please provide a clear, comprehensive explanation that includes:
- Overall purpose and functionality
- Step-by-step breakdown of the logic
- Explanation of key concepts and patterns used
- Potential improvements or alternatives
- Common use cases and examples`

    case 'debug':
      return `Current task: Debug and fix code
Language: ${request.language}

Code with issues:
\`\`\`${request.language}
${request.existingCode || 'No code provided'}
\`\`\`

Please:
- Identify the specific issues in the code
- Explain why these issues occur
- Provide the corrected code
- Suggest preventive measures for similar issues
- Include proper error handling and validation`

    case 'optimize':
      return `Current task: Optimize code for performance
Language: ${request.language}

Code to optimize:
\`\`\`${request.language}
${request.existingCode || 'No code provided'}
\`\`\`

Please optimize the code by:
- Improving algorithmic complexity where possible
- Reducing memory usage
- Eliminating redundant operations
- Using more efficient data structures
- Applying language-specific optimizations
- Maintaining code readability and maintainability`

    default:
      return ''
  }
}

function generateContextPrompt(context?: EditorContext): string {
  if (!context) return ''

  return `Current editor context:
- Active file: ${context.currentFile}
- Language: ${context.language}
- Available files: ${Object.keys(context.files).join(', ')}
${context.selectedText ? `- Selected text: ${context.selectedText}` : ''}

Please consider the existing project structure and maintain consistency with the codebase.`
}

export function generateCodeGenerationPrompt(
  description: string,
  language: string,
  framework?: string,
  requirements?: string[]
): string {
  return `Generate ${language}${framework ? ` (${framework})` : ''} code for: ${description}

${requirements?.length ? `Requirements:\n${requirements.map(req => `- ${req}`).join('\n')}\n` : ''}

Please provide:
1. Complete, working code
2. Clear explanations of key components
3. Usage examples
4. Any necessary setup instructions

Format your response with proper code blocks and clear explanations.`
}

export function generateDebuggingPrompt(
  code: string,
  language: string,
  errorDescription?: string
): string {
  return `Debug this ${language} code${errorDescription ? ` (Error: ${errorDescription})` : ''}:

\`\`\`${language}
${code}
\`\`\`

Please:
1. Identify the issue(s)
2. Explain why the error occurs
3. Provide the corrected code
4. Suggest best practices to prevent similar issues`
}

export function generateOptimizationPrompt(
  code: string,
  language: string,
  optimizationGoals?: string[]
): string {
  return `Optimize this ${language} code${optimizationGoals?.length ? ` for: ${optimizationGoals.join(', ')}` : ''}:

\`\`\`${language}
${code}
\`\`\`

Please provide:
1. Optimized version of the code
2. Explanation of improvements made
3. Performance impact analysis
4. Any trade-offs to consider`
}