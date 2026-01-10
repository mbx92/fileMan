import { prisma } from '../../../utils/prisma'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'User ID is required'
    })
  }

  const { password } = body

  if (!password || password.length < 6) {
    throw createError({
      statusCode: 400,
      message: 'Password must be at least 6 characters'
    })
  }

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

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update user password
    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      }
    })

    return { 
      success: true,
      message: 'Password reset successfully' 
    }
  } catch (error: any) {
    console.error('Error resetting password:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to reset password'
    })
  }
})
