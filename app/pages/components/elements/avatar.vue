<script setup lang="ts">
// Avatar props documentation
const avatarProps = [
  { name: 'src', type: 'string', default: 'undefined', description: 'The image source URL' },
  { name: 'alt', type: 'string', default: 'undefined', description: 'Alt text for the image' },
  { name: 'size', type: 'string', default: "'md'", description: 'Size (xs, sm, md, lg, xl, 2xl, 3xl)' },
  { name: 'text', type: 'string', default: 'undefined', description: 'Text/initials to display if no image' },
  { name: 'icon', type: 'string', default: 'undefined', description: 'Icon to display as fallback' }
]

// Code examples
const basicCode = `<UAvatar
  src="https://avatars.githubusercontent.com/u/1?v=4"
  alt="User Avatar"
/>`

const sizesCode = `<UAvatar src="..." size="xs" />
<UAvatar src="..." size="sm" />
<UAvatar src="..." size="md" />
<UAvatar src="..." size="lg" />
<UAvatar src="..." size="xl" />
<UAvatar src="..." size="2xl" />
<UAvatar src="..." size="3xl" />`

const fallbackCode = `<!-- With initials -->
<UAvatar text="JD" />

<!-- With icon -->
<UAvatar icon="i-heroicons-user" />

<!-- Broken image with fallback -->
<UAvatar src="invalid-url" text="FB" />`

const groupCode = `<UAvatarGroup>
  <UAvatar src="..." />
  <UAvatar src="..." />
  <UAvatar src="..." />
  <UAvatar text="+5" />
</UAvatarGroup>`

const statusCode = `<div class="relative">
  <UAvatar src="..." />
  <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
</div>`

const demoUsers = [
  'https://avatars.githubusercontent.com/u/1?v=4',
  'https://avatars.githubusercontent.com/u/2?v=4',
  'https://avatars.githubusercontent.com/u/3?v=4',
  'https://avatars.githubusercontent.com/u/4?v=4',
  'https://avatars.githubusercontent.com/u/5?v=4'
]
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
        <span class="text-gray-900 dark:text-white">Avatar</span>
      </div>
      <h1 class="page-title text-gray-900 dark:text-white">Avatar</h1>
      <p class="page-description text-gray-600 dark:text-gray-400">
        Display user profile images with fallback support for initials or icons.
      </p>
    </div>

    <!-- Basic Usage -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Basic Usage</h2>
      <DocsComponentPreview title="Default Avatar" :code="basicCode">
        <UAvatar
          src="https://avatars.githubusercontent.com/u/1?v=4"
          alt="User Avatar"
        />
      </DocsComponentPreview>
    </section>

    <!-- Sizes -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Sizes</h2>
      <DocsComponentPreview title="Avatar Sizes" :code="sizesCode">
        <div class="flex flex-wrap items-end gap-4">
          <div class="text-center">
            <UAvatar :src="demoUsers[0]" size="xs" />
            <p class="text-xs text-gray-500 mt-1">xs</p>
          </div>
          <div class="text-center">
            <UAvatar :src="demoUsers[0]" size="sm" />
            <p class="text-xs text-gray-500 mt-1">sm</p>
          </div>
          <div class="text-center">
            <UAvatar :src="demoUsers[0]" size="md" />
            <p class="text-xs text-gray-500 mt-1">md</p>
          </div>
          <div class="text-center">
            <UAvatar :src="demoUsers[0]" size="lg" />
            <p class="text-xs text-gray-500 mt-1">lg</p>
          </div>
          <div class="text-center">
            <UAvatar :src="demoUsers[0]" size="xl" />
            <p class="text-xs text-gray-500 mt-1">xl</p>
          </div>
          <div class="text-center">
            <UAvatar :src="demoUsers[0]" size="2xl" />
            <p class="text-xs text-gray-500 mt-1">2xl</p>
          </div>
          <div class="text-center">
            <UAvatar :src="demoUsers[0]" size="3xl" />
            <p class="text-xs text-gray-500 mt-1">3xl</p>
          </div>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Fallback -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Fallback</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        When an image fails to load or isn't provided, you can display initials or an icon.
      </p>
      <DocsComponentPreview title="Avatar Fallbacks" :code="fallbackCode">
        <div class="flex flex-wrap items-center gap-4">
          <div class="text-center">
            <UAvatar text="JD" size="lg" />
            <p class="text-xs text-gray-500 mt-2">Initials</p>
          </div>
          <div class="text-center">
            <UAvatar icon="i-heroicons-user" size="lg" />
            <p class="text-xs text-gray-500 mt-2">Icon</p>
          </div>
          <div class="text-center">
            <UAvatar text="AB" size="lg" />
            <p class="text-xs text-gray-500 mt-2">Custom Text</p>
          </div>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Avatar Group -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Avatar Group</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Display multiple avatars in a stacked group, perfect for showing team members or participants.
      </p>
      <DocsComponentPreview title="Avatar Group" :code="groupCode">
        <div class="flex items-center -space-x-3">
          <UAvatar
            v-for="(user, i) in demoUsers.slice(0, 4)"
            :key="i"
            :src="user"
            class="ring-2 ring-white dark:ring-gray-900"
            size="md"
          />
          <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
            <span class="text-xs font-medium text-gray-600 dark:text-gray-300">+5</span>
          </div>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- With Status -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">With Status Indicator</h2>
      <DocsComponentPreview title="Status Indicator" :code="statusCode">
        <div class="flex items-center gap-6">
          <div class="relative">
            <UAvatar :src="demoUsers[0]" size="lg" />
            <span class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
          </div>
          <div class="relative">
            <UAvatar :src="demoUsers[1]" size="lg" />
            <span class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-yellow-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
          </div>
          <div class="relative">
            <UAvatar :src="demoUsers[2]" size="lg" />
            <span class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-gray-400 rounded-full ring-2 ring-white dark:ring-gray-900" />
          </div>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Props Table -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Props</h2>
      <DocsPropsTable :props="avatarProps" />
    </section>
  </div>
</template>
