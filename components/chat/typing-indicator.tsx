"use client"

import { Card, CardContent } from "@/components/ui/card"

export function TypingIndicator() {
  return (
    <div className="flex gap-3 max-w-4xl mr-auto">
      <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-medium">
        AI
      </div>

      <Card className="bg-muted max-w-[80%]">
        <CardContent className="p-4">
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" />
            </div>
            <span className="text-sm text-muted-foreground ml-2">AI is thinking...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
