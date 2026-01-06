<script setup lang="ts">
// Alert props
const alertProps = [
  { name: 'title', type: 'string', default: 'undefined', description: 'Alert title' },
  { name: 'description', type: 'string', default: 'undefined', description: 'Alert description' },
  { name: 'color', type: 'string', default: "'primary'", description: 'Alert color theme' },
  { name: 'icon', type: 'string', default: 'undefined', description: 'Alert icon' },
  { name: 'variant', type: 'string', default: "'solid'", description: 'Visual variant (solid, soft, outline)' }
]

const basicCode = `<UAlert title="Info" description="This is an informational alert." />`

const colorsCode = `<UAlert color="success" ... />`

const variantsCode = `<UAlert variant="soft" ... />`

const actionsCode = `<UAlert>
  <template #actions>
    <UButton size="sm">Action</UButton>
  </template>
</UAlert>`
</script>

<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <div class="page-header">
      <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
        <NuxtLink to="/components" class="hover:text-primary-500">Components</NuxtLink>
        <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
        <span class="text-gray-900 dark:text-white">Alert</span>
      </div>
      <h1 class="page-title text-gray-900 dark:text-white">Alert</h1>
      <p class="page-description text-gray-600 dark:text-gray-400">
        A component for displaying important messages to users.
      </p>
    </div>

    <!-- Basic Usage -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Basic Usage</h2>
      <DocsComponentPreview title="Default Alert" :code="basicCode">
        <div class="w-full max-w-lg space-y-4">
          <UAlert title="Heads up!" description="This is an informational alert message." />
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Colors -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Colors</h2>
      <DocsComponentPreview title="Alert Colors" :code="colorsCode">
        <div class="w-full max-w-lg space-y-4">
          <UAlert
            title="Info"
            description="This is an informational message."
            icon="i-heroicons-information-circle"
            color="primary"
          />
          <UAlert
            title="Success"
            description="Your action was completed successfully."
            icon="i-heroicons-check-circle"
            color="success"
          />
          <UAlert
            title="Warning"
            description="Please review before proceeding."
            icon="i-heroicons-exclamation-triangle"
            color="warning"
          />
          <UAlert
            title="Error"
            description="Something went wrong. Please try again."
            icon="i-heroicons-x-circle"
            color="error"
          />
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Variants -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Variants</h2>
      <DocsComponentPreview title="Alert Variants" :code="variantsCode">
        <div class="w-full max-w-lg space-y-4">
          <UAlert title="Solid Alert" description="This is a solid variant." variant="solid" color="primary" />
          <UAlert title="Soft Alert" description="This is a soft variant." variant="soft" color="primary" />
          <UAlert title="Outline Alert" description="This is an outline variant." variant="outline" color="primary" />
        </div>
      </DocsComponentPreview>
    </section>

    <!-- With Actions -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">With Actions</h2>
      <DocsComponentPreview title="Alert with Actions" :code="actionsCode">
        <div class="w-full max-w-lg space-y-4">
          <div class="p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
            <div class="flex gap-4">
              <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div class="flex-1">
                <h4 class="font-medium text-blue-900 dark:text-blue-100">Update Available</h4>
                <p class="text-sm text-blue-700 dark:text-blue-300 mt-1">A new version is available. Update now to get the latest features.</p>
                <div class="flex gap-2 mt-3">
                  <UButton size="sm" color="primary">Update Now</UButton>
                  <UButton size="sm" variant="ghost">Later</UButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Props Table -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Props</h2>
      <DocsPropsTable :props="alertProps" />
    </section>
  </div>
</template>
