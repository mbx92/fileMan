<script setup lang="ts">
interface Props {
  code: string
  language?: string
  filename?: string
}

const props = withDefaults(defineProps<Props>(), {
  language: 'vue'
})

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

// Language badge colors
const languageColors: Record<string, string> = {
  vue: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  ts: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  typescript: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  js: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  javascript: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  html: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  css: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  bash: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  json: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
}

const languageColor = computed(() => languageColors[props.language] || languageColors.js)
</script>

<template>
  <div class="code-block relative rounded-xl overflow-hidden bg-gray-950 border border-gray-800">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
      <div class="flex items-center gap-3">
        <!-- Window dots -->
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-red-500" />
          <span class="w-3 h-3 rounded-full bg-yellow-500" />
          <span class="w-3 h-3 rounded-full bg-green-500" />
        </div>
        
        <!-- Filename -->
        <span v-if="filename" class="text-sm text-gray-400">
          {{ filename }}
        </span>
        
        <!-- Language badge -->
        <span
          class="text-xs font-medium px-2 py-0.5 rounded"
          :class="languageColor"
        >
          {{ language }}
        </span>
      </div>

      <!-- Copy button -->
      <button
        class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        @click="copyCode"
      >
        <UIcon
          :name="copied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'"
          class="w-4 h-4"
        />
        {{ copied ? 'Copied!' : 'Copy' }}
      </button>
    </div>

    <!-- Code -->
    <pre class="p-4 overflow-x-auto"><code class="text-sm text-gray-100 font-mono">{{ code }}</code></pre>
  </div>
</template>

<style scoped>
pre {
  margin: 0;
  line-height: 1.7;
}

pre::-webkit-scrollbar {
  height: 6px;
}

pre::-webkit-scrollbar-track {
  background: rgb(31 41 55);
}

pre::-webkit-scrollbar-thumb {
  background: rgb(75 85 99);
  border-radius: 3px;
}
</style>
