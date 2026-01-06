export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  try {
    // Test SSO server by fetching OIDC configuration
    const wellKnownUrl = `${config.public.sso.baseUrl}/.well-known/openid-configuration`
    
    const response = await $fetch<any>(wellKnownUrl, {
      method: 'GET',
    })

    return {
      success: true,
      message: 'SSO server is reachable',
      issuer: response.issuer || config.public.sso.baseUrl,
      endpoints: {
        authorization: response.authorization_endpoint,
        token: response.token_endpoint,
        userinfo: response.userinfo_endpoint,
      },
    }
  } catch (error: any) {
    // Try alternative endpoint
    try {
      const altUrl = `${config.public.sso.baseUrl}/api/oidc/token`
      await $fetch(altUrl, {
        method: 'OPTIONS',
      })
      
      return {
        success: true,
        message: 'SSO server is reachable (basic check)',
        baseUrl: config.public.sso.baseUrl,
        note: 'OIDC discovery endpoint not available, but server is responding',
      }
    } catch {
      console.error('SSO test failed:', error)
      throw createError({
        statusCode: 500,
        message: `SSO connection failed: ${error.message || 'Server not reachable'}`,
      })
    }
  }
})
