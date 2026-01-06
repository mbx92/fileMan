<script setup lang="ts">
interface Props {
  colorMode?: string
}

defineProps<Props>()

const emit = defineEmits<{
  toggleSidebar: []
  toggleDesktopSidebar: []
  toggleColorMode: []
}>()

// Search
const searchOpen = ref(false)
const searchQuery = ref('')

// Notifications
const notifications = ref([
  { id: 1, title: 'New update available', description: 'Version 2.0 is now available', time: '5m ago', read: false },
  { id: 2, title: 'Welcome to NuxtBase', description: 'Get started with the documentation', time: '1h ago', read: false },
  { id: 3, title: 'System update', description: 'Maintenance completed successfully', time: '2h ago', read: true }
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

// User dropdown items
const userItems = [
  [
    { label: 'Profile', icon: 'i-heroicons-user', to: '/examples/profile' },
    { label: 'Settings', icon: 'i-heroicons-cog-6-tooth', to: '/examples/settings' }
  ],
  [
    { label: 'Documentation', icon: 'i-heroicons-book-open', to: '/components' },
    { label: 'Changelog', icon: 'i-heroicons-document-text' }
  ],
  [
    { label: 'Sign out', icon: 'i-heroicons-arrow-right-on-rectangle', click: () => console.log('Sign out') }
  ]
]

// Keyboard shortcut for search
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      searchOpen.value = true
    }
  }
  window.addEventListener('keydown', handleKeydown)
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
})
</script>

<template>
  <div class="h-full px-4 flex items-center justify-between gap-4">
    <!-- Left section -->
    <div class="flex items-center gap-4">
      <!-- Desktop sidebar toggle -->
      <UButton
        icon="i-heroicons-bars-3"
        variant="ghost"
        color="neutral"
        class="hidden lg:flex"
        @click="emit('toggleDesktopSidebar')"
      />

      <!-- Mobile menu toggle -->
      <UButton
        icon="i-heroicons-bars-3"
        variant="ghost"
        color="neutral"
        class="lg:hidden"
        @click="emit('toggleSidebar')"
      />

      <!-- Breadcrumb -->
      <div class="hidden md:flex items-center gap-2 text-sm">
        <UIcon name="i-heroicons-home" class="w-4 h-4 text-gray-500" />
        <span class="text-gray-500">/</span>
        <span class="text-gray-900 dark:text-white">Dashboard</span>
      </div>
    </div>

    <!-- Right section -->
    <div class="flex items-center gap-2">
      <!-- Search button -->
      <UButton
        icon="i-heroicons-magnifying-glass"
        variant="ghost"
        color="neutral"
        class="hidden sm:flex"
        @click="searchOpen = true"
      >
        <span class="hidden lg:inline text-sm text-gray-500">Search...</span>
        <UKbd class="hidden lg:inline ml-2">⌘K</UKbd>
      </UButton>

      <!-- Color mode toggle -->
      <UButton
        :icon="colorMode === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'"
        variant="ghost"
        color="neutral"
        @click="emit('toggleColorMode')"
      />

      <!-- Notifications -->
      <UPopover>
        <UButton
          icon="i-heroicons-bell"
          variant="ghost"
          color="neutral"
          class="relative"
        >
          <span
            v-if="unreadCount > 0"
            class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
          />
        </UButton>

        <template #content>
          <div class="w-80">
            <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                <UBadge v-if="unreadCount > 0" color="primary" variant="subtle">
                  {{ unreadCount }} new
                </UBadge>
              </div>
            </div>
            
            <div class="max-h-80 overflow-y-auto">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                :class="{ 'bg-primary-50/50 dark:bg-primary-950/20': !notification.read }"
              >
                <div class="flex gap-3">
                  <div class="flex-shrink-0">
                    <div
                      class="w-8 h-8 rounded-full flex items-center justify-center"
                      :class="notification.read ? 'bg-gray-100 dark:bg-gray-700' : 'bg-primary-100 dark:bg-primary-900'"
                    >
                      <UIcon
                        name="i-heroicons-bell"
                        class="w-4 h-4"
                        :class="notification.read ? 'text-gray-500' : 'text-primary-600 dark:text-primary-400'"
                      />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ notification.title }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {{ notification.description }}
                    </p>
                    <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {{ notification.time }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <UButton variant="ghost" color="primary" block size="sm">
                View all notifications
              </UButton>
            </div>
          </div>
        </template>
      </UPopover>

      <!-- User dropdown -->
      <UDropdownMenu :items="userItems">
        <UButton variant="ghost" color="neutral" class="gap-2" trailing-icon="i-heroicons-chevron-down">
          <UAvatar
            icon="i-heroicons-user"
            size="xs"
            class="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200"
          />
          <span class="hidden lg:inline text-sm">John Doe</span>
        </UButton>
      </UDropdownMenu>
    </div>

    <!-- Search Modal -->
    <UModal v-model:open="searchOpen">
      <template #content>
        <div class="p-4">
          <UInput
            v-model="searchQuery"
            icon="i-heroicons-magnifying-glass"
            placeholder="Search components, pages..."
            size="lg"
            autofocus
          />
          
          <div class="mt-4">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick Links</p>
            <div class="space-y-1">
              <NuxtLink
                v-for="link in [
                  { label: 'Button', to: '/components/elements/button' },
                  { label: 'Input', to: '/components/forms/input' },
                  { label: 'Table', to: '/components/data/table' },
                  { label: 'Modal', to: '/components/overlays/modal' }
                ]"
                :key="link.to"
                :to="link.to"
                class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                @click="searchOpen = false"
              >
                <UIcon name="i-heroicons-cube" class="w-4 h-4 text-gray-400" />
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ link.label }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
