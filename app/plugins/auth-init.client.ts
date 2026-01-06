export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  // Restore auth on app init (client-side only)
  authStore.restoreAuth()
})
