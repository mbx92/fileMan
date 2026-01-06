export default defineAppConfig({
  // App branding
  app: {
    name: 'NuxtBase',
    description: 'Premium Nuxt UI Starter Kit',
    version: '1.0.0'
  },

  // UI theme configuration
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'slate'
    },
    button: {
      defaultVariants: {
        color: 'primary'
      }
    }
  },

  // Navigation configuration
  navigation: {
    // Main sidebar navigation
    sidebar: [
      {
        label: 'Dashboard',
        icon: 'i-heroicons-home',
        to: '/'
      },
      {
        label: 'Components',
        icon: 'i-heroicons-cube',
        to: '/components',
        children: [
          {
            label: 'Elements',
            icon: 'i-heroicons-squares-2x2',
            children: [
              { label: 'Button', to: '/components/elements/button' },
              { label: 'Badge', to: '/components/elements/badge' },
              { label: 'Avatar', to: '/components/elements/avatar' },
              { label: 'Icon', to: '/components/elements/icon' },
              { label: 'Chip', to: '/components/elements/chip' },
              { label: 'Kbd', to: '/components/elements/kbd' }
            ]
          },
          {
            label: 'Forms',
            icon: 'i-heroicons-pencil-square',
            children: [
              { label: 'Input', to: '/components/forms/input' },
              { label: 'Textarea', to: '/components/forms/textarea' },
              { label: 'Select', to: '/components/forms/select' },
              { label: 'Checkbox', to: '/components/forms/checkbox' },
              { label: 'Radio', to: '/components/forms/radio' },
              { label: 'Toggle', to: '/components/forms/toggle' }
            ]
          },
          {
            label: 'Data',
            icon: 'i-heroicons-table-cells',
            children: [
              { label: 'Table', to: '/components/data/table' },
              { label: 'Card', to: '/components/data/card' },
              { label: 'Skeleton', to: '/components/data/skeleton' }
            ]
          },
          {
            label: 'Navigation',
            icon: 'i-heroicons-bars-3',
            children: [
              { label: 'Tabs', to: '/components/navigation/tabs' },
              { label: 'Breadcrumb', to: '/components/navigation/breadcrumb' },
              { label: 'Pagination', to: '/components/navigation/pagination' },
              { label: 'NavigationMenu', to: '/components/navigation/navigation-menu' }
            ]
          },
          {
            label: 'Overlays',
            icon: 'i-heroicons-window',
            children: [
              { label: 'Modal', to: '/components/overlays/modal' },
              { label: 'Drawer', to: '/components/overlays/drawer' },
              { label: 'Popover', to: '/components/overlays/popover' },
              { label: 'Tooltip', to: '/components/overlays/tooltip' }
            ]
          },
          {
            label: 'Feedback',
            icon: 'i-heroicons-bell',
            children: [
              { label: 'Alert', to: '/components/feedback/alert' },
              { label: 'Toast', to: '/components/feedback/toast' },
              { label: 'Progress', to: '/components/feedback/progress' }
            ]
          }
        ]
      },
      {
        label: 'Examples',
        icon: 'i-heroicons-document-duplicate',
        children: [
          { label: 'Dashboard', to: '/examples/dashboard', icon: 'i-heroicons-chart-bar' },
          { label: 'Settings', to: '/examples/settings', icon: 'i-heroicons-cog-6-tooth' },
          { label: 'Profile', to: '/examples/profile', icon: 'i-heroicons-user' }
        ]
      }
    ]
  }
})
