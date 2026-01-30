/**
 * POST /api/onlyoffice/callback
 * Callback endpoint for OnlyOffice Document Server to save edited documents
 */
import { jwtVerify } from 'jose'
import { Buffer } from 'buffer'
import { prisma } from '../../utils/prisma'
import { uploadBuffer } from '../../utils/minio'

// OnlyOffice callback statuses
const CALLBACK_STATUS = {
  EDITING: 1,           // Document is being edited
  READY_FOR_SAVE: 2,    // Document is ready for saving
  SAVE_ERROR: 3,        // Document saving error occurred
  CLOSED_NO_CHANGES: 4, // Document closed with no changes
  SAVE_IN_PROGRESS: 6,  // Document is being saved
  FORCE_SAVE: 7,        // Force save request
}

// Verify JWT token from OnlyOffice using jose
async function verifyJwtToken(token: string, secret: string): Promise<any> {
  if (!secret || !token) return null
  
  try {
    const secretKey = new TextEncoder().encode(secret)
    const { payload } = await jwtVerify(token, secretKey)
    return payload
  } catch {
    return null
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const fileId = query.fileId as string

  if (!fileId) {
    return { error: 1 } // Error response for OnlyOffice
  }

  const body = await readBody(event)
  console.log('[OnlyOffice Callback] Received:', JSON.stringify(body, null, 2))

  // Get settings
  const settings = await prisma.systemSettings.findUnique({
    where: { id: 'system' },
  })

  if (!settings?.onlyofficeEnabled) {
    return { error: 1 }
  }

  // Verify JWT if secret is configured
  const config = useRuntimeConfig()
  const secret = settings.onlyofficeSecret || config.onlyoffice?.secret
  
  if (secret && body.token) {
    const verified = await verifyJwtToken(body.token, secret)
    if (!verified) {
      console.error('[OnlyOffice Callback] JWT verification failed')
      return { error: 1 }
    }
  }

  const { status, url, key, users } = body

  // Handle different callback statuses
  switch (status) {
    case CALLBACK_STATUS.EDITING:
      // Document is being edited, no action needed
      console.log('[OnlyOffice Callback] Document is being edited by:', users)
      break

    case CALLBACK_STATUS.READY_FOR_SAVE:
    case CALLBACK_STATUS.FORCE_SAVE:
      // Document is ready to be saved
      if (!url) {
        console.error('[OnlyOffice Callback] No URL provided for saving')
        return { error: 1 }
      }

      try {
        // Download the edited document from OnlyOffice
        console.log('[OnlyOffice Callback] Downloading edited document from:', url)
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`Failed to download document: ${response.status}`)
        }

        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Get original file info
        const file = await prisma.file.findUnique({
          where: { id: fileId },
        })

        if (!file) {
          console.error('[OnlyOffice Callback] File not found:', fileId)
          return { error: 1 }
        }

        // Upload to MinIO
        await uploadBuffer(buffer, file.minioKey, file.mimeType)

        // Update file metadata
        await prisma.file.update({
          where: { id: fileId },
          data: {
            size: buffer.length,
            updatedAt: new Date(),
          },
        })

        console.log('[OnlyOffice Callback] Document saved successfully:', fileId)
      } catch (error) {
        console.error('[OnlyOffice Callback] Error saving document:', error)
        return { error: 1 }
      }
      break

    case CALLBACK_STATUS.SAVE_ERROR:
      console.error('[OnlyOffice Callback] Document save error')
      break

    case CALLBACK_STATUS.CLOSED_NO_CHANGES:
      console.log('[OnlyOffice Callback] Document closed without changes')
      break

    case CALLBACK_STATUS.SAVE_IN_PROGRESS:
      console.log('[OnlyOffice Callback] Document save in progress')
      break

    default:
      console.log('[OnlyOffice Callback] Unknown status:', status)
  }

  // Return success response to OnlyOffice
  return { error: 0 }
})
