<script setup lang="ts">
// Modal props
const modalProps = [
  { name: 'open', type: 'boolean', default: 'false', description: 'Control visibility (v-model:open)' },
  { name: 'title', type: 'string', default: 'undefined', description: 'Modal title' },
  { name: 'preventClose', type: 'boolean', default: 'false', description: 'Prevent closing on overlay click' }
]

// Demo states
const basicModal = ref(false)
const confirmModal = ref(false)
const formModal = ref(false)

// Code examples
const basicCode = `<UButton @click="open = true">Open</UButton>
<UModal v-model:open="open">...</UModal>`

const confirmCode = `<UModal>Are you sure?</UModal>`

const formCode = `<UModal><form>...</form></UModal>`
</script>

<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <div class="page-header">
      <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
        <NuxtLink to="/components" class="hover:text-primary-500">Components</NuxtLink>
        <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
        <span class="text-gray-900 dark:text-white">Modal</span>
      </div>
      <h1 class="page-title text-gray-900 dark:text-white">Modal</h1>
      <p class="page-description text-gray-600 dark:text-gray-400">
        A dialog component for displaying content that requires user attention.
      </p>
    </div>

    <!-- Basic Usage -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Basic Usage</h2>
      <DocsComponentPreview title="Basic Modal" :code="basicCode">
        <UButton @click="basicModal = true">Open Modal</UButton>
        
        <UModal v-model:open="basicModal">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Modal Title</h3>
          </template>
          <p class="text-gray-600 dark:text-gray-400">This is the modal content.</p>
          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton variant="ghost" @click="basicModal = false">Cancel</UButton>
              <UButton @click="basicModal = false">Confirm</UButton>
            </div>
          </template>
        </UModal>
      </DocsComponentPreview>
    </section>

    <!-- Confirmation Modal -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Confirmation Dialog</h2>
      <DocsComponentPreview title="Confirm Modal" :code="confirmCode">
        <UButton color="error" variant="soft" @click="confirmModal = true">Delete Item</UButton>
        
        <UModal v-model:open="confirmModal">
          <template #content>
            <div class="p-6 text-center">
              <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 mx-auto mb-4 flex items-center justify-center">
                <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-red-600" />
              </div>
              <h3 class="text-lg font-semibold mb-2">Delete Item</h3>
              <p class="text-gray-500 mb-6">This action cannot be undone.</p>
              <div class="flex justify-center gap-3">
                <UButton variant="outline" @click="confirmModal = false">Cancel</UButton>
                <UButton color="error" @click="confirmModal = false">Delete</UButton>
              </div>
            </div>
          </template>
        </UModal>
      </DocsComponentPreview>
    </section>

    <!-- Form Modal -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Form Modal</h2>
      <DocsComponentPreview title="Form Modal" :code="formCode">
        <UButton @click="formModal = true">Create User</UButton>
        
        <UModal v-model:open="formModal">
          <template #header>
            <h3 class="text-lg font-semibold">Create User</h3>
          </template>
          <form class="space-y-4">
            <UInput icon="i-heroicons-user" placeholder="Full Name" />
            <UInput icon="i-heroicons-envelope" type="email" placeholder="Email" />
          </form>
          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton variant="ghost" @click="formModal = false">Cancel</UButton>
              <UButton @click="formModal = false">Create</UButton>
            </div>
          </template>
        </UModal>
      </DocsComponentPreview>
    </section>

    <!-- Props Table -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Props</h2>
      <DocsPropsTable :props="modalProps" />
    </section>
  </div>
</template>
