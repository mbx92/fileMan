<script setup lang="ts">
/**
 * OnlyOffice Document Editor Component
 * Integrates with OnlyOffice Document Server for viewing/editing documents
 */

const props = defineProps<{
  fileId: string
  fileName?: string
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const isOpen = defineModel<boolean>('open', { default: false })

// State
const isLoading = ref(true)
const error = ref<string | null>(null)
const editorConfig = ref<any>(null)
const documentServerUrl = ref('')

// Editor container ref
const editorContainer = ref<HTMLDivElement | null>(null)
let docEditor: any = null

// Load OnlyOffice configuration
async function loadConfig() {
  if (!props.fileId) return
  
  isLoading.value = true
  error.value = null

  try {
    const response = await $fetch<{
      config: any
      onlyofficeUrl: string
      documentServerUrl: string
    }>('/api/onlyoffice/config', {
      params: { fileId: props.fileId },
    })

    editorConfig.value = response.config
    documentServerUrl.value = response.documentServerUrl

    // Load OnlyOffice API script
    await loadOnlyOfficeScript()
    
    // Initialize editor
    initEditor()
  } catch (e: any) {
    error.value = e.data?.message || e.message || 'Failed to load document editor'
    console.error('OnlyOffice error:', e)
  } finally {
    isLoading.value = false
  }
}

// Load OnlyOffice API script dynamically
function loadOnlyOfficeScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window as any).DocsAPI) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = documentServerUrl.value
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load OnlyOffice API'))
    document.head.appendChild(script)
  })
}

// Initialize OnlyOffice editor
function initEditor() {
  if (!editorConfig.value || !editorContainer.value) return
  
  const DocsAPI = (window as any).DocsAPI
  if (!DocsAPI) {
    error.value = 'OnlyOffice API not loaded'
    return
  }

  // Destroy existing editor
  if (docEditor) {
    docEditor.destroyEditor()
    docEditor = null
  }

  // Create new editor
  try {
    docEditor = new DocsAPI.DocEditor('onlyoffice-editor', {
      ...editorConfig.value,
      events: {
        onAppReady: () => {
          console.log('[OnlyOffice] Editor ready')
          isLoading.value = false
        },
        onDocumentStateChange: (event: any) => {
          console.log('[OnlyOffice] Document state changed:', event)
        },
        onError: (event: any) => {
          console.error('[OnlyOffice] Error:', event)
          error.value = event.data?.message || 'Document editor error'
        },
        onRequestClose: () => {
          handleClose()
        },
        onDocumentReady: () => {
          console.log('[OnlyOffice] Document ready')
        },
        onWarning: (event: any) => {
          console.warn('[OnlyOffice] Warning:', event)
        },
      },
    })
  } catch (e: any) {
    error.value = e.message || 'Failed to initialize editor'
    console.error('Editor init error:', e)
  }
}

// Handle close
function handleClose() {
  if (docEditor) {
    docEditor.destroyEditor()
    docEditor = null
  }
  isOpen.value = false
  emit('close')
}

// Watch for modal open
watch(isOpen, (open) => {
  if (open) {
    loadConfig()
  } else {
    if (docEditor) {
      docEditor.destroyEditor()
      docEditor = null
    }
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (docEditor) {
    docEditor.destroyEditor()
    docEditor = null
  }
})
</script>

<template>
  <UModal 
    v-model:open="isOpen" 
    :title="fileName || 'Document Editor'"
    description="OnlyOffice Document Editor"
    fullscreen
    :close-button="true"
    @close="handleClose"
  >
    <template #body>
      <div class="h-full flex flex-col">
        <!-- Loading -->
        <div v-if="isLoading" class="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div class="text-center">
            <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 animate-spin text-primary-500 mb-4" />
            <p class="text-gray-600 dark:text-gray-400">Loading document editor...</p>
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div class="text-center max-w-md">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-500 mb-4 mx-auto" />
            <p class="text-gray-900 dark:text-white font-medium mb-2">Failed to load editor</p>
            <p class="text-gray-500 text-sm mb-4">{{ error }}</p>
            <UButton variant="soft" @click="loadConfig">
              <UIcon name="i-heroicons-arrow-path" class="mr-2" />
              Retry
            </UButton>
          </div>
        </div>

        <!-- OnlyOffice Editor Container -->
        <div 
          v-show="!isLoading && !error"
          ref="editorContainer" 
          class="flex-1"
        >
          <div id="onlyoffice-editor" class="w-full h-full" />
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
#onlyoffice-editor {
  min-height: calc(100vh - 80px);
}
</style>
