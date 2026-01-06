<script setup lang="ts">
// Kbd props documentation
const kbdProps = [
  { name: 'value', type: 'string', default: 'undefined', description: 'The key or shortcut to display' },
  { name: 'size', type: 'string', default: "'md'", description: 'The size of the keyboard key' }
]

// Code examples
const basicCode = `<UKbd>⌘</UKbd>
<UKbd>K</UKbd>`

const shortcutsCode = `<div class="flex items-center gap-1">
  <UKbd>⌘</UKbd>
  <span>+</span>
  <UKbd>K</UKbd>
</div>`

const sizesCode = `<UKbd size="xs">Esc</UKbd>
<UKbd size="sm">Esc</UKbd>
<UKbd size="md">Esc</UKbd>
<UKbd size="lg">Esc</UKbd>`

const specialKeysCode = `<UKbd>⌘</UKbd> <!-- Command -->
<UKbd>⌥</UKbd> <!-- Option -->
<UKbd>⇧</UKbd> <!-- Shift -->
<UKbd>⌃</UKbd> <!-- Control -->`
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
        <span class="text-gray-900 dark:text-white">Kbd</span>
      </div>
      <h1 class="page-title text-gray-900 dark:text-white">Kbd</h1>
      <p class="page-description text-gray-600 dark:text-gray-400">
        Display keyboard keys and shortcuts in a styled format.
      </p>
    </div>

    <!-- Basic Usage -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Basic Usage</h2>
      <DocsComponentPreview title="Single Keys" :code="basicCode">
        <div class="flex items-center gap-3">
          <UKbd>⌘</UKbd>
          <UKbd>K</UKbd>
          <UKbd>Esc</UKbd>
          <UKbd>Enter</UKbd>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Keyboard Shortcuts -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Keyboard Shortcuts</h2>
      <DocsComponentPreview title="Combined Shortcuts" :code="shortcutsCode">
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-600 dark:text-gray-400 w-32">Search:</span>
            <div class="flex items-center gap-1">
              <UKbd>⌘</UKbd>
              <span class="text-gray-400">+</span>
              <UKbd>K</UKbd>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-600 dark:text-gray-400 w-32">Save:</span>
            <div class="flex items-center gap-1">
              <UKbd>⌘</UKbd>
              <span class="text-gray-400">+</span>
              <UKbd>S</UKbd>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-600 dark:text-gray-400 w-32">Undo:</span>
            <div class="flex items-center gap-1">
              <UKbd>⌘</UKbd>
              <span class="text-gray-400">+</span>
              <UKbd>Z</UKbd>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-600 dark:text-gray-400 w-32">Copy:</span>
            <div class="flex items-center gap-1">
              <UKbd>⌘</UKbd>
              <span class="text-gray-400">+</span>
              <UKbd>C</UKbd>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-600 dark:text-gray-400 w-32">Select All:</span>
            <div class="flex items-center gap-1">
              <UKbd>⌘</UKbd>
              <span class="text-gray-400">+</span>
              <UKbd>A</UKbd>
            </div>
          </div>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Sizes -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Sizes</h2>
      <DocsComponentPreview title="Different Sizes" :code="sizesCode">
        <div class="flex items-end gap-4">
          <div class="text-center">
            <UKbd size="xs">Esc</UKbd>
            <p class="text-xs text-gray-500 mt-2">xs</p>
          </div>
          <div class="text-center">
            <UKbd size="sm">Esc</UKbd>
            <p class="text-xs text-gray-500 mt-2">sm</p>
          </div>
          <div class="text-center">
            <UKbd>Esc</UKbd>
            <p class="text-xs text-gray-500 mt-2">md</p>
          </div>
          <div class="text-center">
            <UKbd size="lg">Esc</UKbd>
            <p class="text-xs text-gray-500 mt-2">lg</p>
          </div>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Special Keys -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Special Keys</h2>
      <DocsComponentPreview title="Special Keys" :code="specialKeysCode">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UKbd>⌘</UKbd>
            <span class="text-sm text-gray-600 dark:text-gray-400">Command</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UKbd>⌥</UKbd>
            <span class="text-sm text-gray-600 dark:text-gray-400">Option/Alt</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UKbd>⇧</UKbd>
            <span class="text-sm text-gray-600 dark:text-gray-400">Shift</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UKbd>⌃</UKbd>
            <span class="text-sm text-gray-600 dark:text-gray-400">Control</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UKbd>↵</UKbd>
            <span class="text-sm text-gray-600 dark:text-gray-400">Return</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UKbd>⌫</UKbd>
            <span class="text-sm text-gray-600 dark:text-gray-400">Delete</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UKbd>⇥</UKbd>
            <span class="text-sm text-gray-600 dark:text-gray-400">Tab</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UKbd>␣</UKbd>
            <span class="text-sm text-gray-600 dark:text-gray-400">Space</span>
          </div>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Props Table -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Props</h2>
      <DocsPropsTable :props="kbdProps" />
    </section>
  </div>
</template>
