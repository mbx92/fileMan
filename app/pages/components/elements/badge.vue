<script setup lang="ts">
// Badge props documentation
const badgeProps = [
  { name: 'color', type: 'string', default: "'primary'", description: 'The color theme of the badge' },
  { name: 'variant', type: 'string', default: "'solid'", description: 'The visual style (solid, outline, soft, subtle)' },
  { name: 'size', type: 'string', default: "'md'", description: 'The size of the badge (xs, sm, md, lg)' }
]

// Code examples
const basicCode = `<UBadge>Badge</UBadge>`

const colorsCode = `<UBadge color="primary">Primary</UBadge>
<UBadge color="secondary">Secondary</UBadge>
<UBadge color="success">Success</UBadge>
<UBadge color="warning">Warning</UBadge>
<UBadge color="error">Error</UBadge>
<UBadge color="neutral">Neutral</UBadge>`

const variantsCode = `<UBadge variant="solid">Solid</UBadge>
<UBadge variant="outline">Outline</UBadge>
<UBadge variant="soft">Soft</UBadge>
<UBadge variant="subtle">Subtle</UBadge>`

const sizesCode = `<UBadge size="xs">Extra Small</UBadge>
<UBadge size="sm">Small</UBadge>
<UBadge size="md">Medium</UBadge>
<UBadge size="lg">Large</UBadge>`

const useCasesCode = `<!-- Status indicators -->
<div class="flex items-center gap-2">
  <span>Status:</span>
  <UBadge color="success" variant="soft">Active</UBadge>
</div>

<!-- Count badges -->
<div class="flex items-center gap-2">
  <span>Messages</span>
  <UBadge color="error">5</UBadge>
</div>

<!-- Labels -->
<UBadge color="primary" variant="outline">New Feature</UBadge>`
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
        <span class="text-gray-900 dark:text-white">Badge</span>
      </div>
      <h1 class="page-title text-gray-900 dark:text-white">Badge</h1>
      <p class="page-description text-gray-600 dark:text-gray-400">
        A small label component for status indicators, counts, and labels.
      </p>
    </div>

    <!-- Basic Usage -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Basic Usage</h2>
      <DocsComponentPreview title="Default Badge" :code="basicCode">
        <UBadge>Badge</UBadge>
      </DocsComponentPreview>
    </section>

    <!-- Colors -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Colors</h2>
      <DocsComponentPreview title="Badge Colors" :code="colorsCode">
        <div class="flex flex-wrap items-center gap-3">
          <UBadge color="primary">Primary</UBadge>
          <UBadge color="secondary">Secondary</UBadge>
          <UBadge color="success">Success</UBadge>
          <UBadge color="warning">Warning</UBadge>
          <UBadge color="error">Error</UBadge>
          <UBadge color="neutral">Neutral</UBadge>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Variants -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Variants</h2>
      <DocsComponentPreview title="Badge Variants" :code="variantsCode">
        <div class="flex flex-wrap items-center gap-3">
          <UBadge variant="solid">Solid</UBadge>
          <UBadge variant="outline">Outline</UBadge>
          <UBadge variant="soft">Soft</UBadge>
          <UBadge variant="subtle">Subtle</UBadge>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Sizes -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Sizes</h2>
      <DocsComponentPreview title="Badge Sizes" :code="sizesCode">
        <div class="flex flex-wrap items-center gap-3">
          <UBadge size="xs">Extra Small</UBadge>
          <UBadge size="sm">Small</UBadge>
          <UBadge size="md">Medium</UBadge>
          <UBadge size="lg">Large</UBadge>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Use Cases -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Common Use Cases</h2>
      <DocsComponentPreview title="Use Cases" :code="useCasesCode">
        <div class="space-y-6">
          <!-- Status indicators -->
          <div class="flex items-center gap-2">
            <span class="text-gray-600 dark:text-gray-400">Status:</span>
            <UBadge color="success" variant="soft">Active</UBadge>
          </div>

          <!-- Count badges -->
          <div class="flex items-center gap-2">
            <span class="text-gray-600 dark:text-gray-400">Messages</span>
            <UBadge color="error">5</UBadge>
          </div>

          <!-- Labels -->
          <div class="flex gap-2">
            <UBadge color="primary" variant="outline">New Feature</UBadge>
            <UBadge color="warning" variant="outline">Beta</UBadge>
            <UBadge color="success" variant="outline">Stable</UBadge>
          </div>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Props Table -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Props</h2>
      <DocsPropsTable :props="badgeProps" />
    </section>
  </div>
</template>
