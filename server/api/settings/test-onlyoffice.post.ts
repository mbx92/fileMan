/**
 * POST /api/settings/test-onlyoffice
 * Test OnlyOffice Document Server connection
 */
export default defineEventHandler(async (event) => {
  const user = event.context.user

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  // Check admin permission
  if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }

  const body = await readBody(event)
  const { url } = body

  if (!url) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'OnlyOffice URL is required',
    })
  }

  try {
    // Try to fetch the OnlyOffice API endpoint
    const apiUrl = `${url.replace(/\/$/, '')}/web-apps/apps/api/documents/api.js`
    
    const response = await fetch(apiUrl, {
      method: 'HEAD',
      headers: {
        'Accept': '*/*',
      },
    })

    if (response.ok) {
      // Also try to get server info
      let serverInfo = null
      try {
        const infoResponse = await fetch(`${url.replace(/\/$/, '')}/info`)
        if (infoResponse.ok) {
          serverInfo = await infoResponse.json()
        }
      } catch {
        // Info endpoint might not be available
      }

      return {
        success: true,
        message: 'OnlyOffice Document Server is reachable',
        url,
        apiUrl,
        serverInfo,
      }
    } else {
      throw new Error(`Server returned status ${response.status}`)
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Connection Failed',
      message: `Failed to connect to OnlyOffice: ${error.message}`,
    })
  }
})
