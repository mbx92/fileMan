<script setup lang="ts">
const props = defineProps<{
  currentFolderId?: string | null
}>()

const emit = defineEmits<{
  (e: 'upload-complete'): void
}>()

const settingsStore = useSettingsStore()

const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const { uploadFiles, hasActiveUploads } = useBackgroundUpload()

function onDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function onDragLeave(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    handleFiles(files)
  }
}

function onClick() {
  fileInput.value?.click()
}

function onFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    handleFiles(input.files)
  }
}

async function handleFiles(files: FileList) {
  // Use composable to handle uploads in background
  await uploadFiles(files, props.currentFolderId)
  
  // Emit complete event for parent component to refresh
  emit('upload-complete')
  
  // Reset input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<template>
  <div
    class="relative rounded-lg border-2 border-dashed transition-colors duration-200"
    :class="[
      isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600',
      'cursor-pointer'
    ]"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
    @click="onClick"
  >
    <div class="px-6 py-10 flex flex-col items-center justify-center text-center">
      <input
        ref="fileInput"
        type="file"
        multiple
        class="hidden"
        @change="onFileSelect"
      >
      
      <UIcon
        name="i-heroicons-cloud-arrow-up"
        class="w-10 h-10 text-gray-400 mb-3"
      />
      
      <div>
        <p class="text-sm font-medium text-gray-900 dark:text-white">
          <span class="text-primary-500">Click to upload</span> or drag and drop
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Any file up to {{ settingsStore.maxFileSizeMB }}MB
        </p>
      </div>
    </div>
  </div>
</template>
