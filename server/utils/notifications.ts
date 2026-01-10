/**
 * Notification utility functions
 */

interface CreateNotificationParams {
  userId: string
  type: 'file_shared' | 'folder_shared' | 'public_link' | 'storage_warning' | 'system'
  title: string
  message?: string
  fileId?: string
  folderId?: string
}

/**
 * Create a notification for a user
 */
export async function createNotification(params: CreateNotificationParams) {
  const { userId, type, title, message, fileId, folderId } = params
  
  try {
    return await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        fileId,
        folderId,
      },
    })
  } catch (error) {
    console.error('Failed to create notification:', error)
    return null
  }
}

/**
 * Create notification when a file is shared with a user
 */
export async function notifyFileShared(
  sharedWithUserId: string,
  sharedByName: string,
  fileName: string,
  fileId: string
) {
  return createNotification({
    userId: sharedWithUserId,
    type: 'file_shared',
    title: 'File shared with you',
    message: `${sharedByName} shared "${fileName}" with you`,
    fileId,
  })
}

/**
 * Create notification when a folder is shared with a user
 */
export async function notifyFolderShared(
  sharedWithUserId: string,
  sharedByName: string,
  folderName: string,
  folderId: string
) {
  return createNotification({
    userId: sharedWithUserId,
    type: 'folder_shared',
    title: 'Folder shared with you',
    message: `${sharedByName} shared "${folderName}" with you`,
    folderId,
  })
}

/**
 * Create storage warning notification
 */
export async function notifyStorageWarning(userId: string, percentUsed: number) {
  return createNotification({
    userId,
    type: 'storage_warning',
    title: 'Storage almost full',
    message: `You have used ${percentUsed}% of your storage quota`,
  })
}
