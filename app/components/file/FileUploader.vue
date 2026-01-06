<script setup lang="ts">
const props = defineProps<{
  currentFolderId?: string | null
}>()

const emit = defineEmits<{
  (e: 'upload-complete'): void
}>()

const isDragging = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const fileInput = ref<HTMLInputElement | null>(null)
const toast = useToast()

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
  isUploading.value = true
  uploadProgress.value = 0
  
  const formData = new FormData()
  
  if (props.currentFolderId) {
    formData.append('folderId', props.currentFolderId)
  }
  
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i])
  }
  
  try {
    // Simulate progress since fetch doesn't support it natively yet
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 200)
    
    await $fetch('/api/files/upload', {
      method: 'POST',
      body: formData,
    })
    
    clearInterval(progressInterval)
    uploadProgress.value = 100
    
    toast.add({
      title: 'Success',
      description: `Uploaded ${files.length} file(s) successfully`,
      color: 'success',
    })
    
    emit('upload-complete')
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to upload files',
      color: 'error',
    })
  } finally {
    setTimeout(() => {
      isUploading.value = false
      uploadProgress.value = 0
    }, 1000)
    
    // Reset input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}
</script>

<template>
  <div
    class="relative rounded-lg border-2 border-dashed transition-colors duration-200"
    :class="[
      isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600',
      isUploading ? 'pointer-events-none opacity-70' : 'cursor-pointer'
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
        v-if="!isUploading"
        name="i-heroicons-cloud-arrow-up"
        class="w-10 h-10 text-gray-400 mb-3"
      />
      <UIcon
        v-else
        name="i-heroicons-arrow-path"
        class="w-10 h-10 text-primary-500 mb-3 animate-spin"
      />
      
      <div v-if="!isUploading">
        <p class="text-sm font-medium text-gray-900 dark:text-white">
          <span class="text-primary-500">Click to upload</span> or drag and drop
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Any file up to 50MB
        </p>
      </div>
      
      <div v-else class="w-full max-w-xs">
        <p class="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Uploading files...
        </p>
        <UProgress :value="uploadProgress" color="primary" size="sm" />
      </div>
    </div>
  </div>
</template>
