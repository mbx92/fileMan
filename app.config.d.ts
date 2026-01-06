export {}

declare module 'nuxt/schema' {
  interface AppConfig {
    ui: {
      colors: {
        primary: string
        neutral: string
      }
      button: {
        defaultVariants: {
          color: string
        }
      }
    }
    app: {
      name: string
      description: string
      version: string
    }
    navigation: {
      sidebar: Array<{
        label: string
        icon?: string
        to?: string
        children?: Array<{
          label: string
          icon?: string
          to?: string
          children?: Array<{
            label: string
            icon?: string
            to?: string
          }>
        }>
      }>
    }
  }
}
