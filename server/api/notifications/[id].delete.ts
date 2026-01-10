/**
 * DELETE /api/notifications/[id]
 * Delete a specific notification
 */
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const notificationId = getRouterParam(event, 'id')
  if (!notificationId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Notification ID is required',
    })
  }

  // Delete notification (only if it belongs to user)
  await prisma.notification.deleteMany({
    where: {
      id: notificationId,
      userId: user.id,
    },
  })

  return { success: true }
})
