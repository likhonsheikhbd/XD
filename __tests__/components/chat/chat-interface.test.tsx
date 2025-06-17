import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChatInterface } from '@/components/chat/chat-interface'

// Mock the useChat hook
const mockUseChat = {
  messages: [],
  input: '',
  handleInputChange: jest.fn(),
  handleSubmit: jest.fn(),
  isLoading: false,
  error: null,
  reload: jest.fn(),
  stop: jest.fn(),
  setMessages: jest.fn(),
}

jest.mock('ai/react', () => ({
  useChat: () => mockUseChat,
}))

describe('ChatInterface', () => {
  const mockProps = {
    onCodeGenerated: jest.fn(),
    currentFiles: {
      'index.html': '<html><body>Test</body></html>',
    },
    activeFile: 'index.html',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders chat interface with welcome message', () => {
    render(<ChatInterface {...mockProps} />)
    
    expect(screen.getByText('Welcome to AI Coding Assistant')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/ask me to generate/i)).toBeInTheDocument()
  })

  it('displays loading state when AI is processing', () => {
    mockUseChat.isLoading = true
    
    render(<ChatInterface {...mockProps} />)
    
    expect(screen.getByText('AI is thinking...')).toBeInTheDocument()
  })

  it('handles input change', () => {
    render(<ChatInterface {...mockProps} />)
    
    const input = screen.getByPlaceholderText(/ask me to generate/i)
    fireEvent.change(input, { target: { value: 'Create a button component' } })
    
    expect(mockUseChat.handleInputChange).toHaveBeenCalled()
  })

  it('submits form when enter is pressed', () => {
    render(<ChatInterface {...mockProps} />)
    
    const input = screen.getByPlaceholderText(/ask me to generate/i)
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    
    expect(mockUseChat.handleSubmit).toHaveBeenCalled()
  })

  it('displays error message when there is an error', () => {
    mockUseChat.error = new Error('Test error')
    
    render(<ChatInterface {...mockProps} />)
    
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })

  it('shows retry button when there is an error', () => {
    mockUseChat.error = new Error('Test error')
    
    render(<ChatInterface {...mockProps} />)
    
    const retryButton = screen.getByText('Retry')
    expect(retryButton).toBeInTheDocument()
    
    fireEvent.click(retryButton)
    expect(mockUseChat.reload).toHaveBeenCalled()
  })

  it('clears chat when clear button is clicked', () => {
    mockUseChat.messages = [
      { id: '1', role: 'user', content: 'Test message', timestamp: new Date() }
    ]
    
    render(<ChatInterface {...mockProps} />)
    
    const clearButton = screen.getByText('Clear')
    fireEvent.click(clearButton)
    
    expect(mockUseChat.setMessages).toHaveBeenCalledWith([])
  })
})