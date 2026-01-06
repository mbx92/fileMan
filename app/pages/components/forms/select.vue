<script setup lang="ts">
// Select props
const selectProps = [
  { name: 'modelValue', type: 'any', default: 'undefined', description: 'Selected value (v-model)' },
  { name: 'options', type: 'array', required: true, description: 'Array of options' },
  { name: 'placeholder', type: 'string', default: 'undefined', description: 'Placeholder text' },
  { name: 'size', type: 'string', default: "'md'", description: 'Size (xs, sm, md, lg, xl)' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the select' },
  { name: 'searchable', type: 'boolean', default: 'false', description: 'Enable search/filter' },
  { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow multiple selections' },
  { name: 'clearable', type: 'boolean', default: 'false', description: 'Show clear button' }
]

// Demo data
const selectedCountry = ref('')
const selectedFramework = ref('')
const selectedMultiple = ref([])

const countries = [
  { label: 'Indonesia', value: 'id' },
  { label: 'United States', value: 'us' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Japan', value: 'jp' },
  { label: 'Australia', value: 'au' },
  { label: 'Germany', value: 'de' }
]

const frameworks = [
  { label: 'Vue.js', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'Next.js', value: 'next' }
]

// Code examples
const basicCode = `<USelect
  v-model="selected"
  :options="options"
  placeholder="Select an option"
/>`

const searchableCode = `<USelect
  v-model="selected"
  :options="options"
  placeholder="Search..."
  searchable
/>`

const multipleCode = `<USelect
  v-model="selected"
  :options="options"
  placeholder="Select multiple"
  multiple
/>`

const sizesCode = `<USelect size="xs" ... />
<USelect size="sm" ... />
<USelect size="md" ... />
<USelect size="lg" ... />`

const iconCode = `<USelect icon="i-heroicons-globe-alt" ... />`

const disabledCode = `<USelect disabled ... />`

const formFieldCode = `<div>
  <label>Country</label>
  <USelect ... />
  <p class="help-text">Select your country</p>
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
        <span class="text-gray-900 dark:text-white">Select</span>
      </div>
      <h1 class="page-title text-gray-900 dark:text-white">Select</h1>
      <p class="page-description text-gray-600 dark:text-gray-400">
        A dropdown component for selecting from a list of options.
      </p>
    </div>

    <!-- Basic Usage -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Basic Usage</h2>
      <DocsComponentPreview title="Default Select" :code="basicCode">
        <div class="w-full">
          <USelect
            v-model="selectedCountry"
            :options="countries"
            placeholder="Select a country"
          />
          <p v-if="selectedCountry" class="text-sm text-gray-500 mt-2">
            Selected: {{ selectedCountry }}
          </p>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Sizes -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Sizes</h2>
      <DocsComponentPreview title="Select Sizes" :code="sizesCode">
        <div class="w-full space-y-3">
          <USelect
            :options="countries"
            size="xs"
            placeholder="Extra small"
          />
          <USelect
            :options="countries"
            size="sm"
            placeholder="Small"
          />
          <USelect
            :options="countries"
            size="md"
            placeholder="Medium (default)"
          />
          <USelect
            :options="countries"
            size="lg"
            placeholder="Large"
          />
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Searchable -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Searchable</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Enable search to filter through options in large lists.
      </p>
      <DocsComponentPreview title="Searchable Select" :code="searchableCode">
        <div class="w-full">
          <USelect
            v-model="selectedFramework"
            :options="frameworks"
            placeholder="Search frameworks..."
            searchable
          />
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Multiple -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Multiple Selection</h2>
      <DocsComponentPreview title="Multiple Select" :code="multipleCode">
        <div class="w-full">
          <USelect
            v-model="selectedMultiple"
            :options="frameworks"
            placeholder="Select multiple frameworks"
            multiple
          />
          <p v-if="selectedMultiple.length" class="text-sm text-gray-500 mt-2">
            Selected: {{ selectedMultiple.join(', ') }}
          </p>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- With Icon -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">With Leading Icon</h2>
      <DocsComponentPreview title="Select with Icon" :code="iconCode">
        <div class="w-full">
          <USelect
            :options="countries"
            icon="i-heroicons-globe-alt"
            placeholder="Select a country"
          />
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Disabled -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Disabled State</h2>
      <DocsComponentPreview title="Disabled Select" :code="disabledCode">
        <div class="w-full">
          <USelect
            :options="countries"
            disabled
            placeholder="Cannot select"
          />
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Form Field Pattern -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Form Field Pattern</h2>
      <DocsComponentPreview title="Complete Form Field" :code="formFieldCode">
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Country <span class="text-red-500">*</span>
          </label>
          <USelect
            :options="countries"
            icon="i-heroicons-globe-alt"
            placeholder="Select your country"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
            This will be used for shipping calculations.
          </p>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Props Table -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Props</h2>
      <DocsPropsTable :props="selectProps" />
    </section>
  </div>
</template>
