import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username too long'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validate input
  const result = registerSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: result.error.errors[0].message
    })
  }

  const { email, username, password, name } = result.data

  // Check if email already exists
  const existingEmail = await prisma.user.findUnique({
    where: { email }
  })

  if (existingEmail) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Conflict',
      message: 'Email already registered'
    })
  }

  // Check if username already exists
  const existingUsername = await prisma.user.findUnique({
    where: { username }
  })

  if (existingUsername) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Conflict',
      message: 'Username already taken'
    })
  }

  // Hash password
  const hashedPassword = await hashPassword(password)

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      name: name || username,
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    }
  })

  // Generate JWT token
  const token = await signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  })

  // Set cookie
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: getTokenExpiration(),
  })

  return {
    user,
    token,
  }
})
