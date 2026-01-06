<script setup lang="ts">
// Card props
const cardProps = [
  { name: 'title', type: 'string', default: 'undefined', description: 'Card title' },
  { name: 'description', type: 'string', default: 'undefined', description: 'Card description' },
  { name: 'icon', type: 'string', default: 'undefined', description: 'Header icon' }
]

// Code examples
const basicCode = `<UCard>
  <template #header>
    <h3>Card Title</h3>
  </template>
  
  <p>Card content goes here...</p>
  
  <template #footer>
    <UButton>Action</UButton>
  </template>
</UCard>`

const simpleCode = `<UCard>
  <p>Simple card with just content</p>
</UCard>`

const gridCode = `<div class="grid grid-cols-3 gap-4">
  <UCard>...</UCard>
  <UCard>...</UCard>
  <UCard>...</UCard>
</div>`

const interactiveCode = `<NuxtLink to="/some-page">
  <UCard class="hover:shadow-lg transition-shadow cursor-pointer">
    ...
  </UCard>
</NuxtLink>`
</script>

<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <div class="page-header">
      <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
        <NuxtLink to="/components" class="hover:text-primary-500">Components</NuxtLink>
        <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
        <NuxtLink to="/components" class="hover:text-primary-500">Data</NuxtLink>
        <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
        <span class="text-gray-900 dark:text-white">Card</span>
      </div>
      <h1 class="page-title text-gray-900 dark:text-white">Card</h1>
      <p class="page-description text-gray-600 dark:text-gray-400">
        A container component for grouping related content.
      </p>
    </div>

    <!-- Basic Usage -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Basic Usage</h2>
      <DocsComponentPreview title="Default Card" :code="basicCode">
        <div class="w-full max-w-sm">
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-gray-900 dark:text-white">Card Title</h3>
                <UButton icon="i-heroicons-ellipsis-vertical" variant="ghost" size="xs" color="neutral" />
              </div>
            </template>
            
            <p class="text-gray-600 dark:text-gray-400">
              This is some example content for the card. Cards are great for grouping related information together.
            </p>
            
            <template #footer>
              <div class="flex gap-2">
                <UButton size="sm">Save changes</UButton>
                <UButton variant="ghost" color="neutral" size="sm">Cancel</UButton>
              </div>
            </template>
          </UCard>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Simple Card -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Simple Card</h2>
      <DocsComponentPreview title="Simple Card" :code="simpleCode">
        <div class="w-full max-w-sm">
          <UCard>
            <p class="text-gray-600 dark:text-gray-400">
              A simple card with only content, no header or footer.
            </p>
          </UCard>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Card Grid -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Card Grid</h2>
      <DocsComponentPreview title="Grid Layout" :code="gridCode">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white">Documents</h3>
                  <p class="text-xs text-gray-500">12 files</p>
                </div>
              </div>
            </template>
            <p class="text-sm text-gray-600 dark:text-gray-400">Manage your documents and files.</p>
          </UCard>
          
          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <UIcon name="i-heroicons-users" class="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white">Team</h3>
                  <p class="text-xs text-gray-500">8 members</p>
                </div>
              </div>
            </template>
            <p class="text-sm text-gray-600 dark:text-gray-400">Collaborate with your team members.</p>
          </UCard>
          
          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white">Analytics</h3>
                  <p class="text-xs text-gray-500">Updated today</p>
                </div>
              </div>
            </template>
            <p class="text-sm text-gray-600 dark:text-gray-400">View your performance metrics.</p>
          </UCard>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Interactive Card -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Interactive Card</h2>
      <DocsComponentPreview title="Clickable Card" :code="interactiveCode">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          <div class="group cursor-pointer">
            <UCard class="transition-all group-hover:shadow-lg group-hover:border-primary-300 dark:group-hover:border-primary-700">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-heroicons-rocket-launch" class="w-6 h-6 text-white" />
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                    Quick Start
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Get started with our quick setup guide
                  </p>
                </div>
                <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
              </div>
            </UCard>
          </div>
          
          <div class="group cursor-pointer">
            <UCard class="transition-all group-hover:shadow-lg group-hover:border-primary-300 dark:group-hover:border-primary-700">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-heroicons-book-open" class="w-6 h-6 text-white" />
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                    Documentation
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Read the full documentation
                  </p>
                </div>
                <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
              </div>
            </UCard>
          </div>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Props Table -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Props</h2>
      <DocsPropsTable :props="cardProps" />
    </section>
  </div>
</template>
