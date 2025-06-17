'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface EditorStatusBarProps {
  filename: string
  language: string
  cursorPosition: { line: number; column: number }
  selectedText: string
  encoding: string
  lineEnding: string
}

export function EditorStatusBar({
  filename,
  language,
  cursorPosition,
  selectedText,
  encoding,
  lineEnding,
}: EditorStatusBarProps) {
  return (
    <div className="border-t bg-muted/30 px-3 py-1 flex items-center justify-between text-xs">
      <div className="flex items-center gap-3">
        <span className="font-medium">{filename}</span>
        <Separator orientation="vertical" className="h-4" />
        <Badge variant="outline" className="text-xs">
          {language}
        </Badge>
      </div>
      
      <div className="flex items-center gap-3">
        {selectedText && (
          <>
            <span>
              {selectedText.length} character{selectedText.length !== 1 ? 's' : ''} selected
            </span>
            <Separator orientation="vertical" className="h-4" />
          </>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 text-xs hover:bg-transparent"
        >
          Ln {cursorPosition.line}, Col {cursorPosition.column}
        </Button>
        
        <Separator orientation="vertical" className="h-4" />
        
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 text-xs hover:bg-transparent"
        >
          {encoding}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 text-xs hover:bg-transparent"
        >
          {lineEnding}
        </Button>
      </div>
    </div>
  )
}