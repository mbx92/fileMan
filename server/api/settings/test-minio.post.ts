import { getMinioClient } from '../../utils/minio'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  try {
    const minioClient = getMinioClient()
    
    // Test connection by checking if bucket exists
    const bucketExists = await minioClient.bucketExists(config.minio.bucketName)

    if (!bucketExists) {
      return {
        success: true,
        message: 'MinIO connection successful, but bucket does not exist',
        connected: true,
        bucketExists: false,
        bucketName: config.minio.bucketName,
      }
    }

    return {
      success: true,
      message: 'MinIO connection successful',
      connected: true,
      bucketExists: true,
      bucketName: config.minio.bucketName,
    }
  } catch (error: any) {
    console.error('MinIO test failed:', error)
    throw createError({
      statusCode: 500,
      message: `MinIO connection failed: ${error.message}`,
    })
  }
})
