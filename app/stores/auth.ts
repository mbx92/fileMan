import { defineStore } from 'pinia'
import type { User, AuthTokens, AuthState } from '~/types/auth'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    tokens: null,
    isLoading: false,
    isAuthenticated: false,
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'ADMIN' || state.user?.role === 'SUPERADMIN',
    isSuperAdmin: (state) => state.user?.role === 'SUPERADMIN',
    isTokenExpired: (state) => {
      if (!state.tokens) return true
      return Date.now() >= state.tokens.expiresAt
    },
    shouldRefreshToken: (state) => {
      if (!state.tokens) return false
      // Refresh 5 minutes before expiry
      return Date.now() >= state.tokens.expiresAt - 5 * 60 * 1000
    },
  },

  actions: {
    /**
     * Initialize auth state from localStorage or server
     */
    async init() {
      try {
        this.isLoading = true
        
        // First try to restore from localStorage
        this.restoreAuth()
        
        // If we have tokens, try to get fresh user data from server
        if (this.isAuthenticated && !this.isTokenExpired) {
          try {
            const { data } = await useFetch('/api/auth/me')
            if (data.value?.user) {
              this.user = data.value.user as User
              this.isAuthenticated = true
            }
          } catch {
            // If server request fails but we have local data, keep it
            console.warn('Could not fetch user from server, using cached data')
          }
        }
      } catch {
        this.user = null
        this.isAuthenticated = false
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Set authentication data (for SSO flow)
     */
    setAuth(user: User, tokens: AuthTokens) {
      this.user = user
      this.tokens = tokens
      this.isAuthenticated = true

      // Save to localStorage for persistence
      if (import.meta.client) {
        localStorage.setItem('auth_user', JSON.stringify(user))
        localStorage.setItem('auth_tokens', JSON.stringify(tokens))
      }
    },

    /**
     * Clear authentication data
     */
    clearAuth() {
      this.user = null
      this.tokens = null
      this.isAuthenticated = false

      if (import.meta.client) {
        localStorage.removeItem('auth_user')
        localStorage.removeItem('auth_tokens')
      }
    },

    /**
     * Restore auth from localStorage
     */
    restoreAuth() {
      if (!import.meta.client) return

      try {
        const userStr = localStorage.getItem('auth_user')
        const tokensStr = localStorage.getItem('auth_tokens')

        if (userStr && tokensStr) {
          this.user = JSON.parse(userStr)
          this.tokens = JSON.parse(tokensStr)
          this.isAuthenticated = true

          // Check if token is expired
          if (this.isTokenExpired) {
            this.clearAuth()
          }
        }
      } catch (error) {
        console.error('Failed to restore auth:', error)
        this.clearAuth()
      }
    },

    /**
     * Update user data
     */
    updateUser(user: Partial<User>) {
      if (this.user) {
        this.user = { ...this.user, ...user }
        if (import.meta.client) {
          localStorage.setItem('auth_user', JSON.stringify(this.user))
        }
      }
    },

    /**
     * Update tokens
     */
    updateTokens(tokens: AuthTokens) {
      this.tokens = tokens
      if (import.meta.client) {
        localStorage.setItem('auth_tokens', JSON.stringify(tokens))
      }
    },

    /**
     * Legacy login method (fallback for local auth)
     */
    async login(email: string, password: string) {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      
      this.user = response.user as User
      this.isAuthenticated = true
      
      // Save to localStorage for persistence
      if (import.meta.client && response.token) {
        const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
        this.tokens = { accessToken: response.token, expiresAt }
        localStorage.setItem('auth_user', JSON.stringify(response.user))
        localStorage.setItem('auth_tokens', JSON.stringify(this.tokens))
      }
      
      return response
    },

    /**
     * Legacy register method (fallback for local auth)
     */
    async register(data: { email: string; username: string; password: string; name?: string }) {
      const response = await $fetch('/api/auth/register', {
        method: 'POST',
        body: data,
      })
      
      this.user = response.user as User
      this.isAuthenticated = true
      return response
    },

    /**
     * Logout
     */
    async logout() {
      await $fetch('/api/auth/logout', { method: 'POST' })
      this.clearAuth()
      navigateTo('/login')
    },

    /**
     * Set user (legacy compatibility)
     */
    setUser(user: User | null) {
      this.user = user
      this.isAuthenticated = !!user
    },
  },
})
