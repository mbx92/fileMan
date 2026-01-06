<script setup lang="ts">
// Props
const radioProps = [
  { name: 'modelValue', type: 'any', default: 'undefined', description: 'Selected value (v-model)' },
  { name: 'value', type: 'any', required: true, description: 'Value of this radio option' },
  { name: 'label', type: 'string', default: 'undefined', description: 'Label text' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the radio' },
  { name: 'color', type: 'string', default: "'primary'", description: 'Radio color when selected' }
]

// Demo
const selected = ref('email')
const plan = ref('pro')

// Code examples
const basicCode = `<URadioGroup v-model="selected">
  <URadio value="email" label="Email" />
  <URadio value="phone" label="Phone" />
  <URadio value="mail" label="Mail" />
</URadioGroup>`

const horizontalCode = `<div class="flex gap-6">
  <URadio v-model="selected" value="small" label="Small" />
  <URadio v-model="selected" value="medium" label="Medium" />
  <URadio v-model="selected" value="large" label="Large" />
</div>`

const colorsCode = `<URadio color="primary" ... />
<URadio color="success" ... />
<URadio color="warning" ... />
<URadio color="error" ... />`

const disabledCode = `<URadio disabled label="Disabled option" />`

const cardCode = `<div class="grid gap-4">
  <label :class="{ active: plan === 'basic' }">
    <URadio v-model="plan" value="basic" />
    <div>Basic Plan</div>
  </label>
  ...
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
        <span class="text-gray-900 dark:text-white">Radio</span>
      </div>
      <h1 class="page-title text-gray-900 dark:text-white">Radio</h1>
      <p class="page-description text-gray-600 dark:text-gray-400">
        A radio button component for single-choice selections.
      </p>
    </div>

    <!-- Basic Usage -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Basic Usage</h2>
      <DocsComponentPreview title="Radio Group" :code="basicCode">
        <div class="space-y-3">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Contact method:</p>
          <div class="space-y-2">
            <URadio v-model="selected" value="email" label="Email" />
            <URadio v-model="selected" value="phone" label="Phone" />
            <URadio v-model="selected" value="mail" label="Mail" />
          </div>
          <p class="text-sm text-gray-500 mt-2">Selected: {{ selected }}</p>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Horizontal -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Horizontal Layout</h2>
      <DocsComponentPreview title="Horizontal Radio Group" :code="horizontalCode">
        <div>
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Size:</p>
          <div class="flex gap-6">
            <URadio v-model="selected" value="small" label="Small" />
            <URadio v-model="selected" value="medium" label="Medium" />
            <URadio v-model="selected" value="large" label="Large" />
          </div>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Colors -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Colors</h2>
      <DocsComponentPreview title="Radio Colors" :code="colorsCode">
        <div class="flex flex-wrap gap-6">
          <URadio color="primary" value="primary" :model-value="'primary'" label="Primary" />
          <URadio color="success" value="success" :model-value="'success'" label="Success" />
          <URadio color="warning" value="warning" :model-value="'warning'" label="Warning" />
          <URadio color="error" value="error" :model-value="'error'" label="Error" />
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Disabled -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Disabled State</h2>
      <DocsComponentPreview title="Disabled Radio" :code="disabledCode">
        <div class="space-y-2">
          <URadio disabled value="disabled1" label="Disabled (unselected)" />
          <URadio disabled :model-value="'disabled2'" value="disabled2" label="Disabled (selected)" />
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Card Style Radio -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Card Style Selection</h2>
      <DocsComponentPreview title="Plan Selection" :code="cardCode">
        <div class="grid gap-3 w-full">
          <label
            class="flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all"
            :class="plan === 'basic' 
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-950' 
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
          >
            <URadio v-model="plan" value="basic" class="mt-0.5" />
            <div class="flex-1">
              <p class="font-medium text-gray-900 dark:text-white">Basic</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">$9/month • 5 projects</p>
            </div>
          </label>
          
          <label
            class="flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all"
            :class="plan === 'pro' 
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-950' 
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
          >
            <URadio v-model="plan" value="pro" class="mt-0.5" />
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <p class="font-medium text-gray-900 dark:text-white">Pro</p>
                <UBadge color="primary" variant="soft" size="xs">Popular</UBadge>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400">$29/month • Unlimited projects</p>
            </div>
          </label>
          
          <label
            class="flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all"
            :class="plan === 'enterprise' 
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-950' 
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
          >
            <URadio v-model="plan" value="enterprise" class="mt-0.5" />
            <div class="flex-1">
              <p class="font-medium text-gray-900 dark:text-white">Enterprise</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Custom pricing • Everything included</p>
            </div>
          </label>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Props Table -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Props</h2>
      <DocsPropsTable :props="radioProps" />
    </section>
  </div>
</template>
