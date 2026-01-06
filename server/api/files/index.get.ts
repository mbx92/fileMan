export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const query = getQuery(event)
  const folderId = query.folderId ? query.folderId.toString() : null

  // Get folders in current directory
  const folders = await prisma.folder.findMany({
    where: {
      ownerId: user.id,
      parentId: folderId,
    },
    orderBy: {
      name: 'asc',
    },
  })

  // Get files in current directory
  const files = await prisma.file.findMany({
    where: {
      ownerId: user.id,
      folderId: folderId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Get breadcrumbs if inside a folder
  let breadcrumbs: any[] = []
  if (folderId) {
    let currentFolderId = folderId
    while (currentFolderId) {
      const folder = await prisma.folder.findUnique({
        where: { id: currentFolderId },
        select: { id: true, name: true, parentId: true },
      })
      
      if (folder) {
        breadcrumbs.unshift({
          id: folder.id,
          name: folder.name,
        })
        currentFolderId = folder.parentId || ''
      } else {
        break
      }
    }
  }

  return {
    folders,
    files,
    breadcrumbs,
  }
})
