<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { getPaginationRowModel } from '@tanstack/vue-table'
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  middleware: ['admin']
})

const authStore = useAuthStore()
const toast = useToast()
const isLoading = ref(true)
const table = useTemplateRef('table')

// Resolve components for use in cell render functions
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

// Users data
const usersData = ref({
  users: [],
  total: 0,
  ssoUsers: 0,
  admins: 0,
  regularUsers: 0
})

const users = computed(() => {
  const result = usersData.value?.users || []
  return [...result]
})

// Table state
const globalFilter = ref('')
const sorting = ref([])
const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})

// Fetch users from API
async function fetchUsers() {
  try {
    isLoading.value = true
    const response: any = await $fetch('/api/users', {
      credentials: 'include'
    })
    
    usersData.value.users = response.users || []
    usersData.value.total = response.total || 0
    usersData.value.ssoUsers = response.ssoUsers || 0
    usersData.value.admins = response.admins || 0
    usersData.value.regularUsers = response.regularUsers || 0
  } catch (error: any) {
    console.error('Failed to fetch users:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to load users',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

// Load users on mount
onMounted(() => {
  fetchUsers()
})

const refresh = fetchUsers

// Role badge color helper
const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'SUPERADMIN': return 'error'
    case 'ADMIN': return 'warning'
    default: return 'neutral'
  }
}

// Define columns with sorting capability
type User = {
  id: string
  username: string
  email: string
  name: string
  role: string
  ssoProvider: string | null
  createdAt: string
}

const columns: TableColumn<User>[] = [
  {
    accessorKey: 'username',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Username',
        icon: isSorted 
          ? isSorted === 'asc' 
            ? 'i-lucide-arrow-up-narrow-wide' 
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    }
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Email',
        icon: isSorted 
          ? isSorted === 'asc' 
            ? 'i-lucide-arrow-up-narrow-wide' 
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    }
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Name',
        icon: isSorted 
          ? isSorted === 'asc' 
            ? 'i-lucide-arrow-up-narrow-wide' 
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    }
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as string
      const color = getRoleBadgeColor(role)
      return h(UBadge, { 
        class: 'capitalize', 
        variant: 'subtle', 
        color 
      }, () => role)
    }
  },
  {
    accessorKey: 'ssoProvider',
    header: 'SSO',
    cell: ({ row }) => {
      const sso = row.getValue('ssoProvider') as string | null
      if (sso) {
        return h(UBadge, { 
          variant: 'subtle', 
          color: 'success' 
        }, () => sso)
      }
      return h('span', { class: 'text-gray-400' }, '-')
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original
      const items = [
        [{
          label: 'Edit',
          icon: 'i-heroicons-pencil',
          onClick: () => openUserModal(user)
        }],
        [{
          label: 'Reset Password',
          icon: 'i-heroicons-key',
          onClick: () => openResetPasswordModal(user)
        }],
        [{
          label: 'Delete',
          icon: 'i-heroicons-trash',
          color: 'error' as const,
          onClick: () => openDeleteModal(user)
        }]
      ]
      
      return h(UDropdownMenu, {
        items,
        class: 'inline-flex'
      }, {
        default: () => h(UButton, {
          icon: 'i-heroicons-ellipsis-vertical',
          color: 'neutral',
          variant: 'ghost',
          size: 'sm'
        })
      })
    }
  }
]

// User Form Modal State
const selectedUser = ref<User | null>(null)
const isModalOpen = ref(false)
const isSaving = ref(false)

const formData = ref({
  username: '',
  name: '',
  email: '',
  role: 'USER',
  password: ''
})

// Modal title computed
const modalTitle = computed(() => selectedUser.value ? 'Edit User' : 'Add User')
const modalDescription = computed(() => selectedUser.value ? 'Update user information' : 'Create a new user account')

function openUserModal(user?: User) {
  selectedUser.value = user || null
  if (user) {
    formData.value = {
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      password: ''
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
  
  try {
    const currentUser = selectedUser.value
    
    if (currentUser) {
      await $fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        body: {
          name: formData.value.name,
          email: formData.value.email,
          role: formData.value.role,
        }
      })
      toast.add({ title: 'Success', description: 'User updated successfully', color: 'success' })
    } else {
      await $fetch('/api/users', {
        method: 'POST',
        body: formData.value
      })
      toast.add({ title: 'Success', description: 'User created successfully', color: 'success' })
    }
    
    await refresh()
    closeModal()
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to save user',
      color: 'error'
    })
  } finally {
    isSaving.value = false
  }
}

function closeModal() {
  isModalOpen.value = false
  selectedUser.value = null
}

// Delete Modal State
const isDeleteModalOpen = ref(false)
const userToDelete = ref<User | null>(null)
const isDeleting = ref(false)

function openDeleteModal(user: User) {
  userToDelete.value = user
  isDeleteModalOpen.value = true
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false
  userToDelete.value = null
}

async function confirmDeleteUser() {
  if (!userToDelete.value) return
  
  try {
    isDeleting.value = true
    await $fetch(`/api/users/${userToDelete.value.id}`, { method: 'DELETE' })
    toast.add({
      title: 'Success',
      description: 'User deleted successfully',
      color: 'success',
    })
    await refresh()
    closeDeleteModal()
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || error.message || 'Failed to delete user',
      color: 'error',
    })
  } finally {
    isDeleting.value = false
  }
}

// Reset Password Modal State
const isResetPasswordModalOpen = ref(false)
const userToResetPassword = ref<User | null>(null)
const isResettingPassword = ref(false)
const newPassword = ref('')

function openResetPasswordModal(user: User) {
  userToResetPassword.value = user
  newPassword.value = ''
  isResetPasswordModalOpen.value = true
}

function closeResetPasswordModal() {
  isResetPasswordModalOpen.value = false
  userToResetPassword.value = null
  newPassword.value = ''
}

async function confirmResetPassword() {
  if (!userToResetPassword.value || !newPassword.value) return
  
  try {
    isResettingPassword.value = true
    await $fetch(`/api/users/${userToResetPassword.value.id}/reset-password`, {
      method: 'POST',
      body: { password: newPassword.value }
    })
    toast.add({
      title: 'Success',
      description: 'Password reset successfully',
      color: 'success',
    })
    closeResetPasswordModal()
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || error.message || 'Failed to reset password',
      color: 'error',
    })
  } finally {
    isResettingPassword.value = false
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
              <p class="text-2xl font-bold">{{ usersData?.total || 0 }}</p>
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
              <p class="text-2xl font-bold">{{ usersData?.ssoUsers || 0 }}</p>
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
              <p class="text-2xl font-bold">{{ usersData?.admins || 0 }}</p>
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
              <p class="text-2xl font-bold">{{ usersData?.regularUsers || 0 }}</p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Users Table -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between gap-4">
            <h2 class="text-lg font-semibold">All Users</h2>
            <UInput
              v-model="globalFilter"
              icon="i-heroicons-magnifying-glass"
              placeholder="Search users..."
              class="w-64"
            />
          </div>
        </template>

        <UTable
          ref="table"
          v-model:sorting="sorting"
          v-model:global-filter="globalFilter"
          v-model:pagination="pagination"
          :columns="columns"
          :data="users"
          :loading="isLoading"
          :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
        >
          <template #loading-state>
            <div class="text-center py-6">
              <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin mx-auto mb-2" />
              <p class="text-gray-500">Loading users...</p>
            </div>
          </template>
          
          <template #empty-state>
            <div class="text-center py-6">
              <UIcon name="i-heroicons-users" class="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p class="text-gray-500">No users found</p>
            </div>
          </template>
        </UTable>

        <template #footer>
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500">
              Showing {{ (table?.tableApi?.getState().pagination.pageIndex || 0) * (table?.tableApi?.getState().pagination.pageSize || 10) + 1 }} 
              to {{ Math.min(((table?.tableApi?.getState().pagination.pageIndex || 0) + 1) * (table?.tableApi?.getState().pagination.pageSize || 10), table?.tableApi?.getFilteredRowModel().rows.length || 0) }} 
              of {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} users
            </p>
            <UPagination
              :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
              :items-per-page="table?.tableApi?.getState().pagination.pageSize"
              :total="table?.tableApi?.getFilteredRowModel().rows.length || 0"
              @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
            />
          </div>
        </template>
      </UCard>
    </div>

    <!-- User Form Modal -->
    <UModal 
      v-model:open="isModalOpen"
      :title="modalTitle"
      :description="modalDescription"
    >
      <template #body>
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
            <USelectMenu 
              v-model="formData.role" 
              value-key="id"
              size="lg"
              class="w-full"
              :items="[
                { label: 'Super Admin', id: 'SUPERADMIN' }, 
                { label: 'Admin', id: 'ADMIN' }, 
                { label: 'User', id: 'USER' }
              ]"
            />
          </UFormField>
          
          <UFormField v-if="!selectedUser" label="Password" name="password" required>
            <UInput v-model="formData.password" type="password" placeholder="••••••••" size="lg" class="w-full" />
          </UFormField>
        </form>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="neutral" variant="ghost" @click="closeModal">
            Cancel
          </UButton>
          <UButton :loading="isSaving" @click="saveUser">
            Save User
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal 
      v-model:open="isDeleteModalOpen"
      title="Delete User"
      description="This action cannot be undone"
    >
      <template #body>
        <div class="flex flex-col items-center text-center py-4">
          <div class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Delete {{ userToDelete?.name || userToDelete?.username }}?
          </h3>
          <p class="text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this user? This action cannot be undone and all associated data will be permanently removed.
          </p>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="neutral" variant="ghost" @click="closeDeleteModal">
            Cancel
          </UButton>
          <UButton color="error" :loading="isDeleting" @click="confirmDeleteUser">
            Delete User
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Reset Password Modal -->
    <UModal 
      v-model:open="isResetPasswordModalOpen"
      title="Reset Password"
      description="Set a new password for this user"
    >
      <template #body>
        <div class="space-y-4">
          <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <UIcon name="i-heroicons-user-circle" class="w-10 h-10 text-gray-400" />
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ userToResetPassword?.name }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ userToResetPassword?.email }}</p>
            </div>
          </div>
          
          <UFormField label="New Password" name="newPassword" required>
            <UInput 
              v-model="newPassword" 
              type="password" 
              placeholder="Enter new password" 
              size="lg" 
              class="w-full" 
            />
          </UFormField>
          
          <p class="text-sm text-gray-500 dark:text-gray-400">
            The user will need to use this new password to login.
          </p>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="neutral" variant="ghost" @click="closeResetPasswordModal">
            Cancel
          </UButton>
          <UButton 
            :loading="isResettingPassword" 
            :disabled="!newPassword"
            @click="confirmResetPassword"
          >
            Reset Password
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
