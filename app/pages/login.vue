<script setup lang="ts">
definePageMeta({
  layout: false,
})

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()
const { login } = useAuth()

// Redirect if already authenticated
onMounted(async () => {
  await authStore.init()
  if (authStore.isAuthenticated) {
    router.replace('/dashboard')
  }
})

const isLoading = ref(false)
const isRegisterMode = ref(false)

const loginForm = reactive({
  email: '',
  password: '',
})

// Dev mode check
const isDev = import.meta.dev

// Fill dev credentials
function fillDevCredentials() {
  loginForm.email = 'superadmin@fileman.id'
  loginForm.password = 'Admin123!'
}

const registerForm = reactive({
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  name: '',
})

// SSO Login
async function handleSSOLogin() {
  try {
    isLoading.value = true
    const redirect = route.query.redirect as string
    await login(redirect)
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: 'Failed to redirect to SSO',
      color: 'error',
    })
    isLoading.value = false
  }
}

async function handleLogin() {
  if (!loginForm.email || !loginForm.password) {
    toast.add({
      title: 'Error',
      description: 'Please fill in all fields',
      color: 'error',
    })
    return
  }

  try {
    isLoading.value = true
    await authStore.login(loginForm.email, loginForm.password)
    toast.add({
      title: 'Success',
      description: 'Login successful',
      color: 'success',
    })
    router.push('/dashboard')
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Login failed',
      color: 'error',
    })
  } finally {
    isLoading.value = false
  }
}

async function handleRegister() {
  if (!registerForm.email || !registerForm.username || !registerForm.password) {
    toast.add({
      title: 'Error',
      description: 'Please fill in all required fields',
      color: 'error',
    })
    return
  }

  if (registerForm.password !== registerForm.confirmPassword) {
    toast.add({
      title: 'Error',
      description: 'Passwords do not match',
      color: 'error',
    })
    return
  }

  if (registerForm.password.length < 8) {
    toast.add({
      title: 'Error',
      description: 'Password must be at least 8 characters',
      color: 'error',
    })
    return
  }

  try {
    isLoading.value = true
    await authStore.register({
      email: registerForm.email,
      username: registerForm.username,
      password: registerForm.password,
      name: registerForm.name || undefined,
    })
    toast.add({
      title: 'Success',
      description: 'Account created successfully',
      color: 'success',
    })
    router.push('/dashboard')
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Registration failed',
      color: 'error',
    })
  } finally {
    isLoading.value = false
  }
}

function toggleMode() {
  isRegisterMode.value = !isRegisterMode.value
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 transition-colors duration-200">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-3xl" />
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl" />
    </div>

    <div class="relative w-full max-w-md">
      <!-- Logo and Title -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/20 mb-4">
          <UIcon name="i-heroicons-folder" class="w-8 h-8 text-primary-500 dark:text-primary-400" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">FileMan</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-2">Internal File Sharing System</p>
      </div>

      <!-- Auth Card -->
      <UCard class="backdrop-blur-xl bg-white/80 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 shadow-xl">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon
              :name="isRegisterMode ? 'i-heroicons-user-plus' : 'i-heroicons-arrow-right-end-on-rectangle'"
              class="w-5 h-5 text-primary-500 dark:text-primary-400"
            />
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ isRegisterMode ? 'Create Account' : 'Sign In' }}
            </h2>
          </div>
        </template>

        <!-- Login Form -->
        <form v-if="!isRegisterMode" @submit.prevent="handleLogin" class="space-y-4">
          <UFormField label="Email" required>
            <UInput
              v-model="loginForm.email"
              type="email"
              placeholder="you@company.com"
              icon="i-heroicons-envelope"
              autocomplete="email"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Password" required>
            <UInput
              v-model="loginForm.password"
              type="password"
              placeholder="••••••••"
              icon="i-heroicons-lock-closed"
              autocomplete="current-password"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UButton
            type="submit"
            block
            size="lg"
            :loading="isLoading"
            :disabled="isLoading"
          >
            Sign In
          </UButton>

          <!-- Dev Credentials Button (only in dev mode) -->
          <UButton
            v-if="isDev"
            type="button"
            block
            size="lg"
            variant="soft"
            color="neutral"
            class="mt-2"
            @click="fillDevCredentials"
          >
            <template #leading>
              <UIcon name="i-heroicons-code-bracket" class="w-5 h-5" />
            </template>
            Fill Dev Credentials
          </UButton>
        </form>

        <!-- Register Form -->
        <form v-else @submit.prevent="handleRegister" class="space-y-4">
          <UFormField label="Email" required>
            <UInput
              v-model="registerForm.email"
              type="email"
              placeholder="you@company.com"
              icon="i-heroicons-envelope"
              autocomplete="email"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Username" required>
            <UInput
              v-model="registerForm.username"
              type="text"
              placeholder="johndoe"
              icon="i-heroicons-at-symbol"
              autocomplete="username"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Full Name">
            <UInput
              v-model="registerForm.name"
              type="text"
              placeholder="John Doe"
              icon="i-heroicons-user"
              autocomplete="name"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Password" required>
            <UInput
              v-model="registerForm.password"
              type="password"
              placeholder="Min. 8 characters"
              icon="i-heroicons-lock-closed"
              autocomplete="new-password"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Confirm Password" required>
            <UInput
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="Confirm your password"
              icon="i-heroicons-lock-closed"
              autocomplete="new-password"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UButton
            type="submit"
            block
            size="lg"
            :loading="isLoading"
            :disabled="isLoading"
          >
            Create Account
          </UButton>
        </form>

        <template #footer>
          <div class="text-center">
            <button
              type="button"
              class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
              @click="toggleMode"
            >
              {{ isRegisterMode ? 'Already have an account? Sign in' : "Don't have an account? Register" }}
            </button>
          </div>
        </template>
      </UCard>

      <!-- SSO Section -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <div class="mt-6">
          <UButton
            type="button"
            block
            size="lg"
            variant="outline"
            :loading="isLoading"
            :disabled="isLoading"
            @click="handleSSOLogin"
          >
            <template #leading>
              <UIcon name="i-heroicons-shield-check" class="w-5 h-5" />
            </template>
            Sign in with SSO
          </UButton>
        </div>

        <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Use your company SSO account to login
        </p>
      </div>
    </div>
  </div>
</template>
