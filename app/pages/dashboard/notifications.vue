<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const toast = useToast()
const notificationsStore = useNotificationsStore()

const isLoading = ref(false)

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
    case 'system': return 'i-heroicons-cog-6-tooth'
    default: return 'i-heroicons-bell'
  }
}

// Fetch with loading state
async function refresh() {
  isLoading.value = true
  await notificationsStore.fetchNotifications(50)
  isLoading.value = false
}

// Mark all as read with toast
async function markAllAsRead() {
  await notificationsStore.markAllAsRead()
  toast.add({
    title: 'Done',
    description: 'All notifications marked as read',
  })
}

// Delete notification with UI feedback
async function deleteNotification(notificationId: string, event: Event) {
  event.stopPropagation()
  const success = await notificationsStore.deleteNotification(notificationId)
  if (!success) {
    toast.add({
      title: 'Error',
      description: 'Failed to delete notification',
      color: 'error',
    })
  }
}

onMounted(() => {
  // Refresh with larger limit for full page
  refresh()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ notificationsStore.unreadCount > 0 ? `${notificationsStore.unreadCount} unread notifications` : 'All caught up!' }}
        </p>
      </div>
      <div class="flex gap-2">
        <UButton
          v-if="notificationsStore.unreadCount > 0"
          icon="i-heroicons-check"
          color="neutral"
          variant="ghost"
          @click="markAllAsRead"
        >
          Mark all read
        </UButton>
        <UButton
          icon="i-heroicons-arrow-path"
          color="neutral"
          variant="ghost"
          :loading="isLoading"
          @click="refresh()"
        >
          Refresh
        </UButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400" />
    </div>

    <!-- Empty State -->
    <UCard v-else-if="notificationsStore.notifications.length === 0" class="text-center py-12">
      <UIcon name="i-heroicons-bell-slash" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">No notifications</h3>
      <p class="text-gray-500 dark:text-gray-400 mt-2">
        You're all caught up! Notifications will appear here when someone shares files with you.
      </p>
    </UCard>

    <!-- Notifications List -->
    <div v-else class="space-y-3">
      <UCard
        v-for="notification in notificationsStore.notifications"
        :key="notification.id"
        class="cursor-pointer transition-all hover:shadow-md"
        :class="{ 'ring-2 ring-primary-500/20 bg-primary-50/30 dark:bg-primary-950/20': !notification.isRead }"
        @click="notificationsStore.markAsRead(notification.id)"
      >
        <div class="flex gap-4">
          <!-- Icon -->
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            :class="notification.isRead ? 'bg-gray-100 dark:bg-gray-700' : 'bg-primary-100 dark:bg-primary-900'"
          >
            <UIcon
              :name="getNotificationIcon(notification.type)"
              class="w-5 h-5"
              :class="notification.isRead ? 'text-gray-500' : 'text-primary-600 dark:text-primary-400'"
            />
          </div>
          
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <p class="font-medium text-gray-900 dark:text-white">
                {{ notification.title }}
              </p>
              <span class="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                {{ formatRelativeTime(notification.createdAt) }}
              </span>
            </div>
            <p v-if="notification.message" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ notification.message }}
            </p>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center gap-2 shrink-0">
            <!-- Unread indicator -->
            <span v-if="!notification.isRead" class="w-2 h-2 bg-primary-500 rounded-full block"></span>
            
            <!-- Delete button -->
            <UButton
              icon="i-heroicons-x-mark"
              color="neutral"
              variant="ghost"
              size="xs"
              @click="deleteNotification(notification.id, $event)"
            />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
