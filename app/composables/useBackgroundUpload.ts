import { useUploadStore } from '~/stores/upload'

export function useBackgroundUpload() {
  const uploadStore = useUploadStore()
  const toast = useToast()

  /**
   * Upload a single file with progress tracking
   */
  async function uploadFile(file: File, folderId?: string | null): Promise<boolean> {
    const uploadId = uploadStore.addUpload(file, folderId)

    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest()
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100)
          uploadStore.updateProgress(uploadId, percentComplete)
        }
      })

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          uploadStore.completeUpload(uploadId)
          resolve(true)
        } else {
          let errorMessage = 'Upload failed'
          try {
            const response = JSON.parse(xhr.responseText)
            errorMessage = response.message || response.statusMessage || errorMessage
          } catch {
            // Keep default error message
          }
          uploadStore.failUpload(uploadId, errorMessage)
          resolve(false)
        }
      })

      // Handle errors
      xhr.addEventListener('error', () => {
        uploadStore.failUpload(uploadId, 'Network error occurred')
        resolve(false)
      })

      // Handle abort
      xhr.addEventListener('abort', () => {
        uploadStore.failUpload(uploadId, 'Upload cancelled')
        resolve(false)
      })

      // Prepare and send request
      const formData = new FormData()
      formData.append('files', file)
      if (folderId) {
        formData.append('folderId', folderId)
      }

      xhr.open('POST', '/api/files/upload')
      xhr.withCredentials = true
      
      // Store XHR reference for cancellation
      uploadStore.setUploading(uploadId, xhr)
      
      xhr.send(formData)
    })
  }

  /**
   * Upload multiple files
   */
  async function uploadFiles(files: FileList | File[], folderId?: string | null): Promise<void> {
    const fileArray = Array.from(files)
    
    // Start all uploads in parallel
    const uploadPromises = fileArray.map(file => uploadFile(file, folderId))
    
    const results = await Promise.all(uploadPromises)
    
    const successCount = results.filter(r => r).length
    const failCount = results.filter(r => !r).length

    if (successCount > 0 && failCount === 0) {
      toast.add({
        title: 'Upload Complete',
        description: `${successCount} file(s) uploaded successfully`,
        color: 'success',
      })
    } else if (successCount > 0 && failCount > 0) {
      toast.add({
        title: 'Partial Upload',
        description: `${successCount} file(s) uploaded, ${failCount} failed`,
        color: 'warning',
      })
    } else if (failCount > 0) {
      toast.add({
        title: 'Upload Failed',
        description: `${failCount} file(s) failed to upload`,
        color: 'error',
      })
    }
  }

  /**
   * Cancel a specific upload
   */
  function cancelUpload(id: string) {
    uploadStore.cancelUpload(id)
  }

  /**
   * Cancel all active uploads
   */
  function cancelAllUploads() {
    uploadStore.activeUploads.forEach(upload => {
      uploadStore.cancelUpload(upload.id)
    })
  }

  /**
   * Remove a completed/failed upload from the list
   */
  function removeUpload(id: string) {
    uploadStore.removeUpload(id)
  }

  /**
   * Clear all completed uploads
   */
  function clearCompleted() {
    uploadStore.clearCompleted()
  }

  return {
    uploadFile,
    uploadFiles,
    cancelUpload,
    cancelAllUploads,
    removeUpload,
    clearCompleted,
    // Expose store getters for convenience
    uploads: computed(() => uploadStore.uploads),
    activeUploads: computed(() => uploadStore.activeUploads),
    hasActiveUploads: computed(() => uploadStore.hasActiveUploads),
    totalProgress: computed(() => uploadStore.totalProgress),
  }
}
