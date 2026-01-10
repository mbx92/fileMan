import { prisma } from '../../utils/prisma'
import { getPresignedUrl } from '../../utils/minio'

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')
  
  if (!token) {
    throw createError({
      statusCode: 400,
      message: 'Token is required'
    })
  }

  // Find share by public token
  const share = await prisma.share.findUnique({
    where: { publicToken: token },
    include: {
      file: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              username: true
            }
          }
        }
      },
      folder: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              username: true
            }
          },
          files: true
        }
      }
    }
  })

  if (!share) {
    throw createError({
      statusCode: 404,
      message: 'Invalid or expired link'
    })
  }

  // Check if share has expired
  if (share.expiresAt && new Date() > share.expiresAt) {
    throw createError({
      statusCode: 410,
      message: 'This link has expired'
    })
  }

  // Return file or folder info based on what's shared
  if (share.file) {
    // Generate presigned URL for download
    const downloadUrl = await getPresignedUrl(share.file.minioKey, 3600) // 1 hour expiry

    return {
      type: 'file',
      file: {
        id: share.file.id,
        name: share.file.name,
        originalName: share.file.originalName,
        mimeType: share.file.mimeType,
        size: share.file.size,
        createdAt: share.file.createdAt
      },
      owner: share.file.owner,
      permission: share.permission,
      downloadUrl: share.permission !== 'VIEW' ? downloadUrl : null
    }
  }

  if (share.folder) {
    return {
      type: 'folder',
      folder: {
        id: share.folder.id,
        name: share.folder.name,
        fileCount: share.folder.files.length,
        createdAt: share.folder.createdAt
      },
      files: share.folder.files.map(f => ({
        id: f.id,
        name: f.name,
        originalName: f.originalName,
        mimeType: f.mimeType,
        size: f.size
      })),
      owner: share.folder.owner,
      permission: share.permission
    }
  }

  throw createError({
    statusCode: 500,
    message: 'Invalid share configuration'
  })
})
