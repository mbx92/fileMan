/**
 * GET/POST /api/settings/general
 * Get or update system general settings
 */
export default defineEventHandler(async (event) => {
  const user = event.context.user
  
  // Only authenticated users can read
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  // GET - Return current settings
  if (event.method === 'GET') {
    let settings = await prisma.systemSettings.findUnique({
      where: { id: 'system' }
    })

    // Create default settings if not exists
    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: { id: 'system' }
      })
    }

    return settings
  }

  // POST/PUT - Update settings (admin only)
  if (event.method === 'POST' || event.method === 'PUT') {
    // Check admin permission
    if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Only admins can modify settings',
      })
    }

    const body = await readBody(event)

    // Validate input
    const allowedFields = [
      // General
      'systemName',
      'timezone',
      'maxFileSizeMB',
      'maxStorageGB',
      'allowPublicSharing',
      'allowUserRegistration',
      'sessionTimeoutMinutes',
      'logoUrl',
      'primaryColor',
      // Security
      'minPasswordLength',
      'requireSpecialChar',
      'requireUppercase',
      'requireNumber',
      'maxLoginAttempts',
      'lockoutDurationMinutes',
      'allowedFileTypes',
      'blockedFileTypes',
    ]

    // Filter only allowed fields
    const updateData: Record<string, any> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    // Validate specific fields
    if (updateData.maxFileSizeMB !== undefined) {
      const size = parseInt(updateData.maxFileSizeMB)
      if (isNaN(size) || size < 1 || size > 10240) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Max file size must be between 1 and 10240 MB',
        })
      }
      updateData.maxFileSizeMB = size
    }

    if (updateData.maxStorageGB !== undefined) {
      const size = parseInt(updateData.maxStorageGB)
      if (isNaN(size) || size < 1 || size > 1000) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Max storage must be between 1 and 1000 GB',
        })
      }
      updateData.maxStorageGB = size
    }

    if (updateData.sessionTimeoutMinutes !== undefined) {
      const timeout = parseInt(updateData.sessionTimeoutMinutes)
      if (isNaN(timeout) || timeout < 5 || timeout > 1440) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Session timeout must be between 5 and 1440 minutes',
        })
      }
      updateData.sessionTimeoutMinutes = timeout
    }

    // Upsert settings
    const settings = await prisma.systemSettings.upsert({
      where: { id: 'system' },
      update: updateData,
      create: { id: 'system', ...updateData },
    })

    return settings
  }
})
