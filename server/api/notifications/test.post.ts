/**
 * POST /api/notifications/test
 * Create a test notification for the current user (for debugging)
 */
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  // Create a test notification
  const notification = await prisma.notification.create({
    data: {
      userId: user.id,
      type: 'system',
      title: 'Welcome to FileMan!',
      message: 'Your notification system is working correctly.',
    },
  })

  return notification
})
