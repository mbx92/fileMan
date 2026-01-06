<script setup lang="ts">
// Textarea props
const textareaProps = [
  { name: 'modelValue', type: 'string', default: 'undefined', description: 'The textarea value (v-model)' },
  { name: 'placeholder', type: 'string', default: 'undefined', description: 'Placeholder text' },
  { name: 'rows', type: 'number', default: '3', description: 'Number of visible rows' },
  { name: 'size', type: 'string', default: "'md'", description: 'Size (xs, sm, md, lg, xl)' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the textarea' },
  { name: 'autoresize', type: 'boolean', default: 'false', description: 'Auto-resize based on content' }
]

// Demo
const message = ref('')

// Code examples
const basicCode = `<UTextarea v-model="message" placeholder="Enter your message..." />`

const rowsCode = `<UTextarea :rows="2" placeholder="2 rows" />
<UTextarea :rows="4" placeholder="4 rows" />
<UTextarea :rows="6" placeholder="6 rows" />`

const autoresizeCode = `<UTextarea autoresize placeholder="This will grow as you type..." />`

const formFieldCode = `<div>
  <label>Description</label>
  <UTextarea :rows="4" placeholder="..." />
  <p class="help-text">Max 500 characters</p>
</div>`

const disabledCode = `<UTextarea disabled placeholder="Cannot edit" />`
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
        <span class="text-gray-900 dark:text-white">Textarea</span>
      </div>
      <h1 class="page-title text-gray-900 dark:text-white">Textarea</h1>
      <p class="page-description text-gray-600 dark:text-gray-400">
        A multi-line text input for longer form content.
      </p>
    </div>

    <!-- Basic Usage -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Basic Usage</h2>
      <DocsComponentPreview title="Default Textarea" :code="basicCode">
        <div class="w-full">
          <UTextarea v-model="message" placeholder="Enter your message..." />
          <p v-if="message" class="text-sm text-gray-500 mt-2">{{ message.length }} characters</p>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Rows -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Rows</h2>
      <DocsComponentPreview title="Different Row Heights" :code="rowsCode">
        <div class="w-full space-y-4">
          <div>
            <label class="text-sm text-gray-600 dark:text-gray-400 mb-1 block">2 rows</label>
            <UTextarea :rows="2" placeholder="Short textarea (2 rows)" />
          </div>
          <div>
            <label class="text-sm text-gray-600 dark:text-gray-400 mb-1 block">4 rows</label>
            <UTextarea :rows="4" placeholder="Medium textarea (4 rows)" />
          </div>
          <div>
            <label class="text-sm text-gray-600 dark:text-gray-400 mb-1 block">6 rows</label>
            <UTextarea :rows="6" placeholder="Tall textarea (6 rows)" />
          </div>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Autoresize -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Auto Resize</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        The textarea can automatically grow as the user types.
      </p>
      <DocsComponentPreview title="Auto-resizing Textarea" :code="autoresizeCode">
        <div class="w-full">
          <UTextarea autoresize placeholder="Start typing and watch me grow..." />
        </div>
      </DocsComponentPreview>
    </section>

    <!-- With Label -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Form Field Pattern</h2>
      <DocsComponentPreview title="Complete Form Field" :code="formFieldCode">
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Description
          </label>
          <UTextarea
            :rows="4"
            placeholder="Tell us about your project..."
          />
          <div class="flex items-center justify-between mt-1.5">
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Provide a detailed description of your request.
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              0/500
            </p>
          </div>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Disabled -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Disabled State</h2>
      <DocsComponentPreview title="Disabled Textarea" :code="disabledCode">
        <div class="w-full">
          <UTextarea disabled placeholder="This textarea is disabled" />
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Props Table -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Props</h2>
      <DocsPropsTable :props="textareaProps" />
    </section>
  </div>
</template>
