<script setup lang="ts">
import * as mammoth from 'mammoth'
import * as XLSX from 'xlsx'

const props = defineProps<{
  fileId?: string
  fileName?: string
  mimeType?: string
  downloadUrl?: string
}>()

const isOpen = defineModel<boolean>('open', { default: false })

// Preview state
const isLoading = ref(true)
const error = ref<string | null>(null)
const previewContent = ref<string>('')
const excelData = ref<any[][]>([])
const currentSheet = ref(0)
const sheetNames = ref<string[]>([])

// Determine preview type
const previewType = computed(() => {
  const mime = props.mimeType || ''
  const name = props.fileName?.toLowerCase() || ''
  
  if (mime.startsWith('image/')) return 'image'
  if (mime === 'application/pdf' || name.endsWith('.pdf')) return 'pdf'
  if (mime.includes('word') || name.endsWith('.docx') || name.endsWith('.doc')) return 'docx'
  if (mime.includes('spreadsheet') || mime.includes('excel') || name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.csv')) return 'xlsx'
  if (mime.startsWith('text/') || name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.json') || name.endsWith('.js') || name.endsWith('.ts') || name.endsWith('.css') || name.endsWith('.html')) return 'text'
  if (mime.startsWith('video/')) return 'video'
  if (mime.startsWith('audio/')) return 'audio'
  
  return 'unsupported'
})

// Can preview
const canPreview = computed(() => previewType.value !== 'unsupported')

// Load preview when modal opens
watch([isOpen, () => props.downloadUrl], async ([open, url]) => {
  if (open && url) {
    await loadPreview()
  }
}, { immediate: true })

async function loadPreview() {
  if (!props.downloadUrl) return
  
  isLoading.value = true
  error.value = null
  previewContent.value = ''
  excelData.value = []
  
  try {
    switch (previewType.value) {
      case 'docx':
        await loadDocx()
        break
      case 'xlsx':
        await loadXlsx()
        break
      case 'text':
        await loadText()
        break
      default:
        // Image, PDF, Video, Audio handled directly in template
        break
    }
  } catch (e: any) {
    console.error('Preview error:', e)
    error.value = e.message || 'Failed to load preview'
  } finally {
    isLoading.value = false
  }
}

async function loadDocx() {
  const response = await fetch(props.downloadUrl!)
  const arrayBuffer = await response.arrayBuffer()
  const result = await mammoth.convertToHtml({ arrayBuffer })
  previewContent.value = result.value
}

async function loadXlsx() {
  const response = await fetch(props.downloadUrl!)
  const arrayBuffer = await response.arrayBuffer()
  const workbook = XLSX.read(arrayBuffer, { type: 'array' })
  
  sheetNames.value = workbook.SheetNames
  currentSheet.value = 0
  
  loadSheetData(workbook, 0)
}

function loadSheetData(workbook: XLSX.WorkBook, sheetIndex: number) {
  const sheetName = sheetNames.value[sheetIndex]
  if (!sheetName) return
  const worksheet = workbook.Sheets[sheetName]
  if (!worksheet) return
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]
  excelData.value = jsonData
}

async function loadText() {
  const response = await fetch(props.downloadUrl!)
  previewContent.value = await response.text()
}

// Format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Download file
function downloadFile() {
  if (props.downloadUrl) {
    window.open(props.downloadUrl, '_blank')
  }
}
</script>

<template>
  <UModal 
    v-model:open="isOpen" 
    :title="fileName || 'Preview'"
    description="File preview"
    fullscreen
  >
    <template #body>
      <div class="h-full flex flex-col">
        <!-- Toolbar -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <UIcon 
              :name="previewType === 'image' ? 'i-heroicons-photo' : 
                     previewType === 'pdf' ? 'i-heroicons-document-text' :
                     previewType === 'docx' ? 'i-heroicons-document' :
                     previewType === 'xlsx' ? 'i-heroicons-table-cells' :
                     'i-heroicons-document'"
              class="w-6 h-6 text-gray-400"
            />
            <span class="font-medium text-gray-900 dark:text-white">{{ fileName }}</span>
          </div>
          <div class="flex items-center gap-2">
            <UButton
              v-if="downloadUrl"
              icon="i-heroicons-arrow-down-tray"
              color="primary"
              variant="soft"
              @click="downloadFile"
            >
              Download
            </UButton>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
          <!-- Loading -->
          <div v-if="isLoading && previewType !== 'image' && previewType !== 'pdf' && previewType !== 'video' && previewType !== 'audio'" class="flex items-center justify-center h-full">
            <div class="text-center">
              <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500 mb-2" />
              <p class="text-gray-500">Loading preview...</p>
            </div>
          </div>

          <!-- Error -->
          <div v-else-if="error" class="flex items-center justify-center h-full">
            <div class="text-center">
              <UIcon name="i-heroicons-exclamation-circle" class="w-12 h-12 text-red-500 mb-4" />
              <p class="text-gray-900 dark:text-white font-medium mb-2">Failed to load preview</p>
              <p class="text-gray-500 text-sm">{{ error }}</p>
            </div>
          </div>

          <!-- Image Preview -->
          <div v-else-if="previewType === 'image'" class="flex items-center justify-center h-full">
            <img 
              :src="downloadUrl" 
              :alt="fileName"
              class="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              @load="isLoading = false"
            />
          </div>

          <!-- PDF Preview -->
          <div v-else-if="previewType === 'pdf'" class="h-full">
            <iframe 
              :src="downloadUrl" 
              class="w-full h-full rounded-lg border border-gray-200 dark:border-gray-700"
              @load="isLoading = false"
            />
          </div>

          <!-- Video Preview -->
          <div v-else-if="previewType === 'video'" class="flex items-center justify-center h-full">
            <video 
              :src="downloadUrl" 
              controls
              class="max-w-full max-h-full rounded-lg shadow-lg"
              @loadeddata="isLoading = false"
            />
          </div>

          <!-- Audio Preview -->
          <div v-else-if="previewType === 'audio'" class="flex items-center justify-center h-full">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
              <UIcon name="i-heroicons-musical-note" class="w-16 h-16 text-primary-500 mx-auto mb-4" />
              <p class="text-center text-gray-900 dark:text-white font-medium mb-4">{{ fileName }}</p>
              <audio 
                :src="downloadUrl" 
                controls
                class="w-full"
                @loadeddata="isLoading = false"
              />
            </div>
          </div>

          <!-- DOCX Preview -->
          <div v-else-if="previewType === 'docx' && previewContent" class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div class="prose dark:prose-invert max-w-none" v-html="previewContent" />
          </div>

          <!-- XLSX Preview -->
          <div v-else-if="previewType === 'xlsx' && excelData.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <!-- Sheet Tabs -->
            <div v-if="sheetNames.length > 1" class="flex gap-1 p-2 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <UButton
                v-for="(name, index) in sheetNames"
                :key="name"
                size="xs"
                :variant="currentSheet === index ? 'solid' : 'ghost'"
                :color="currentSheet === index ? 'primary' : 'neutral'"
                @click="currentSheet = index"
              >
                {{ name }}
              </UButton>
            </div>
            
            <!-- Table -->
            <div class="overflow-auto max-h-[70vh]">
              <table class="w-full text-sm">
                <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0">
                  <tr>
                    <th 
                      v-for="(cell, colIndex) in (excelData[0] || [])"
                      :key="colIndex"
                      class="px-4 py-2 text-left font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600"
                    >
                      {{ cell }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="(row, rowIndex) in excelData.slice(1)"
                    :key="rowIndex"
                    class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td 
                      v-for="(cell, colIndex) in row"
                      :key="colIndex"
                      class="px-4 py-2 text-gray-700 dark:text-gray-300"
                    >
                      {{ cell }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Text Preview -->
          <div v-else-if="previewType === 'text' && previewContent" class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <pre class="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">{{ previewContent }}</pre>
          </div>

          <!-- Unsupported -->
          <div v-else-if="previewType === 'unsupported'" class="flex items-center justify-center h-full">
            <div class="text-center">
              <UIcon name="i-heroicons-document" class="w-16 h-16 text-gray-300 mb-4" />
              <p class="text-gray-900 dark:text-white font-medium mb-2">Preview not available</p>
              <p class="text-gray-500 text-sm mb-4">This file type cannot be previewed</p>
              <UButton icon="i-heroicons-arrow-down-tray" @click="downloadFile">
                Download File
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.prose :deep(img) {
  max-width: 100%;
  height: auto;
}

.prose :deep(table) {
  width: 100%;
  border-collapse: collapse;
}

.prose :deep(td),
.prose :deep(th) {
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
}
</style>
