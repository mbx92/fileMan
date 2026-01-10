import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const query = getQuery(event)
  const searchQuery = (query.q as string || '').trim()

  if (!searchQuery || searchQuery.length < 2) {
    return { users: [] }
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: user.id } }, // Exclude current user
          {
            OR: [
              { name: { contains: searchQuery, mode: 'insensitive' } },
              { email: { contains: searchQuery, mode: 'insensitive' } },
              { username: { contains: searchQuery, mode: 'insensitive' } },
            ]
          }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        avatar: true
      },
      take: 10
    })

    return { users }
  } catch (error) {
    console.error('User search error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to search users'
    })
  }
})
