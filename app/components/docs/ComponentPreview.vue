<script setup lang="ts">
interface Props {
  title: string
  description?: string
  code: string
  language?: string
}

const props = withDefaults(defineProps<Props>(), {
  language: 'vue'
})

const activeTab = ref('preview')
const copied = ref(false)

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy code:', err)
  }
}

const tabs = [
  { label: 'Preview', value: 'preview', icon: 'i-heroicons-eye' },
  { label: 'Code', value: 'code', icon: 'i-heroicons-code-bracket' }
]
</script>

<template>
  <div class="component-preview border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
    <!-- Header -->
    <div class="component-preview-header border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
      <div class="flex items-center gap-2">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
        <p v-if="description" class="text-xs text-gray-500 dark:text-gray-400">{{ description }}</p>
      </div>
      
      <div class="flex items-center gap-2">
        <!-- Tab switcher -->
        <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            :class="[
              activeTab === tab.value
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            ]"
            @click="activeTab = tab.value"
          >
            <UIcon :name="tab.icon" class="w-3.5 h-3.5" />
            {{ tab.label }}
          </button>
        </div>

        <!-- Copy button -->
        <UButton
          :icon="copied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'"
          variant="ghost"
          color="neutral"
          size="xs"
          @click="copyCode"
        />
      </div>
    </div>

    <!-- Preview -->
    <div v-show="activeTab === 'preview'" class="component-preview-body p-8 bg-gray-50/50 dark:bg-gray-800/30">
      <slot />
    </div>

    <!-- Code -->
    <div v-show="activeTab === 'code'" class="component-preview-code">
      <div class="code-block bg-gray-950">
        <pre class="text-sm"><code class="text-gray-100">{{ code }}</code></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-block pre {
  margin: 0;
  padding: 1rem 1.25rem;
  overflow-x: auto;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.8125rem;
  line-height: 1.7;
}
</style>
