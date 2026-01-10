import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'User ID is required'
    })
  }

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    // Delete user (this will cascade delete related records due to Prisma schema)
    await prisma.user.delete({
      where: { id }
    })

    return {
      success: true,
      message: 'User deleted successfully'
    }
  } catch (error: any) {
    console.error('Error deleting user:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to delete user'
    })
  }
})
