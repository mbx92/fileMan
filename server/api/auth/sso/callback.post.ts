import { exchangeCodeForTokens, fetchUserInfo } from '~/utils/auth'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody(event)

  const { code, codeVerifier, redirectUri } = body

  if (!code) {
    throw createError({
      statusCode: 400,
      message: 'Authorization code is required',
    })
  }

  try {
    // Exchange code for tokens (server-side)
    const tokenResponse = await $fetch<any>(`${config.public.sso.baseUrl}/api/oidc/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: config.public.sso.clientId,
        client_secret: config.sso.clientSecret, // Server-side only
        redirect_uri: redirectUri || config.public.sso.redirectUri,
        code,
        ...(codeVerifier && { code_verifier: codeVerifier }),
      }),
    })

    // Fetch user info
    const userInfo = await $fetch<any>(`${config.public.sso.baseUrl}/api/oidc/userinfo`, {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
    })

    return {
      tokens: tokenResponse,
      userInfo,
    }
  } catch (error: any) {
    console.error('SSO token exchange error:', error)
    throw createError({
      statusCode: error.statusCode || 401,
      message: error.data?.error_description || error.message || 'Failed to authenticate with SSO',
    })
  }
})
