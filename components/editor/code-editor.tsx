'use client'

import { useEffect, useRef, useState } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState, Extension } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { python } from '@codemirror/lang-python'
import { json } from '@codemirror/lang-json'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'
import { autocompletion, completionKeymap } from '@codemirror/autocomplete'
import { searchKeymap } from '@codemirror/search'
import { historyKeymap } from '@codemirror/commands'
import { keymap } from '@codemirror/view'
import { useTheme } from 'next-themes'
import { useAssistantStore } from '@/lib/store'
import { useDebounce } from 'use-debounce'
import { EditorTabs } from './editor-tabs'
import { EditorStatusBar } from './editor-status-bar'
import { cn } from '@/lib/utils'

interface CodeEditorProps {
  files: Record<string, string>
  activeFile: string
  onFileChange: (filename: string, content: string) => void
  onFileSelect: (filename: string) => void
}

export function CodeEditor({ files, activeFile, onFileChange, onFileSelect }: CodeEditorProps) {
  const { theme } = useTheme()
  const { preferences } = useAssistantStore()
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })
  const [selectedText, setSelectedText] = useState('')
  
  const currentContent = files[activeFile] || ''
  const [debouncedContent] = useDebounce(currentContent, 300)

  // Get language extension based on file extension
  const getLanguageExtension = (filename: string): Extension => {
    const ext = filename.split('.').pop()?.toLowerCase()
    
    switch (ext) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return javascript({ jsx: true, typescript: ext.includes('ts') })
      case 'html':
      case 'htm':
        return html()
      case 'css':
      case 'scss':
      case 'sass':
        return css()
      case 'py':
        return python()
      case 'json':
        return json()
      case 'md':
      case 'markdown':
        return markdown()
      default:
        return javascript()
    }
  }

  // Create editor extensions
  const createExtensions = (): Extension[] => {
    const extensions = [
      basicSetup,
      getLanguageExtension(activeFile),
      autocompletion(),
      keymap.of([
        ...completionKeymap,
        ...searchKeymap,
        ...historyKeymap,
      ]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const content = update.state.doc.toString()
          onFileChange(activeFile, content)
        }
        
        if (update.selectionSet) {
          const selection = update.state.selection.main
          const line = update.state.doc.lineAt(selection.head)
          setCursorPosition({
            line: line.number,
            column: selection.head - line.from + 1,
          })
          
          const selectedText = update.state.sliceDoc(selection.from, selection.to)
          setSelectedText(selectedText)
        }
      }),
      EditorView.theme({
        '&': {
          fontSize: `${preferences.fontSize}px`,
          fontFamily: 'var(--font-mono)',
        },
        '.cm-content': {
          padding: '16px',
          minHeight: '100%',
        },
        '.cm-focused': {
          outline: 'none',
        },
        '.cm-editor': {
          height: '100%',
        },
        '.cm-scroller': {
          fontFamily: 'var(--font-mono)',
        },
      }),
    ]

    if (theme === 'dark') {
      extensions.push(oneDark)
    }

    return extensions
  }

  // Initialize editor
  useEffect(() => {
    if (!editorRef.current) return

    const state = EditorState.create({
      doc: currentContent,
      extensions: createExtensions(),
    })

    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, [activeFile, theme, preferences.fontSize])

  // Update editor content when file changes
  useEffect(() => {
    if (viewRef.current && viewRef.current.state.doc.toString() !== currentContent) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: currentContent,
        },
      })
    }
  }, [currentContent])

  return (
    <div className="h-full flex flex-col bg-background">
      <EditorTabs
        files={Object.keys(files)}
        activeFile={activeFile}
        onFileSelect={onFileSelect}
        onFileClose={(filename) => {
          // Handle file close
          console.log('Close file:', filename)
        }}
      />
      
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={editorRef}
          className={cn(
            "h-full w-full",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          )}
        />
      </div>
      
      <EditorStatusBar
        filename={activeFile}
        language={getLanguageFromFilename(activeFile)}
        cursorPosition={cursorPosition}
        selectedText={selectedText}
        encoding="UTF-8"
        lineEnding="LF"
      />
    </div>
  )
}

function getLanguageFromFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  
  const languageMap: Record<string, string> = {
    js: 'JavaScript',
    jsx: 'JavaScript React',
    ts: 'TypeScript',
    tsx: 'TypeScript React',
    py: 'Python',
    java: 'Java',
    cs: 'C#',
    cpp: 'C++',
    c: 'C',
    go: 'Go',
    rs: 'Rust',
    php: 'PHP',
    rb: 'Ruby',
    swift: 'Swift',
    kt: 'Kotlin',
    html: 'HTML',
    css: 'CSS',
    scss: 'SCSS',
    sass: 'Sass',
    sql: 'SQL',
    sh: 'Shell',
    json: 'JSON',
    yaml: 'YAML',
    yml: 'YAML',
    xml: 'XML',
    md: 'Markdown',
  }
  
  return languageMap[ext || ''] || 'Plain Text'
}