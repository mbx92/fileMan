<script setup lang="ts">
definePageMeta({
  layout: false,
})

const route = useRoute()
const { handleCallback } = useAuth()
const message = ref('Memproses login...')
const isError = ref(false)

onMounted(async () => {
  const code = route.query.code as string
  const state = route.query.state as string
  const error = route.query.error as string

  if (error) {
    message.value = 'Login gagal: ' + (route.query.error_description || error)
    isError.value = true
    setTimeout(() => {
      navigateTo('/login')
    }, 3000)
    return
  }

  if (!code || !state) {
    message.value = 'Invalid callback parameters'
    isError.value = true
    setTimeout(() => {
      navigateTo('/login')
    }, 2000)
    return
  }

  try {
    await handleCallback(code, state)
    message.value = 'Login berhasil! Redirecting...'
  } catch (err: any) {
    console.error('Callback error:', err)
    const errorMsg = err.data?.message || err.message || 'Unknown error'
    message.value = 'Login gagal: ' + errorMsg
    isError.value = true
    
    // Log detailed error for debugging
    console.error('SSO Error Details:', {
      status: err.statusCode,
      message: err.data?.message,
      description: err.data?.error_description,
      error: err.data?.error,
    })
    
    setTimeout(() => {
      navigateTo('/login')
    }, 5000) // Increased timeout for reading error
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-3xl" />
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl" />
    </div>

    <div class="relative text-center">
      <UCard class="backdrop-blur-xl bg-white/80 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 shadow-xl p-8">
        <!-- Loading Spinner -->
        <div v-if="!isError" class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
        </div>

        <!-- Error Icon -->
        <div v-else class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
          <UIcon name="i-heroicons-x-circle" class="w-8 h-8 text-red-500" />
        </div>

        <h1 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {{ isError ? 'Authentication Failed' : 'Authenticating...' }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400">{{ message }}</p>

        <div v-if="isError" class="mt-6">
          <UButton
            to="/login"
            variant="outline"
          >
            <template #leading>
              <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
            </template>
            Back to Login
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>
