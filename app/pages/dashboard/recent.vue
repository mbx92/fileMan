<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const toast = useToast()

// Fetch recent files
const { data: recentFiles, pending, error, refresh } = await useFetch('/api/files/recent')

// Helper functions
function formatFileSize(bytes: number): string {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  
  return date.toLocaleDateString()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Recent Files</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Files you've recently viewed or modified
        </p>
      </div>
      <UButton
        icon="i-heroicons-arrow-path"
        color="neutral"
        variant="ghost"
        :loading="pending"
        @click="refresh()"
      >
        Refresh
      </UButton>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex items-center justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400" />
    </div>

    <!-- Error State -->
    <UCard v-else-if="error" class="text-center py-12">
      <UIcon name="i-heroicons-exclamation-circle" class="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Failed to load recent files</h3>
      <p class="text-gray-500 dark:text-gray-400 mt-2">{{ error.message }}</p>
      <UButton class="mt-4" @click="refresh()">Try Again</UButton>
    </UCard>

    <!-- Empty State -->
    <UCard v-else-if="!recentFiles || recentFiles.length === 0" class="text-center py-12">
      <UIcon name="i-heroicons-clock" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">No recent files</h3>
      <p class="text-gray-500 dark:text-gray-400 mt-2">
        Files you view or edit will appear here
      </p>
      <NuxtLink to="/dashboard/files">
        <UButton class="mt-4" color="primary">
          Browse Files
        </UButton>
      </NuxtLink>
    </UCard>

    <!-- Files List -->
    <div v-else class="space-y-4">
      <UCard v-for="file in recentFiles" :key="file.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <div class="flex items-center gap-4">
          <!-- File Icon -->
          <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <UIcon 
              :name="file.mimeType?.startsWith('image/') ? 'i-heroicons-photo' : 
                     file.mimeType?.startsWith('video/') ? 'i-heroicons-film' :
                     file.mimeType?.includes('pdf') ? 'i-heroicons-document-text' :
                     'i-heroicons-document'" 
              class="w-5 h-5 text-blue-600 dark:text-blue-400" 
            />
          </div>
          
          <!-- File Info -->
          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-900 dark:text-white truncate">{{ file.name }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatFileSize(file.size) }} • {{ formatDate(file.updatedAt) }}
            </p>
          </div>
          
          <!-- Actions -->
          <NuxtLink :to="`/dashboard/files?preview=${file.id}`">
            <UButton icon="i-heroicons-eye" color="neutral" variant="ghost" size="sm">
              View
            </UButton>
          </NuxtLink>
        </div>
      </UCard>
    </div>
  </div>
</template>

