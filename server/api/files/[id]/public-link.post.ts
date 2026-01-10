import { prisma } from '../../../utils/prisma'
import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  // Check if public sharing is allowed
  const settings = await prisma.systemSettings.findUnique({
    where: { id: 'system' }
  })
  if (settings && !settings.allowPublicSharing) {
    throw createError({
      statusCode: 403,
      message: 'Public sharing is disabled by administrator'
    })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'File ID is required'
    })
  }

  // Get file and verify ownership
  const file = await prisma.file.findUnique({
    where: { id }
  })

  if (!file) {
    throw createError({
      statusCode: 404,
      message: 'File not found'
    })
  }

  if (file.ownerId !== user.id) {
    throw createError({
      statusCode: 403,
      message: 'You can only generate public links for your own files'
    })
  }

  // Generate unique public token
  const publicToken = crypto.randomBytes(32).toString('hex')

  // Create or update share with public token
  const existingShare = await prisma.share.findFirst({
    where: {
      fileId: id,
      sharedById: user.id,
      sharedWithId: null, // Public share (no specific user)
      publicToken: { not: null }
    }
  })

  let share
  if (existingShare) {
    // Regenerate token
    share = await prisma.share.update({
      where: { id: existingShare.id },
      data: { publicToken }
    })
  } else {
    // Create new public share
    share = await prisma.share.create({
      data: {
        fileId: id,
        sharedById: user.id,
        sharedWithId: null,
        publicToken,
        permission: 'DOWNLOAD'
      }
    })
  }

  // Also mark file as public
  await prisma.file.update({
    where: { id },
    data: { isPublic: true }
  })

  const config = useRuntimeConfig()
  const baseUrl = config.public.appUrl || 'http://localhost:3000'
  const publicUrl = `${baseUrl}/public/${publicToken}`

  return {
    success: true,
    publicToken,
    publicUrl,
    message: 'Public link generated successfully'
  }
})
