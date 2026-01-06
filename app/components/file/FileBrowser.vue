<script setup lang="ts">
import ShareModal from './ShareModal.vue'

const props = withDefaults(defineProps<{
  files: any[]
  folders: any[]
  currentFolderId?: string | null
  loading?: boolean
  viewMode?: 'grid' | 'list'
}>(), {
  viewMode: 'grid',
  loading: false,
})

const emit = defineEmits<{
  (e: 'navigate', folderId: string): void
  (e: 'delete', item: { id: string, type: 'file' | 'folder' }): void
  (e: 'refresh'): void
}>()

const selectedItem = ref<any>(null)
const contextMenuOpen = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })
const showShareModal = ref(false)
const itemToShare = ref<any>(null)

function formatSize(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function handleItemClick(item: any, type: 'file' | 'folder') {
  if (type === 'folder') {
    emit('navigate', item.id)
  } else {
    // Preview file or download
    // Preview file or download
    window.open(`/api/files/download/${item.id}`, '_blank')

  }
}

function openShareModal(item: any, type: 'file' | 'folder') {
  itemToShare.value = { ...item, type }
  showShareModal.value = true
}

function handleDelete(item: any, type: 'file' | 'folder') {
  emit('delete', { id: item.id, type })
}

function getFileIcon(filename: string): { name: string, color?: string } {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  
  // Use vscode-icons collection for rich file type icons
  // Note: Nuxt UI uses Iconify, so we can use any collection
  
  switch (ext) {
    // Documents
    case 'pdf': return { name: 'i-vscode-icons-file-type-pdf2' }
    case 'doc':
    case 'docx': return { name: 'i-vscode-icons-file-type-word' }
    case 'xls':
    case 'xlsx': return { name: 'i-vscode-icons-file-type-excel' }
    case 'ppt':
    case 'pptx': return { name: 'i-vscode-icons-file-type-powerpoint' }
    case 'txt': return { name: 'i-vscode-icons-file-type-text' }
    case 'md': return { name: 'i-vscode-icons-file-type-markdown' }
    
    // Images
    case 'jpg':
    case 'jpeg':
    case 'png': 
    case 'gif': 
    case 'webp': return { name: 'i-vscode-icons-file-type-image' }
    case 'svg': return { name: 'i-vscode-icons-file-type-svg' }
    case 'ico': return { name: 'i-vscode-icons-file-type-favicon' }
    
    // Code
    case 'js': return { name: 'i-vscode-icons-file-type-js-official' }
    case 'ts': return { name: 'i-vscode-icons-file-type-typescript-official' }
    case 'vue': return { name: 'i-vscode-icons-file-type-vue' }
    case 'html': return { name: 'i-vscode-icons-file-type-html' }
    case 'css': return { name: 'i-vscode-icons-file-type-css' }
    case 'json': return { name: 'i-vscode-icons-file-type-json' }
    
    // Archives
    case 'zip': return { name: 'i-vscode-icons-file-type-zip' }
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz': return { name: 'i-vscode-icons-file-type-zip' }
    
    // Media
    case 'mp3':
    case 'wav': return { name: 'i-vscode-icons-file-type-audio' }
    case 'mp4':
    case 'mkv':
    case 'avi':
    case 'mov': return { name: 'i-vscode-icons-file-type-video' }
    
    // System
    case 'exe':
    case 'msi': return { name: 'i-vscode-icons-file-type-binary' }
    case 'iso': return { name: 'i-vscode-icons-file-type-image' } // Generic image/disk
    
    default:
      return { name: 'i-vscode-icons-default-file' }
  }
}

</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="props.loading" class="flex flex-col items-center justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400 mb-2" />
      <p class="text-gray-500">Loading files...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="props.files.length === 0 && props.folders.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
      <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
        <UIcon name="i-heroicons-folder-open" class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">This folder is empty</h3>
      <p class="text-gray-500 dark:text-gray-400 text-sm">Upload files or create a new folder to get started</p>
    </div>

    <!-- Content -->
    <div v-else class="space-y-8">
      <!-- Folders -->
      <div v-if="props.folders.length > 0">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">Folders</h3>
        
        <!-- Grid View for Folders -->
        <div v-if="props.viewMode === 'grid'" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div
            v-for="folder in props.folders"
            :key="folder.id"
            class="group relative p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-md hover:border-primary-500 dark:hover:border-primary-500 transition-all cursor-pointer"
            @click="handleItemClick(folder, 'folder')"
          >
            <div class="flex flex-col items-center text-center gap-3">
              <UIcon name="i-heroicons-folder" class="w-12 h-12 text-amber-400" />
              <div class="w-full">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate" :title="folder.name">
                  {{ folder.name }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ formatDate(folder.updatedAt) }}
                </p>
              </div>
            </div>
            
            <!-- Context Menu Button -->
            <div class="absolute top-2 right-2">
              <UDropdownMenu
                :items="[
                  [
                    { label: 'Open', icon: 'i-heroicons-folder-open', click: () => handleItemClick(folder, 'folder') },
                    { label: 'Share', icon: 'i-heroicons-share', click: () => openShareModal(folder, 'folder') },
                    { label: 'Rename', icon: 'i-heroicons-pencil-square' },
                  ],
                  [
                    { label: 'Delete', icon: 'i-heroicons-trash', color: 'error', click: () => handleDelete(folder, 'folder') }
                  ]
                ]"
              >
                <UButton color="neutral" variant="ghost" icon="i-heroicons-ellipsis-vertical" size="xs" @click.stop />
              </UDropdownMenu>
            </div>
          </div>
        </div>

        <!-- List View for Folders -->
        <div v-else class="divide-y divide-gray-200 dark:divide-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
          <div
            v-for="folder in props.folders"
            :key="folder.id"
            class="group flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
            @click="handleItemClick(folder, 'folder')"
          >
            <div class="flex items-center gap-4 flex-1 min-w-0">
              <div class="w-10 h-10 flex items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <UIcon name="i-heroicons-folder" class="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ folder.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Folder • {{ formatDate(folder.updatedAt) }}
                </p>
              </div>
            </div>
            
            <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-heroicons-folder-open"
                size="sm"
                @click.stop="handleItemClick(folder, 'folder')"
              />
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-heroicons-share"
                size="sm"
                @click.stop="openShareModal(folder, 'folder')"
              />
              <UButton
                color="error"
                variant="ghost"
                icon="i-heroicons-trash"
                size="sm"
                @click.stop="handleDelete(folder, 'folder')"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Files -->
      <div v-if="props.files.length > 0">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">Files</h3>
        
        <!-- Grid View -->
        <div v-if="props.viewMode === 'grid'" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div
            v-for="file in props.files"
            :key="file.id"
            class="group relative p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-md hover:border-primary-500 dark:hover:border-primary-500 transition-all cursor-pointer"
            @click="handleItemClick(file, 'file')"
          >
            <div class="flex flex-col items-center text-center gap-3">
              <div class="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800 transition-transform group-hover:scale-110 duration-200">
                <UIcon 
                  :name="getFileIcon(file.name).name" 
                  class="w-10 h-10" 
                />
              </div>
              <div class="w-full">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate" :title="file.name">
                  {{ file.name }}
                </p>
                <div class="flex items-center justify-center gap-2 mt-1">
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatSize(file.size) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Context Menu Button -->
            <div class="absolute top-2 right-2" @click.stop>
              <UDropdownMenu
                :items="[
                  [
                    { label: 'Download', icon: 'i-heroicons-arrow-down-tray', click: () => handleItemClick(file, 'file') },
                    { label: 'Share', icon: 'i-heroicons-share', click: () => openShareModal(file, 'file') },
                    { label: 'Rename', icon: 'i-heroicons-pencil-square' },
                  ],
                  [
                    { label: 'Delete', icon: 'i-heroicons-trash', color: 'error', click: () => handleDelete(file, 'file') }
                  ]
                ]"
              >
                <UButton color="neutral" variant="ghost" icon="i-heroicons-ellipsis-vertical" size="xs" @click.stop />
              </UDropdownMenu>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div v-else class="divide-y divide-gray-200 dark:divide-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
          <div
            v-for="file in props.files"
            :key="file.id"
            class="group flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
            @click="handleItemClick(file, 'file')"
          >
            <div class="flex items-center gap-4 flex-1 min-w-0">
              <div class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800">
                <UIcon 
                  :name="getFileIcon(file.name).name" 
                  class="w-8 h-8" 
                />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ file.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatSize(file.size) }} • {{ formatDate(file.updatedAt) }}
                </p>
              </div>
            </div>
            
            <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-heroicons-arrow-down-tray"
                size="sm"
                @click.stop="handleItemClick(file, 'file')"
              />
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-heroicons-share"
                size="sm"
                @click.stop="openShareModal(file, 'file')"
              />
              <UButton
                color="error"
                variant="ghost"
                icon="i-heroicons-trash"
                size="sm"
                @click.stop="handleDelete(file, 'file')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <ShareModal
      v-if="itemToShare"
      v-model="showShareModal"
      :file-id="itemToShare.type === 'file' ? itemToShare.id : undefined"
      :file-name="itemToShare.type === 'file' ? itemToShare.name : undefined"
      :folder-id="itemToShare.type === 'folder' ? itemToShare.id : undefined"
      :folder-name="itemToShare.type === 'folder' ? itemToShare.name : undefined"
    />
  </div>
</template>
