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

// Notifications - use shared store
const notificationsStore = useNotificationsStore()

// Format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

// Get icon based on notification type
function getNotificationIcon(type: string): string {
  switch (type) {
    case 'file_shared': return 'i-heroicons-document'
    case 'folder_shared': return 'i-heroicons-folder'
    case 'storage_warning': return 'i-heroicons-exclamation-triangle'
    default: return 'i-heroicons-bell'
  }
}

// Quick Links for navigation
const quickLinks = [
  { label: 'Dashboard', to: '/dashboard', icon: 'i-heroicons-home' },
  { label: 'My Files', to: '/dashboard/files', icon: 'i-heroicons-folder' },
  { label: 'Shared', to: '/dashboard/shared', icon: 'i-heroicons-share' },
  { label: 'Recent', to: '/dashboard/recent', icon: 'i-heroicons-clock' },
  { label: 'Settings', to: '/dashboard/settings', icon: 'i-heroicons-cog-6-tooth' },
  { label: 'Users', to: '/dashboard/users', icon: 'i-heroicons-users' },
  { label: 'Notifications', to: '/dashboard/notifications', icon: 'i-heroicons-bell' },
]

// Search functionality
interface SearchFile {
  id: string
  name: string
  size: number
  folderId?: string
}

const searchResults = ref<SearchFile[]>([])
const router = useRouter()

async function performSearch() {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }
  
  try {
    const data = await $fetch<{ files: SearchFile[] }>('/api/files/search', {
      query: { q: searchQuery.value }
    })
    searchResults.value = data.files || []
  } catch (error) {
    console.error('Search failed:', error)
    searchResults.value = []
  }
}

function goToFile(file: SearchFile) {
  searchOpen.value = false
  searchQuery.value = ''
  searchResults.value = []
  
  // Navigate to files page with folder context if available
  if (file.folderId) {
    router.push(`/dashboard/files?folder=${file.folderId}`)
  } else {
    router.push('/dashboard/files')
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
}

// Watch search query for debounced search
let searchTimeout: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, (newQuery) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  if (!newQuery.trim()) {
    searchResults.value = []
    return
  }
  searchTimeout = setTimeout(() => {
    performSearch()
  }, 300)
})

const authStore = useAuthStore()
const { logout } = useAuth()

// Handle logout
const handleLogout = async () => {
  try {
    await logout()
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// User dropdown items
const userItems = [
  [
    { label: 'Settings', icon: 'i-heroicons-cog-6-tooth', to: '/dashboard/settings' },
    { label: 'Users', icon: 'i-heroicons-users', to: '/dashboard/users' }
  ],
  [
    { label: 'Sign out', icon: 'i-heroicons-arrow-right-on-rectangle', onSelect: handleLogout }
  ]
]

// Keyboard shortcut for search
onMounted(() => {
  // Fetch notifications if not already loaded
  if (!notificationsStore.isLoaded) {
    notificationsStore.fetchNotifications()
  }
  
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
            v-if="notificationsStore.unreadCount > 0"
            class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
          />
        </UButton>

        <template #content>
          <div class="w-80">
            <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                <UBadge v-if="notificationsStore.unreadCount > 0" color="primary" variant="subtle">
                  {{ notificationsStore.unreadCount }} new
                </UBadge>
              </div>
            </div>
            
            <div class="max-h-80 overflow-y-auto">
              <div v-if="notificationsStore.notifications.length === 0" class="px-4 py-8 text-center">
                <UIcon name="i-heroicons-bell-slash" class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p class="text-sm text-gray-500">No notifications</p>
              </div>
              <div
                v-for="notification in notificationsStore.notifications"
                :key="notification.id"
                class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                :class="{ 'bg-primary-50/50 dark:bg-primary-950/20': !notification.isRead }"
                @click="notificationsStore.markAsRead(notification.id)"
              >
                <div class="flex gap-3">
                  <div class="shrink-0">
                    <div
                      class="w-8 h-8 rounded-full flex items-center justify-center"
                      :class="notification.isRead ? 'bg-gray-100 dark:bg-gray-700' : 'bg-primary-100 dark:bg-primary-900'"
                    >
                      <UIcon
                        :name="getNotificationIcon(notification.type)"
                        class="w-4 h-4"
                        :class="notification.isRead ? 'text-gray-500' : 'text-primary-600 dark:text-primary-400'"
                      />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ notification.title }}
                    </p>
                    <p v-if="notification.message" class="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {{ notification.message }}
                    </p>
                    <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {{ formatRelativeTime(notification.createdAt) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <UButton v-if="notificationsStore.unreadCount > 0" variant="ghost" color="neutral" size="sm" @click="notificationsStore.markAllAsRead">
                Mark all read
              </UButton>
              <UButton to="/dashboard/notifications" variant="ghost" color="primary" size="sm">
                View all
              </UButton>
            </div>
          </div>
        </template>
      </UPopover>

      <!-- User dropdown -->
      <UDropdownMenu :items="userItems">
        <UButton variant="ghost" color="neutral" class="gap-2" trailing-icon="i-heroicons-chevron-down">
          <UAvatar
            :src="authStore.user?.avatarUrl"
            :alt="authStore.user?.name || 'User'"
            icon="i-heroicons-user"
            size="xs"
            class="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200"
          />
          <span class="hidden lg:inline text-sm">{{ authStore.user?.name || 'User' }}</span>
        </UButton>
      </UDropdownMenu>
    </div>

    <!-- Search Modal -->
    <UModal v-model:open="searchOpen" title="Search" description="Search files and navigate quickly">
      <template #content>
        <div class="p-4 w-full min-w-[400px]">
          <UInput
            v-model="searchQuery"
            icon="i-heroicons-magnifying-glass"
            placeholder="Search files..."
            size="lg"
            class="w-full"
            autofocus
            @keyup.enter="performSearch"
          />
          
          <!-- Search Results -->
          <div v-if="searchResults.length > 0" class="mt-4">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Search Results</p>
            <div class="space-y-1 max-h-60 overflow-y-auto">
              <div
                v-for="file in searchResults"
                :key="file.id"
                class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                @click="goToFile(file)"
              >
                <UIcon name="i-heroicons-document" class="w-4 h-4 text-gray-400" />
                <div class="flex-1 min-w-0">
                  <span class="text-sm text-gray-700 dark:text-gray-300 block truncate">{{ file.name }}</span>
                  <span class="text-xs text-gray-500">{{ formatSize(file.size) }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Quick Links when no search -->
          <div v-else class="mt-4">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick Links</p>
            <div class="space-y-1">
              <NuxtLink
                v-for="link in quickLinks"
                :key="link.to"
                :to="link.to"
                class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                @click="searchOpen = false"
              >
                <UIcon :name="link.icon" class="w-4 h-4 text-gray-400" />
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ link.label }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
