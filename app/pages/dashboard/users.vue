<script setup lang="ts">
const authStore = useAuthStore()
const toast = useToast()
const isLoading = ref(false)

// Mock data for now - replace with actual API
const mockUsers = ref([
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    name: 'Administrator',
    role: 'SUPERADMIN',
    ssoProvider: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'user1',
    email: 'user1@example.com',
    name: 'User One',
    role: 'USER',
    ssoProvider: 'oidc',
    createdAt: new Date().toISOString(),
  },
])

const columns = [{
  id: 'username',
  key: 'username',
  label: 'Username',
}, {
  id: 'email',
  key: 'email',
  label: 'Email',
}, {
  id: 'name',
  key: 'name',
  label: 'Name',
}, {
  id: 'role',
  key: 'role',
  label: 'Role',
}, {
  id: 'ssoProvider',
  key: 'ssoProvider',
  label: 'SSO',
}, {
  id: 'actions',
  key: 'actions',
  label: 'Actions',
}]

const selectedUser = ref(null)
const isModalOpen = ref(false)
const isSaving = ref(false)

const formData = ref({
  username: '',
  name: '',
  email: '',
  role: 'USER',
  password: ''
})

function openUserModal(user?: any) {
  selectedUser.value = user || null
  if (user) {
    formData.value = {
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      password: '' // Don't fill password on edit
    }
  } else {
    formData.value = {
      username: '',
      name: '',
      email: '',
      role: 'USER',
      password: ''
    }
  }
  isModalOpen.value = true
}

async function saveUser() {
  isSaving.value = true
  // Mock API call
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const currentUser = selectedUser.value as any
  
  if (currentUser) {
    // Update existing
    const index = mockUsers.value.findIndex(u => u.id === currentUser.id)
    if (index !== -1) {
      mockUsers.value[index] = { ...mockUsers.value[index], ...formData.value }
    }
    toast.add({ title: 'Success', description: 'User updated successfully', color: 'success' })
  } else {
    // Add new
    mockUsers.value.push({
      id: String(mockUsers.value.length + 1),
      ...formData.value,
      ssoProvider: null,
      createdAt: new Date().toISOString()
    })
    toast.add({ title: 'Success', description: 'User created successfully', color: 'success' })
  }
  
  isSaving.value = false
  closeModal()
}

function closeModal() {
  isModalOpen.value = false
  selectedUser.value = null
}

async function deleteUser(userId: string) {
  if (!confirm('Are you sure you want to delete this user?')) return
  
  try {
    isLoading.value = true
    // await $fetch(`/api/users/${userId}`, { method: 'DELETE' })
    toast.add({
      title: 'Success',
      description: 'User deleted successfully',
      color: 'success',
    })
    // refresh()
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to delete user',
      color: 'error',
    })
  } finally {
    isLoading.value = false
  }
}

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'SUPERADMIN': return 'error'
    case 'ADMIN': return 'warning'
    default: return 'neutral'
  }
}
</script>

<template>
  <div class="p-6 h-full">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">Manage user accounts and permissions</p>
        </div>
        <UButton
          icon="i-heroicons-plus"
          @click="openUserModal()"
        >
          Add User
        </UButton>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UCard>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <UIcon name="i-heroicons-users" class="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
              <p class="text-2xl font-bold">{{ mockUsers.length }}</p>
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <UIcon name="i-heroicons-shield-check" class="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">SSO Users</p>
              <p class="text-2xl font-bold">{{ mockUsers.filter(u => u.ssoProvider).length }}</p>
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <UIcon name="i-heroicons-user-group" class="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Admins</p>
              <p class="text-2xl font-bold">{{ mockUsers.filter(u => u.role !== 'USER').length }}</p>
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <UIcon name="i-heroicons-user" class="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Regular Users</p>
              <p class="text-2xl font-bold">{{ mockUsers.filter(u => u.role === 'USER').length }}</p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Users Table -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">All Users</h2>
            <UInput
              icon="i-heroicons-magnifying-glass"
              placeholder="Search users..."
              class="w-64"
            />
          </div>
        </template>

        <UTable
          :columns="columns"
          :rows="mockUsers"
          :loading="false"
        >
          <template #username-data="{ row }: any">
            <div class="flex items-center gap-3">
              <UAvatar
                :alt="row.name"
                size="sm"
              />
              <div>
                <p class="font-medium">{{ row.username }}</p>
                <p class="text-xs text-gray-500">{{ row.name }}</p>
              </div>
            </div>
          </template>

          <template #role-data="{ row }">
            <UBadge :color="getRoleBadgeColor(row.role)" variant="subtle">
              {{ row.role }}
            </UBadge>
          </template>

          <template #ssoProvider-data="{ row }: any">
            <UBadge v-if="row.ssoProvider" color="success" variant="subtle">
              <UIcon name="i-heroicons-shield-check" class="w-3 h-3 mr-1" />
              SSO
            </UBadge>
            <UBadge v-else color="neutral" variant="subtle">
              Local
            </UBadge>
          </template>

          <template #actions-data="{ row }: any">
            <div class="flex items-center gap-2">
              <UButton
                icon="i-heroicons-pencil"
                size="xs"
                color="neutral"
                variant="ghost"
                @click="openUserModal(row)"
              />
              <UButton
                icon="i-heroicons-trash"
                size="xs"
                color="error"
                variant="ghost"
                :loading="isLoading"
                @click="deleteUser(row.id)"
              />
            </div>
          </template>
        </UTable>
      </UCard>
    </div>

    <!-- User Modal -->
    <UModal v-model:open="isModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                {{ selectedUser ? 'Edit User' : 'Add User' }}
              </h3>
              <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeModal" />
            </div>
          </template>

          <form @submit.prevent="saveUser" class="space-y-4">
            <UFormField label="Username" name="username" required>
              <UInput v-model="formData.username" placeholder="jdoe" size="lg" class="w-full" :disabled="!!selectedUser" />
            </UFormField>
            
            <UFormField label="Full Name" name="name" required>
              <UInput v-model="formData.name" placeholder="John Doe" size="lg" class="w-full" />
            </UFormField>
            
            <UFormField label="Email" name="email" required>
              <UInput v-model="formData.email" type="email" placeholder="john@example.com" size="lg" class="w-full" />
            </UFormField>
            
            <UFormField label="Role" name="role" required>
              <USelect 
                v-model="formData.role" 
                size="lg"
                class="w-full"
                :options="[
                  { label: 'Super Admin', value: 'SUPERADMIN' }, 
                  { label: 'Admin', value: 'ADMIN' }, 
                  { label: 'User', value: 'USER' }
                ]"
              />
            </UFormField>
            
            <UFormField v-if="!selectedUser" label="Password" name="password" required>
              <UInput v-model="formData.password" type="password" placeholder="••••••••" size="lg" class="w-full" />
            </UFormField>
          </form>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton color="neutral" variant="ghost" @click="closeModal">
                Cancel
              </UButton>
              <UButton type="submit" :loading="isSaving" @click="saveUser">
                Save User
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
