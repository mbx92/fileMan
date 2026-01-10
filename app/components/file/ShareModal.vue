<script setup lang="ts">
const props = defineProps<{
  open: boolean
  fileId?: string
  fileName?: string
  folderId?: string
  folderName?: string
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'shared'): void
}>()

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

const isLoading = ref(false)
const shares = ref<any[]>([])
const publicLink = ref('')
const publicToken = ref('')
const toast = useToast()

// Search state
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const isSearching = ref(false)

const shareForm = reactive({
  email: '',
  permission: 'DOWNLOAD' as 'VIEW' | 'DOWNLOAD' | 'EDIT',
})

const permissions = [
  { label: 'Can view', value: 'VIEW' },
  { label: 'Can download', value: 'DOWNLOAD' },
  { label: 'Can edit', value: 'EDIT' },
]

// Load existing shares
async function loadShares() {
  if (!props.fileId && !props.folderId) return
  
  try {
    isLoading.value = true
    const endpoint = props.fileId 
      ? `/api/files/${props.fileId}/shares`
      : `/api/folders/${props.folderId}/shares`
    
    const response = await $fetch(endpoint)
    shares.value = response as any[]
    
    // Check for public share
    const publicShare = shares.value.find((s: any) => s.publicToken && !s.sharedWithId)
    if (publicShare) {
      publicToken.value = publicShare.publicToken
      const baseUrl = window.location.origin
      publicLink.value = `${baseUrl}/public/${publicShare.publicToken}`
    }
  } catch (error) {
    console.error('Failed to load shares:', error)
    shares.value = []
  } finally {
    isLoading.value = false
  }
}

// Search users
let searchTimeout: NodeJS.Timeout | null = null
watch(searchQuery, (query) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  
  if (!query || query.length < 2) {
    searchResults.value = []
    return
  }
  
  searchTimeout = setTimeout(async () => {
    try {
      isSearching.value = true
      const response: any = await $fetch('/api/users/search', {
        query: { q: query }
      })
      searchResults.value = response.users || []
    } catch (error) {
      console.error('Search failed:', error)
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }, 300)
})

// Share with user (from search)
async function shareWithUser(user: any) {
  await doShare(user.email)
  searchQuery.value = ''
  searchResults.value = []
}

// Share from form
async function handleShare() {
  if (!shareForm.email) return
  await doShare(shareForm.email)
  shareForm.email = ''
}

async function doShare(email: string) {
  try {
    isLoading.value = true
    const endpoint = props.fileId 
      ? `/api/files/${props.fileId}/shares`
      : `/api/folders/${props.folderId}/shares`
    
    await $fetch(endpoint, {
      method: 'POST',
      body: {
        email,
        permission: shareForm.permission
      }
    })
    
    toast.add({
      title: 'Shared',
      description: `Successfully shared with ${email}`,
      color: 'success',
    })
    
    await loadShares()
    emit('shared')
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to share',
      color: 'error',
    })
  } finally {
    isLoading.value = false
  }
}

// Remove share
async function removeShare(shareId: string) {
  try {
    await $fetch(`/api/shares/${shareId}`, { method: 'DELETE' })
    toast.add({
      title: 'Removed',
      description: 'Share access removed',
      color: 'success',
    })
    await loadShares()
    emit('shared')
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to remove share',
      color: 'error',
    })
  }
}

// Create public link
async function createPublicLink() {
  try {
    isLoading.value = true
    const endpoint = props.fileId 
      ? `/api/files/${props.fileId}/public-link`
      : `/api/folders/${props.folderId}/public-link`
    
    const response: any = await $fetch(endpoint, { method: 'POST' })
    
    publicToken.value = response.publicToken
    publicLink.value = response.publicUrl
    
    toast.add({
      title: 'Link Created',
      description: 'Public link generated successfully',
      color: 'success',
    })
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to create link',
      color: 'error',
    })
  } finally {
    isLoading.value = false
  }
}

// Copy link
async function copyLink() {
  try {
    await navigator.clipboard.writeText(publicLink.value)
    toast.add({
      title: 'Copied',
      description: 'Link copied to clipboard',
      color: 'success',
    })
  } catch {
    toast.add({
      title: 'Error',
      description: 'Failed to copy link',
      color: 'error',
    })
  }
}

watch(() => props.open, (val) => {
  if (val) {
    loadShares()
  } else {
    shareForm.email = ''
    searchQuery.value = ''
    searchResults.value = []
    publicLink.value = ''
  }
})
</script>

<template>
  <UModal 
    v-model:open="isOpen" 
    title="Share" 
    :description="`Share '${fileName || folderName}'`"
    :ui="{ content: 'sm:max-w-lg overflow-visible', body: 'overflow-visible' }"
  >
    <template #body>
      <div class="space-y-5 overflow-visible">
        <!-- Public Link Section -->
        <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-globe-alt" class="w-5 h-5 text-gray-500" />
              <span class="text-sm font-medium text-gray-900 dark:text-white">Public Link</span>
            </div>
            <UBadge v-if="publicLink" variant="subtle" color="success" size="xs">Active</UBadge>
          </div>

          <div v-if="publicLink" class="space-y-2">
            <UInput
              :model-value="publicLink"
              readonly
              size="sm"
            />
            <UButton
              color="primary"
              variant="soft"
              icon="i-heroicons-clipboard-document"
              size="sm"
              class="w-full"
              @click="copyLink"
            >
              Copy Link
            </UButton>
          </div>
          
          <UButton
            v-else
            variant="outline"
            icon="i-heroicons-link"
            size="sm"
            class="w-full"
            :loading="isLoading"
            @click="createPublicLink"
          >
            Generate Public Link
          </UButton>
        </div>

        <UDivider />

        <!-- Share with People Section -->
        <div>
          <div class="flex items-center gap-2 mb-3">
            <UIcon name="i-heroicons-users" class="w-5 h-5 text-gray-500" />
            <span class="text-sm font-medium text-gray-900 dark:text-white">Share with People</span>
          </div>

          <!-- Combined Email/Search Input with Controls -->
          <div class="relative">
            <div class="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500">
              <UIcon name="i-heroicons-at-symbol" class="w-4 h-4 text-gray-400 shrink-0" />
              <input
                v-model="shareForm.email"
                type="text"
                placeholder="Enter email or search user..."
                class="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
                @input="searchQuery = shareForm.email"
              />
              <select
                v-model="shareForm.permission"
                class="bg-transparent border-none outline-none text-xs text-gray-600 dark:text-gray-400 cursor-pointer"
              >
                <option v-for="perm in permissions" :key="perm.value" :value="perm.value">
                  {{ perm.label }}
                </option>
              </select>
              <UButton
                color="primary"
                size="xs"
                :loading="isLoading"
                :disabled="!shareForm.email"
                @click="handleShare"
              >
                Share
              </UButton>
            </div>
            
            <!-- Search Results Dropdown -->
            <div
              v-if="searchResults.length > 0"
              class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto"
            >
              <button
                v-for="user in searchResults"
                :key="user.id"
                type="button"
                class="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3"
                @click="shareWithUser(user)"
              >
                <UAvatar :alt="user.name || user.username" size="xs" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ user.name || user.username }}
                  </p>
                  <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
                </div>
                <UIcon name="i-heroicons-plus" class="w-4 h-4 text-primary-500" />
              </button>
            </div>
          </div>
        </div>

        <!-- Shared Users List -->
        <div v-if="shares.filter(s => s.sharedWith).length > 0">
          <div class="flex items-center gap-2 mb-3">
            <UIcon name="i-heroicons-user-group" class="w-5 h-5 text-gray-500" />
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              Shared with ({{ shares.filter(s => s.sharedWith).length }})
            </span>
          </div>
          
          <div class="space-y-2 max-h-40 overflow-y-auto">
            <div
              v-for="share in shares.filter(s => s.sharedWith)"
              :key="share.id"
              class="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
            >
              <div class="flex items-center gap-2">
                <UAvatar :alt="share.sharedWith?.name" size="xs" />
                <div class="text-sm">
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ share.sharedWith?.name || share.sharedWith?.username }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <UBadge variant="subtle" color="neutral" size="xs">
                  {{ share.permission }}
                </UBadge>
                <UButton
                  color="error"
                  variant="ghost"
                  icon="i-heroicons-x-mark"
                  size="xs"
                  @click="removeShare(share.id)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end">
        <UButton color="neutral" variant="ghost" @click="isOpen = false">
          Done
        </UButton>
      </div>
    </template>
  </UModal>
</template>
