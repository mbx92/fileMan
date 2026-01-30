/**
 * GET /api/onlyoffice/download/[id]
 * Download endpoint for OnlyOffice Document Server
 * Uses a temporary signed token instead of user authentication
 */
import { jwtVerify } from 'jose'
import { getPresignedUrl } from '../../../utils/minio'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)
  const token = query.token as string

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'File ID is required',
    })
  }

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Token is required',
    })
  }

  // Verify token
  const config = useRuntimeConfig()
  const secret = new TextEncoder().encode(config.jwtSecret)

  try {
    const { payload } = await jwtVerify(token, secret)

    // Verify token is for this file
    if (payload.fileId !== id || payload.purpose !== 'onlyoffice-download') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Invalid token for this file',
      })
    }

    // Get file from database
    const file = await prisma.file.findUnique({
      where: { id },
    })

    if (!file) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'File not found',
      })
    }

    // Redirect to MinIO presigned URL (accessible from anywhere)
    const url = await getPresignedUrl(file.minioKey)
    console.log('[OnlyOffice Download] Redirecting to MinIO:', url.substring(0, 80) + '...')
    return sendRedirect(event, url)

  } catch (error: any) {
    console.error('[OnlyOffice Download] Token verification failed:', error.message)
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Invalid or expired token',
    })
  }
})
