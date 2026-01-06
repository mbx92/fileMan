<script setup lang="ts">
// Tabs props
const tabsProps = [
  { name: 'modelValue', type: 'string | number', default: 'undefined', description: 'Active tab value (v-model)' },
  { name: 'items', type: 'array', required: true, description: 'Array of tab items' },
  { name: 'orientation', type: 'string', default: "'horizontal'", description: 'Tab orientation' }
]

// Demo
const activeTab = ref('account')

const tabs = [
  { label: 'Account', value: 'account', icon: 'i-heroicons-user' },
  { label: 'Notifications', value: 'notifications', icon: 'i-heroicons-bell' },
  { label: 'Security', value: 'security', icon: 'i-heroicons-lock-closed' },
  { label: 'Billing', value: 'billing', icon: 'i-heroicons-credit-card' }
]

// Code examples
const basicCode = `<UTabs v-model="active" :items="tabs">
  <template #account>
    Account settings content
  </template>
  <template #notifications>
    Notification preferences
  </template>
</UTabs>`

const cardCode = `<UCard>
  <UTabs v-model="active" :items="tabs">
    ...
  </UTabs>
</UCard>`

const pillsCode = `<div class="flex gap-2">
  <button :class="{ active: tab === current }">
    Tab 1
  </button>
  ...
</div>`
</script>

<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <div class="page-header">
      <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
        <NuxtLink to="/components" class="hover:text-primary-500">Components</NuxtLink>
        <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
        <NuxtLink to="/components" class="hover:text-primary-500">Navigation</NuxtLink>
        <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
        <span class="text-gray-900 dark:text-white">Tabs</span>
      </div>
      <h1 class="page-title text-gray-900 dark:text-white">Tabs</h1>
      <p class="page-description text-gray-600 dark:text-gray-400">
        A tabbed interface for organizing content into sections.
      </p>
    </div>

    <!-- Basic Usage -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Basic Usage</h2>
      <DocsComponentPreview title="Default Tabs" :code="basicCode">
        <div class="w-full">
          <UTabs v-model="activeTab" :items="tabs">
            <template #account>
              <div class="p-4">
                <h3 class="font-medium text-gray-900 dark:text-white mb-2">Account Settings</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Manage your account information, profile details, and preferences.
                </p>
              </div>
            </template>
            <template #notifications>
              <div class="p-4">
                <h3 class="font-medium text-gray-900 dark:text-white mb-2">Notification Preferences</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Configure how and when you receive notifications.
                </p>
              </div>
            </template>
            <template #security>
              <div class="p-4">
                <h3 class="font-medium text-gray-900 dark:text-white mb-2">Security Settings</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Manage your password, two-factor authentication, and security preferences.
                </p>
              </div>
            </template>
            <template #billing>
              <div class="p-4">
                <h3 class="font-medium text-gray-900 dark:text-white mb-2">Billing Information</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  View and manage your subscription, payment methods, and invoices.
                </p>
              </div>
            </template>
          </UTabs>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Manual Tabs with Content -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">With Card Content</h2>
      <DocsComponentPreview title="Tabs in Card" :code="cardCode">
        <div class="w-full max-w-2xl">
          <UCard>
            <template #header>
              <div class="border-b border-gray-200 dark:border-gray-700 -mx-4 -mt-4 px-4">
                <div class="flex gap-4">
                  <button
                    v-for="tab in tabs"
                    :key="tab.value"
                    class="flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors -mb-px"
                    :class="activeTab === tab.value 
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
                    @click="activeTab = tab.value"
                  >
                    <UIcon :name="tab.icon" class="w-4 h-4" />
                    {{ tab.label }}
                  </button>
                </div>
              </div>
            </template>
            
            <div v-if="activeTab === 'account'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
                <UInput placeholder="John Doe" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <UInput type="email" placeholder="john@example.com" />
              </div>
            </div>
            
            <div v-else-if="activeTab === 'notifications'" class="space-y-4">
              <UToggle :model-value="true" label="Email notifications" />
              <UToggle :model-value="false" label="Push notifications" />
              <UToggle :model-value="true" label="SMS notifications" />
            </div>
            
            <div v-else-if="activeTab === 'security'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                <UInput type="password" placeholder="••••••••" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                <UInput type="password" placeholder="••••••••" />
              </div>
            </div>
            
            <div v-else-if="activeTab === 'billing'" class="text-center py-8">
              <UIcon name="i-heroicons-credit-card" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p class="text-gray-500">No payment methods added</p>
              <UButton class="mt-4" size="sm">Add payment method</UButton>
            </div>
            
            <template #footer>
              <div class="flex justify-end gap-2">
                <UButton variant="ghost" color="neutral">Cancel</UButton>
                <UButton>Save changes</UButton>
              </div>
            </template>
          </UCard>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Pills Style -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Pills Style</h2>
      <DocsComponentPreview title="Pill Tabs" :code="pillsCode">
        <div class="w-full">
          <div class="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit mb-4">
            <button
              v-for="tab in tabs.slice(0, 3)"
              :key="tab.value"
              class="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all"
              :class="activeTab === tab.value 
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
              @click="activeTab = tab.value"
            >
              <UIcon :name="tab.icon" class="w-4 h-4" />
              {{ tab.label }}
            </button>
          </div>
          
          <div class="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p class="text-gray-600 dark:text-gray-400">
              Content for {{ tabs.find(t => t.value === activeTab)?.label }} tab
            </p>
          </div>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Props Table -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Props</h2>
      <DocsPropsTable :props="tabsProps" />
    </section>
  </div>
</template>
