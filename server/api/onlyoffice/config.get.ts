/**
 * GET /api/onlyoffice/config
 * Get OnlyOffice configuration for a file
 */
import { SignJWT } from 'jose'
import { prisma } from '../../utils/prisma'
import { getPresignedUrl } from '../../utils/minio'

// OnlyOffice document types mapping
const DOCUMENT_TYPES: Record<string, { documentType: string; fileType: string }> = {
  // Word documents
  '.doc': { documentType: 'word', fileType: 'doc' },
  '.docx': { documentType: 'word', fileType: 'docx' },
  '.odt': { documentType: 'word', fileType: 'odt' },
  '.rtf': { documentType: 'word', fileType: 'rtf' },
  '.txt': { documentType: 'word', fileType: 'txt' },
  // Excel documents
  '.xls': { documentType: 'cell', fileType: 'xls' },
  '.xlsx': { documentType: 'cell', fileType: 'xlsx' },
  '.ods': { documentType: 'cell', fileType: 'ods' },
  '.csv': { documentType: 'cell', fileType: 'csv' },
  // PowerPoint documents
  '.ppt': { documentType: 'slide', fileType: 'ppt' },
  '.pptx': { documentType: 'slide', fileType: 'pptx' },
  '.odp': { documentType: 'slide', fileType: 'odp' },
  // PDF
  '.pdf': { documentType: 'word', fileType: 'pdf' },
}

// Get file extension from filename
function getFileExtension(filename: string): string {
  const ext = filename.toLowerCase().match(/\.[^.]+$/)?.[0] || ''
  return ext
}

// Check if file is supported by OnlyOffice
export function isOnlyOfficeSupported(filename: string): boolean {
  const ext = getFileExtension(filename)
  return ext in DOCUMENT_TYPES
}

// Generate JWT token for OnlyOffice using jose
async function generateJwtToken(payload: any, secret: string): Promise<string> {
  if (!secret) return ''
  
  const secretKey = new TextEncoder().encode(secret)
  
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secretKey)
}

// Generate download token for OnlyOffice to access files
async function generateDownloadToken(fileId: string, jwtSecret: string): Promise<string> {
  const secretKey = new TextEncoder().encode(jwtSecret)
  
  return await new SignJWT({
    fileId,
    purpose: 'onlyoffice-download',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h') // Token valid for 1 hour
    .sign(secretKey)
}

export default defineEventHandler(async (event) => {
  const user = event.context.user
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const query = getQuery(event)
  const fileId = query.fileId as string

  if (!fileId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'File ID is required',
    })
  }

  // Get system settings
  const settings = await prisma.systemSettings.findUnique({
    where: { id: 'system' },
  })

  if (!settings?.onlyofficeEnabled || !settings?.onlyofficeUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'OnlyOffice is not configured',
    })
  }

  // Get file info
  const file = await prisma.file.findUnique({
    where: { id: fileId },
    include: { owner: true },
  })

  if (!file) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'File not found',
    })
  }

  // Check permission
  const isOwner = file.ownerId === user.id
  const isAdmin = user.role === 'ADMIN' || user.role === 'SUPERADMIN'
  
  // Check if user has access via share
  const share = await prisma.share.findFirst({
    where: {
      fileId: file.id,
      sharedWithId: user.id,
    },
  })

  if (!isOwner && !isAdmin && !share) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'You do not have access to this file',
    })
  }

  // Get file extension and document type
  const ext = getFileExtension(file.originalName)
  const docInfo = DOCUMENT_TYPES[ext]

  if (!docInfo) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'File type not supported by OnlyOffice',
    })
  }

  // Determine permissions
  const canEdit = settings.onlyofficeEditEnabled && (isOwner || isAdmin || share?.permission === 'EDIT')
  const coEditing = settings.onlyofficeCoEdit

  // Get runtime config
  const config = useRuntimeConfig()
  
  // Build document URL - use MinIO presigned URL directly (accessible from anywhere)
  // This allows OnlyOffice server to download files regardless of network topology
  const documentUrl = await getPresignedUrl(file.minioKey, 3600) // 1 hour expiry
  
  console.log('[OnlyOffice] Document URL (MinIO presigned):', documentUrl.substring(0, 80) + '...')
  
  // Build callback URL for saving - needs to be accessible from OnlyOffice server
  const requestOrigin = getRequestURL(event).origin
  const baseUrl = config.publicUrl || requestOrigin
  const callbackUrl = `${baseUrl}/api/onlyoffice/callback?fileId=${file.id}`
  
  console.log('[OnlyOffice] Callback URL:', callbackUrl)

  // Build OnlyOffice config
  const documentKey = `${file.id}_${file.updatedAt.getTime()}`
  
  const onlyofficeConfig: any = {
    document: {
      fileType: docInfo.fileType,
      key: documentKey,
      title: file.originalName,
      url: documentUrl,
      permissions: {
        comment: canEdit,
        download: true,
        edit: canEdit,
        print: true,
        review: canEdit,
        copy: true,
      },
    },
    documentType: docInfo.documentType,
    editorConfig: {
      callbackUrl: canEdit ? callbackUrl : undefined,
      lang: 'en',
      mode: canEdit ? 'edit' : 'view',
      user: {
        id: user.id,
        name: user.name || user.username || user.email,
      },
      customization: {
        autosave: true,
        chat: coEditing,
        comments: canEdit,
        compactHeader: false,
        compactToolbar: false,
        feedback: false,
        forcesave: true,
        help: false,
        hideRightMenu: false,
        hideRulers: false,
        logo: {
          image: `${baseUrl}/favicon.svg`,
          imageEmbedded: `${baseUrl}/favicon.svg`,
        },
        mentionShare: false,
        plugins: false,
        reviewDisplay: 'markup',
        spellcheck: true,
        unit: 'cm',
        zoom: 100,
      },
      coEditing: coEditing ? {
        mode: 'fast',
        change: true,
      } : undefined,
    },
    height: '100%',
    width: '100%',
    type: 'desktop',
  }

  // Add JWT token if secret is configured
  const secret = settings.onlyofficeSecret || config.onlyoffice?.secret
  if (secret) {
    onlyofficeConfig.token = await generateJwtToken(onlyofficeConfig, secret)
  }

  return {
    config: onlyofficeConfig,
    onlyofficeUrl: settings.onlyofficeUrl,
    documentServerUrl: `${settings.onlyofficeUrl}/web-apps/apps/api/documents/api.js`,
  }
})
