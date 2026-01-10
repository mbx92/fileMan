<script setup lang="ts">
definePageMeta({
  layout: false, // No sidebar/header for public pages
  auth: false
})

const route = useRoute()
const token = route.params.token as string

const { data, pending, error } = await useFetch(`/api/public/${token}`)

// Format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Get file icon based on mime type
function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'i-heroicons-photo'
  if (mimeType.startsWith('video/')) return 'i-heroicons-film'
  if (mimeType.startsWith('audio/')) return 'i-heroicons-musical-note'
  if (mimeType.includes('pdf')) return 'i-heroicons-document-text'
  if (mimeType.includes('word') || mimeType.includes('document')) return 'i-heroicons-document'
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'i-heroicons-table-cells'
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'i-heroicons-presentation-chart-bar'
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive')) return 'i-heroicons-archive-box'
  return 'i-heroicons-document'
}

// Download file
function downloadFile() {
  if (data.value?.downloadUrl) {
    window.open(data.value.downloadUrl, '_blank')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
    <!-- Loading State -->
    <div v-if="pending" class="text-center">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500 mb-4" />
      <p class="text-gray-500">Loading...</p>
    </div>

    <!-- Error State -->
    <UCard v-else-if="error" class="max-w-md w-full">
      <div class="text-center py-8">
        <div class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-red-500" />
        </div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {{ error.statusCode === 404 ? 'Link Not Found' : 'Link Expired' }}
        </h2>
        <p class="text-gray-500 dark:text-gray-400">
          {{ error.data?.message || 'This shared link is no longer available.' }}
        </p>
        <NuxtLink to="/login" class="mt-6 inline-block">
          <UButton color="primary" variant="soft">
            Go to Login
          </UButton>
        </NuxtLink>
      </div>
    </UCard>

    <!-- File View -->
    <UCard v-else-if="data?.type === 'file'" class="max-w-lg w-full">
      <div class="text-center py-6">
        <!-- File Icon -->
        <div class="w-20 h-20 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4">
          <UIcon :name="getFileIcon(data.file.mimeType)" class="w-10 h-10 text-primary-500" />
        </div>

        <!-- File Name -->
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">
          {{ data.file.originalName }}
        </h1>

        <!-- File Info -->
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {{ formatFileSize(data.file.size) }} • Shared by {{ data.owner.name || data.owner.username }}
        </p>

        <!-- Preview for images -->
        <div v-if="data.file.mimeType.startsWith('image/') && data.downloadUrl" class="mb-6">
          <img 
            :src="data.downloadUrl" 
            :alt="data.file.originalName"
            class="max-w-full max-h-96 rounded-lg mx-auto shadow-lg"
          />
        </div>

        <!-- Download Button -->
        <UButton
          v-if="data.downloadUrl"
          icon="i-heroicons-arrow-down-tray"
          size="lg"
          @click="downloadFile"
        >
          Download File
        </UButton>

        <p v-else class="text-sm text-gray-500">
          <UIcon name="i-heroicons-eye" class="w-4 h-4 inline mr-1" />
          View only - download not permitted
        </p>
      </div>
    </UCard>

    <!-- Folder View -->
    <UCard v-else-if="data?.type === 'folder'" class="max-w-2xl w-full">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
            <UIcon name="i-heroicons-folder" class="w-6 h-6 text-primary-500" />
          </div>
          <div>
            <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ data.folder.name }}
            </h1>
            <p class="text-sm text-gray-500">
              {{ data.folder.fileCount }} files • Shared by {{ data.owner.name || data.owner.username }}
            </p>
          </div>
        </div>
      </template>

      <div class="divide-y divide-gray-100 dark:divide-gray-800">
        <div
          v-for="file in data.files"
          :key="file.id"
          class="py-3 flex items-center gap-3"
        >
          <UIcon :name="getFileIcon(file.mimeType)" class="w-5 h-5 text-gray-400" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {{ file.originalName }}
            </p>
            <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
          </div>
        </div>

        <div v-if="data.files.length === 0" class="py-8 text-center text-gray-500">
          This folder is empty
        </div>
      </div>
    </UCard>
  </div>
</template>
