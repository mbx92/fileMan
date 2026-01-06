<script setup lang="ts">
// Props
const checkboxProps = [
  { name: 'modelValue', type: 'boolean', default: 'false', description: 'Checked state (v-model)' },
  { name: 'label', type: 'string', default: 'undefined', description: 'Label text' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the checkbox' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Mark as required' },
  { name: 'color', type: 'string', default: "'primary'", description: 'Checkbox color when checked' }
]

// Demo
const agreed = ref(false)
const options = ref({
  email: true,
  sms: false,
  push: true
})

// Code examples
const basicCode = `<UCheckbox v-model="checked" label="Accept terms and conditions" />`

const multipleCode = `<UCheckbox v-model="options.email" label="Email notifications" />
<UCheckbox v-model="options.sms" label="SMS notifications" />
<UCheckbox v-model="options.push" label="Push notifications" />`

const colorsCode = `<UCheckbox color="primary" label="Primary" />
<UCheckbox color="success" label="Success" />
<UCheckbox color="warning" label="Warning" />
<UCheckbox color="error" label="Error" />`

const disabledCode = `<UCheckbox disabled label="Cannot change" />
<UCheckbox disabled :model-value="true" label="Checked & disabled" />`

const descriptionCode = `<div class="flex items-start gap-3">
  <UCheckbox v-model="agreed" />
  <div>
    <p class="font-medium">Terms of Service</p>
    <p class="text-sm text-gray-500">...</p>
  </div>
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
        <span class="text-gray-900 dark:text-white">Checkbox</span>
      </div>
      <h1 class="page-title text-gray-900 dark:text-white">Checkbox</h1>
      <p class="page-description text-gray-600 dark:text-gray-400">
        A checkbox component for boolean selections.
      </p>
    </div>

    <!-- Basic Usage -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Basic Usage</h2>
      <DocsComponentPreview title="Default Checkbox" :code="basicCode">
        <div>
          <UCheckbox v-model="agreed" label="I agree to the terms and conditions" />
          <p class="text-sm text-gray-500 mt-2">Agreed: {{ agreed }}</p>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Multiple Checkboxes -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Checkbox Group</h2>
      <DocsComponentPreview title="Multiple Checkboxes" :code="multipleCode">
        <div class="space-y-3">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Notification preferences:</p>
          <UCheckbox v-model="options.email" label="Email notifications" />
          <UCheckbox v-model="options.sms" label="SMS notifications" />
          <UCheckbox v-model="options.push" label="Push notifications" />
          <p class="text-sm text-gray-500 mt-3">
            Selected: {{ Object.entries(options).filter(([,v]) => v).map(([k]) => k).join(', ') || 'None' }}
          </p>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Colors -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Colors</h2>
      <DocsComponentPreview title="Checkbox Colors" :code="colorsCode">
        <div class="space-y-3">
          <UCheckbox color="primary" label="Primary color" :model-value="true" />
          <UCheckbox color="success" label="Success color" :model-value="true" />
          <UCheckbox color="warning" label="Warning color" :model-value="true" />
          <UCheckbox color="error" label="Error color" :model-value="true" />
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Disabled -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Disabled State</h2>
      <DocsComponentPreview title="Disabled Checkbox" :code="disabledCode">
        <div class="space-y-3">
          <UCheckbox disabled label="Cannot change (unchecked)" />
          <UCheckbox disabled :model-value="true" label="Cannot change (checked)" />
        </div>
      </DocsComponentPreview>
    </section>

    <!-- With Description -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">With Description</h2>
      <DocsComponentPreview title="Checkbox with Description" :code="descriptionCode">
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <UCheckbox :model-value="true" class="mt-1" />
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">Email me about updates</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Get notified when there are new features or announcements.</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <UCheckbox class="mt-1" />
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">Marketing communications</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Receive promotional offers and marketing emails.</p>
            </div>
          </div>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Props Table -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Props</h2>
      <DocsPropsTable :props="checkboxProps" />
    </section>
  </div>
</template>
