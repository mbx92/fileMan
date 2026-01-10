import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'User ID is required'
    })
  }

  const { name, email, role } = body

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    // Check if email is being changed and already exists
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findFirst({
        where: {
          email,
          NOT: { id }
        }
      })

      if (emailExists) {
        throw createError({
          statusCode: 400,
          message: 'Email already exists'
        })
      }
    }

    // Update user
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        ssoProvider: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return { user }
  } catch (error: any) {
    console.error('Error updating user:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to update user'
    })
  }
})
