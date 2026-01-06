export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  return {
    endpoint: config.minio.endpoint,
    bucketName: config.minio.bucketName,
    useSSL: config.minio.useSSL,
    // Don't expose access keys
  }
})
