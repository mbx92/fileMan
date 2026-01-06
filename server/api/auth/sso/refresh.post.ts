export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody(event)

  const { refreshToken } = body

  if (!refreshToken) {
    throw createError({
      statusCode: 400,
      message: 'Refresh token is required',
    })
  }

  try {
    const tokenResponse = await $fetch(`${config.public.sso.baseUrl}/api/oidc/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: config.public.sso.clientId,
        client_secret: config.sso.clientSecret,
        refresh_token: refreshToken,
      }),
    })

    return {
      tokens: tokenResponse,
    }
  } catch (error: any) {
    console.error('SSO token refresh error:', error)
    throw createError({
      statusCode: error.statusCode || 401,
      message: error.data?.error_description || error.message || 'Failed to refresh token',
    })
  }
})
