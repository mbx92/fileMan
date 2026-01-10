/**
 * POST /api/notifications/read
 * Mark notification(s) as read
 */
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const body = await readBody(event)
  const { ids } = body

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Notification IDs are required',
    })
  }

  // Mark specified notifications as read (only if they belong to user)
  await prisma.notification.updateMany({
    where: {
      id: { in: ids },
      userId: user.id,
    },
    data: {
      isRead: true,
    },
  })

  return { success: true }
})
