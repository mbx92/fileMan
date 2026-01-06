import { Client } from 'minio'
import { Buffer } from 'buffer'

let minioClient: Client | null = null

/**
 * Get MinIO client instance (singleton)
 */
export function getMinioClient(): Client {
  if (minioClient) {
    return minioClient
  }

  const config = useRuntimeConfig()
  const endpoint = config.minio.endpoint || 'localhost:9000'
  
  // Parse endpoint - handle URLs with protocol (https://host or http://host:port)
  let host: string
  let port: number
  let useSSL: boolean
  
  try {
    // Check if endpoint is a URL with protocol
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      const url = new URL(endpoint)
      host = url.hostname
      port = url.port ? parseInt(url.port, 10) : (url.protocol === 'https:' ? 443 : 80)
      useSSL = url.protocol === 'https:'
    } else {
      // Legacy format: host:port
      const parts = endpoint.split(':')
      host = parts[0] || 'localhost'
      port = parts[1] ? parseInt(parts[1], 10) : 9000
      const useSslValue = config.minio.useSSL
      useSSL = useSslValue === true || String(useSslValue) === 'true'
    }
  } catch (e) {
    // Fallback to simple parsing
    const parts = endpoint.replace(/^https?:\/\//, '').split(':')
    host = parts[0] || 'localhost'
    port = parts[1] ? parseInt(parts[1], 10) : 443
    const useSslFallback = config.minio.useSSL
    useSSL = endpoint.startsWith('https://') || useSslFallback === true || String(useSslFallback) === 'true'
  }

  console.log(`[MinIO] Connecting to ${host}:${port} (SSL: ${useSSL})`)

  minioClient = new Client({
    endPoint: host,
    port: port,
    useSSL: useSSL,
    accessKey: config.minio.accessKey,
    secretKey: config.minio.secretKey,
  })

  return minioClient
}


/**
 * Get bucket name from config
 */
export function getBucketName(): string {
  const config = useRuntimeConfig()
  return config.minio.bucketName || 'fileman'
}

/**
 * Ensure bucket exists, create if not
 */
export async function ensureBucketExists(): Promise<void> {
  const client = getMinioClient()
  const bucketName = getBucketName()

  const exists = await client.bucketExists(bucketName)
  if (!exists) {
    await client.makeBucket(bucketName)
  }
}

/**
 * Upload a file to MinIO
 */
export async function uploadFile(
  objectKey: string,
  buffer: Buffer,
  mimeType: string
): Promise<void> {
  const client = getMinioClient()
  const bucketName = getBucketName()

  await ensureBucketExists()
  await client.putObject(bucketName, objectKey, buffer, buffer.length, {
    'Content-Type': mimeType,
  })
}

/**
 * Create an empty folder in MinIO
 */
export async function createFolder(folderKey: string): Promise<void> {
  const client = getMinioClient()
  const bucketName = getBucketName()

  await ensureBucketExists()
  
  // Create empty object with trailing slash to simulate folder
  if (!folderKey.endsWith('/')) {
    folderKey += '/'
  }
  
  await client.putObject(bucketName, folderKey, Buffer.from(''), 0, {
    'Content-Type': 'application/x-directory',
  })
}

/**
 * Download a file from MinIO
 */
export async function downloadFile(objectKey: string): Promise<Buffer> {
  const client = getMinioClient()
  const bucketName = getBucketName()

  const stream = await client.getObject(bucketName, objectKey)
  const chunks: Buffer[] = []

  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: Buffer) => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
    stream.on('error', reject)
  })
}

/**
 * Delete a file from MinIO
 */
export async function deleteFile(objectKey: string): Promise<void> {
  const client = getMinioClient()
  const bucketName = getBucketName()

  console.log(`[MinIO] Removing object: ${objectKey} from bucket: ${bucketName}`)
  await client.removeObject(bucketName, objectKey)

}

/**
 * Generate a presigned URL for downloading a file
 */
export async function getPresignedUrl(
  objectKey: string,
  expirySeconds: number = 3600 // 1 hour default
): Promise<string> {
  const client = getMinioClient()
  const bucketName = getBucketName()

  return await client.presignedGetObject(bucketName, objectKey, expirySeconds)
}

/**
 * Generate unique object key for a file
 */
export function generateObjectKey(userId: string, originalName: string, folderPath: string = ''): string {
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 8)
  const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_')
  
  // Ensure folderPath ends with / if it exists and doesn't have it
  let prefix = folderPath
  if (prefix && !prefix.endsWith('/')) {
    prefix += '/'
  }
  
  // Remove leading slash if exists to avoid double slashes or absolute path confusion
  if (prefix.startsWith('/')) {
    prefix = prefix.substring(1)
  }

  return `${userId}/${prefix}${timestamp}-${randomStr}-${safeName}`
}
