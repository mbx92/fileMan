<script setup lang="ts">
// User profile data
const user = reactive({
  name: 'John Doe',
  email: 'john@example.com',
  username: 'johndoe',
  role: 'Software Developer',
  location: 'Jakarta, Indonesia',
  website: 'https://johndoe.dev',
  bio: 'Passionate developer with 5+ years of experience in building modern web applications. Love working with Vue.js, Nuxt, and TypeScript.',
  joinDate: 'January 2023',
  avatar: 'https://avatars.githubusercontent.com/u/1?v=4'
})

// Stats
const stats = [
  { label: 'Projects', value: '24' },
  { label: 'Followers', value: '1.2K' },
  { label: 'Following', value: '156' }
]

// Recent activity
const activities = [
  { id: 1, action: 'Completed project', target: 'E-commerce Dashboard', time: '2 hours ago', icon: 'i-heroicons-check-circle' },
  { id: 2, action: 'Created new', target: 'API Documentation', time: '5 hours ago', icon: 'i-heroicons-document-plus' },
  { id: 3, action: 'Updated', target: 'User Profile Component', time: '1 day ago', icon: 'i-heroicons-pencil-square' },
  { id: 4, action: 'Reviewed', target: 'Pull Request #42', time: '2 days ago', icon: 'i-heroicons-eye' }
]

// Skills
const skills = [
  { name: 'Vue.js', level: 95 },
  { name: 'TypeScript', level: 88 },
  { name: 'Nuxt', level: 92 },
  { name: 'Tailwind CSS', level: 90 },
  { name: 'Node.js', level: 75 }
]
</script>

<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
      <p class="text-gray-500 dark:text-gray-400">View and manage your profile information.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Card -->
      <div class="lg:col-span-1">
        <UCard>
          <div class="text-center">
            <UAvatar :src="user.avatar" size="3xl" class="mx-auto mb-4" />
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ user.name }}</h2>
            <p class="text-gray-500 dark:text-gray-400">@{{ user.username }}</p>
            <p class="text-sm text-primary-600 dark:text-primary-400 mt-1">{{ user.role }}</p>
          </div>
          
          <div class="mt-6 flex justify-center gap-8">
            <div v-for="stat in stats" :key="stat.label" class="text-center">
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
            </div>
          </div>
          
          <div class="mt-6 flex gap-2">
            <UButton class="flex-1">Edit Profile</UButton>
            <UButton variant="outline" class="flex-1">Share</UButton>
          </div>
        </UCard>

        <!-- Info Card -->
        <UCard class="mt-6">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">About</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{ user.bio }}</p>
          
          <div class="space-y-3">
            <div class="flex items-center gap-3 text-sm">
              <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-gray-400" />
              <span class="text-gray-600 dark:text-gray-400">{{ user.location }}</span>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <UIcon name="i-heroicons-link" class="w-4 h-4 text-gray-400" />
              <a :href="user.website" class="text-primary-600 dark:text-primary-400 hover:underline">{{ user.website }}</a>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <UIcon name="i-heroicons-calendar" class="w-4 h-4 text-gray-400" />
              <span class="text-gray-600 dark:text-gray-400">Joined {{ user.joinDate }}</span>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Skills -->
        <UCard>
          <template #header>
            <h3 class="font-semibold text-gray-900 dark:text-white">Skills</h3>
          </template>
          
          <div class="space-y-4">
            <div v-for="skill in skills" :key="skill.name">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ skill.name }}</span>
                <span class="text-sm text-gray-500">{{ skill.level }}%</span>
              </div>
              <UProgress :value="skill.level" />
            </div>
          </div>
        </UCard>

        <!-- Recent Activity -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
              <UButton variant="ghost" size="xs">View All</UButton>
            </div>
          </template>
          
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div v-for="activity in activities" :key="activity.id" class="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
              <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center shrink-0">
                <UIcon :name="activity.icon" class="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-900 dark:text-white">
                  {{ activity.action }} 
                  <span class="font-medium">{{ activity.target }}</span>
                </p>
                <p class="text-xs text-gray-500">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Contact Information -->
        <UCard>
          <template #header>
            <h3 class="font-semibold text-gray-900 dark:text-white">Contact Information</h3>
          </template>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <UInput :model-value="user.email" disabled icon="i-heroicons-envelope" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
              <UInput :model-value="user.username" disabled icon="i-heroicons-at-symbol" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website</label>
              <UInput :model-value="user.website" disabled icon="i-heroicons-globe-alt" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
              <UInput :model-value="user.location" disabled icon="i-heroicons-map-pin" />
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end">
              <UButton>Update Contact Info</UButton>
            </div>
          </template>
        </UCard>
      </div>
    </div>
  </div>
</template>
