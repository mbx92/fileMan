import { z } from 'zod'
import { createFolder } from '../../utils/minio'

const createFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required').max(255),
  parentId: z.string().optional().nullable(),
})

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const body = await readBody(event)

  // Validate input
  const result = createFolderSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: result.error.errors[0].message
    })
  }

  const { name, parentId } = result.data

  // Verify parent folder exists and belongs to user if provided
  if (parentId) {
    const parentFolder = await prisma.folder.findFirst({
      where: {
        id: parentId,
        ownerId: user.id,
      },
    })

    if (!parentFolder) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Parent folder not found',
      })
    }
  }

  // Create folder
  try {
    const folder = await prisma.folder.create({
      data: {
        name,
        parentId,
        ownerId: user.id,
      },
    })

    // Create folder in MinIO (best effort)
    try {
      let minioPath = `${user.id}/${name}/`
      
      if (parentId) {
        // Build path from parents
        const parents: string[] = []
        let currentId = parentId
        let depth = 0
        
        while (currentId && depth < 10) { // Limit depth to avoid infinite loops
          const pFolder = await prisma.folder.findUnique({
            where: { id: currentId },
            select: { id: true, name: true, parentId: true }
          })
          
          if (!pFolder) break
          parents.unshift(pFolder.name)
          currentId = pFolder.parentId || null
          depth++
        }
        
        if (parents.length > 0) {
          minioPath = `${user.id}/${parents.join('/')}/${name}/`
        }
      }

      await createFolder(minioPath)
    } catch (minioError) {
      console.error('Failed to create MinIO folder:', minioError)
      // Don't fail the request if MinIO folder creation fails, as it's secondary
    }

    return folder
  } catch (error) {
    console.error('Failed to create folder:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Failed to create folder',
    })
  }
})
