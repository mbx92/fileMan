<script setup lang="ts">
const authStore = useAuthStore()
const toast = useToast()

// Stats data
const stats = ref({
  totalFiles: 0,
  totalFolders: 0,
  storageUsed: '0 MB',
  sharedFiles: 0,
})

// Recent files
const recentFiles = ref<any[]>([])
const isLoading = ref(true)

// Helper to format file size
function formatFileSize(bytes: number): string {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Get file icon based on extension (same as FileBrowser)
function getFileIcon(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  
  switch (ext) {
    // Documents
    case 'pdf': return 'i-vscode-icons-file-type-pdf2'
    case 'doc':
    case 'docx': return 'i-vscode-icons-file-type-word'
    case 'xls':
    case 'xlsx': return 'i-vscode-icons-file-type-excel'
    case 'ppt':
    case 'pptx': return 'i-vscode-icons-file-type-powerpoint'
    case 'txt': return 'i-vscode-icons-file-type-text'
    case 'md': return 'i-vscode-icons-file-type-markdown'
    
    // Images
    case 'jpg':
    case 'jpeg':
    case 'jfif':
    case 'png': 
    case 'gif': 
    case 'webp': return 'i-vscode-icons-file-type-image'
    case 'svg': return 'i-vscode-icons-file-type-svg'
    
    // Code
    case 'js': return 'i-vscode-icons-file-type-js-official'
    case 'ts': return 'i-vscode-icons-file-type-typescript-official'
    case 'vue': return 'i-vscode-icons-file-type-vue'
    case 'html': return 'i-vscode-icons-file-type-html'
    case 'css': return 'i-vscode-icons-file-type-css'
    case 'json': return 'i-vscode-icons-file-type-json'
    
    // Archives
    case 'zip':
    case 'rar':
    case '7z': return 'i-vscode-icons-file-type-zip'
    
    // Media
    case 'mp3':
    case 'wav': return 'i-vscode-icons-file-type-audio'
    case 'mp4':
    case 'mkv':
    case 'avi':
    case 'mov': return 'i-vscode-icons-file-type-video'
    
    default:
      return 'i-vscode-icons-default-file'
  }
}

async function loadDashboardData() {
  try {
    isLoading.value = true
    
    // Fetch recent files
    const files = await $fetch<any[]>('/api/files/recent')
    recentFiles.value = (files || []).slice(0, 5) // Show only first 5
    
    // Calculate stats from recent files
    const totalBytes = files?.reduce((sum, f) => sum + (f.size || 0), 0) || 0
    
    // Fetch dashboard stats (or calculate from available data)
    try {
      const statsData = await $fetch<any>('/api/dashboard/stats')
      if (statsData) {
        stats.value = {
          totalFiles: statsData.totalFiles || files?.length || 0,
          totalFolders: statsData.totalFolders || 0,
          storageUsed: formatFileSize(statsData.storageUsed || totalBytes),
          sharedFiles: statsData.sharedFiles || 0,
        }
      }
    } catch {
      // If stats API doesn't exist, use data from files
      stats.value = {
        totalFiles: files?.length || 0,
        totalFolders: 0,
        storageUsed: formatFileSize(totalBytes),
        sharedFiles: 0,
      }
    }
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})

const statCards = computed(() => [
  {
    label: 'Total Files',
    value: stats.value.totalFiles,
    icon: 'i-heroicons-document',
    color: 'primary',
  },
  {
    label: 'Folders',
    value: stats.value.totalFolders,
    icon: 'i-heroicons-folder',
    color: 'success',
  },
  {
    label: 'Storage Used',
    value: stats.value.storageUsed,
    icon: 'i-heroicons-circle-stack',
    color: 'warning',
  },
  {
    label: 'Shared Files',
    value: stats.value.sharedFiles,
    icon: 'i-heroicons-share',
    color: 'info',
  },
])
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Welcome Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {{ authStore.user?.name || authStore.user?.username }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          Here's an overview of your files
        </p>
      </div>
      <UButton
        to="/dashboard/files"
        icon="i-heroicons-plus"
        size="lg"
      >
        Upload Files
      </UButton>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard
        v-for="stat in statCards"
        :key="stat.label"
        class="hover:shadow-lg transition-shadow"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-lg flex items-center justify-center"
            :class="{
              'bg-primary-100 dark:bg-primary-900/30': stat.color === 'primary',
              'bg-green-100 dark:bg-green-900/30': stat.color === 'success',
              'bg-amber-100 dark:bg-amber-900/30': stat.color === 'warning',
              'bg-blue-100 dark:bg-blue-900/30': stat.color === 'info',
            }"
          >
            <UIcon
              :name="stat.icon"
              class="w-6 h-6"
              :class="{
                'text-primary-500': stat.color === 'primary',
                'text-green-500': stat.color === 'success',
                'text-amber-500': stat.color === 'warning',
                'text-blue-500': stat.color === 'info',
              }"
            />
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Quick Actions -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-bolt" class="w-5 h-5 text-primary-500" />
          <h3 class="font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
        </div>
      </template>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <UButton
          to="/dashboard/files"
          variant="soft"
          color="primary"
          class="flex-col h-24 gap-2"
          block
        >
          <UIcon name="i-heroicons-arrow-up-tray" class="w-6 h-6" />
          <span>Upload File</span>
        </UButton>

        <UButton
          to="/dashboard/files"
          variant="soft"
          color="neutral"
          class="flex-col h-24 gap-2"
          block
        >
          <UIcon name="i-heroicons-folder-plus" class="w-6 h-6" />
          <span>New Folder</span>
        </UButton>

        <UButton
          to="/dashboard/shared"
          variant="soft"
          color="neutral"
          class="flex-col h-24 gap-2"
          block
        >
          <UIcon name="i-heroicons-share" class="w-6 h-6" />
          <span>Shared Files</span>
        </UButton>

        <UButton
          to="/dashboard/recent"
          variant="soft"
          color="neutral"
          class="flex-col h-24 gap-2"
          block
        >
          <UIcon name="i-heroicons-clock" class="w-6 h-6" />
          <span>Recent</span>
        </UButton>
      </div>
    </UCard>

    <!-- Recent Files -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-clock" class="w-5 h-5 text-primary-500" />
            <h3 class="font-semibold text-gray-900 dark:text-white">Recent Files</h3>
          </div>
          <UButton to="/dashboard/recent" variant="ghost" size="sm">
            View All
          </UButton>
        </div>
      </template>

      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400" />
      </div>

      <div v-else-if="recentFiles.length === 0" class="text-center py-12">
        <UIcon name="i-heroicons-document" class="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p class="text-gray-500 dark:text-gray-400">No files uploaded yet</p>
        <UButton
          to="/dashboard/files"
          variant="soft"
          class="mt-4"
        >
          Upload your first file
        </UButton>
      </div>

      <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="file in recentFiles"
          :key="file.id"
          class="flex items-center justify-between py-3"
        >
          <div class="flex items-center gap-3">
            <UIcon :name="getFileIcon(file.name)" class="w-6 h-6" />
            <div>
              <p class="font-medium text-gray-900 dark:text-white truncate">{{ file.name }}</p>
              <p class="text-sm text-gray-500">{{ formatFileSize(file.size) }}</p>
            </div>
          </div>
          <UButton variant="ghost" icon="i-heroicons-arrow-down-tray" size="sm" />
        </div>
      </div>
    </UCard>
  </div>
</template>
