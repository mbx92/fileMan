/**
 * GET /api/files/search
 * Search files by name for the current user
 */
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const query = getQuery(event)
  const searchQuery = (query.q as string || '').trim()
  
  if (!searchQuery) {
    return { files: [] }
  }

  // Search files owned by user or shared with user
  const files = await prisma.file.findMany({
    where: {
      OR: [
        // Files owned by user
        {
          ownerId: user.id,
          name: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
        // Files shared with user
        {
          shares: {
            some: {
              sharedWithId: user.id,
            },
          },
          name: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      size: true,
      folderId: true,
    },
    take: 10,
    orderBy: {
      updatedAt: 'desc',
    },
  })

  return { files }
})
