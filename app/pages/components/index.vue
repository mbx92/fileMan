<script setup lang="ts">
// Component categories with preview info
const categories = [
  {
    title: 'Elements',
    description: 'Basic building blocks for your UI',
    icon: 'i-heroicons-squares-2x2',
    color: 'from-blue-500 to-cyan-500',
    items: [
      { name: 'Button', description: 'Clickable button with variants', to: '/components/elements/button' },
      { name: 'Badge', description: 'Status indicators and labels', to: '/components/elements/badge' },
      { name: 'Avatar', description: 'User profile images', to: '/components/elements/avatar' },
      { name: 'Icon', description: 'Heroicons integration', to: '/components/elements/icon' },
      { name: 'Chip', description: 'Compact element for tags', to: '/components/elements/chip' },
      { name: 'Kbd', description: 'Keyboard key styling', to: '/components/elements/kbd' }
    ]
  },
  {
    title: 'Forms',
    description: 'Input components for user data',
    icon: 'i-heroicons-pencil-square',
    color: 'from-purple-500 to-pink-500',
    items: [
      { name: 'Input', description: 'Text input fields', to: '/components/forms/input' },
      { name: 'Textarea', description: 'Multi-line text input', to: '/components/forms/textarea' },
      { name: 'Select', description: 'Dropdown selection', to: '/components/forms/select' },
      { name: 'Checkbox', description: 'Boolean selection', to: '/components/forms/checkbox' },
      { name: 'Radio', description: 'Single choice selection', to: '/components/forms/radio' },
      { name: 'Toggle', description: 'On/off switches', to: '/components/forms/toggle' }
    ]
  },
  {
    title: 'Data Display',
    description: 'Components to present data',
    icon: 'i-heroicons-table-cells',
    color: 'from-orange-500 to-red-500',
    items: [
      { name: 'Table', description: 'Data tables with sorting', to: '/components/data/table' },
      { name: 'Card', description: 'Content containers', to: '/components/data/card' },
      { name: 'Skeleton', description: 'Loading placeholders', to: '/components/data/skeleton' }
    ]
  },
  {
    title: 'Navigation',
    description: 'Components for moving around',
    icon: 'i-heroicons-bars-3',
    color: 'from-green-500 to-emerald-500',
    items: [
      { name: 'Tabs', description: 'Tabbed interfaces', to: '/components/navigation/tabs' },
      { name: 'Breadcrumb', description: 'Location indicators', to: '/components/navigation/breadcrumb' },
      { name: 'Pagination', description: 'Page navigation', to: '/components/navigation/pagination' },
      { name: 'NavigationMenu', description: 'Complex navigation', to: '/components/navigation/navigation-menu' }
    ]
  },
  {
    title: 'Overlays',
    description: 'Floating UI elements',
    icon: 'i-heroicons-window',
    color: 'from-indigo-500 to-purple-500',
    items: [
      { name: 'Modal', description: 'Dialog windows', to: '/components/overlays/modal' },
      { name: 'Drawer', description: 'Side panels', to: '/components/overlays/drawer' },
      { name: 'Popover', description: 'Floating content', to: '/components/overlays/popover' },
      { name: 'Tooltip', description: 'Helpful hints', to: '/components/overlays/tooltip' }
    ]
  },
  {
    title: 'Feedback',
    description: 'User feedback components',
    icon: 'i-heroicons-bell',
    color: 'from-yellow-500 to-orange-500',
    items: [
      { name: 'Alert', description: 'Important messages', to: '/components/feedback/alert' },
      { name: 'Toast', description: 'Notification popups', to: '/components/feedback/toast' },
      { name: 'Progress', description: 'Progress indicators', to: '/components/feedback/progress' }
    ]
  }
]

// Calculate total components
const totalComponents = computed(() => {
  return categories.reduce((sum, cat) => sum + cat.items.length, 0)
})
</script>

<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <div class="page-header mb-8">
      <div class="flex items-center gap-3 mb-2">
        <h1 class="page-title text-gray-900 dark:text-white">Components</h1>
        <UBadge color="primary" variant="subtle">{{ totalComponents }} components</UBadge>
      </div>
      <p class="page-description text-gray-600 dark:text-gray-400">
        Explore all available Nuxt UI components with live examples, code snippets, and documentation.
      </p>
    </div>

    <!-- Search (optional enhancement) -->
    <div class="mb-8">
      <UInput
        icon="i-heroicons-magnifying-glass"
        placeholder="Search components..."
        size="lg"
        class="max-w-md"
      />
    </div>

    <!-- Categories -->
    <div class="space-y-12">
      <section v-for="category in categories" :key="category.title">
        <!-- Category Header -->
        <div class="flex items-center gap-4 mb-6">
          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br', category.color]">
            <UIcon :name="category.icon" class="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ category.title }}</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ category.description }}</p>
          </div>
        </div>

        <!-- Component Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NuxtLink
            v-for="item in category.items"
            :key="item.name"
            :to="item.to"
            class="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg transition-all"
          >
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                  {{ item.name }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ item.description }}
                </p>
              </div>
              <UIcon
                name="i-heroicons-arrow-right"
                class="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all mt-1"
              />
            </div>

            <!-- Mini preview placeholder -->
            <div class="mt-4 h-12 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center border border-dashed border-gray-200 dark:border-gray-700">
              <span class="text-xs text-gray-400 dark:text-gray-500">Preview</span>
            </div>
          </NuxtLink>
        </div>
      </section>
    </div>

    <!-- Pro tip -->
    <div class="mt-12 p-6 rounded-xl bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-200 dark:border-primary-800">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
          <UIcon name="i-heroicons-light-bulb" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Pro Tip</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Use <UKbd>⌘</UKbd> + <UKbd>K</UKbd> to quickly search for any component from anywhere in the app.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
