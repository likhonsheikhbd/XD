import '@testing-library/jest-dom'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme() {
    return {
      theme: 'light',
      setTheme: jest.fn(),
      resolvedTheme: 'light',
    }
  },
  ThemeProvider: ({ children }) => children,
}))

// Mock Zustand stores
jest.mock('@/lib/store', () => ({
  useAssistantStore: () => ({
    files: {
      'index.html': '<html><body>Test</body></html>',
      'style.css': 'body { margin: 0; }',
    },
    activeFile: 'index.html',
    updateFile: jest.fn(),
    addFile: jest.fn(),
    deleteFile: jest.fn(),
    setActiveFile: jest.fn(),
    preferences: {
      theme: 'light',
      fontSize: 14,
      tabSize: 2,
      wordWrap: true,
      minimap: false,
      autoSave: true,
      keyBindings: 'default',
      language: 'en',
    },
    updatePreferences: jest.fn(),
    getEditorContext: jest.fn(),
  }),
}))

jest.mock('@/lib/chat-store', () => ({
  useChatStore: () => ({
    conversations: {},
    activeConversationId: 'test-id',
    isLoading: false,
    messages: [],
    createConversation: jest.fn(),
    deleteConversation: jest.fn(),
    setActiveConversation: jest.fn(),
    addMessage: jest.fn(),
    updateMessage: jest.fn(),
    clearConversation: jest.fn(),
    setLoading: jest.fn(),
    getActiveConversation: jest.fn(),
  }),
}))

// Mock AI SDK
jest.mock('ai/react', () => ({
  useChat: () => ({
    messages: [],
    input: '',
    handleInputChange: jest.fn(),
    handleSubmit: jest.fn(),
    isLoading: false,
    error: null,
    reload: jest.fn(),
    stop: jest.fn(),
    append: jest.fn(),
    setMessages: jest.fn(),
  }),
}))

// Mock react-hotkeys-hook
jest.mock('react-hotkeys-hook', () => ({
  useHotkeys: jest.fn(),
}))

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
  Toaster: () => null,
}))

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
    readText: jest.fn(() => Promise.resolve('')),
  },
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})