<script setup lang="ts">
// Icon props documentation
const iconProps = [
  { name: 'name', type: 'string', required: true, description: 'The icon name (e.g., i-heroicons-home)' },
  { name: 'size', type: 'string', default: "'md'", description: 'Icon size using Tailwind classes' },
  { name: 'class', type: 'string', default: 'undefined', description: 'Additional CSS classes' }
]

// Code examples
const basicCode = `<UIcon name="i-heroicons-home" />
<UIcon name="i-heroicons-user" />
<UIcon name="i-heroicons-cog-6-tooth" />`

const sizesCode = `<UIcon name="i-heroicons-star" class="w-4 h-4" />
<UIcon name="i-heroicons-star" class="w-6 h-6" />
<UIcon name="i-heroicons-star" class="w-8 h-8" />
<UIcon name="i-heroicons-star" class="w-12 h-12" />`

const colorsCode = `<UIcon name="i-heroicons-heart" class="text-red-500" />
<UIcon name="i-heroicons-check-circle" class="text-green-500" />
<UIcon name="i-heroicons-exclamation-triangle" class="text-yellow-500" />
<UIcon name="i-heroicons-information-circle" class="text-blue-500" />`

// Common icons
const commonIcons = [
  'i-heroicons-home',
  'i-heroicons-user',
  'i-heroicons-cog-6-tooth',
  'i-heroicons-bell',
  'i-heroicons-envelope',
  'i-heroicons-calendar',
  'i-heroicons-folder',
  'i-heroicons-document',
  'i-heroicons-photo',
  'i-heroicons-chart-bar',
  'i-heroicons-shopping-cart',
  'i-heroicons-heart',
  'i-heroicons-star',
  'i-heroicons-bookmark',
  'i-heroicons-trash',
  'i-heroicons-pencil',
  'i-heroicons-plus',
  'i-heroicons-minus',
  'i-heroicons-check',
  'i-heroicons-x-mark',
  'i-heroicons-arrow-right',
  'i-heroicons-arrow-left',
  'i-heroicons-chevron-down',
  'i-heroicons-magnifying-glass'
]

const actionIcons = [
  'i-heroicons-arrow-down-tray',
  'i-heroicons-arrow-up-tray',
  'i-heroicons-clipboard',
  'i-heroicons-share',
  'i-heroicons-eye',
  'i-heroicons-eye-slash',
  'i-heroicons-lock-closed',
  'i-heroicons-lock-open'
]
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
        <span class="text-gray-900 dark:text-white">Icon</span>
      </div>
      <h1 class="page-title text-gray-900 dark:text-white">Icon</h1>
      <p class="page-description text-gray-600 dark:text-gray-400">
        Display icons from Heroicons and other icon sets using the UIcon component.
      </p>
    </div>

    <!-- Basic Usage -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Basic Usage</h2>
      <DocsComponentPreview title="Default Icons" :code="basicCode">
        <div class="flex items-center gap-4">
          <UIcon name="i-heroicons-home" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <UIcon name="i-heroicons-user" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <UIcon name="i-heroicons-cog-6-tooth" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Sizes -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Sizes</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Control icon size using Tailwind's width and height classes.
      </p>
      <DocsComponentPreview title="Icon Sizes" :code="sizesCode">
        <div class="flex items-end gap-6">
          <div class="text-center">
            <UIcon name="i-heroicons-star" class="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <p class="text-xs text-gray-500 mt-2">w-4 h-4</p>
          </div>
          <div class="text-center">
            <UIcon name="i-heroicons-star" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
            <p class="text-xs text-gray-500 mt-2">w-6 h-6</p>
          </div>
          <div class="text-center">
            <UIcon name="i-heroicons-star" class="w-8 h-8 text-gray-600 dark:text-gray-400" />
            <p class="text-xs text-gray-500 mt-2">w-8 h-8</p>
          </div>
          <div class="text-center">
            <UIcon name="i-heroicons-star" class="w-12 h-12 text-gray-600 dark:text-gray-400" />
            <p class="text-xs text-gray-500 mt-2">w-12 h-12</p>
          </div>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Colors -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Colors</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Apply any Tailwind text color to icons.
      </p>
      <DocsComponentPreview title="Icon Colors" :code="colorsCode">
        <div class="flex items-center gap-6">
          <UIcon name="i-heroicons-heart" class="w-8 h-8 text-red-500" />
          <UIcon name="i-heroicons-check-circle" class="w-8 h-8 text-green-500" />
          <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-yellow-500" />
          <UIcon name="i-heroicons-information-circle" class="w-8 h-8 text-blue-500" />
          <UIcon name="i-heroicons-x-circle" class="w-8 h-8 text-purple-500" />
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Icon Gallery -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Common Icons</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Heroicons provides both outline and solid variants. Use <code class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm">i-heroicons-*</code> for outline 
        and <code class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm">i-heroicons-*-solid</code> for solid icons.
      </p>
      <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
        <div
          v-for="icon in commonIcons"
          :key="icon"
          class="flex flex-col items-center justify-center p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-colors group cursor-pointer"
        >
          <UIcon :name="icon" class="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-primary-500 transition-colors" />
          <p class="text-[10px] text-gray-500 mt-2 truncate max-w-full">{{ icon.replace('i-heroicons-', '') }}</p>
        </div>
      </div>
    </section>

    <!-- Action Icons -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Action Icons</h2>
      <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
        <div
          v-for="icon in actionIcons"
          :key="icon"
          class="flex flex-col items-center justify-center p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-colors group cursor-pointer"
        >
          <UIcon :name="icon" class="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-primary-500 transition-colors" />
          <p class="text-[10px] text-gray-500 mt-2 truncate max-w-full">{{ icon.replace('i-heroicons-', '') }}</p>
        </div>
      </div>
    </section>

    <!-- Props Table -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Props</h2>
      <DocsPropsTable :props="iconProps" />
    </section>

    <!-- External Link -->
    <section class="page-section">
      <div class="p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-800">
        <div class="flex items-start gap-4">
          <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-6 h-6 text-blue-500" />
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Browse All Icons</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
              View the complete Heroicons library with search functionality.
            </p>
            <UButton
              to="https://heroicons.com"
              target="_blank"
              variant="outline"
              size="sm"
            >
              Visit Heroicons
              <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4 ml-1" />
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
