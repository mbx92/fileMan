import { defineStore } from 'pinia'

interface SystemSettings {
  systemName: string
  timezone: string
  maxFileSizeMB: number
  maxStorageGB: number
  allowPublicSharing: boolean
  allowUserRegistration: boolean
  sessionTimeoutMinutes: number
  primaryColor: string
  minPasswordLength: number
  requireSpecialChar: boolean
  requireUppercase: boolean
  requireNumber: boolean
  maxLoginAttempts: number
  lockoutDurationMinutes: number
  allowedFileTypes: string
  blockedFileTypes: string
  // OnlyOffice settings
  onlyofficeEnabled?: boolean
  onlyofficeUrl?: string
  onlyofficeEditEnabled?: boolean
  onlyofficeCoEdit?: boolean
}

// Helper function to convert hex to HSL
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  // Remove # if present
  hex = hex.replace('#', '')
  
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

export const useSettingsStore = defineStore('settings', {
  state: (): { settings: SystemSettings | null; isLoaded: boolean } => ({
    settings: null,
    isLoaded: false,
  }),

  getters: {
    systemName: (state) => state.settings?.systemName || 'FileMan',
    primaryColor: (state) => state.settings?.primaryColor || '#3b82f6',
    maxFileSizeMB: (state) => state.settings?.maxFileSizeMB || 100,
    maxStorageGB: (state) => state.settings?.maxStorageGB || 10,
    allowPublicSharing: (state) => state.settings?.allowPublicSharing ?? true,
    onlyofficeEnabled: (state) => state.settings?.onlyofficeEnabled ?? false,
    onlyofficeUrl: (state) => state.settings?.onlyofficeUrl || '',
    onlyofficeEditEnabled: (state) => state.settings?.onlyofficeEditEnabled ?? false,
    onlyofficeCoEdit: (state) => state.settings?.onlyofficeCoEdit ?? false,
  },

  actions: {
    // Apply primary color to CSS variables
    applyPrimaryColor(hexColor: string) {
      if (typeof document === 'undefined') return
      
      // Convert hex to RGB
      const hex = hexColor.replace('#', '')
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)
      
      const root = document.documentElement
      
      // Generate color shades by adjusting brightness
      // Nuxt UI uses RGB format like "59 130 246" for --color-primary-500
      const lighten = (r: number, g: number, b: number, factor: number) => ({
        r: Math.min(255, Math.round(r + (255 - r) * factor)),
        g: Math.min(255, Math.round(g + (255 - g) * factor)),
        b: Math.min(255, Math.round(b + (255 - b) * factor)),
      })
      
      const darken = (r: number, g: number, b: number, factor: number) => ({
        r: Math.max(0, Math.round(r * (1 - factor))),
        g: Math.max(0, Math.round(g * (1 - factor))),
        b: Math.max(0, Math.round(b * (1 - factor))),
      })
      
      // Generate palette
      const shades = {
        50: lighten(r, g, b, 0.95),
        100: lighten(r, g, b, 0.9),
        200: lighten(r, g, b, 0.7),
        300: lighten(r, g, b, 0.5),
        400: lighten(r, g, b, 0.25),
        500: { r, g, b },
        600: darken(r, g, b, 0.1),
        700: darken(r, g, b, 0.25),
        800: darken(r, g, b, 0.4),
        900: darken(r, g, b, 0.55),
        950: darken(r, g, b, 0.7),
      }
      
      // Apply to CSS custom properties
      Object.entries(shades).forEach(([shade, color]) => {
        root.style.setProperty(`--color-primary-${shade}`, `${color.r} ${color.g} ${color.b}`)
      })
    },

    async fetchSettings() {
      try {
        const data = await $fetch<SystemSettings>('/api/settings/general')
        this.settings = data
        this.isLoaded = true
        
        // Apply primary color
        if (data.primaryColor) {
          this.applyPrimaryColor(data.primaryColor)
        }
      } catch (error) {
        console.error('Failed to fetch system settings:', error)
        // Use defaults
        this.settings = {
          systemName: 'FileMan',
          timezone: 'Asia/Jakarta',
          maxFileSizeMB: 100,
          maxStorageGB: 10,
          allowPublicSharing: true,
          allowUserRegistration: false,
          sessionTimeoutMinutes: 60,
          primaryColor: '#3b82f6',
          minPasswordLength: 8,
          requireSpecialChar: true,
          requireUppercase: true,
          requireNumber: true,
          maxLoginAttempts: 5,
          lockoutDurationMinutes: 15,
          allowedFileTypes: '*',
          blockedFileTypes: '.exe,.bat,.cmd,.sh,.ps1',
        }
        this.isLoaded = true
      }
    },

    updateSettings(newSettings: Partial<SystemSettings>) {
      if (this.settings) {
        this.settings = { ...this.settings, ...newSettings }
        
        // Apply primary color if changed
        if (newSettings.primaryColor) {
          this.applyPrimaryColor(newSettings.primaryColor)
        }
      }
    },
  },
})
