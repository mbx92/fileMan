<script setup lang="ts">
// Chip props documentation
const chipProps = [
  { name: 'color', type: 'string', default: "'primary'", description: 'The color theme of the chip' },
  { name: 'size', type: 'string', default: "'md'", description: 'The size of the chip' }
]

// Code examples
const basicCode = `<UChip>Chip</UChip>`

const colorsCode = `<UChip color="primary">Primary</UChip>
<UChip color="secondary">Secondary</UChip>
<UChip color="success">Success</UChip>
<UChip color="warning">Warning</UChip>
<UChip color="error">Error</UChip>`

const withAvatarCode = `<UChip>
  <template #leading>
    <UAvatar src="..." size="2xs" />
  </template>
  John Doe
</UChip>`

const removableCode = `<span class="chip">
  Vue.js
  <button><UIcon name="i-heroicons-x-mark" /></button>
</span>`
</script>

<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <div class="page-header">
      <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
        <NuxtLink to="/components" class="hover:text-primary-500">Components</NuxtLink>
        <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
        <NuxtLink to="/components" class="hover:text-primary-500">Elements</NuxtLink>
        <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
        <span class="text-gray-900 dark:text-white">Chip</span>
      </div>
      <h1 class="page-title text-gray-900 dark:text-white">Chip</h1>
      <p class="page-description text-gray-600 dark:text-gray-400">
        A compact element for representing an input, attribute, or action.
      </p>
    </div>

    <!-- Basic Usage -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Basic Usage</h2>
      <DocsComponentPreview title="Default Chip" :code="basicCode">
        <div class="flex flex-wrap gap-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
            Chip
          </span>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Colors -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Colors</h2>
      <DocsComponentPreview title="Chip Colors" :code="colorsCode">
        <div class="flex flex-wrap gap-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
            Primary
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
            Secondary
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
            Success
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium">
            Warning
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">
            Error
          </span>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- With Avatar -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">With Avatar</h2>
      <DocsComponentPreview title="Chip with Avatar" :code="withAvatarCode">
        <div class="flex flex-wrap gap-2">
          <span class="inline-flex items-center gap-2 pl-1 pr-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
            <UAvatar src="https://avatars.githubusercontent.com/u/1?v=4" size="2xs" />
            John Doe
          </span>
          <span class="inline-flex items-center gap-2 pl-1 pr-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
            <UAvatar src="https://avatars.githubusercontent.com/u/2?v=4" size="2xs" />
            Jane Smith
          </span>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Removable Chips -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Removable Chips</h2>
      <DocsComponentPreview title="Dismissible Chips" :code="removableCode">
        <div class="flex flex-wrap gap-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
            Vue.js
            <button class="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors">
              <UIcon name="i-heroicons-x-mark" class="w-3.5 h-3.5" />
            </button>
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
            Nuxt
            <button class="hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5 transition-colors">
              <UIcon name="i-heroicons-x-mark" class="w-3.5 h-3.5" />
            </button>
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
            TypeScript
            <button class="hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5 transition-colors">
              <UIcon name="i-heroicons-x-mark" class="w-3.5 h-3.5" />
            </button>
          </span>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Props Table -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Props</h2>
      <DocsPropsTable :props="chipProps" />
    </section>
  </div>
</template>
