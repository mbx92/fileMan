import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validate input
  const result = loginSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: result.error.errors[0].message
    })
  }

  const { email, password } = result.data

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Invalid email or password'
    })
  }

  // Check if user has password (might be SSO-only user)
  if (!user.password) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Please use SSO to login'
    })
  }

  // Verify password
  const isValidPassword = await comparePassword(password, user.password)
  if (!isValidPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Invalid email or password'
    })
  }

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

  // Return user data (without password)
  const { password: _, ...userWithoutPassword } = user
  return {
    user: userWithoutPassword,
    token,
  }
})
