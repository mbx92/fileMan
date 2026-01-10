import { z } from 'zod'
import { uploadFile, generateObjectKey } from '../../utils/minio'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  // Get system settings for validation
  let settings = await prisma.systemSettings.findUnique({
    where: { id: 'system' }
  })
  if (!settings) {
    settings = await prisma.systemSettings.create({
      data: { id: 'system' }
    })
  }

  const maxFileSizeBytes = settings.maxFileSizeMB * 1024 * 1024
  const maxStorageBytes = settings.maxStorageGB * 1024 * 1024 * 1024
  const blockedTypes = settings.blockedFileTypes.split(',').map(t => t.trim().toLowerCase())
  const allowedTypes = settings.allowedFileTypes === '*' 
    ? null 
    : settings.allowedFileTypes.split(',').map(t => t.trim().toLowerCase())

  // Check user's current storage usage
  const storageUsed = await prisma.file.aggregate({
    where: { ownerId: user.id },
    _sum: { size: true }
  })
  const currentStorageUsed = storageUsed._sum.size || 0

  // Parse multipart form data
  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'No file uploaded',
    })
  }

  // Get folder ID from form data if provided
  let folderId: string | null = null
  const folderField = formData.find((f) => f.name === 'folderId')
  if (folderField) {
    folderId = folderField.data.toString()
    // Verify folder exists and belongs to user
    if (folderId) {
      const folder = await prisma.folder.findFirst({
        where: {
          id: folderId,
          ownerId: user.id,
        },
      })
      if (!folder) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Not Found',
          message: 'Folder not found',
        })
      }
    }
  }

  const uploadedFiles: any[] = []

  for (const file of formData) {
    // Skip non-file fields
    if (!file.filename) continue

    const originalName = file.filename
    const mimeType = file.type || 'application/octet-stream'
    const buffer = file.data
    const fileExtension = '.' + originalName.split('.').pop()?.toLowerCase()

    // Check file size limit
    if (buffer.length > maxFileSizeBytes) {
      throw createError({
        statusCode: 413,
        statusMessage: 'Payload Too Large',
        message: `File "${originalName}" exceeds the maximum size of ${settings.maxFileSizeMB} MB`,
      })
    }

    // Check storage quota
    if (currentStorageUsed + buffer.length > maxStorageBytes) {
      throw createError({
        statusCode: 413,
        statusMessage: 'Storage Limit Exceeded',
        message: `Uploading this file would exceed your storage quota of ${settings.maxStorageGB} GB`,
      })
    }

    // Check blocked file types
    if (blockedTypes.some(ext => ext && fileExtension === ext)) {
      throw createError({
        statusCode: 415,
        statusMessage: 'Unsupported Media Type',
        message: `File type "${fileExtension}" is not allowed for security reasons`,
      })
    }

    // Check allowed file types (if not wildcard)
    if (allowedTypes && !allowedTypes.some(ext => ext && fileExtension === ext)) {
      throw createError({
        statusCode: 415,
        statusMessage: 'Unsupported Media Type',
        message: `File type "${fileExtension}" is not in the list of allowed types`,
      })
    }

    // Build full folder path for MinIO
    let folderPath = ''
    if (folderId) {
      const getFolderPath = async (currentFolderId: string): Promise<string> => {
        const folder = await prisma.folder.findUnique({
          where: { id: currentFolderId },
          include: { parent: true }
        })
        
        if (!folder) return ''
        
        const parentPath = folder.parentId ? await getFolderPath(folder.parentId) : ''
        return parentPath ? `${parentPath}/${folder.name}` : folder.name
      }
      
      folderPath = await getFolderPath(folderId)
    }

    // Generate unique object key with folder path
    const objectKey = generateObjectKey(user.id, originalName, folderPath)

    try {
      // Upload to MinIO
      await uploadFile(objectKey, buffer, mimeType)

      // Create database record
      const dbFile = await prisma.file.create({
        data: {
          name: originalName,
          originalName,
          mimeType,
          size: buffer.length,
          minioKey: objectKey,
          folderId,
          ownerId: user.id,
        },
      })

      uploadedFiles.push(dbFile)
    } catch (error) {
      console.error('Failed to upload file:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'Failed to upload file',
      })
    }
  }

  return {
    success: true,
    files: uploadedFiles,
  }
})
