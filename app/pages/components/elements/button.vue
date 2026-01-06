<script setup lang="ts">
// Button props documentation
const buttonProps = [
  { name: 'color', type: 'string', default: "'primary'", description: 'The color theme of the button' },
  { name: 'variant', type: 'string', default: "'solid'", description: 'The visual style variant (solid, outline, soft, ghost, link)' },
  { name: 'size', type: 'string', default: "'md'", description: 'The size of the button (xs, sm, md, lg, xl)' },
  { name: 'icon', type: 'string', default: 'undefined', description: 'Icon to display in the button' },
  { name: 'trailing-icon', type: 'string', default: 'undefined', description: 'Icon to display after the label' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a loading spinner' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button' },
  { name: 'block', type: 'boolean', default: 'false', description: 'Makes the button full width' },
  { name: 'to', type: 'string', default: 'undefined', description: 'Renders as NuxtLink with this destination' }
]

// Code examples
const basicCode = `<UButton>Click me</UButton>`

const variantsCode = `<UButton variant="solid">Solid</UButton>
<UButton variant="outline">Outline</UButton>
<UButton variant="soft">Soft</UButton>
<UButton variant="ghost">Ghost</UButton>
<UButton variant="link">Link</UButton>`

const colorsCode = `<UButton color="primary">Primary</UButton>
<UButton color="secondary">Secondary</UButton>
<UButton color="success">Success</UButton>
<UButton color="warning">Warning</UButton>
<UButton color="error">Error</UButton>
<UButton color="neutral">Neutral</UButton>`

const sizesCode = `<UButton size="xs">Extra Small</UButton>
<UButton size="sm">Small</UButton>
<UButton size="md">Medium</UButton>
<UButton size="lg">Large</UButton>
<UButton size="xl">Extra Large</UButton>`

const iconsCode = `<UButton icon="i-heroicons-plus">Add Item</UButton>
<UButton icon="i-heroicons-trash" color="error" variant="soft">Delete</UButton>
<UButton trailing-icon="i-heroicons-arrow-right">Continue</UButton>
<UButton icon="i-heroicons-heart" variant="ghost" />`

const loadingCode = `<UButton loading>Processing...</UButton>
<UButton loading disabled>Please wait</UButton>`

const blockCode = `<UButton block>Full Width Button</UButton>`

// Demo state
const isLoading = ref(false)
const toggleLoading = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
}
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
        <span class="text-gray-900 dark:text-white">Button</span>
      </div>
      <h1 class="page-title text-gray-900 dark:text-white">Button</h1>
      <p class="page-description text-gray-600 dark:text-gray-400">
        A versatile button component with multiple variants, colors, sizes, and states.
      </p>
    </div>

    <!-- Basic Usage -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Basic Usage</h2>
      <DocsComponentPreview title="Default Button" :code="basicCode">
        <UButton>Click me</UButton>
      </DocsComponentPreview>
    </section>

    <!-- Variants -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Variants</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Buttons come in 5 different variants to match your design needs.
      </p>
      <DocsComponentPreview title="Button Variants" :code="variantsCode">
        <div class="flex flex-wrap items-center gap-3">
          <UButton variant="solid">Solid</UButton>
          <UButton variant="outline">Outline</UButton>
          <UButton variant="soft">Soft</UButton>
          <UButton variant="ghost">Ghost</UButton>
          <UButton variant="link">Link</UButton>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Colors -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Colors</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Use the <code class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm">color</code> prop to change the button's color theme.
      </p>
      <DocsComponentPreview title="Button Colors" :code="colorsCode">
        <div class="flex flex-wrap items-center gap-3">
          <UButton color="primary">Primary</UButton>
          <UButton color="secondary">Secondary</UButton>
          <UButton color="success">Success</UButton>
          <UButton color="warning">Warning</UButton>
          <UButton color="error">Error</UButton>
          <UButton color="neutral">Neutral</UButton>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Sizes -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Sizes</h2>
      <DocsComponentPreview title="Button Sizes" :code="sizesCode">
        <div class="flex flex-wrap items-center gap-3">
          <UButton size="xs">Extra Small</UButton>
          <UButton size="sm">Small</UButton>
          <UButton size="md">Medium</UButton>
          <UButton size="lg">Large</UButton>
          <UButton size="xl">Extra Large</UButton>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Icons -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">With Icons</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Add icons using the <code class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm">icon</code> or 
        <code class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm">trailing-icon</code> props.
      </p>
      <DocsComponentPreview title="Buttons with Icons" :code="iconsCode">
        <div class="flex flex-wrap items-center gap-3">
          <UButton icon="i-heroicons-plus">Add Item</UButton>
          <UButton icon="i-heroicons-trash" color="error" variant="soft">Delete</UButton>
          <UButton trailing-icon="i-heroicons-arrow-right">Continue</UButton>
          <UButton icon="i-heroicons-heart" variant="ghost" />
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Loading State -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Loading State</h2>
      <DocsComponentPreview title="Loading Button" :code="loadingCode">
        <div class="flex flex-wrap items-center gap-3">
          <UButton :loading="isLoading" @click="toggleLoading">
            {{ isLoading ? 'Processing...' : 'Click to Load' }}
          </UButton>
          <UButton loading disabled>Please wait</UButton>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Block Button -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Full Width</h2>
      <DocsComponentPreview title="Block Button" :code="blockCode">
        <div class="w-full max-w-md">
          <UButton block>Full Width Button</UButton>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Props Table -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Props</h2>
      <DocsPropsTable :props="buttonProps" />
    </section>
  </div>
</template>
