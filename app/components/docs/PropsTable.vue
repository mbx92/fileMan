<script setup lang="ts">
interface Prop {
  name: string
  type: string
  default?: string
  description: string
  required?: boolean
}

interface Props {
  props: Prop[]
}

defineProps<Props>()
</script>

<template>
  <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
    <table class="props-table w-full">
      <thead class="bg-gray-50 dark:bg-gray-800/50">
        <tr>
          <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Prop
          </th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Type
          </th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Default
          </th>
          <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Description
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
        <tr
          v-for="prop in props"
          :key="prop.name"
          class="bg-white dark:bg-gray-900"
        >
          <td class="px-4 py-3">
            <div class="flex items-center gap-2">
              <code class="text-sm font-mono text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950 px-1.5 py-0.5 rounded">
                {{ prop.name }}
              </code>
              <UBadge v-if="prop.required" color="red" variant="subtle" size="xs">
                Required
              </UBadge>
            </div>
          </td>
          <td class="px-4 py-3">
            <code class="text-sm font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-1.5 py-0.5 rounded">
              {{ prop.type }}
            </code>
          </td>
          <td class="px-4 py-3">
            <code
              v-if="prop.default !== undefined"
              class="text-sm font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded"
            >
              {{ prop.default }}
            </code>
            <span v-else class="text-gray-400 dark:text-gray-600">—</span>
          </td>
          <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
            {{ prop.description }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
