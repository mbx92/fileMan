<script setup lang="ts">
// Toast props
const toastProps = [
  { name: 'title', type: 'string', description: 'Toast title' },
  { name: 'description', type: 'string', description: 'Toast message' },
  { name: 'color', type: 'string', default: "'primary'", description: 'Toast color' },
  { name: 'duration', type: 'number', default: '5000', description: 'Duration in milliseconds' }
]

const toast = useToast()

const showSuccess = () => {
  toast.add({ title: 'Success!', description: 'Your changes have been saved.', color: 'success' })
}

const showError = () => {
  toast.add({ title: 'Error', description: 'Something went wrong.', color: 'error' })
}

const showWarning = () => {
  toast.add({ title: 'Warning', description: 'Please review your input.', color: 'warning' })
}
</script>

<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <div class="page-header">
      <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
        <NuxtLink to="/components" class="hover:text-primary-500">Components</NuxtLink>
        <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
        <span class="text-gray-900 dark:text-white">Toast</span>
      </div>
      <h1 class="page-title text-gray-900 dark:text-white">Toast</h1>
      <p class="page-description text-gray-600 dark:text-gray-400">
        Non-intrusive notification messages that appear temporarily.
      </p>
    </div>

    <!-- Basic Usage -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Basic Usage</h2>
      <DocsComponentPreview title="Trigger Toasts" code="const toast = useToast()
toast.add({ title: 'Hello!', description: 'This is a toast.' })">
        <div class="flex flex-wrap gap-3">
          <UButton @click="showSuccess" color="success">
            <UIcon name="i-heroicons-check-circle" class="w-4 h-4 mr-2" />
            Success Toast
          </UButton>
          <UButton @click="showError" color="error">
            <UIcon name="i-heroicons-x-circle" class="w-4 h-4 mr-2" />
            Error Toast
          </UButton>
          <UButton @click="showWarning" color="warning">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4 mr-2" />
            Warning Toast
          </UButton>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Static Examples -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Toast Styles</h2>
      <DocsComponentPreview title="Toast Examples" code="toast.add({ title, description, color })">
        <div class="w-full max-w-sm space-y-3">
          <div class="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
            <div class="flex gap-3">
              <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500 flex-shrink-0" />
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Success</p>
                <p class="text-sm text-gray-500">Changes saved successfully.</p>
              </div>
            </div>
          </div>
          
          <div class="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
            <div class="flex gap-3">
              <UIcon name="i-heroicons-x-circle" class="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Error</p>
                <p class="text-sm text-gray-500">Failed to save changes.</p>
              </div>
            </div>
          </div>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Props Table -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Options</h2>
      <DocsPropsTable :props="toastProps" />
    </section>
  </div>
</template>
