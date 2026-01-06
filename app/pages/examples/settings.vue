<script setup lang="ts">
// Form state
const profile = reactive({
  name: 'John Doe',
  email: 'john@example.com',
  username: 'johndoe',
  bio: ''
})

const notifications = reactive({
  email: true,
  push: false,
  marketing: false
})

const activeTab = ref('profile')
</script>

<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <p class="text-gray-500 dark:text-gray-400">Manage your account settings and preferences.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Sidebar Navigation -->
      <div class="lg:col-span-1">
        <nav class="space-y-1">
          <button
            v-for="tab in [
              { id: 'profile', label: 'Profile', icon: 'i-heroicons-user' },
              { id: 'notifications', label: 'Notifications', icon: 'i-heroicons-bell' },
              { id: 'security', label: 'Security', icon: 'i-heroicons-lock-closed' },
              { id: 'billing', label: 'Billing', icon: 'i-heroicons-credit-card' }
            ]"
            :key="tab.id"
            class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="activeTab === tab.id 
              ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"
            @click="activeTab = tab.id"
          >
            <UIcon :name="tab.icon" class="w-5 h-5" />
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Content -->
      <div class="lg:col-span-3">
        <!-- Profile Settings -->
        <UCard v-if="activeTab === 'profile'">
          <template #header>
            <h2 class="font-semibold text-gray-900 dark:text-white">Profile Information</h2>
            <p class="text-sm text-gray-500">Update your personal information.</p>
          </template>
          
          <div class="space-y-6">
            <div class="flex items-center gap-6">
              <UAvatar src="https://avatars.githubusercontent.com/u/1?v=4" size="xl" />
              <div>
                <UButton size="sm">Change Avatar</UButton>
                <p class="text-xs text-gray-500 mt-2">JPG, GIF or PNG. 1MB max.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <UInput v-model="profile.name" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                <UInput v-model="profile.username" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <UInput v-model="profile.email" type="email" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                <UTextarea v-model="profile.bio" placeholder="Tell us about yourself" :rows="3" />
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton variant="ghost">Cancel</UButton>
              <UButton>Save Changes</UButton>
            </div>
          </template>
        </UCard>

        <!-- Notification Settings -->
        <UCard v-else-if="activeTab === 'notifications'">
          <template #header>
            <h2 class="font-semibold text-gray-900 dark:text-white">Notification Preferences</h2>
            <p class="text-sm text-gray-500">Choose how you want to be notified.</p>
          </template>
          
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div class="flex items-center justify-between py-4">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                <p class="text-sm text-gray-500">Receive email updates about your account.</p>
              </div>
              <UToggle v-model="notifications.email" />
            </div>
            <div class="flex items-center justify-between py-4">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                <p class="text-sm text-gray-500">Receive push notifications on your device.</p>
              </div>
              <UToggle v-model="notifications.push" />
            </div>
            <div class="flex items-center justify-between py-4">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Marketing Emails</p>
                <p class="text-sm text-gray-500">Receive emails about new features and promotions.</p>
              </div>
              <UToggle v-model="notifications.marketing" />
            </div>
          </div>
        </UCard>

        <!-- Security Settings -->
        <UCard v-else-if="activeTab === 'security'">
          <template #header>
            <h2 class="font-semibold text-gray-900 dark:text-white">Security Settings</h2>
            <p class="text-sm text-gray-500">Manage your password and security preferences.</p>
          </template>
          
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
              <UInput type="password" placeholder="••••••••" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
              <UInput type="password" placeholder="••••••••" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
              <UInput type="password" placeholder="••••••••" />
            </div>
          </div>

          <template #footer>
            <UButton>Update Password</UButton>
          </template>
        </UCard>

        <!-- Billing Settings -->
        <UCard v-else-if="activeTab === 'billing'">
          <template #header>
            <h2 class="font-semibold text-gray-900 dark:text-white">Billing Information</h2>
          </template>
          
          <div class="text-center py-12">
            <UIcon name="i-heroicons-credit-card" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 class="font-medium text-gray-900 dark:text-white mb-2">No payment method</h3>
            <p class="text-gray-500 mb-4">Add a payment method to upgrade your plan.</p>
            <UButton>Add Payment Method</UButton>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
