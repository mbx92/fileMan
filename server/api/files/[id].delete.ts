import { deleteFile } from '../../utils/minio'

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
  const whereClause: any = { id }
  if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
    whereClause.ownerId = user.id
  }

  const file = await prisma.file.findFirst({
    where: whereClause,
  })

  if (!file) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'File not found',
    })
  }

  try {
    // Delete from MinIO
    console.log(`[API] Deleting file ${id} from MinIO with key: ${file.minioKey}`)
    await deleteFile(file.minioKey)


    // Delete shares first (due to foreign key)
    await prisma.share.deleteMany({
      where: { fileId: id },
    })

    // Delete from database
    await prisma.file.delete({
      where: { id },
    })

    return {
      success: true,
      message: 'File deleted successfully',
    }
  } catch (error) {
    console.error('Failed to delete file:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Failed to delete file',
    })
  }
})
