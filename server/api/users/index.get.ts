import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Get all users from database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        ssoProvider: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return {
      users,
      total: users.length,
      ssoUsers: users.filter(u => u.ssoProvider).length,
      admins: users.filter(u => u.role !== 'USER').length,
      regularUsers: users.filter(u => u.role === 'USER').length,
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch users'
    })
  }
})
