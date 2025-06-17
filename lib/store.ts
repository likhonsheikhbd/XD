import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { EditorContext, UserPreferences, SandpackFiles } from './types'

interface AssistantState {
  // Files
  files: Record<string, string>
  activeFile: string
  
  // User preferences
  preferences: UserPreferences
  
  // Actions
  updateFile: (filename: string, content: string) => void
  addFile: (filename: string, content?: string) => void
  deleteFile: (filename: string) => void
  renameFile: (oldName: string, newName: string) => void
  setActiveFile: (filename: string) => void
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  getEditorContext: (currentFile: string) => EditorContext
}

export const useAssistantStore = create<AssistantState>()(
  persist(
    (set, get) => ({
      files: {
        'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>Welcome to your coding assistant!</p>
</body>
</html>`,
        'style.css': `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

h1 {
    color: #333;
    text-align: center;
}

p {
    color: #666;
    text-align: center;
    font-size: 18px;
}`,
        'script.js': `console.log('Hello, World!');

// Add your JavaScript code here
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded successfully!');
});`,
      },
      activeFile: 'index.html',
      
      preferences: {
        theme: 'system',
        fontSize: 14,
        tabSize: 2,
        wordWrap: true,
        minimap: false,
        autoSave: true,
        keyBindings: 'default',
        language: 'en',
      },

      updateFile: (filename, content) =>
        set((state) => ({
          files: { ...state.files, [filename]: content },
        })),

      addFile: (filename, content = '') =>
        set((state) => ({
          files: { ...state.files, [filename]: content },
        })),

      deleteFile: (filename) =>
        set((state) => {
          const { [filename]: deleted, ...rest } = state.files
          const newActiveFile = state.activeFile === filename 
            ? Object.keys(rest)[0] || 'index.html'
            : state.activeFile
          
          return {
            files: rest,
            activeFile: newActiveFile,
          }
        }),

      renameFile: (oldName, newName) =>
        set((state) => {
          const { [oldName]: content, ...rest } = state.files
          return {
            files: { ...rest, [newName]: content },
            activeFile: state.activeFile === oldName ? newName : state.activeFile,
          }
        }),

      setActiveFile: (filename) =>
        set({ activeFile: filename }),

      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),

      getEditorContext: (currentFile) => {
        const state = get()
        return {
          currentFile,
          cursorPosition: 0, // This would be updated by the editor
          files: Object.entries(state.files).reduce((acc, [filename, content]) => {
            acc[filename] = { code: content }
            return acc
          }, {} as SandpackFiles),
          language: getLanguageFromFilename(currentFile),
        }
      },
    }),
    {
      name: 'assistant-storage',
      partialize: (state) => ({
        files: state.files,
        activeFile: state.activeFile,
        preferences: state.preferences,
      }),
    }
  )
)

function getLanguageFromFilename(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase()
  
  const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    java: 'java',
    cs: 'csharp',
    cpp: 'cpp',
    c: 'c',
    go: 'go',
    rs: 'rust',
    php: 'php',
    rb: 'ruby',
    swift: 'swift',
    kt: 'kotlin',
    html: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'sass',
    sql: 'sql',
    sh: 'shell',
    json: 'json',
    yaml: 'yaml',
    yml: 'yaml',
    xml: 'xml',
    md: 'markdown',
  }
  
  return languageMap[extension || ''] || 'text'
}