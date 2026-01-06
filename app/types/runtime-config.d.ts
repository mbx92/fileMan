declare module 'nuxt/schema' {
  interface RuntimeConfig {
    jwtSecret: string
    jwtExpiresIn: string
    databaseUrl: string
    sso: {
      clientSecret: string
    }
    minio: {
      endpoint: string
      accessKey: string
      secretKey: string
      bucketName: string
      useSSL: boolean
    }
  }

  interface PublicRuntimeConfig {
    appName: string
    sso: {
      baseUrl: string
      clientId: string
      redirectUri: string
      scopes: string[]
    }
  }
}

export {}
