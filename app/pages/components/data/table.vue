<script setup lang="ts">
// Table props
const tableProps = [
  { name: 'data', type: 'array', required: true, description: 'Array of row data' },
  { name: 'columns', type: 'array', required: true, description: 'Column definitions' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show loading state' },
  { name: 'sticky', type: 'boolean', default: 'false', description: 'Sticky header' }
]

// Demo data
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', status: 'Inactive' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Editor', status: 'Active' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Viewer', status: 'Pending' }
]

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' }
]

// Code examples
const basicCode = `<UTable :data="users" :columns="columns" />`

const customCellCode = `<UTable :data="users" :columns="columns">
  <template #status="{ row }">
    <UBadge :color="row.status === 'Active' ? 'success' : 'error'">
      {{ row.status }}
    </UBadge>
  </template>
</UTable>`

const loadingCode = `<UTable :data="[]" :columns="columns" loading />`

const emptyCode = `<UTable :data="[]" :columns="columns">
  <template #empty>
    <div class="text-center py-12">
      No data available
    </div>
  </template>
</UTable>`
</script>

<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <div class="page-header">
      <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
        <NuxtLink to="/components" class="hover:text-primary-500">Components</NuxtLink>
        <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
        <NuxtLink to="/components" class="hover:text-primary-500">Data</NuxtLink>
        <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
        <span class="text-gray-900 dark:text-white">Table</span>
      </div>
      <h1 class="page-title text-gray-900 dark:text-white">Table</h1>
      <p class="page-description text-gray-600 dark:text-gray-400">
        A flexible data table component for displaying structured data.
      </p>
    </div>

    <!-- Basic Usage -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Basic Usage</h2>
      <DocsComponentPreview title="Default Table" :code="basicCode">
        <div class="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th v-for="col in columns" :key="col.key" class="text-left px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                  {{ col.label }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ user.name }}</td>
                <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</td>
                <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{{ user.role }}</td>
                <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{{ user.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Custom Cells -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Custom Cell Rendering</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Use slots to customize how cells are rendered.
      </p>
      <DocsComponentPreview title="Custom Cells" :code="customCellCode">
        <div class="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="text-left px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                <th class="text-left px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                <th class="text-left px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">Role</th>
                <th class="text-left px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th class="text-right px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <UAvatar :text="user.name.split(' ').map((n: string) => n[0]).join('')" size="sm" />
                    <span class="font-medium text-gray-900 dark:text-white">{{ user.name }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-gray-500 dark:text-gray-400">{{ user.email }}</td>
                <td class="px-4 py-3 text-gray-500 dark:text-gray-400">{{ user.role }}</td>
                <td class="px-4 py-3">
                  <UBadge
                    :color="user.status === 'Active' ? 'success' : user.status === 'Pending' ? 'warning' : 'error'"
                    variant="soft"
                    size="sm"
                  >
                    {{ user.status }}
                  </UBadge>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <UButton icon="i-heroicons-pencil" variant="ghost" size="xs" color="neutral" />
                    <UButton icon="i-heroicons-trash" variant="ghost" size="xs" color="error" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Loading State -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Loading State</h2>
      <DocsComponentPreview title="Loading Table" :code="loadingCode">
        <div class="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th v-for="col in columns" :key="col.key" class="text-left px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                  {{ col.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in 3" :key="i">
                <td v-for="col in columns" :key="col.key" class="px-4 py-3">
                  <USkeleton class="h-4 w-24" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Empty State -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Empty State</h2>
      <DocsComponentPreview title="Empty Table" :code="emptyCode">
        <div class="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th v-for="col in columns" :key="col.key" class="text-left px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                  {{ col.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td :colspan="columns.length" class="px-4 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <UIcon name="i-heroicons-inbox" class="w-12 h-12 text-gray-300 dark:text-gray-600" />
                    <p class="text-gray-500 dark:text-gray-400">No data available</p>
                    <UButton size="sm">Add first item</UButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </DocsComponentPreview>
    </section>

    <!-- Props Table -->
    <section class="page-section">
      <h2 class="section-title text-gray-900 dark:text-white">Props</h2>
      <DocsPropsTable :props="tableProps" />
    </section>
  </div>
</template>
