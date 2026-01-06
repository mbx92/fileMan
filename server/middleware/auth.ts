import { H3Event } from 'h3'
import type { User } from '@prisma/client'

// Extend H3EventContext to include user
declare module 'h3' {
  interface H3EventContext {
    user?: Omit<User, 'password'>
  }
}

/**
 * Server middleware to validate JWT token and attach user to event context
 * Only applies to /api/ routes (excluding /api/auth/*)
 */
export default defineEventHandler(async (event: H3Event) => {
  const path = getRequestURL(event).pathname

  // Skip auth for non-API routes
  if (!path.startsWith('/api/')) {
    return
  }

  // Skip auth for auth endpoints
  if (path.startsWith('/api/auth/')) {
    return
  }

  // Skip auth for Nuxt icon endpoints
  if (path.startsWith('/api/_nuxt_icon/')) {
    return
  }

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

  // Attach user to event context
  event.context.user = user
})
