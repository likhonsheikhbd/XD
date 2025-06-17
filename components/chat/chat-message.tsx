'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Copy, Check, ChevronDown, ChevronRight, Play, Download } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from 'next-themes'
import { extractCodeBlocks } from '@/lib/code-parser'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ChatMessage as ChatMessageType } from '@/lib/types'

interface ChatMessageProps {
  message: ChatMessageType
  onCodeInsert: (code: string, filename: string) => void
}

export function ChatMessage({ message, onCodeInsert }: ChatMessageProps) {
  const { theme } = useTheme()
  const [copiedStates, setCopiedStates] = useState<Record<number, boolean>>({})
  const [expandedBlocks, setExpandedBlocks] = useState<Record<number, boolean>>({})

  const isUser = message.role === 'user'
  const codeBlocks = extractCodeBlocks(message.content)

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates(prev => ({ ...prev, [index]: true }))
      toast.success('Code copied to clipboard')
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [index]: false }))
      }, 2000)
    } catch (error) {
      toast.error('Failed to copy code')
    }
  }

  const downloadCode = (code: string, language: string, index: number) => {
    const extension = getFileExtension(language)
    const filename = `code-${index + 1}.${extension}`
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`Downloaded ${filename}`)
  }

  const insertCode = (code: string, language: string, index: number) => {
    const extension = getFileExtension(language)
    const filename = `generated-${index + 1}.${extension}`
    onCodeInsert(code, filename)
  }

  const toggleExpanded = (index: number) => {
    setExpandedBlocks(prev => ({ ...prev, [index]: !prev[index] }))
  }

  return (
    <div className={cn(
      "flex gap-3 max-w-full",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex gap-3 max-w-[85%]",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        {/* Avatar */}
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-muted-foreground"
        )}>
          {isUser ? "U" : "AI"}
        </div>

        {/* Message Content */}
        <Card className={cn(
          "p-4 max-w-full",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-card"
        )}>
          {codeBlocks.length > 0 ? (
            <div className="space-y-4">
              {/* Text content before/between code blocks */}
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className={cn(
                  "prose prose-sm max-w-none",
                  isUser 
                    ? "prose-invert" 
                    : "prose-gray dark:prose-invert"
                )}
                components={{
                  pre: ({ children }) => <>{children}</>,
                  code: ({ children, className }) => {
                    // Skip code blocks as they're handled separately
                    if (className?.includes('language-')) {
                      return null
                    }
                    return (
                      <code className="bg-muted px-1 py-0.5 rounded text-sm">
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {message.content.replace(/```[\s\S]*?```/g, '')}
              </ReactMarkdown>

              {/* Code blocks */}
              {codeBlocks.map((block, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between bg-muted px-3 py-2 border-b">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {block.language}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {block.code.split('\n').length} lines
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(block.code, index)}
                        className="h-7 w-7 p-0"
                      >
                        {copiedStates[index] ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadCode(block.code, block.language, index)}
                        className="h-7 w-7 p-0"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => insertCode(block.code, block.language, index)}
                        className="h-7 w-7 p-0"
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                      
                      {block.code.split('\n').length > 10 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(index)}
                          className="h-7 w-7 p-0"
                        >
                          {expandedBlocks[index] ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <Collapsible 
                    open={expandedBlocks[index] || block.code.split('\n').length <= 10}
                  >
                    <CollapsibleContent>
                      <SyntaxHighlighter
                        language={block.language}
                        style={theme === 'dark' ? oneDark : oneLight}
                        customStyle={{
                          margin: 0,
                          borderRadius: 0,
                          background: 'transparent',
                        }}
                        codeTagProps={{
                          className: 'code-editor text-sm',
                        }}
                      >
                        {block.code}
                      </SyntaxHighlighter>
                    </CollapsibleContent>
                  </Collapsible>
                  
                  {!expandedBlocks[index] && block.code.split('\n').length > 10 && (
                    <div className="bg-muted/50 px-3 py-2 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(index)}
                        className="text-xs"
                      >
                        Show {block.code.split('\n').length - 10} more lines
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className={cn(
                "prose prose-sm max-w-none",
                isUser 
                  ? "prose-invert" 
                  : "prose-gray dark:prose-invert"
              )}
            >
              {message.content}
            </ReactMarkdown>
          )}
          
          {/* Timestamp */}
          <div className={cn(
            "text-xs mt-2 opacity-70",
            isUser ? "text-right" : "text-left"
          )}>
            {message.timestamp.toLocaleTimeString()}
          </div>
        </Card>
      </div>
    </div>
  )
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