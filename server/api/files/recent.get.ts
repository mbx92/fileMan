/**
 * GET /api/files/recent
 * Get recently accessed/modified files for the current user
 */
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  // Get files owned by user or shared with user, ordered by last modified
  const recentFiles = await prisma.file.findMany({
    where: {
      OR: [
        { ownerId: user.id },
        {
          shares: {
            some: {
              sharedWithId: user.id,
            },
          },
        },
      ],
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: 50, // Limit to 50 most recent
    select: {
      id: true,
      name: true,
      originalName: true,
      mimeType: true,
      size: true,
      createdAt: true,
      updatedAt: true,
      folder: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  return recentFiles
})
