<script setup lang="ts">
import FileBrowser from '~/components/file/FileBrowser.vue'
import FileUploader from '~/components/file/FileUploader.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const currentFolderId = ref<string | null>(route.query.folder as string || null)
const viewMode = ref<'grid' | 'list'>('grid')
const showUploader = ref(false)

const { data, pending, refresh } = await useFetch('/api/files', {
  query: computed(() => ({
    folderId: currentFolderId.value,
  })),
  headers: computed(() => ({
    Authorization: `Bearer ${authStore.tokens?.accessToken || ''}`,
  })),
  watch: [currentFolderId],
})

const currentFolder = computed(() => {
  if (!data.value?.breadcrumbs?.length) return null
  return data.value.breadcrumbs[data.value.breadcrumbs.length - 1]
})

function navigateToFolder(folderId: string) {
  currentFolderId.value = folderId
  router.push({ query: { ...route.query, folder: folderId } })
}

function navigateUp() {
  if (!data.value?.breadcrumbs?.length) return
  
  const breadcrumbs = data.value.breadcrumbs
  if (breadcrumbs.length > 1) {
    // Go to parent
    navigateToFolder(breadcrumbs[breadcrumbs.length - 2].id)
  } else {
    // Go to root
    currentFolderId.value = null
    router.push({ query: { ...route.query, folder: undefined } })
  }
}

const isCreateFolderModalOpen = ref(false)
const newFolderName = ref('')
const isCreatingFolder = ref(false)

function handleCreateFolder() {
  newFolderName.value = ''
  isCreateFolderModalOpen.value = true
}

async function createFolder() {
  if (!newFolderName.value.trim()) return

  const { authFetch } = useAuthFetch()
  isCreatingFolder.value = true

  try {
    await authFetch('/api/folders', {
      method: 'POST',
      body: {
        name: newFolderName.value,
        parentId: currentFolderId.value,
      },
    })
    refresh()
    isCreateFolderModalOpen.value = false
    newFolderName.value = ''
  } catch (error) {
    console.error('Failed to create folder:', error)
  } finally {
    isCreatingFolder.value = false
  }
}

// Delete Modal State
const isDeleteModalOpen = ref(false)
const itemToDelete = ref<{ id: string, type: 'file' | 'folder', name: string } | null>(null)
const isDeleting = ref(false)

function handleDelete(item: any) {
  // Check if item is a file or folder event object
  const id = item.id
  const type = item.type
  // Find name from data if not passed directly, but FileBrowser passes {id, type}
  // We need to find the name to show in modal. 
  // FileBrowser check: emit('delete', { id: item.id, type })
  // We need the name. Let's update FileBrowser to pass name or find it here.
  // Actually simpler to just rely on props being refreshed or look it up.
  // Looking up in data.files or data.folders
  let name = ''
  if (type === 'file') {
    const file = data.value?.files.find((f: any) => f.id === id)
    name = file?.name || 'File'
  } else {
    const folder = data.value?.folders.find((f: any) => f.id === id)
    name = folder?.name || 'Folder'
  }
  
  // Fallback if name is still empty (shouldn't happen but good for safety)
  if (!name) name = type === 'file' ? 'File' : 'Folder'

  itemToDelete.value = { id, type, name }
  isDeleteModalOpen.value = true
}

function handleDeleteCurrentFolder() {
  if (!currentFolderId.value || !currentFolder.value) return
  
  itemToDelete.value = {
    id: currentFolderId.value,
    type: 'folder',
    name: currentFolder.value.name
  }
  isDeleteModalOpen.value = true
}

async function confirmDelete() {
  if (!itemToDelete.value) return
  
  const { authFetch } = useAuthFetch()
  isDeleting.value = true
  
  try {
    if (itemToDelete.value.type === 'file') {
      await authFetch(`/api/files/${itemToDelete.value.id}`, { method: 'DELETE' })
    } else {
      await authFetch(`/api/folders/${itemToDelete.value.id}`, { method: 'DELETE' })
    }
    
    // If we deleted the current folder, navigate up
    if (itemToDelete.value.id === currentFolderId.value) {
      navigateUp()
    } else {
      refresh()
    }
    
    isDeleteModalOpen.value = false
    itemToDelete.value = null
  } catch (error) {
    console.error('Failed to delete item:', error)
    alert('Failed to delete item')
  } finally {
    isDeleting.value = false
  }
}

// Watch route changes for back/forward navigation
watch(
  () => route.query.folder,
  (newFolder) => {
    currentFolderId.value = (newFolder as string) || null
  }
)
</script>

<template>
  <div class="p-6 h-full flex flex-col">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div class="flex items-center gap-2">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">File Browser</h1>
      </div>
      
      <div class="flex items-center gap-2">
        <UButton
          v-if="currentFolderId"
          icon="i-heroicons-trash"
          color="error"
          variant="ghost"
          @click="handleDeleteCurrentFolder"
        >
          Delete Folder
        </UButton>
        <UButton
          icon="i-heroicons-folder-plus"
          color="neutral"
          variant="ghost"
          @click="handleCreateFolder"
        >
          New Folder
        </UButton>
        <UButton
          :icon="viewMode === 'grid' ? 'i-heroicons-list-bullet' : 'i-heroicons-squares-2x2'"
          color="neutral"
          variant="ghost"
          @click="viewMode = viewMode === 'grid' ? 'list' : 'grid'"
        />
        <UButton
          :icon="showUploader ? 'i-heroicons-x-mark' : 'i-heroicons-cloud-arrow-up'"
          :color="showUploader ? 'neutral' : 'primary'"
          @click="showUploader = !showUploader"
        >
          {{ showUploader ? 'Close Upload' : 'Upload' }}
        </UButton>
      </div>
    </div>

    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 mb-6 text-sm overflow-x-auto pb-2">
      <UButton
        variant="ghost"
        color="neutral"
        size="sm"
        icon="i-heroicons-home"
        :class="{ 'text-primary-500 font-medium': !currentFolderId }"
        @click="navigateToFolder('')"
      >
        Home
      </UButton>
      
      <template v-if="data?.breadcrumbs">
        <template v-for="(crumb, index) in data.breadcrumbs" :key="crumb.id">
          <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400 flex-shrink-0" />
          <UButton
            variant="ghost"
            color="neutral"
            size="sm"
            :class="{ 'text-primary-500 font-medium': index === data.breadcrumbs.length - 1 }"
            @click="navigateToFolder(crumb.id)"
          >
            {{ crumb.name }}
          </UButton>
        </template>
      </template>
    </div>

    <!-- Uploader -->
    <div v-if="showUploader" class="mb-6">
      <FileUploader
        :current-folder-id="currentFolderId"
        @upload-complete="refresh"
      />
    </div>

    <!-- Browser -->
    <FileBrowser
      class="flex-1"
      :files="data?.files || []"
      :folders="data?.folders || []"
      :loading="pending"
      :view-mode="viewMode"
      @navigate="navigateToFolder"
      @delete="handleDelete"
      @refresh="refresh"
    />
    <!-- Create Folder Modal -->
    <UModal v-model:open="isCreateFolderModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Create New Folder
              </h3>
              <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isCreateFolderModalOpen = false" />
            </div>
          </template>

          <form @submit.prevent="createFolder">
            <UFormField label="Folder Name" name="name">
              <UInput
                v-model="newFolderName"
                placeholder="Enter folder name"
                size="lg"
                class="w-full"
                autofocus
              />
            </UFormField>
          </form>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton color="neutral" variant="ghost" @click="isCreateFolderModalOpen = false">
                Cancel
              </UButton>
              <UButton @click="createFolder" :loading="isCreatingFolder">
                Create
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="isDeleteModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Delete {{ itemToDelete?.type === 'folder' ? 'Folder' : 'File' }}
              </h3>
              <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isDeleteModalOpen = false" />
            </div>
          </template>

          <div class="p-4">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete 
              <span class="font-medium text-gray-900 dark:text-white">"{{ itemToDelete?.name }}"</span>?
              <template v-if="itemToDelete?.type === 'folder'">
                All contents inside this folder will also be permanently deleted.
              </template>
              <template v-else>
                This action cannot be undone.
              </template>
            </p>
          </div>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton color="neutral" variant="ghost" @click="isDeleteModalOpen = false">
                Cancel
              </UButton>
              <UButton color="error" @click="confirmDelete" :loading="isDeleting">
                Delete
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
