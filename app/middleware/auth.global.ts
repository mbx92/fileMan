export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware on server-side
  if (import.meta.server) return

  const authStore = useAuthStore()
  const { ensureValidToken } = useAuth()

  // Restore auth from localStorage on first load
  if (!authStore.isAuthenticated && !authStore.user) {
    authStore.restoreAuth()
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/auth/callback']
  const isPublicRoute = publicRoutes.some(route => to.path.startsWith(route))

  // Handle root path - redirect based on auth status
  if (to.path === '/') {
    if (authStore.isAuthenticated) {
      return navigateTo('/dashboard')
    } else {
      return navigateTo('/login')
    }
  }

  if (!isPublicRoute) {
    // Protected route - require authentication
    if (!authStore.isAuthenticated) {
      return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
    }

    // Ensure token is valid (auto-refresh if needed)
    try {
      await ensureValidToken()
    } catch (error) {
      console.error('Token validation failed:', error)
      return navigateTo('/login')
    }
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    // Already authenticated, redirect to dashboard
    return navigateTo('/dashboard')
  }
})
