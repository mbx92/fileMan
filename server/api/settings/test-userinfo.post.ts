/**
 * Test SSO UserInfo endpoint
 * Requires a valid access token to test
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody(event)
  
  const { accessToken } = body

  if (!accessToken) {
    throw createError({
      statusCode: 400,
      message: 'Access token is required for testing userinfo',
    })
  }

  try {
    // Fetch userinfo from SSO
    const userInfo = await $fetch<any>(`${config.public.sso.baseUrl}/api/oidc/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    // Check which role fields are present
    const roleFields = {
      hasRole: !!userInfo.role,
      roleValue: userInfo.role || null,
      hasRoleName: !!userInfo.role_name,
      roleNameValue: userInfo.role_name || null,
      hasRoleId: !!userInfo.role_id,
      roleIdValue: userInfo.role_id || null,
    }

    return {
      success: true,
      message: 'UserInfo fetched successfully',
      userInfo,
      roleFields,
      allFields: Object.keys(userInfo),
    }
  } catch (error: any) {
    console.error('Failed to fetch SSO userinfo:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.data?.error_description || error.message || 'Failed to fetch userinfo',
    })
  }
})
