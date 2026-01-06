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
    })
  }

  // Get share and verify ownership (either sharedBy or sharedWith?)
  // Usually only owner (sharedBy) can remove shares, or the recipient (sharedWith) can leave.
  const share = await prisma.share.findUnique({
    where: { id },
  })

  if (!share) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
    })
  }

  if (share.sharedById !== user.id && share.sharedWithId !== user.id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }

  await prisma.share.delete({
    where: { id },
  })

  return { success: true }
})
