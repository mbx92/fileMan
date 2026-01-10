/**
 * Notifications store for shared state between header and notifications page
 */
interface Notification {
  id: string
  type: string
  title: string
  message?: string
  isRead: boolean
  createdAt: string
  fileId?: string
  folderId?: string
}

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as Notification[],
    unreadCount: 0,
    isLoaded: false,
  }),

  actions: {
    async fetchNotifications(limit: number = 20) {
      try {
        const data = await $fetch<{ notifications: Notification[], unreadCount: number }>(`/api/notifications?limit=${limit}`)
        this.notifications = data.notifications
        this.unreadCount = data.unreadCount
        this.isLoaded = true
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
      }
    },

    async markAsRead(notificationId: string) {
      try {
        await $fetch('/api/notifications/read', {
          method: 'POST',
          body: { ids: [notificationId] }
        })
        const notification = this.notifications.find(n => n.id === notificationId)
        if (notification && !notification.isRead) {
          notification.isRead = true
          this.unreadCount = Math.max(0, this.unreadCount - 1)
        }
      } catch (error) {
        console.error('Failed to mark notification as read:', error)
      }
    },

    async markAllAsRead() {
      try {
        await $fetch('/api/notifications/read-all', { method: 'POST' })
        this.notifications.forEach(n => n.isRead = true)
        this.unreadCount = 0
      } catch (error) {
        console.error('Failed to mark all notifications as read:', error)
      }
    },

    async deleteNotification(notificationId: string) {
      try {
        await $fetch(`/api/notifications/${notificationId}`, { method: 'DELETE' })
        const index = this.notifications.findIndex(n => n.id === notificationId)
        if (index !== -1) {
          const notification = this.notifications[index]
          if (!notification.isRead) {
            this.unreadCount = Math.max(0, this.unreadCount - 1)
          }
          this.notifications.splice(index, 1)
        }
        return true
      } catch (error) {
        console.error('Failed to delete notification:', error)
        return false
      }
    },
  },
})
