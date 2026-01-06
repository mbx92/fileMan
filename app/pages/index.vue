<script setup lang="ts">
const appConfig = useAppConfig()

// Dashboard stats
const stats = [
  { label: 'Components', value: '50+', icon: 'i-heroicons-cube', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Examples', value: '12', icon: 'i-heroicons-document-duplicate', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { label: 'Dark Mode', value: 'Yes', icon: 'i-heroicons-moon', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { label: 'TypeScript', value: '100%', icon: 'i-heroicons-code-bracket', color: 'text-cyan-500', bg: 'bg-cyan-500/10' }
]

// Quick links
const quickLinks = [
  {
    title: 'Elements',
    description: 'Buttons, badges, avatars, and more',
    icon: 'i-heroicons-squares-2x2',
    to: '/components/elements/button',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Forms',
    description: 'Input fields, selects, toggles',
    icon: 'i-heroicons-pencil-square',
    to: '/components/forms/input',
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Data Display',
    description: 'Tables, cards, skeletons',
    icon: 'i-heroicons-table-cells',
    to: '/components/data/table',
    color: 'from-orange-500 to-red-500'
  },
  {
    title: 'Navigation',
    description: 'Tabs, breadcrumbs, pagination',
    icon: 'i-heroicons-bars-3',
    to: '/components/navigation/tabs',
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Overlays',
    description: 'Modals, drawers, popovers',
    icon: 'i-heroicons-window',
    to: '/components/overlays/modal',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    title: 'Feedback',
    description: 'Alerts, toasts, progress bars',
    icon: 'i-heroicons-bell',
    to: '/components/feedback/alert',
    color: 'from-yellow-500 to-orange-500'
  }
]

// Recent updates
const recentUpdates = [
  { title: 'Added Modal component docs', date: 'Just now' },
  { title: 'Updated Button variants', date: '2 hours ago' },
  { title: 'New Table examples', date: 'Yesterday' },
  { title: 'Form validation guide', date: '2 days ago' }
]
</script>

<template>
  <div class="animate-fade-in">
    <!-- Hero Section -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 md:p-12 mb-8">
      <!-- Background decoration -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
      </div>
      
      <div class="relative">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <UIcon name="i-heroicons-cube" class="w-7 h-7 text-white" />
          </div>
          <UBadge color="primary" variant="subtle">v{{ appConfig.app?.version || '1.0.0' }}</UBadge>
        </div>
        
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-3">
          Welcome to {{ appConfig.app?.name || 'NuxtBase' }}
        </h1>
        <p class="text-lg text-gray-300 max-w-2xl mb-6">
          A premium Nuxt UI starter kit with comprehensive component documentation.
          Build beautiful applications faster with pre-built components and examples.
        </p>
        
        <div class="flex flex-wrap gap-3">
          <UButton to="/components" size="lg">
            <UIcon name="i-heroicons-book-open" class="w-5 h-5 mr-2" />
            Browse Components
          </UButton>
          <UButton to="/examples/dashboard" variant="outline" color="white" size="lg">
            <UIcon name="i-heroicons-eye" class="w-5 h-5 mr-2" />
            View Examples
          </UButton>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800"
      >
        <div class="flex items-center justify-between mb-3">
          <div :class="[stat.bg, 'w-10 h-10 rounded-lg flex items-center justify-center']">
            <UIcon :name="stat.icon" :class="[stat.color, 'w-5 h-5']" />
          </div>
        </div>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Quick Links Grid -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink
          v-for="link in quickLinks"
          :key="link.title"
          :to="link.to"
          class="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 hover:border-gray-300 dark:hover:border-gray-700 transition-all hover:shadow-lg"
        >
          <div :class="['absolute top-0 right-0 w-32 h-32 opacity-10 blur-2xl bg-gradient-to-br', link.color]" />
          
          <div class="relative">
            <div :class="['w-10 h-10 rounded-lg mb-4 flex items-center justify-center bg-gradient-to-br', link.color]">
              <UIcon :name="link.icon" class="w-5 h-5 text-white" />
            </div>
            
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-500 transition-colors">
              {{ link.title }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ link.description }}
            </p>
          </div>
          
          <UIcon
            name="i-heroicons-arrow-right"
            class="absolute bottom-5 right-5 w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all"
          />
        </NuxtLink>
      </div>
    </div>

    <!-- Two Column Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Getting Started -->
      <div class="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Getting Started</h2>
        
        <div class="space-y-4">
          <div class="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
              <span class="text-sm font-bold text-primary-600 dark:text-primary-400">1</span>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">Explore Components</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Browse through our extensive collection of UI components with live examples.
              </p>
            </div>
          </div>
          
          <div class="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
              <span class="text-sm font-bold text-primary-600 dark:text-primary-400">2</span>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">Copy & Paste</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Each component includes copyable code snippets you can use directly.
              </p>
            </div>
          </div>
          
          <div class="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
              <span class="text-sm font-bold text-primary-600 dark:text-primary-400">3</span>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">Customize & Build</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Customize the theme to match your brand and start building your app.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Updates -->
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Updates</h2>
        
        <div class="space-y-4">
          <div
            v-for="update in recentUpdates"
            :key="update.title"
            class="flex items-start gap-3"
          >
            <div class="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ update.title }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ update.date }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
