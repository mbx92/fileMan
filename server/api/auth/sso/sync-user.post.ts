/**
 * Sync SSO user to database
 * Creates or updates user with SSO data and roles
 * Also generates internal JWT token for API authentication
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userInfo } = body

  if (!userInfo?.sub || !userInfo?.email) {
    throw createError({
      statusCode: 400,
      message: 'Invalid user info',
    })
  }

  try {
    // Map SSO role to FileMan role
    let role: 'USER' | 'ADMIN' | 'SUPERADMIN' = 'USER'
    
    if (userInfo.role) {
      const ssoRole = userInfo.role.toLowerCase()
      if (ssoRole === 'superadmin' || ssoRole === 'super_admin') {
        role = 'SUPERADMIN'
      } else if (ssoRole === 'admin' || ssoRole === 'administrator') {
        role = 'ADMIN'
      }
    } else if (userInfo.role_name) {
      // Alternative: use role_name field
      const roleName = userInfo.role_name.toLowerCase()
      if (roleName.includes('superadmin') || roleName.includes('super')) {
        role = 'SUPERADMIN'
      } else if (roleName.includes('admin')) {
        role = 'ADMIN'
      }
    }

    // Upsert user to database (use email as unique key)
    const user = await prisma!.user.upsert({
      where: { 
        email: userInfo.email 
      },
      update: {
        email: userInfo.email,
        username: userInfo.preferred_username || userInfo.email.split('@')[0],
        name: userInfo.name,
        avatar: userInfo.avatar_url || userInfo.picture,
        role: role,
        ssoProvider: 'oidc',
      },
      create: {
        ssoId: userInfo.sub,
        email: userInfo.email,
        username: userInfo.preferred_username || userInfo.email.split('@')[0],
        name: userInfo.name,
        avatar: userInfo.avatar_url || userInfo.picture,
        role: role,
        ssoProvider: 'oidc',
        password: null, // SSO users don't have local password
      },
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
      },
    })

    // Generate internal JWT token for API authentication
    const internalToken = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Set auth_token cookie
    const config = useRuntimeConfig(event)
    const isSecure = config.cookieSecure === 'true' || config.cookieSecure === true
    setCookie(event, 'auth_token', internalToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return {
      user,
      syncedRole: role,
      internalToken, // Return token so client can store it
    }
  } catch (error: any) {
    console.error('Failed to sync SSO user:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to sync user to database',
    })
  }
})

