<script setup lang="ts">
definePageMeta({
  middleware: ['admin']
})

const config = useRuntimeConfig()
const toast = useToast()
const settingsStore = useSettingsStore()

// Tabs
const selectedTab = ref('integrations')

const tabs = [
  { value: 'integrations', label: 'Integrations', icon: 'i-heroicons-puzzle-piece', slot: 'integrations' },
  { value: 'roles', label: 'SSO Roles', icon: 'i-heroicons-user-group', slot: 'roles' },
  { value: 'general', label: 'General', icon: 'i-heroicons-cog-6-tooth', slot: 'general' },
  { value: 'security', label: 'Security', icon: 'i-heroicons-shield-check', slot: 'security' },
]

// Role mapping info
const roleMappings = [
  { ssoRole: 'superadmin, super_admin', fileManRole: 'SUPERADMIN', color: 'error' as const, description: 'Full system access' },
  { ssoRole: 'admin, administrator', fileManRole: 'ADMIN', color: 'warning' as const, description: 'Administrative access' },
  { ssoRole: 'user, default', fileManRole: 'USER', color: 'primary' as const, description: 'Standard user access' },
]

// SSO Configuration (from runtime config)
const ssoConfig = ref({
  baseUrl: config.public.sso.baseUrl,
  clientId: config.public.sso.clientId,
  redirectUri: config.public.sso.redirectUri,
  scopes: config.public.sso.scopes.join(', '),
})

// MinIO Configuration (from runtime config)
const minioConfig = ref({
  endpoint: '',
  bucketName: '',
  useSSL: false,
})

// Test states
const ssoTestLoading = ref(false)
const ssoTestResult = ref<any>(null)
const userInfoTestLoading = ref(false)
const userInfoTestResult = ref<any>(null)
const minioTestLoading = ref(false)
const minioTestResult = ref<any>(null)

const authStore = useAuthStore()

// Get MinIO config from server
const { data: minioData } = await useFetch('/api/settings/minio')
if (minioData.value) {
  minioConfig.value = {
    endpoint: minioData.value.endpoint,
    bucketName: minioData.value.bucketName,
    useSSL: minioData.value.useSSL,
  }
}

// General Settings
const generalSettingsLoading = ref(false)
const generalSettingsSaving = ref(false)
const generalSettings = ref({
  systemName: 'FileMan',
  timezone: 'Asia/Jakarta',
  maxFileSizeMB: 100,
  maxStorageGB: 10,
  allowPublicSharing: true,
  allowUserRegistration: false,
  sessionTimeoutMinutes: 60,
  primaryColor: '#3b82f6',
})

// Security Settings
const securitySettingsLoading = ref(false)
const securitySettingsSaving = ref(false)
const securitySettings = ref({
  minPasswordLength: 8,
  requireSpecialChar: true,
  requireUppercase: true,
  requireNumber: true,
  maxLoginAttempts: 5,
  lockoutDurationMinutes: 15,
  allowedFileTypes: '*',
  blockedFileTypes: '.exe,.bat,.cmd,.sh,.ps1',
})

// Timezone options
const timezones = [
  // Indonesia
  { label: 'WIB - Jakarta (UTC+7)', value: 'Asia/Jakarta' },
  { label: 'WITA - Makassar (UTC+8)', value: 'Asia/Makassar' },
  { label: 'WIT - Jayapura (UTC+9)', value: 'Asia/Jayapura' },
  // Asia
  { label: 'Singapore (UTC+8)', value: 'Asia/Singapore' },
  { label: 'Tokyo (UTC+9)', value: 'Asia/Tokyo' },
  { label: 'Seoul (UTC+9)', value: 'Asia/Seoul' },
  { label: 'Hong Kong (UTC+8)', value: 'Asia/Hong_Kong' },
  { label: 'Bangkok (UTC+7)', value: 'Asia/Bangkok' },
  { label: 'Manila (UTC+8)', value: 'Asia/Manila' },
  { label: 'Kuala Lumpur (UTC+8)', value: 'Asia/Kuala_Lumpur' },
  // Europe
  { label: 'London (UTC+0/+1)', value: 'Europe/London' },
  { label: 'Paris (UTC+1/+2)', value: 'Europe/Paris' },
  { label: 'Berlin (UTC+1/+2)', value: 'Europe/Berlin' },
  // Americas
  { label: 'New York (UTC-5/-4)', value: 'America/New_York' },
  { label: 'Los Angeles (UTC-8/-7)', value: 'America/Los_Angeles' },
  { label: 'Chicago (UTC-6/-5)', value: 'America/Chicago' },
  // Other
  { label: 'Sydney (UTC+10/+11)', value: 'Australia/Sydney' },
  { label: 'Auckland (UTC+12/+13)', value: 'Pacific/Auckland' },
  { label: 'UTC', value: 'UTC' },
]

// Load general settings
async function loadGeneralSettings() {
  try {
    generalSettingsLoading.value = true
    const data: any = await $fetch('/api/settings/general')
    if (data) {
      generalSettings.value = {
        systemName: data.systemName || 'FileMan',
        timezone: data.timezone || 'Asia/Jakarta',
        maxFileSizeMB: data.maxFileSizeMB || 100,
        maxStorageGB: data.maxStorageGB || 10,
        allowPublicSharing: data.allowPublicSharing ?? true,
        allowUserRegistration: data.allowUserRegistration ?? false,
        sessionTimeoutMinutes: data.sessionTimeoutMinutes || 60,
        primaryColor: data.primaryColor || '#3b82f6',
      }
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  } finally {
    generalSettingsLoading.value = false
  }
}

// Save general settings
async function saveGeneralSettings() {
  try {
    generalSettingsSaving.value = true
    await $fetch('/api/settings/general', {
      method: 'POST',
      body: generalSettings.value,
    })
    
    // Update global store so sidebar reflects changes immediately
    settingsStore.updateSettings(generalSettings.value)
    
    toast.add({
      title: 'Settings Saved',
      description: 'General settings have been saved successfully',
      icon: 'i-heroicons-check-circle',
    })
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to save settings',
      color: 'error',
      icon: 'i-heroicons-x-circle',
    })
  } finally {
    generalSettingsSaving.value = false
  }
}

// Load settings on mount
onMounted(() => {
  loadGeneralSettings()
  loadSecuritySettings()
})

// Load security settings
async function loadSecuritySettings() {
  try {
    securitySettingsLoading.value = true
    const data: any = await $fetch('/api/settings/general')
    if (data) {
      securitySettings.value = {
        minPasswordLength: data.minPasswordLength || 8,
        requireSpecialChar: data.requireSpecialChar ?? true,
        requireUppercase: data.requireUppercase ?? true,
        requireNumber: data.requireNumber ?? true,
        maxLoginAttempts: data.maxLoginAttempts || 5,
        lockoutDurationMinutes: data.lockoutDurationMinutes || 15,
        allowedFileTypes: data.allowedFileTypes || '*',
        blockedFileTypes: data.blockedFileTypes || '.exe,.bat,.cmd,.sh,.ps1',
      }
    }
  } catch (error) {
    console.error('Failed to load security settings:', error)
  } finally {
    securitySettingsLoading.value = false
  }
}

// Save security settings
async function saveSecuritySettings() {
  try {
    securitySettingsSaving.value = true
    await $fetch('/api/settings/general', {
      method: 'POST',
      body: securitySettings.value,
    })
    toast.add({
      title: 'Saved',
      description: 'Security settings saved successfully',
      color: 'success',
    })
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to save security settings',
      color: 'error',
    })
  } finally {
    securitySettingsSaving.value = false
  }
}

// Test SSO Connection
async function testSSOConnection() {
  ssoTestLoading.value = true
  ssoTestResult.value = null
  
  try {
    const response = await $fetch('/api/settings/test-sso', {
      method: 'POST',
    })
    
    ssoTestResult.value = {
      success: true,
      message: 'SSO server is reachable',
      data: response,
    }
    
    toast.add({
      title: 'Success',
      description: 'SSO connection successful',
      color: 'success',
    })
  } catch (error: any) {
    ssoTestResult.value = {
      success: false,
      message: error.data?.message || error.message || 'Connection failed',
      error: error,
    }
    
    toast.add({
      title: 'Error',
      description: 'SSO connection failed',
      color: 'error',
    })
  } finally {
    ssoTestLoading.value = false
  }
}

// Test SSO UserInfo with current token
async function testUserInfo() {
  userInfoTestLoading.value = true
  userInfoTestResult.value = null
  
  const accessToken = authStore.tokens?.accessToken
  
  if (!accessToken) {
    toast.add({
      title: 'Error',
      description: 'No access token found. Please login first.',
      color: 'error',
    })
    userInfoTestLoading.value = false
    return
  }
  
  try {
    const response = await $fetch('/api/settings/test-userinfo', {
      method: 'POST',
      body: { accessToken },
    })
    
    userInfoTestResult.value = {
      success: true,
      message: 'UserInfo fetched successfully',
      data: response,
    }
    
    toast.add({
      title: 'Success',
      description: `UserInfo fetched. Role field: ${response.roleFields.hasRole ? '✓ Found' : '✗ Not found'}`,
      color: response.roleFields.hasRole ? 'success' : 'warning',
    })
  } catch (error: any) {
    userInfoTestResult.value = {
      success: false,
      message: error.data?.message || error.message || 'Failed to fetch userinfo',
      error: error,
    }
    
    toast.add({
      title: 'Error',
      description: 'Failed to fetch userinfo from SSO',
      color: 'error',
    })
  } finally {
    userInfoTestLoading.value = false
  }
}

// Test MinIO Connection
async function testMinIOConnection() {
  minioTestLoading.value = true
  minioTestResult.value = null
  
  try {
    const response = await $fetch('/api/settings/test-minio', {
      method: 'POST',
    })
    
    minioTestResult.value = {
      success: true,
      message: 'MinIO connection successful',
      data: response,
    }
    
    toast.add({
      title: 'Success',
      description: 'MinIO connection successful',
      color: 'success',
    })
  } catch (error: any) {
    minioTestResult.value = {
      success: false,
      message: error.data?.message || error.message || 'Connection failed',
      error: error,
    }
    
    toast.add({
      title: 'Error',
      description: 'MinIO connection failed',
      color: 'error',
    })
  } finally {
    minioTestLoading.value = false
  }
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  toast.add({
    title: 'Copied',
    description: 'Copied to clipboard',
    color: 'success',
  })
}
</script>


<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">Manage application settings and integrations</p>
    </div>

    <!-- Tabs -->
    <UTabs v-model="selectedTab" :items="tabs">
      <!-- Integrations Tab -->
      <template #integrations>
        <div class="space-y-6">
          <!-- SSO Integration -->
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                    <UIcon name="i-heroicons-key" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">SSO Integration</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">OAuth2/OIDC Configuration</p>
                  </div>
                </div>
                <UBadge color="primary" variant="subtle">Active</UBadge>
              </div>
            </template>

            <div class="space-y-4">
              <!-- SSO Config Display -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Base URL</label>
                  <div class="mt-1 flex gap-2">
                    <UInput v-model="ssoConfig.baseUrl" readonly class="flex-1" />
                    <UButton icon="i-heroicons-clipboard" variant="ghost" @click="copyToClipboard(ssoConfig.baseUrl)" />
                  </div>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Client ID</label>
                  <div class="mt-1 flex gap-2">
                    <UInput v-model="ssoConfig.clientId" readonly class="flex-1" />
                    <UButton icon="i-heroicons-clipboard" variant="ghost" @click="copyToClipboard(ssoConfig.clientId)" />
                  </div>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Redirect URI</label>
                  <div class="mt-1 flex gap-2">
                    <UInput v-model="ssoConfig.redirectUri" readonly class="flex-1" />
                    <UButton icon="i-heroicons-clipboard" variant="ghost" @click="copyToClipboard(ssoConfig.redirectUri)" />
                  </div>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Scopes</label>
                  <div class="mt-1">
                    <UInput v-model="ssoConfig.scopes" readonly />
                  </div>
                </div>
              </div>

              <!-- Test Buttons -->
              <div class="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <UButton color="primary" variant="outline" :loading="ssoTestLoading" @click="testSSOConnection">
                  <template #leading>
                    <UIcon name="i-heroicons-signal" />
                  </template>
                  Test Connection
                </UButton>
                <UButton color="primary" variant="outline" :loading="userInfoTestLoading" @click="testUserInfo">
                  <template #leading>
                    <UIcon name="i-heroicons-user-circle" />
                  </template>
                  Test UserInfo
                </UButton>
              </div>

              <!-- SSO Test Results -->
              <div v-if="ssoTestResult" class="mt-4 p-4 rounded-lg" :class="ssoTestResult.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'">
                <div class="flex items-start gap-3">
                  <UIcon :name="ssoTestResult.success ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" class="w-5 h-5 mt-0.5" :class="ssoTestResult.success ? 'text-green-600' : 'text-red-600'" />
                  <div class="flex-1">
                    <p class="font-medium" :class="ssoTestResult.success ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'">
                      {{ ssoTestResult.message }}
                    </p>
                    <pre v-if="ssoTestResult.data" class="mt-2 text-xs overflow-auto">{{ JSON.stringify(ssoTestResult.data, null, 2) }}</pre>
                  </div>
                </div>
              </div>

              <!-- UserInfo Test Results -->
              <div v-if="userInfoTestResult" class="mt-4 p-4 rounded-lg" :class="userInfoTestResult.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'">
                <div class="flex items-start gap-3">
                  <UIcon :name="userInfoTestResult.success ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" class="w-5 h-5 mt-0.5" :class="userInfoTestResult.success ? 'text-green-600' : 'text-red-600'" />
                  <div class="flex-1">
                    <p class="font-medium" :class="userInfoTestResult.success ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'">
                      {{ userInfoTestResult.message }}
                    </p>
                    <pre v-if="userInfoTestResult.data" class="mt-2 text-xs overflow-auto">{{ JSON.stringify(userInfoTestResult.data, null, 2) }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </UCard>

          <!-- MinIO Integration -->
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <UIcon name="i-heroicons-cloud" class="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">MinIO Storage</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Object Storage Configuration</p>
                  </div>
                </div>
                <UBadge color="orange" variant="subtle">Active</UBadge>
              </div>
            </template>

            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Endpoint</label>
                  <div class="mt-1">
                    <UInput v-model="minioConfig.endpoint" readonly />
                  </div>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Bucket Name</label>
                  <div class="mt-1">
                    <UInput v-model="minioConfig.bucketName" readonly />
                  </div>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Use SSL</label>
                  <div class="mt-1">
                    <UBadge :color="minioConfig.useSSL ? 'green' : 'gray'">
                      {{ minioConfig.useSSL ? 'Enabled' : 'Disabled' }}
                    </UBadge>
                  </div>
                </div>
              </div>

              <div class="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <UButton color="orange" variant="outline" :loading="minioTestLoading" @click="testMinIOConnection">
                  <template #leading>
                    <UIcon name="i-heroicons-signal" />
                  </template>
                  Test Connection
                </UButton>
              </div>

              <!-- MinIO Test Results -->
              <div v-if="minioTestResult" class="mt-4 p-4 rounded-lg" :class="minioTestResult.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'">
                <div class="flex items-start gap-3">
                  <UIcon :name="minioTestResult.success ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" class="w-5 h-5 mt-0.5" :class="minioTestResult.success ? 'text-green-600' : 'text-red-600'" />
                  <div class="flex-1">
                    <p class="font-medium" :class="minioTestResult.success ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'">
                      {{ minioTestResult.message }}
                    </p>
                    <pre v-if="minioTestResult.data" class="mt-2 text-xs overflow-auto">{{ JSON.stringify(minioTestResult.data, null, 2) }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </template>

      <!-- Roles Tab -->
      <template #roles>
        <UCard>
          <template #header>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">SSO Role Mapping</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">How SSO roles are mapped to FileMan roles</p>
            </div>
          </template>

          <div class="space-y-4">
            <div v-for="mapping in roleMappings" :key="mapping.fileManRole" class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3">
                    <UBadge :color="mapping.color" variant="subtle" size="lg">
                      {{ mapping.fileManRole }}
                    </UBadge>
                    <span class="text-sm text-gray-500 dark:text-gray-400">←</span>
                    <code class="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">{{ mapping.ssoRole }}</code>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">{{ mapping.description }}</p>
                </div>
              </div>
            </div>

            <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div class="flex gap-3">
                <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div class="text-sm text-blue-900 dark:text-blue-100">
                  <p class="font-medium mb-2">Role Mapping Rules:</p>
                  <ul class="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
                    <li>SSO role field should be: <code class="px-1 bg-blue-100 dark:bg-blue-800 rounded">role</code> or <code class="px-1 bg-blue-100 dark:bg-blue-800 rounded">roles</code></li>
                    <li>Multiple SSO role values can map to the same FileMan role (comma-separated above)</li>
                    <li>Role matching is case-insensitive</li>
                    <li>If no match is found, user defaults to USER role</li>
                    <li>Use "Test UserInfo" in Integrations tab to verify role field exists</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </template>

      <!-- General Tab -->
      <template #general>
        <div class="space-y-6">
          <!-- System Info Card -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <UIcon name="i-heroicons-building-office" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">System Information</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Basic system configuration</p>
                </div>
              </div>
            </template>

            <div v-if="generalSettingsLoading" class="text-center py-8">
              <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400 mx-auto" />
              <p class="text-gray-500 mt-2">Loading settings...</p>
            </div>

            <div v-else class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">System Name</label>
                  <UInput v-model="generalSettings.systemName" placeholder="FileMan" />
                  <p class="text-xs text-gray-500 mt-1">Display name for the application</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
                  <USelectMenu 
                    v-model="generalSettings.timezone" 
                    value-key="id"
                    :items="[
                      { label: 'WIB - Jakarta (UTC+7)', id: 'Asia/Jakarta' },
                      { label: 'WITA - Makassar (UTC+8)', id: 'Asia/Makassar' },
                      { label: 'WIT - Jayapura (UTC+9)', id: 'Asia/Jayapura' },
                      { label: 'Singapore (UTC+8)', id: 'Asia/Singapore' },
                      { label: 'Tokyo (UTC+9)', id: 'Asia/Tokyo' },
                      { label: 'Bangkok (UTC+7)', id: 'Asia/Bangkok' },
                      { label: 'Hong Kong (UTC+8)', id: 'Asia/Hong_Kong' },
                      { label: 'Kuala Lumpur (UTC+8)', id: 'Asia/Kuala_Lumpur' },
                      { label: 'Manila (UTC+8)', id: 'Asia/Manila' },
                      { label: 'UTC', id: 'UTC' },
                    ]"
                    class="w-full"
                  />
                  <p class="text-xs text-gray-500 mt-1">Default timezone for the system</p>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Upload Limits Card -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <div class="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <UIcon name="i-heroicons-arrow-up-tray" class="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Upload & Storage Limits</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Configure file upload and storage restrictions</p>
                </div>
              </div>
            </template>

            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max File Size (MB)</label>
                  <UInput v-model="generalSettings.maxFileSizeMB" type="number" min="1" max="10240" />
                  <p class="text-xs text-gray-500 mt-1">Maximum size for a single file upload (1-10240 MB)</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Storage Per User (GB)</label>
                  <UInput v-model="generalSettings.maxStorageGB" type="number" min="1" max="1000" />
                  <p class="text-xs text-gray-500 mt-1">Maximum storage quota per user (1-1000 GB)</p>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Features Card -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Features</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Enable or disable system features</p>
                </div>
              </div>
            </template>

            <div class="space-y-4">
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Allow Public Sharing</p>
                  <p class="text-sm text-gray-500">Users can create public links for files and folders</p>
                </div>
                <USwitch v-model="generalSettings.allowPublicSharing" />
              </div>
              
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Allow User Registration</p>
                  <p class="text-sm text-gray-500">New users can register without admin approval</p>
                </div>
                <USwitch v-model="generalSettings.allowUserRegistration" />
              </div>
            </div>
          </UCard>

          <!-- Session Card -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <UIcon name="i-heroicons-clock" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Session Settings</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Configure user session behavior</p>
                </div>
              </div>
            </template>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Session Timeout (minutes)</label>
              <UInput v-model="generalSettings.sessionTimeoutMinutes" type="number" min="5" max="1440" class="w-48" />
              <p class="text-xs text-gray-500 mt-1">Auto logout after inactivity (5-1440 minutes)</p>
            </div>
          </UCard>

          <!-- Save Button -->
          <div class="flex justify-end">
            <UButton color="primary" size="lg" :loading="generalSettingsSaving" @click="saveGeneralSettings">
              <template #leading>
                <UIcon name="i-heroicons-check" />
              </template>
              Save Settings
            </UButton>
          </div>
        </div>
      </template>

      <!-- Security Tab -->
      <template #security>
        <div class="space-y-6">
          <!-- Password Requirements Card -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <div class="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <UIcon name="i-heroicons-key" class="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Password Requirements</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Configure password strength requirements</p>
                </div>
              </div>
            </template>

            <div v-if="securitySettingsLoading" class="text-center py-8">
              <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400 mx-auto" />
              <p class="text-gray-500 mt-2">Loading settings...</p>
            </div>

            <div v-else class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minimum Password Length</label>
                <UInput v-model="securitySettings.minPasswordLength" type="number" min="6" max="32" class="w-48" />
                <p class="text-xs text-gray-500 mt-1">Minimum characters required (6-32)</p>
              </div>

              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">Require Special Character</p>
                    <p class="text-sm text-gray-500">Must contain symbols like !@#$%^&*()</p>
                  </div>
                  <USwitch v-model="securitySettings.requireSpecialChar" />
                </div>

                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">Require Uppercase Letter</p>
                    <p class="text-sm text-gray-500">Must contain at least one uppercase letter (A-Z)</p>
                  </div>
                  <USwitch v-model="securitySettings.requireUppercase" />
                </div>

                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">Require Number</p>
                    <p class="text-sm text-gray-500">Must contain at least one number (0-9)</p>
                  </div>
                  <USwitch v-model="securitySettings.requireNumber" />
                </div>
              </div>
            </div>
          </UCard>

          <!-- Login Protection Card -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <div class="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <UIcon name="i-heroicons-shield-exclamation" class="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Login Protection</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Brute force attack prevention</p>
                </div>
              </div>
            </template>

            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Login Attempts</label>
                  <UInput v-model="securitySettings.maxLoginAttempts" type="number" min="1" max="20" />
                  <p class="text-xs text-gray-500 mt-1">Failed attempts before lockout (1-20)</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lockout Duration (minutes)</label>
                  <UInput v-model="securitySettings.lockoutDurationMinutes" type="number" min="1" max="1440" />
                  <p class="text-xs text-gray-500 mt-1">Account lockout time (1-1440 minutes)</p>
                </div>
              </div>
            </div>
          </UCard>

          <!-- File Type Restrictions Card -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <UIcon name="i-heroicons-document-check" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">File Type Restrictions</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Control which file types users can upload</p>
                </div>
              </div>
            </template>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Allowed File Types</label>
                <UInput v-model="securitySettings.allowedFileTypes" placeholder="* or .pdf,.docx,.jpg" />
                <p class="text-xs text-gray-500 mt-1">Use * for all types, or comma-separated extensions (.pdf,.docx,.jpg)</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Blocked File Types</label>
                <UInput v-model="securitySettings.blockedFileTypes" placeholder=".exe,.bat,.cmd" />
                <p class="text-xs text-gray-500 mt-1">Comma-separated extensions to block (e.g. .exe,.bat,.cmd,.sh,.ps1)</p>
              </div>

              <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div class="flex gap-3">
                  <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                  <div class="text-sm text-yellow-800 dark:text-yellow-200">
                    <p class="font-medium mb-1">Security Notice</p>
                    <p>Executable files (.exe, .bat, .cmd, .sh, .ps1) are blocked by default to prevent malicious uploads. Removing these from the blocked list is not recommended.</p>
                  </div>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Save Button -->
          <div class="flex justify-end">
            <UButton color="primary" size="lg" :loading="securitySettingsSaving" @click="saveSecuritySettings">
              <template #leading>
                <UIcon name="i-heroicons-check" />
              </template>
              Save Security Settings
            </UButton>
          </div>
        </div>
      </template>
    </UTabs>
  </div>
</template>
