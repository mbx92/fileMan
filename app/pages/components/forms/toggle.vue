<script setup lang="ts">
// Props
const toggleProps = [
  { name: 'modelValue', type: 'boolean', default: 'false', description: 'Toggle state (v-model)' },
  { name: 'label', type: 'string', default: 'undefined', description: 'Label text' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the toggle' },
  { name: 'color', type: 'string', default: "'primary'", description: 'Toggle color when on' },
  { name: 'size', type: 'string', default: "'md'", description: 'Size (xs, sm, md, lg, xl)' }
]

// Demo
const darkMode = ref(true)
const notifications = ref(true)
const autoSave = ref(false)

// Code examples
const basicCode = `<UToggle v-model="enabled" label="Enable feature" />`

const sizesCode = `<UToggle size="xs" label="Extra small" />
<UToggle size="sm" label="Small" />
<UToggle size="md" label="Medium" />
<UToggle size="lg" label="Large" />`

const colorsCode = `<UToggle color="primary" :model-value="true" />
<UToggle color="success" :model-value="true" />
<UToggle color="warning" :model-value="true" />
<UToggle color="error" :model-value="true" />`

const disabledCode = `<UToggle disabled label="Cannot toggle" />`

const settingsCode = `<div class="divide-y">
  <div class="flex justify-between py-4">
    <div>
      <p class="font-medium">Notifications</p>
      <p class="text-sm text-gray-500">...</p>
    </div>
    <UToggle v-model="notifications" />
  </div>
  ...
</div>`

const iconsCode = `<div class="flex items-center gap-3">
  <UIcon name="i-heroicons-sun" />
  <UToggle v-model="darkMode" />
  <UIcon name="i-heroicons-moon" />
</div>`
</script>

<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <div class="page-header">
      <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
        <NuxtLink to="/components" class="hover:text-primary-500">Components</NuxtLink>
        <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
        <NuxtLink to="/components" class="hover:text-primary-500">Forms</NuxtLink>
        <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
        <span class="text-gray-900 dark:text-white">Toggle</span>
      </div>
      <h1 class="page-title text-gray-900 dark:text-white">Toggle</h1>
      <p class="page-description text-gray-600 dark:text-gray-400">
        A switch component for toggling between on and off states.
      </p>
    </div>

    <!-- Basic Usage -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Basic Usage</h2>
      <DocsComponentPreview title="Default Toggle" :code="basicCode">
        <div class="space-y-4">
          <UToggle v-model="darkMode" label="Dark mode" />
          <p class="text-sm text-gray-500">Status: {{ darkMode ? 'On' : 'Off' }}</p>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Sizes -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Sizes</h2>
      <DocsComponentPreview title="Toggle Sizes" :code="sizesCode">
        <div class="space-y-4">
          <UToggle size="xs" :model-value="true" label="Extra small" />
          <UToggle size="sm" :model-value="true" label="Small" />
          <UToggle size="md" :model-value="true" label="Medium (default)" />
          <UToggle size="lg" :model-value="true" label="Large" />
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Colors -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Colors</h2>
      <DocsComponentPreview title="Toggle Colors" :code="colorsCode">
        <div class="flex flex-wrap gap-6">
          <UToggle color="primary" :model-value="true" />
          <UToggle color="success" :model-value="true" />
          <UToggle color="warning" :model-value="true" />
          <UToggle color="error" :model-value="true" />
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Disabled -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Disabled State</h2>
      <DocsComponentPreview title="Disabled Toggle" :code="disabledCode">
        <div class="space-y-4">
          <UToggle disabled label="Disabled (off)" />
          <UToggle disabled :model-value="true" label="Disabled (on)" />
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Settings Pattern -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Settings Pattern</h2>
      <DocsComponentPreview title="Settings List" :code="settingsCode">
        <div class="w-full divide-y divide-gray-200 dark:divide-gray-700">
          <div class="flex items-center justify-between py-4">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">Push notifications</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Receive push notifications on your device</p>
            </div>
            <UToggle v-model="notifications" />
          </div>
          
          <div class="flex items-center justify-between py-4">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">Auto-save</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Automatically save your work every 5 minutes</p>
            </div>
            <UToggle v-model="autoSave" />
          </div>
          
          <div class="flex items-center justify-between py-4">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">Dark mode</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Use dark theme throughout the app</p>
            </div>
            <UToggle v-model="darkMode" />
          </div>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- With Icons -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">With Icon Labels</h2>
      <DocsComponentPreview title="Toggle with Icons" :code="iconsCode">
        <div class="flex items-center gap-3">
          <UIcon 
            name="i-heroicons-sun" 
            class="w-5 h-5" 
            :class="darkMode ? 'text-gray-400' : 'text-yellow-500'"
          />
          <UToggle v-model="darkMode" />
          <UIcon 
            name="i-heroicons-moon" 
            class="w-5 h-5"
            :class="darkMode ? 'text-blue-500' : 'text-gray-400'"
          />
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Props Table -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Props</h2>
      <DocsPropsTable :props="toggleProps" />
    </section>
  </div>
</template>
