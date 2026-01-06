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
