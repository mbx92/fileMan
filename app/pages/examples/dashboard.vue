<script setup lang="ts">
// Stats data
const stats = [
  { label: 'Total Revenue', value: '$45,231.89', change: '+20.1%', changeType: 'positive', icon: 'i-heroicons-currency-dollar' },
  { label: 'Subscriptions', value: '+2,350', change: '+180.1%', changeType: 'positive', icon: 'i-heroicons-users' },
  { label: 'Sales', value: '+12,234', change: '+19%', changeType: 'positive', icon: 'i-heroicons-credit-card' },
  { label: 'Active Now', value: '+573', change: '+201', changeType: 'positive', icon: 'i-heroicons-bolt' }
]

// Recent sales
const recentSales = [
  { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+$1,999.00', avatar: 'https://avatars.githubusercontent.com/u/1?v=4' },
  { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '+$39.00', avatar: 'https://avatars.githubusercontent.com/u/2?v=4' },
  { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '+$299.00', avatar: 'https://avatars.githubusercontent.com/u/3?v=4' },
  { name: 'William Kim', email: 'will@email.com', amount: '+$99.00', avatar: 'https://avatars.githubusercontent.com/u/4?v=4' },
  { name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: '+$39.00', avatar: 'https://avatars.githubusercontent.com/u/5?v=4' }
]

// Activity
const activities = [
  { title: 'New user registered', description: 'John Doe signed up', time: '2 minutes ago', icon: 'i-heroicons-user-plus' },
  { title: 'Order completed', description: 'Order #12345 was delivered', time: '15 minutes ago', icon: 'i-heroicons-check-circle' },
  { title: 'Payment received', description: '$1,999.00 from Olivia Martin', time: '1 hour ago', icon: 'i-heroicons-currency-dollar' },
  { title: 'New comment', description: 'On product review', time: '3 hours ago', icon: 'i-heroicons-chat-bubble-left' }
]
</script>

<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p class="text-gray-500 dark:text-gray-400">Welcome back, here's what's happening.</p>
      </div>
      <div class="flex gap-2">
        <UButton variant="outline" icon="i-heroicons-arrow-down-tray">Export</UButton>
        <UButton icon="i-heroicons-plus">Add Widget</UButton>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <UCard v-for="stat in stats" :key="stat.label">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stat.value }}</p>
            <p class="text-sm text-green-600 dark:text-green-400 mt-1">{{ stat.change }} from last month</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            <UIcon :name="stat.icon" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Chart Area -->
      <div class="lg:col-span-2">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-gray-900 dark:text-white">Overview</h3>
              <USelect :options="[{ label: 'Last 7 days', value: '7d' }, { label: 'Last 30 days', value: '30d' }]" size="sm" />
            </div>
          </template>
          <!-- Chart placeholder -->
          <div class="h-64 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-950 dark:to-purple-950 rounded-lg flex items-center justify-center">
            <div class="text-center">
              <UIcon name="i-heroicons-chart-bar" class="w-12 h-12 text-primary-400 mx-auto mb-2" />
              <p class="text-gray-500 dark:text-gray-400">Chart Component Here</p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Recent Sales -->
      <div>
        <UCard>
          <template #header>
            <h3 class="font-semibold text-gray-900 dark:text-white">Recent Sales</h3>
            <p class="text-sm text-gray-500">You made 265 sales this month.</p>
          </template>
          <div class="space-y-4">
            <div v-for="sale in recentSales" :key="sale.email" class="flex items-center gap-3">
              <UAvatar :src="sale.avatar" size="sm" />
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 dark:text-white text-sm truncate">{{ sale.name }}</p>
                <p class="text-xs text-gray-500 truncate">{{ sale.email }}</p>
              </div>
              <p class="font-medium text-gray-900 dark:text-white text-sm">{{ sale.amount }}</p>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Activity Feed -->
    <div class="mt-6">
      <UCard>
        <template #header>
          <h3 class="font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        </template>
        <div class="space-y-4">
          <div v-for="activity in activities" :key="activity.title" class="flex gap-4">
            <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
              <UIcon :name="activity.icon" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900 dark:text-white text-sm">{{ activity.title }}</p>
              <p class="text-sm text-gray-500">{{ activity.description }}</p>
            </div>
            <p class="text-xs text-gray-400">{{ activity.time }}</p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
