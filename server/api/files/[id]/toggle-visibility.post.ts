import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
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
      message: 'You can only change visibility of your own files'
    })
  }

  // Toggle visibility
  const updatedFile = await prisma.file.update({
    where: { id },
    data: {
      isPublic: !file.isPublic
    }
  })

  return {
    success: true,
    isPublic: updatedFile.isPublic,
    message: updatedFile.isPublic ? 'File is now public' : 'File is now private'
  }
})
