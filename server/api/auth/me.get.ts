export default defineEventHandler(async (event) => {
  // Get token from cookie or Authorization header
  const token = getCookie(event, 'auth_token') ||
    getHeader(event, 'Authorization')?.replace('Bearer ', '')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Authentication required'
    })
  }

  // Verify token
  const payload = await verifyToken(token)
  if (!payload) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Invalid or expired token'
    })
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      role: true,
      ssoProvider: true,
      ssoId: true,
      createdAt: true,
      updatedAt: true,
    }
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'User not found'
    })
  }

  return { user }
})
