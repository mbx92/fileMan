import { getPresignedUrl } from '../../../utils/minio'

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
  })

  if (!file) {
    // Check if file is shared with user with download permission
    const sharedFile = await prisma.share.findFirst({
      where: {
        fileId: id,
        sharedWithId: user.id,
        permission: {
          in: ['DOWNLOAD', 'EDIT'],
        },
      },
      include: {
        file: true,
      },
    })

    if (!sharedFile || !sharedFile.file) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'File not found or no download permission',
      })
    }

    // Generate presigned URL for shared file
    const url = await getPresignedUrl(sharedFile.file.minioKey)
    return sendRedirect(event, url)
  }

  // Generate presigned URL
  const url = await getPresignedUrl(file.minioKey)
  return sendRedirect(event, url)
})
