/**
 * GET /api/notifications
 * Get notifications for the current user
 */
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  // Get query params
  const query = getQuery(event)
  const limit = parseInt(query.limit as string) || 20
  const unreadOnly = query.unread === 'true'

  const notifications = await prisma.notification.findMany({
    where: {
      userId: user.id,
      ...(unreadOnly && { isRead: false }),
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  })

  // Get unread count
  const unreadCount = await prisma.notification.count({
    where: {
      userId: user.id,
      isRead: false,
    },
  })

  return {
    notifications,
    unreadCount,
  }
})
