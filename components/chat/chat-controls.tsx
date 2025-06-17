"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RotateCcw, Square, Trash2 } from "lucide-react"

interface ChatControlsProps {
  onClear: () => void
  onReload: () => void
  onStop: () => void
  isLoading: boolean
}

export function ChatControls({ onClear, onReload, onStop, isLoading }: ChatControlsProps) {
  return (
    <Card className="m-4 mb-0">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onReload} disabled={isLoading}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Regenerate
            </Button>

            {isLoading && (
              <Button variant="outline" size="sm" onClick={onStop}>
                <Square className="h-4 w-4 mr-1" />
                Stop
              </Button>
            )}
          </div>

          <Button variant="outline" size="sm" onClick={onClear}>
            <Trash2 className="h-4 w-4 mr-1" />
            Clear Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
