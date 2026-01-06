<script setup lang="ts">
// Input props documentation
const inputProps = [
  { name: 'modelValue', type: 'string | number', default: 'undefined', description: 'The input value (v-model)' },
  { name: 'type', type: 'string', default: "'text'", description: 'Input type (text, password, email, number, etc.)' },
  { name: 'placeholder', type: 'string', default: 'undefined', description: 'Placeholder text' },
  { name: 'size', type: 'string', default: "'md'", description: 'Size (xs, sm, md, lg, xl)' },
  { name: 'color', type: 'string', default: "'primary'", description: 'Focus ring color' },
  { name: 'variant', type: 'string', default: "'outline'", description: 'Visual variant (outline, none)' },
  { name: 'icon', type: 'string', default: 'undefined', description: 'Leading icon' },
  { name: 'trailing-icon', type: 'string', default: 'undefined', description: 'Trailing icon' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the input' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Mark as required' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show loading spinner' }
]

// Demo state
const textValue = ref('')
const emailValue = ref('')
const passwordValue = ref('')
const searchValue = ref('')

// Code examples
const basicCode = `<UInput v-model="value" placeholder="Enter text..." />`

const typesCode = `<UInput type="text" placeholder="Text input" />
<UInput type="email" placeholder="Email address" />
<UInput type="password" placeholder="Password" />
<UInput type="number" placeholder="Number" />`

const sizesCode = `<UInput size="xs" placeholder="Extra small" />
<UInput size="sm" placeholder="Small" />
<UInput size="md" placeholder="Medium" />
<UInput size="lg" placeholder="Large" />
<UInput size="xl" placeholder="Extra large" />`

const iconsCode = `<UInput icon="i-heroicons-magnifying-glass" placeholder="Search..." />
<UInput icon="i-heroicons-envelope" placeholder="Email address" />
<UInput trailing-icon="i-heroicons-check-circle" placeholder="Validated" />`

const statesCode = `<UInput disabled placeholder="Disabled input" />
<UInput loading placeholder="Loading..." />
<UInput required placeholder="Required field" />`

const formFieldCode = `<div>
  <label class="block text-sm font-medium mb-1">Email</label>
  <UInput 
    icon="i-heroicons-envelope" 
    placeholder="you@example.com"
  />
  <p class="text-xs text-gray-500 mt-1">We'll never share your email.</p>
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
        <span class="text-gray-900 dark:text-white">Input</span>
      </div>
      <h1 class="page-title text-gray-900 dark:text-white">Input</h1>
      <p class="page-description text-gray-600 dark:text-gray-400">
        A versatile text input component with icons, validation states, and various sizes.
      </p>
    </div>

    <!-- Basic Usage -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Basic Usage</h2>
      <DocsComponentPreview title="Default Input" :code="basicCode">
        <div class="w-full">
          <UInput v-model="textValue" placeholder="Enter text..." />
          <p v-if="textValue" class="text-sm text-gray-500 mt-2">Value: {{ textValue }}</p>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Input Types -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Input Types</h2>
      <DocsComponentPreview title="Different Input Types" :code="typesCode">
        <div class="w-full space-y-3">
          <UInput type="text" placeholder="Text input" />
          <UInput v-model="emailValue" type="email" placeholder="Email address" />
          <UInput v-model="passwordValue" type="password" placeholder="Password" />
          <UInput type="number" placeholder="Number" />
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Sizes -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Sizes</h2>
      <DocsComponentPreview title="Input Sizes" :code="sizesCode">
        <div class="w-full space-y-3">
          <UInput size="xs" placeholder="Extra small" />
          <UInput size="sm" placeholder="Small" />
          <UInput size="md" placeholder="Medium (default)" />
          <UInput size="lg" placeholder="Large" />
          <UInput size="xl" placeholder="Extra large" />
        </div>
      </DocsComponentPreview>
    </section>

    <!-- With Icons -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">With Icons</h2>
      <DocsComponentPreview title="Input with Icons" :code="iconsCode">
        <div class="w-full space-y-3">
          <UInput
            v-model="searchValue"
            icon="i-heroicons-magnifying-glass"
            placeholder="Search..."
          />
          <UInput
            icon="i-heroicons-envelope"
            placeholder="Email address"
          />
          <UInput
            icon="i-heroicons-user"
            trailing-icon="i-heroicons-check-circle"
            placeholder="Username"
          />
          <UInput
            icon="i-heroicons-lock-closed"
            type="password"
            placeholder="Password"
          />
        </div>
      </DocsComponentPreview>
    </section>

    <!-- States -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">States</h2>
      <DocsComponentPreview title="Input States" :code="statesCode">
        <div class="w-full space-y-3">
          <div>
            <label class="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Disabled</label>
            <UInput disabled placeholder="Disabled input" value="Cannot edit" />
          </div>
          <div>
            <label class="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Loading</label>
            <UInput loading placeholder="Loading..." />
          </div>
          <div>
            <label class="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Required</label>
            <UInput required placeholder="Required field" />
          </div>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- With Labels and Help Text -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Form Field Pattern</h2>
      <DocsComponentPreview title="Complete Form Field" :code="formFieldCode">
        <div class="w-full space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email Address
            </label>
            <UInput
              icon="i-heroicons-envelope"
              placeholder="you@example.com"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              We'll never share your email with anyone else.
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Password <span class="text-red-500">*</span>
            </label>
            <UInput
              icon="i-heroicons-lock-closed"
              type="password"
              placeholder="Enter a secure password"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              Must be at least 8 characters.
            </p>
          </div>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Props Table -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Props</h2>
      <DocsPropsTable :props="inputProps" />
    </section>
  </div>
</template>
