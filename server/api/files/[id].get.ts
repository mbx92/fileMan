export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'File ID is required',
    })
  }

  // Get file from database
  const file = await prisma.file.findFirst({
    where: {
      id,
      ownerId: user.id,
    },
    include: {
      folder: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  if (!file) {
    // Check if file is shared with user
    const sharedFile = await prisma.share.findFirst({
      where: {
        fileId: id,
        sharedWithId: user.id,
      },
      include: {
        file: {
          include: {
            folder: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    if (!sharedFile || !sharedFile.file) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'File not found',
      })
    }

    return sharedFile.file
  }

  return file
})
