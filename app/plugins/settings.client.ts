/**
 * Plugin to load system settings on app initialization
 */
export default defineNuxtPlugin(async () => {
  const settingsStore = useSettingsStore()
  const authStore = useAuthStore()

  // Only fetch settings if user is authenticated
  if (authStore.isAuthenticated) {
    await settingsStore.fetchSettings()
  }

  // Watch for auth changes to reload settings
  watch(() => authStore.isAuthenticated, async (isAuthenticated) => {
    if (isAuthenticated) {
      // Always reload settings when user logs in
      await settingsStore.fetchSettings()
    }
  })
})
