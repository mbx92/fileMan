// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-05',

  devtools: { enabled: false },

  devServer: {
    port: 3003,
  },

  future: {
    compatibilityVersion: 4,
  },

  modules: ['@nuxt/ui', '@nuxt/image', '@pinia/nuxt', '@vueuse/nuxt', '@nuxt/devtools'],

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: '',
  },

  runtimeConfig: {
    // Server-only config
    jwtSecret: process.env.JWT_SECRET || 'default-secret-change-me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    databaseUrl: process.env.DATABASE_URL,
    sso: {
      clientSecret: process.env.SSO_CLIENT_SECRET,
    },
    minio: {
      endpoint: process.env.MINIO_ENDPOINT || 'localhost:9000',
      accessKey: process.env.MINIO_ACCESS_KEY || '',
      secretKey: process.env.MINIO_SECRET_KEY || '',
      bucketName: process.env.MINIO_BUCKET_NAME || 'fileman',
      useSSL: process.env.MINIO_USE_SSL === 'true',
    },
    onlyoffice: {
      secret: process.env.ONLYOFFICE_SECRET || '',
    },
    // Public URL for external services access (e.g., OnlyOffice)
    publicUrl: process.env.PUBLIC_URL || '',
    // Public config (available client-side)
    public: {
      appName: 'FileMan',
      sso: {
        baseUrl: process.env.SSO_BASE_URL || '',
        clientId: process.env.SSO_CLIENT_ID || '',
        redirectUri: process.env.SSO_REDIRECT_URI || 'http://localhost:3003/auth/callback',
        scopes: ['openid', 'profile', 'email'],
      },
      onlyoffice: {
        url: process.env.ONLYOFFICE_URL || '',
      },
    }
  },

  app: {
    head: {
      title: 'FileMan - Internal File Sharing',
      meta: [
        { name: 'description', content: 'Secure internal file sharing for your organization' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap' }
      ],
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },
})