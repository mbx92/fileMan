export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  // Get shared files where user is the recipient
  const shares = await prisma.share.findMany({
    where: {
      sharedWithId: user.id,
    },
    include: {
      file: true,
      folder: true,
      sharedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Normalize structure for FileBrowser
  const files = shares
    .filter(s => s.file)
    .map(s => ({
      ...s.file,
      sharedBy: s.sharedBy,
      permission: s.permission,
      shareId: s.id,
    }))

  const folders = shares
    .filter(s => s.folder)
    .map(s => ({
      ...s.folder,
      sharedBy: s.sharedBy,
      permission: s.permission,
      shareId: s.id,
    }))

  return {
    files,
    folders,
    breadcrumbs: [], // No hierarchical navigation for shared root for now
  }
})
