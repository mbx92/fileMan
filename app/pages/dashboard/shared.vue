<script setup lang="ts">
import FileBrowser from '~/components/file/FileBrowser.vue'

const viewMode = ref<'grid' | 'list'>('grid')

const { data, pending, refresh } = await useFetch('/api/files/shared')

async function handleDownload(item: any) {
    if (confirm('Download file?')) {
      window.open(`/api/files/download/${item.id}`, '_blank')
    }
}
</script>

<template>
  <div class="p-6 h-full flex flex-col">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div class="flex items-center gap-2">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Shared With Me</h1>
      </div>
      
      <div class="flex items-center gap-2">
        <UButton
          :icon="viewMode === 'grid' ? 'i-heroicons-list-bullet' : 'i-heroicons-squares-2x2'"
          color="gray"
          variant="ghost"
          @click="viewMode = viewMode === 'grid' ? 'list' : 'grid'"
        />
      </div>
    </div>

    <!-- Browser -->
    <FileBrowser
      class="flex-1"
      :files="data?.files || []"
      :folders="data?.folders || []"
      :loading="pending"
      :view-mode="viewMode"
      @refresh="refresh"
    />
  </div>
</template>
