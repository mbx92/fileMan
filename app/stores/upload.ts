import { defineStore } from 'pinia'

export interface UploadItem {
  id: string
  file: File
  fileName: string
  fileSize: number
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'failed' | 'cancelled'
  error?: string
  folderId?: string | null
  xhr?: XMLHttpRequest
  createdAt: number
}

interface UploadState {
  uploads: UploadItem[]
  isMinimized: boolean
}

export const useUploadStore = defineStore('upload', {
  state: (): UploadState => ({
    uploads: [],
    isMinimized: false,
  }),

  getters: {
    activeUploads: (state) => state.uploads.filter(u => 
      u.status === 'pending' || u.status === 'uploading'
    ),
    completedUploads: (state) => state.uploads.filter(u => u.status === 'completed'),
    failedUploads: (state) => state.uploads.filter(u => u.status === 'failed'),
    hasActiveUploads: (state) => state.uploads.some(u => 
      u.status === 'pending' || u.status === 'uploading'
    ),
    totalProgress: (state) => {
      const active = state.uploads.filter(u => 
        u.status === 'pending' || u.status === 'uploading' || u.status === 'completed'
      )
      if (active.length === 0) return 0
      const totalProgress = active.reduce((sum, u) => sum + u.progress, 0)
      return Math.round(totalProgress / active.length)
    },
    uploadCount: (state) => state.uploads.length,
  },

  actions: {
    addUpload(file: File, folderId?: string | null): string {
      const id = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      this.uploads.push({
        id,
        file,
        fileName: file.name,
        fileSize: file.size,
        progress: 0,
        status: 'pending',
        folderId,
        createdAt: Date.now(),
      })

      return id
    },

    updateProgress(id: string, progress: number) {
      const upload = this.uploads.find(u => u.id === id)
      if (upload) {
        upload.progress = Math.min(100, Math.max(0, progress))
        if (upload.status === 'pending') {
          upload.status = 'uploading'
        }
      }
    },

    setUploading(id: string, xhr: XMLHttpRequest) {
      const upload = this.uploads.find(u => u.id === id)
      if (upload) {
        upload.status = 'uploading'
        upload.xhr = xhr
      }
    },

    completeUpload(id: string) {
      const upload = this.uploads.find(u => u.id === id)
      if (upload) {
        upload.progress = 100
        upload.status = 'completed'
        upload.xhr = undefined
      }
    },

    failUpload(id: string, error: string) {
      const upload = this.uploads.find(u => u.id === id)
      if (upload) {
        upload.status = 'failed'
        upload.error = error
        upload.xhr = undefined
      }
    },

    cancelUpload(id: string) {
      const upload = this.uploads.find(u => u.id === id)
      if (upload) {
        if (upload.xhr) {
          upload.xhr.abort()
        }
        upload.status = 'cancelled'
        upload.xhr = undefined
      }
    },

    removeUpload(id: string) {
      const index = this.uploads.findIndex(u => u.id === id)
      if (index !== -1) {
        const upload = this.uploads[index]
        if (upload && upload.xhr) {
          upload.xhr.abort()
        }
        this.uploads.splice(index, 1)
      }
    },

    clearCompleted() {
      this.uploads = this.uploads.filter(u => 
        u.status !== 'completed' && u.status !== 'cancelled'
      )
    },

    clearAll() {
      // Abort all active uploads
      this.uploads.forEach(u => {
        if (u.xhr) {
          u.xhr.abort()
        }
      })
      this.uploads = []
    },

    toggleMinimized() {
      this.isMinimized = !this.isMinimized
    },

    setMinimized(value: boolean) {
      this.isMinimized = value
    },
  },
})
