export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  const { refresh } = useAuth()

  const api = $fetch.create({
    baseURL: '/api',
    
    async onRequest({ options }) {
      // Add Authorization header with JWT
      const token = authStore.tokens?.accessToken
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        } as HeadersInit
      }
    },

    async onResponseError({ response }) {
      // Auto-refresh on 401
      if (response.status === 401) {
        try {
          await refresh()
          // Note: The request will need to be retried manually by the caller
        } catch (error) {
          console.error('Auto-refresh failed:', error)
        }
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})
