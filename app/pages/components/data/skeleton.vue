<script setup lang="ts">
// Skeleton props
const skeletonProps = [
  { name: 'class', type: 'string', default: 'undefined', description: 'CSS classes for sizing' }
]

// Code examples
const basicCode = `<USkeleton class="h-4 w-48" />`

const cardCode = `<div class="flex gap-4">
  <USkeleton class="w-12 h-12 rounded-full" />
  <div class="space-y-2">
    <USkeleton class="h-4 w-32" />
    <USkeleton class="h-3 w-48" />
  </div>
</div>`

const tableCode = `<div class="space-y-3">
  <USkeleton class="h-10 w-full" />
  <USkeleton class="h-12 w-full" />
  <USkeleton class="h-12 w-full" />
  <USkeleton class="h-12 w-full" />
</div>`

const articleCode = `<div class="space-y-4">
  <USkeleton class="h-8 w-3/4" />
  <USkeleton class="h-4 w-full" />
  <USkeleton class="h-4 w-full" />
  <USkeleton class="h-4 w-2/3" />
</div>`
</script>

<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <div class="page-header">
      <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
        <NuxtLink to="/components" class="hover:text-primary-500">Components</NuxtLink>
        <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
        <NuxtLink to="/components" class="hover:text-primary-500">Data</NuxtLink>
        <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
        <span class="text-gray-900 dark:text-white">Skeleton</span>
      </div>
      <h1 class="page-title text-gray-900 dark:text-white">Skeleton</h1>
      <p class="page-description text-gray-600 dark:text-gray-400">
        A placeholder component for loading states.
      </p>
    </div>

    <!-- Basic Usage -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Basic Usage</h2>
      <DocsComponentPreview title="Basic Skeleton" :code="basicCode">
        <div class="space-y-3 w-full max-w-sm">
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-3/4" />
          <USkeleton class="h-4 w-1/2" />
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Card Skeleton -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Card Loading</h2>
      <DocsComponentPreview title="Card Skeleton" :code="cardCode">
        <div class="w-full max-w-sm">
          <UCard>
            <div class="flex gap-4">
              <USkeleton class="w-12 h-12 rounded-full flex-shrink-0" />
              <div class="flex-1 space-y-2">
                <USkeleton class="h-4 w-32" />
                <USkeleton class="h-3 w-48" />
              </div>
            </div>
          </UCard>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Table Skeleton -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Table Loading</h2>
      <DocsComponentPreview title="Table Skeleton" :code="tableCode">
        <div class="w-full rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <!-- Header -->
          <div class="bg-gray-50 dark:bg-gray-800 p-4">
            <div class="flex gap-8">
              <USkeleton class="h-4 w-24" />
              <USkeleton class="h-4 w-32" />
              <USkeleton class="h-4 w-20" />
              <USkeleton class="h-4 w-16" />
            </div>
          </div>
          <!-- Rows -->
          <div class="divide-y divide-gray-200 dark:divide-gray-800">
            <div v-for="i in 4" :key="i" class="p-4">
              <div class="flex gap-8 items-center">
                <div class="flex items-center gap-3">
                  <USkeleton class="h-8 w-8 rounded-full" />
                  <USkeleton class="h-4 w-24" />
                </div>
                <USkeleton class="h-4 w-32" />
                <USkeleton class="h-4 w-16" />
                <USkeleton class="h-6 w-16 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Article Skeleton -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Article Loading</h2>
      <DocsComponentPreview title="Article Skeleton" :code="articleCode">
        <div class="w-full max-w-lg space-y-6">
          <!-- Title -->
          <USkeleton class="h-8 w-3/4" />
          
          <!-- Meta -->
          <div class="flex items-center gap-4">
            <USkeleton class="h-10 w-10 rounded-full" />
            <div class="space-y-2">
              <USkeleton class="h-4 w-24" />
              <USkeleton class="h-3 w-16" />
            </div>
          </div>
          
          <!-- Image -->
          <USkeleton class="h-48 w-full rounded-xl" />
          
          <!-- Content -->
          <div class="space-y-3">
            <USkeleton class="h-4 w-full" />
            <USkeleton class="h-4 w-full" />
            <USkeleton class="h-4 w-5/6" />
            <USkeleton class="h-4 w-full" />
            <USkeleton class="h-4 w-3/4" />
          </div>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Props Table -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Props</h2>
      <DocsPropsTable :props="skeletonProps" />
    </section>
  </div>
</template>
