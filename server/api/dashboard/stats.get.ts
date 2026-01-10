/**
 * GET /api/dashboard/stats
 * Get dashboard statistics for the current user
 */
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  // Count files owned by user
  const totalFiles = await prisma.file.count({
    where: { ownerId: user.id },
  })

  // Count folders owned by user
  const totalFolders = await prisma.folder.count({
    where: { ownerId: user.id },
  })

  // Calculate total storage used
  const storageResult = await prisma.file.aggregate({
    where: { ownerId: user.id },
    _sum: { size: true },
  })
  const storageUsed = storageResult._sum.size || 0

  // Count shared files (files shared with others)
  const sharedFiles = await prisma.share.count({
    where: {
      file: { ownerId: user.id },
    },
  })

  return {
    totalFiles,
    totalFolders,
    storageUsed,
    sharedFiles,
  }
})
