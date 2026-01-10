import { useAuthStore } from '~/stores/auth'
import type { User, AuthTokens } from '~/types/auth'
import { generatePKCE } from '~/utils/pkce'
import { buildAuthUrl, exchangeCodeForTokens, fetchUserInfo, refreshAccessToken, generateRandomString } from '~/utils/auth'

export const useAuth = () => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  const router = useRouter()

  /**
   * Login - Redirect to SSO
   */
  const login = async (returnUrl?: string) => {
    if (!import.meta.client) return

    // Generate PKCE challenge
    const { codeVerifier, codeChallenge } = generatePKCE()
    
    // Generate state and nonce
    const state = generateRandomString(32)
    const nonce = generateRandomString(32)

    // Store PKCE and state in sessionStorage
    sessionStorage.setItem('pkce_code_verifier', codeVerifier)
    sessionStorage.setItem('oauth_state', state)
    sessionStorage.setItem('oauth_nonce', nonce)
    if (returnUrl) {
      sessionStorage.setItem('return_url', returnUrl)
    }

    // Build authorization URL
    const authUrl = buildAuthUrl({
      baseUrl: config.public.sso.baseUrl,
      clientId: config.public.sso.clientId,
      redirectUri: config.public.sso.redirectUri,
      scopes: config.public.sso.scopes,
      state,
      nonce,
      codeChallenge,
    })

    // Redirect to SSO
    window.location.href = authUrl
  }

  /**
   * Handle OAuth callback
   */
  const handleCallback = async (code: string, state: string) => {
    if (!import.meta.client) return

    // Verify state
    const savedState = sessionStorage.getItem('oauth_state')
    if (state !== savedState) {
      throw new Error('Invalid state parameter')
    }

    // Get PKCE verifier
    const codeVerifier = sessionStorage.getItem('pkce_code_verifier')

    try {
      // Exchange code for tokens via server-side endpoint
      const response = await $fetch<{
        tokens: any
        userInfo: any
      }>('/api/auth/sso/callback', {
        method: 'POST',
        body: {
          code,
          codeVerifier: codeVerifier || undefined,
          redirectUri: config.public.sso.redirectUri,
        },
      })

      const { tokens: tokenResponse, userInfo } = response

      // Sync user to database (create/update with SSO role)
      // This also generates an internal JWT token for FileMan API auth
      const syncResponse = await $fetch<{
        user: any
        syncedRole: string
        internalToken: string
      }>('/api/auth/sso/sync-user', {
        method: 'POST',
        body: { userInfo },
      })

      // Prepare auth data with database user
      const dbUser = syncResponse.user
      const user: User = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        username: dbUser.username,
        employeeId: userInfo.employee_id,
        department: userInfo.department,
        position: userInfo.position,
        avatarUrl: dbUser.avatar,
        roleId: userInfo.role_id,
        roleName: userInfo.role_name,
        role: dbUser.role, // Use role from database (synced from SSO)
        ssoProvider: dbUser.ssoProvider,
      }

      // Use internal JWT token for API auth, but keep SSO tokens for refresh/logout
      const tokens: AuthTokens = {
        accessToken: syncResponse.internalToken, // Use internal token for API calls
        refreshToken: tokenResponse.refresh_token,
        idToken: tokenResponse.id_token,
        expiresAt: Date.now() + tokenResponse.expires_in * 1000,
      }

      // Save to store
      authStore.setAuth(user, tokens)

      // Clean up session storage
      sessionStorage.removeItem('pkce_code_verifier')
      sessionStorage.removeItem('oauth_state')
      sessionStorage.removeItem('oauth_nonce')

      // Redirect to return URL or dashboard
      const returnUrl = sessionStorage.getItem('return_url') || '/dashboard'
      sessionStorage.removeItem('return_url')
      
      await router.push(returnUrl)
    } catch (error) {
      console.error('OAuth callback error:', error)
      throw error
    }
  }

  /**
   * Logout
   */
  const logout = async () => {
    try {
      const idToken = authStore.tokens?.idToken

      // Call logout API to clear server-side cookie
      await $fetch('/api/auth/logout', { method: 'POST' })

      // Clear local auth
      authStore.clearAuth()

      // Redirect to SSO logout if we have id_token
      if (idToken && import.meta.client) {
        const logoutUrl = new URL(`${config.public.sso.baseUrl}/api/oidc/logout`)
        logoutUrl.searchParams.set('id_token_hint', idToken)
        logoutUrl.searchParams.set('post_logout_redirect_uri', window.location.origin)
        
        window.location.href = logoutUrl.toString()
      } else {
        await router.push('/login')
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Force clear even if API fails
      authStore.clearAuth()
      await router.push('/login')
    }
  }

  /**
   * Refresh token
   */
  const refresh = async () => {
    if (!authStore.tokens?.refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await $fetch<{
        tokens: any
      }>('/api/auth/sso/refresh', {
        method: 'POST',
        body: {
          refreshToken: authStore.tokens.refreshToken,
        },
      })

      const { tokens: tokenResponse } = response

      const tokens: AuthTokens = {
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token || authStore.tokens.refreshToken,
        idToken: tokenResponse.id_token || authStore.tokens.idToken,
        expiresAt: Date.now() + tokenResponse.expires_in * 1000,
      }

      authStore.updateTokens(tokens)
    } catch (error) {
      console.error('Token refresh failed:', error)
      // If refresh fails, logout
      await logout()
      throw error
    }
  }

  /**
   * Auto-refresh token if needed
   */
  const ensureValidToken = async () => {
    if (authStore.shouldRefreshToken) {
      await refresh()
    }
  }

  return {
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isLoading: computed(() => authStore.isLoading),
    login,
    logout,
    handleCallback,
    refresh,
    ensureValidToken,
  }
}
