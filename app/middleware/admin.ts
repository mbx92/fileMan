/**
 * Admin-only route middleware
 * Restricts access to pages only for ADMIN and SUPERADMIN roles
 */
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  if (!authStore.isAdmin) {
    // Redirect regular users to dashboard
    return navigateTo('/dashboard')
  }
})
