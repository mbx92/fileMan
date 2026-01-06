import { z } from 'zod'

const shareSchema = z.object({
  email: z.string().email(),
  permission: z.enum(['VIEW', 'DOWNLOAD', 'EDIT']),
})

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const fileId = getRouterParam(event, 'id')
  if (!fileId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'File ID is required',
    })
  }

  // Verify ownership
  const file = await prisma.file.findFirst({
    where: { id: fileId, ownerId: user.id },
  })

  if (!file) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'File not found',
    })
  }

  if (event.method === 'GET') {
    // List shares
    const shares = await prisma.share.findMany({
      where: { fileId },
      include: {
        sharedWith: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
          },
        },
      },
    })
    return shares
  }

  if (event.method === 'POST') {
    // Create share
    const body = await readBody(event)
    const result = shareSchema.safeParse(body)
    if (!result.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: result.error.errors[0].message
      })
    }

    const { email, permission } = result.data

    // Find user to share with
    const shareWithUser = await prisma.user.findUnique({
      where: { email },
    })

    if (!shareWithUser) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'User not found',
      })
    }

    if (shareWithUser.id === user.id) {
       throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Cannot share with yourself',
      })
    }

    // Check existing share
    const existingShare = await prisma.share.findFirst({
      where: {
        fileId,
        sharedWithId: shareWithUser.id,
      },
    })

    if (existingShare) {
      // Update permission
      return await prisma.share.update({
        where: { id: existingShare.id },
        data: { permission },
      })
    }

    return await prisma.share.create({
      data: {
        fileId,
        sharedById: user.id,
        sharedWithId: shareWithUser.id,
        permission,
      },
    })
  }
})
