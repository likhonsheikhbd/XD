'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Terminal, X, Trash2, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TerminalOutput {
  id: string
  type: 'command' | 'output' | 'error'
  content: string
  timestamp: Date
}

export function TerminalPanel() {
  const [output, setOutput] = useState<TerminalOutput[]>([
    {
      id: '1',
      type: 'output',
      content: 'Welcome to AI Coding Assistant Terminal',
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'output',
      content: 'Type "help" for available commands',
      timestamp: new Date(),
    },
  ])
  const [currentCommand, setCurrentCommand] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [output])

  // Focus input when terminal is opened
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const addOutput = (content: string, type: TerminalOutput['type'] = 'output') => {
    const newOutput: TerminalOutput = {
      id: crypto.randomUUID(),
      type,
      content,
      timestamp: new Date(),
    }
    setOutput(prev => [...prev, newOutput])
  }

  const executeCommand = async (command: string) => {
    if (!command.trim()) return

    // Add command to output
    addOutput(`$ ${command}`, 'command')

    // Add to history
    setCommandHistory(prev => [...prev, command])
    setHistoryIndex(-1)

    // Process command
    const cmd = command.trim().toLowerCase()
    
    try {
      switch (cmd) {
        case 'help':
          addOutput('Available commands:')
          addOutput('  help     - Show this help message')
          addOutput('  clear    - Clear terminal output')
          addOutput('  ls       - List files')
          addOutput('  pwd      - Show current directory')
          addOutput('  date     - Show current date and time')
          addOutput('  echo     - Echo text')
          break

        case 'clear':
          setOutput([])
          break

        case 'ls':
          addOutput('index.html  style.css  script.js')
          break

        case 'pwd':
          addOutput('/workspace')
          break

        case 'date':
          addOutput(new Date().toString())
          break

        default:
          if (cmd.startsWith('echo ')) {
            const text = command.slice(5)
            addOutput(text)
          } else {
            addOutput(`Command not found: ${command}`, 'error')
            addOutput('Type "help" for available commands', 'error')
          }
      }
    } catch (error) {
      addOutput(`Error executing command: ${error}`, 'error')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeCommand(currentCommand)
    setCurrentCommand('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCurrentCommand('')
      }
    }
  }

  const clearTerminal = () => {
    setOutput([])
  }

  const copyOutput = () => {
    const text = output.map(item => {
      const prefix = item.type === 'command' ? '' : item.type === 'error' ? '[ERROR] ' : ''
      return `${prefix}${item.content}`
    }).join('\n')
    
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="h-full flex flex-col bg-black text-green-400 font-mono text-sm">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-900 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            <span className="font-semibold">Terminal</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyOutput}
              className="h-7 w-7 p-0 text-gray-400 hover:text-white"
            >
              <Copy className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={clearTerminal}
              className="h-7 w-7 p-0 text-gray-400 hover:text-white"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Output */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-1">
          {output.map((item) => (
            <div
              key={item.id}
              className={cn(
                "whitespace-pre-wrap break-words",
                item.type === 'command' && "text-yellow-400",
                item.type === 'error' && "text-red-400",
                item.type === 'output' && "text-green-400"
              )}
            >
              {item.content}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-gray-700 p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-yellow-400">$</span>
          <Input
            ref={inputRef}
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter command..."
            className="flex-1 bg-transparent border-none text-green-400 placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </form>
      </div>
    </div>
  )
}