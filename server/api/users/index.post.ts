import { prisma } from '../../utils/prisma'
import { hashPassword } from '../../utils/password'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const { username, email, name, role, password } = body

  if (!username || !email || !name || !password) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields'
    })
  }

  try {
    // Check if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    })

    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: 'Username or email already exists'
      })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        name,
        role: role || 'USER',
        password: hashedPassword,
        ssoProvider: null,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        ssoProvider: true,
        createdAt: true,
      }
    })

    return { user }
  } catch (error: any) {
    console.error('Error creating user:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create user'
    })
  }
})
