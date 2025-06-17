import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChatMessage, ConversationHistory } from './types'

interface ChatState {
  conversations: Record<string, ConversationHistory>
  activeConversationId: string
  isLoading: boolean
  
  // Actions
  createConversation: (title?: string) => string
  deleteConversation: (id: string) => void
  setActiveConversation: (id: string) => void
  addMessage: (conversationId: string, message: ChatMessage) => void
  updateMessage: (conversationId: string, messageId: string, updates: Partial<ChatMessage>) => void
  clearConversation: (conversationId: string) => void
  setLoading: (loading: boolean) => void
  
  // Getters
  getActiveConversation: () => ConversationHistory | undefined
  messages: ChatMessage[]
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: {},
      activeConversationId: '',
      isLoading: false,
      messages: [],

      createConversation: (title = 'New Conversation') => {
        const id = crypto.randomUUID()
        const conversation: ConversationHistory = {
          id,
          title,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        
        set((state) => ({
          conversations: { ...state.conversations, [id]: conversation },
          activeConversationId: id,
          messages: [],
        }))
        
        return id
      },

      deleteConversation: (id) =>
        set((state) => {
          const { [id]: deleted, ...rest } = state.conversations
          const newActiveId = state.activeConversationId === id 
            ? Object.keys(rest)[0] || ''
            : state.activeConversationId
          
          return {
            conversations: rest,
            activeConversationId: newActiveId,
            messages: newActiveId ? rest[newActiveId]?.messages || [] : [],
          }
        }),

      setActiveConversation: (id) =>
        set((state) => ({
          activeConversationId: id,
          messages: state.conversations[id]?.messages || [],
        })),

      addMessage: (conversationId, message) =>
        set((state) => {
          const conversation = state.conversations[conversationId]
          if (!conversation) return state

          const updatedConversation = {
            ...conversation,
            messages: [...conversation.messages, message],
            updatedAt: new Date(),
          }

          return {
            conversations: {
              ...state.conversations,
              [conversationId]: updatedConversation,
            },
            messages: conversationId === state.activeConversationId 
              ? updatedConversation.messages 
              : state.messages,
          }
        }),

      updateMessage: (conversationId, messageId, updates) =>
        set((state) => {
          const conversation = state.conversations[conversationId]
          if (!conversation) return state

          const updatedMessages = conversation.messages.map(msg =>
            msg.id === messageId ? { ...msg, ...updates } : msg
          )

          const updatedConversation = {
            ...conversation,
            messages: updatedMessages,
            updatedAt: new Date(),
          }

          return {
            conversations: {
              ...state.conversations,
              [conversationId]: updatedConversation,
            },
            messages: conversationId === state.activeConversationId 
              ? updatedMessages 
              : state.messages,
          }
        }),

      clearConversation: (conversationId) =>
        set((state) => {
          const conversation = state.conversations[conversationId]
          if (!conversation) return state

          const updatedConversation = {
            ...conversation,
            messages: [],
            updatedAt: new Date(),
          }

          return {
            conversations: {
              ...state.conversations,
              [conversationId]: updatedConversation,
            },
            messages: conversationId === state.activeConversationId ? [] : state.messages,
          }
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      getActiveConversation: () => {
        const state = get()
        return state.conversations[state.activeConversationId]
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
      }),
    }
  )
)

// Initialize with a default conversation if none exists
const store = useChatStore.getState()
if (Object.keys(store.conversations).length === 0) {
  store.createConversation('Welcome Chat')
}