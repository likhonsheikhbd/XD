"use client"

import type React from "react"

import type { Message } from "ai"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, ThumbsUp, ThumbsDown, ChevronDown, Brain, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import ReactMarkdown from "react-markdown"

// Add this simple collapsible implementation since it's not in the default shadcn/ui
function Collapsible({
  children,
  open,
  onOpenChange,
}: { children: React.ReactNode; open: boolean; onOpenChange: (open: boolean) => void }) {
  return <div>{children}</div>
}

function CollapsibleTrigger({
  children,
  asChild,
  ...props
}: { children: React.ReactNode; asChild?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>
}

function CollapsibleContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

interface MessageBubbleProps {
  message: Message
  isLast: boolean
  showSources?: boolean
  showReasoning?: boolean
}

export function MessageBubble({ message, isLast, showSources = false, showReasoning = false }: MessageBubbleProps) {
  const { toast } = useToast()
  const [reasoningOpen, setReasoningOpen] = useState(false)
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const isUser = message.role === "user"

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    toast({ title: "Copied to clipboard" })
  }

  const handleFeedback = async (type: "positive" | "negative") => {
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: message.id,
          type,
          timestamp: new Date().toISOString(),
        }),
      })
      toast({ title: `Feedback recorded` })
    } catch (error) {
      toast({ title: "Failed to record feedback", variant: "destructive" })
    }
  }

  return (
    <div className={cn("flex gap-3 max-w-4xl", isUser ? "ml-auto flex-row-reverse" : "mr-auto")}>
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
        )}
      >
        {isUser ? "U" : "AI"}
      </div>

      <div className={cn("flex-1 space-y-2", isUser ? "items-end" : "items-start")}>
        <Card className={cn("max-w-[80%]", isUser ? "bg-primary text-primary-foreground ml-auto" : "bg-muted")}>
          <CardContent className="p-4">
            {/* Handle multimodal content */}
            {Array.isArray(message.content) ? (
              <div className="space-y-2">
                {message.content.map((part, index) => (
                  <div key={index}>
                    {part.type === "text" && (
                      <ReactMarkdown className="prose prose-sm dark:prose-invert">{part.text}</ReactMarkdown>
                    )}
                    {part.type === "image" && (
                      <img
                        src={part.image || "/placeholder.svg"}
                        alt="User uploaded image"
                        className="max-w-full h-auto rounded-lg"
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <ReactMarkdown className="prose prose-sm dark:prose-invert">{message.content}</ReactMarkdown>
            )}

            {/* Reasoning section */}
            {!isUser && showReasoning && message.reasoning && (
              <Collapsible open={reasoningOpen} onOpenChange={setReasoningOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto">
                    <Brain className="w-4 h-4 mr-1" />
                    View Reasoning
                    <ChevronDown className={cn("w-4 h-4 ml-1 transition-transform", reasoningOpen && "rotate-180")} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Card className="mt-2 bg-muted/50">
                    <CardContent className="p-3">
                      <pre className="text-xs whitespace-pre-wrap font-mono">{message.reasoning}</pre>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Sources section */}
            {!isUser && showSources && message.sources && message.sources.length > 0 && (
              <Collapsible open={sourcesOpen} onOpenChange={setSourcesOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto">
                    <Search className="w-4 h-4 mr-1" />
                    Sources ({message.sources.length})
                    <ChevronDown className={cn("w-4 h-4 ml-1 transition-transform", sourcesOpen && "rotate-180")} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 space-y-2">
                    {message.sources.map((source, index) => (
                      <Card key={index} className="bg-muted/50">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{source.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1">{source.snippet}</p>
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline mt-1 inline-block"
                              >
                                {source.url}
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </CardContent>
        </Card>

        {/* Message actions */}
        {!isUser && (
          <div className="flex items-center gap-1 px-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                copyToClipboard(
                  typeof message.content === "string"
                    ? message.content
                    : message.content.map((p) => (p.type === "text" ? p.text : "")).join(""),
                )
              }
            >
              <Copy className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleFeedback("positive")}>
              <ThumbsUp className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleFeedback("negative")}>
              <ThumbsDown className="w-3 h-3" />
            </Button>
          </div>
        )}

        {/* Timestamp */}
        <div className={cn("text-xs text-muted-foreground px-2", isUser ? "text-right" : "text-left")}>
          {new Date(message.createdAt || Date.now()).toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
