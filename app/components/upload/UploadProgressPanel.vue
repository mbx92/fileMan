<script setup lang="ts">
import { useUploadStore } from '~/stores/upload'

const uploadStore = useUploadStore()

// Computed properties from store
const uploads = computed(() => uploadStore.uploads)
const hasUploads = computed(() => uploadStore.uploads.length > 0)
const hasActiveUploads = computed(() => uploadStore.hasActiveUploads)
const isMinimized = computed(() => uploadStore.isMinimized)
const activeCount = computed(() => uploadStore.activeUploads.length)
const completedCount = computed(() => uploadStore.completedUploads.length)
const failedCount = computed(() => uploadStore.failedUploads.length)

// Format file size helper
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Get status icon
function getStatusIcon(status: string): string {
  switch (status) {
    case 'pending': return 'i-heroicons-clock'
    case 'uploading': return 'i-heroicons-arrow-up-tray'
    case 'completed': return 'i-heroicons-check-circle'
    case 'failed': return 'i-heroicons-exclamation-circle'
    case 'cancelled': return 'i-heroicons-x-circle'
    default: return 'i-heroicons-document'
  }
}

// Get status color
function getStatusColor(status: string): string {
  switch (status) {
    case 'pending': return 'text-gray-400'
    case 'uploading': return 'text-primary-500'
    case 'completed': return 'text-green-500'
    case 'failed': return 'text-red-500'
    case 'cancelled': return 'text-gray-400'
    default: return 'text-gray-400'
  }
}

// Actions
function toggleMinimize() {
  uploadStore.toggleMinimized()
}

function clearAll() {
  uploadStore.clearAll()
}

function cancelUpload(id: string) {
  uploadStore.cancelUpload(id)
}

function removeUpload(id: string) {
  uploadStore.removeUpload(id)
}

function clearCompleted() {
  uploadStore.clearCompleted()
}
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="hasUploads"
      class="fixed bottom-4 right-4 z-50 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
        @click="toggleMinimize"
      >
        <div class="flex items-center gap-2">
          <UIcon
            v-if="hasActiveUploads"
            name="i-heroicons-arrow-up-tray"
            class="w-5 h-5 text-primary-500 animate-pulse"
          />
          <UIcon
            v-else
            name="i-heroicons-check-circle"
            class="w-5 h-5 text-green-500"
          />
          <span class="font-medium text-sm text-gray-900 dark:text-white">
            <template v-if="hasActiveUploads">
              Uploading {{ activeCount }} file{{ activeCount > 1 ? 's' : '' }}...
            </template>
            <template v-else>
              {{ completedCount }} completed<template v-if="failedCount">, {{ failedCount }} failed</template>
            </template>
          </span>
        </div>
        
        <div class="flex items-center gap-1">
          <UButton
            v-if="!hasActiveUploads"
            icon="i-heroicons-x-mark"
            size="xs"
            color="neutral"
            variant="ghost"
            @click.stop="clearAll"
          />
          <UButton
            :icon="isMinimized ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
            size="xs"
            color="neutral"
            variant="ghost"
            @click.stop="toggleMinimize"
          />
        </div>
      </div>

      <!-- Upload List (collapsible) -->
      <Transition name="collapse">
        <div v-if="!isMinimized" class="max-h-64 overflow-y-auto">
          <div
            v-for="upload in uploads"
            :key="upload.id"
            class="px-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
          >
            <div class="flex items-start gap-3">
              <!-- File Icon -->
              <div class="flex-shrink-0 mt-0.5">
                <UIcon
                  :name="getStatusIcon(upload.status)"
                  :class="[
                    'w-5 h-5',
                    getStatusColor(upload.status),
                    upload.status === 'uploading' ? 'animate-bounce' : ''
                  ]"
                />
              </div>

              <!-- File Info -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ upload.fileName }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatFileSize(upload.fileSize) }}
                  <template v-if="upload.status === 'uploading'">
                    • {{ upload.progress }}%
                  </template>
                  <template v-else-if="upload.status === 'failed'">
                    • {{ upload.error }}
                  </template>
                </p>

                <!-- Progress Bar -->
                <div
                  v-if="upload.status === 'uploading' || upload.status === 'pending'"
                  class="mt-2"
                >
                  <UProgress
                    :value="upload.progress"
                    size="xs"
                    :color="upload.status === 'uploading' ? 'primary' : 'neutral'"
                  />
                </div>
              </div>

              <!-- Actions -->
              <div class="flex-shrink-0">
                <UButton
                  v-if="upload.status === 'uploading' || upload.status === 'pending'"
                  icon="i-heroicons-x-mark"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  @click="cancelUpload(upload.id)"
                />
                <UButton
                  v-else
                  icon="i-heroicons-x-mark"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  @click="removeUpload(upload.id)"
                />
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Footer Actions (when expanded) -->
      <Transition name="collapse">
        <div
          v-if="!isMinimized && (completedCount > 0 || failedCount > 0)"
          class="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end"
        >
          <UButton
            size="xs"
            color="neutral"
            variant="ghost"
            @click="clearCompleted"
          >
            Clear completed
          </UButton>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  max-height: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  max-height: 300px;
}
</style>
