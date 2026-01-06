import { deleteFile } from '../../utils/minio'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Folder ID is required',
    })
  }

  // Get folder from database
  // If user is admin/superadmin, they can delete any folder
  // Otherwise, they can only delete their own
  const whereClause: any = { id }
  if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
    whereClause.ownerId = user.id
  }

  const folder = await prisma.folder.findFirst({
    where: whereClause,
    include: {
      files: true,
      children: true, // Check for subfolders
    },
  })

  if (!folder) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Folder not found',
    })
  }

  // Recursive delete function to handle nested files and folders
  // Note: Prisma cascade delete handles database records, but we need to delete files from MinIO manually
  async function deleteFolderContent(folderId: string) {
    // Get all files in this folder
    const files = await prisma.file.findMany({
      where: { folderId },
    })

    // Delete files from MinIO
    for (const file of files) {
      try {
        await deleteFile(file.minioKey)
      } catch (e) {
        console.error(`Failed to delete file ${file.id} from MinIO:`, e)
      }
    }

    // Get subfolders
    const subfolders = await prisma.folder.findMany({
      where: { parentId: folderId },
    })

    // Recursively delete subfolders
    for (const subfolder of subfolders) {
      await deleteFolderContent(subfolder.id)
    }
  }

  try {
    // Delete content from MinIO first
    await deleteFolderContent(id)

    // Delete shares associated with folder
    await prisma.share.deleteMany({
      where: { folderId: id },
    })

    // Delete folder from database (cascade will handle files and subfolders records if configured, but let's be safe)
    // Actually our schema doesn't have onDelete: Cascade for Folder children, so we rely on Prisma to delete related records if possible or we delete them explicitly.
    // Our schema for File has `folder Folder? @relation(fields: [folderId], references: [id])` which is optional, so files might just get folderId=null if we aren't careful?
    // Wait, typical file system behavior is everything inside is deleted.
    // Let's use `delete` which might fail if there are constraints.
    // Prisma `onDelete` actions:
    // User -> Folder: nothing
    // Folder -> Parent: nothing
    // Folder -> Files: nothing specific
    
    // We should enable cascade delete in schema for better integrity, but for now we manually clean up.
    
    // 1. Delete all files in this folder and subfolders (recursive)
    // We already did MinIO deletion. Now DB deletion.
    
    // Helper to get all nested folder IDs
    async function getAllFolderIds(rootId: string): Promise<string[]> {
      const ids = [rootId]
      const children = await prisma.folder.findMany({
        where: { parentId: rootId },
        select: { id: true },
      })
      for (const child of children) {
        ids.push(...(await getAllFolderIds(child.id)))
      }
      return ids
    }

    const allFolderIds = await getAllFolderIds(id)
    
    // Delete all files in these folders
    await prisma.file.deleteMany({
      where: { folderId: { in: allFolderIds } }
    })

    // Delete all shares for these folders and files (already handled file shares via cascade on file delete? No, Share->File has onDelete: Cascade. Share->Folder has onDelete: Cascade)
    // So file shares are gone. Folder shares need to be gone.
    await prisma.share.deleteMany({
      where: { folderId: { in: allFolderIds } }
    })

    // Delete folders in reverse order (children first)
    // A simple deleteMany might work if we didn't have self-relation constraints?
    // With self-relation, we must delete children first.
    // But `onDelete: Cascade` on the self-relation `children` would be ideal.
    // Let's trying deleting the root folder. If it fails, we need to update schema or manual recursive delete.
    // For now, let's assume manual recursive delete is safest without schema change.

    // Sort IDs by depth (approximation or just retry logic? No, let's just use deleteMany on files, then try delete on folders)
    // Actually, `delete` on a folder with children will throw Foreign Key constraint error if not cascade.
    
    // Let's try to update schema first? No, migration takes time.
    // Let's implement recursive delete function for DB records.
    
    async function recursiveDelete(targetId: string) {
      const children = await prisma.folder.findMany({
        where: { parentId: targetId }
      })
      for (const child of children) {
        await recursiveDelete(child.id)
      }
      // Delete files
       await prisma.file.deleteMany({
        where: { folderId: targetId }
      })
      // Delete folder
      await prisma.folder.delete({
        where: { id: targetId }
      })
    }
    
    await recursiveDelete(id)

    return {
      success: true,
      message: 'Folder deleted successfully',
    }
  } catch (error) {
    console.error('Failed to delete folder:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Failed to delete folder',
    })
  }
})
