const API_BASE_URL = import.meta.env.VITE_API_URL || "https://vibes-of-telegram.vercel.app/api"

class APIClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    const token = localStorage.getItem("auth_token")
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Auth endpoints
  async login(initData: string) {
    return this.request("/auth/telegram", {
      method: "POST",
      body: JSON.stringify({ initData }),
    })
  }

  async validateToken(token: string) {
    return this.request("/auth/validate", {
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  async updateUser(updates: any, token: string) {
    return this.request("/user/update", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(updates),
    })
  }

  // Vibe endpoints
  async detectVibe(input: string, language = "en") {
    return this.request("/vibe/detect", {
      method: "POST",
      body: JSON.stringify({ input, language }),
    })
  }

  async getVibeHistory() {
    return this.request("/vibe/history")
  }

  // Mood board endpoints
  async generateMoodBoard(vibeId: string, customElements: any[] = []) {
    return this.request("/moodboard/generate", {
      method: "POST",
      body: JSON.stringify({ vibeId, customElements }),
    })
  }

  async getMoodBoards() {
    return this.request("/moodboard/list")
  }

  async deleteMoodBoard(id: string) {
    return this.request(`/moodboard/${id}`, {
      method: "DELETE",
    })
  }

  // Security endpoints
  async validateSecurity(code: string) {
    return this.request("/security/validate", {
      method: "POST",
      body: JSON.stringify({ code }),
    })
  }

  // Payment endpoints
  async createPayment(amount: number, currency: string, paymentMethod: string) {
    return this.request("/payment/create", {
      method: "POST",
      body: JSON.stringify({ amount, currency, paymentMethod }),
    })
  }

  async getPaymentHistory() {
    return this.request("/payment/history")
  }

  // Notification endpoints
  async sendNotification(message: string, type = "info") {
    return this.request("/notifications/send", {
      method: "POST",
      body: JSON.stringify({ message, type }),
    })
  }

  async updateNotificationSettings(settings: any) {
    return this.request("/notifications/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    })
  }
}

export const api = new APIClient(API_BASE_URL)

// Specific API modules
export const authAPI = {
  login: (initData: string) => api.login(initData),
  validateToken: (token: string) => api.validateToken(token),
  updateUser: (updates: any, token: string) => api.updateUser(updates, token),
}

export const vibeAPI = {
  detect: (input: string, language?: string) => api.detectVibe(input, language),
  getHistory: () => api.getVibeHistory(),
}

export const moodBoardAPI = {
  generate: (vibeId: string, customElements?: any[]) => api.generateMoodBoard(vibeId, customElements),
  list: () => api.getMoodBoards(),
  delete: (id: string) => api.deleteMoodBoard(id),
}

export const securityAPI = {
  validate: (code: string) => api.validateSecurity(code),
}

export const paymentAPI = {
  create: (amount: number, currency: string, paymentMethod: string) =>
    api.createPayment(amount, currency, paymentMethod),
  getHistory: () => api.getPaymentHistory(),
}

export const notificationAPI = {
  send: (message: string, type?: string) => api.sendNotification(message, type),
  updateSettings: (settings: any) => api.updateNotificationSettings(settings),
}
