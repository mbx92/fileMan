/**
 * Composable for authenticated API calls
 * Automatically includes auth token in headers
 * Also sends cookies for fallback authentication
 */
export const useAuthFetch = () => {
  const authStore = useAuthStore()

  return {
    /**
     * Make an authenticated $fetch request
     * Uses Authorization header as primary auth method
     * Cookie (auth_token) is automatically sent as fallback
     */
    authFetch: <T = any>(url: string, options: any = {}) => {
      const token = authStore.tokens?.accessToken
      
      return $fetch<T>(url, {
        ...options,
        credentials: 'include', // Ensure cookies are sent for fallback auth
        headers: {
          ...options.headers,
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })
    },
  }
}
