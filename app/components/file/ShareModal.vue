<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  fileId?: string
  fileName?: string
  folderId?: string
  folderName?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const isLoading = ref(false)
const shares = ref<any[]>([])
const publicLink = ref('')
const toast = useToast()

const shareForm = reactive({
  email: '',
  permission: 'VIEW',
})

const permissions = [
  { label: 'Can view', value: 'VIEW' },
  { label: 'Can download', value: 'DOWNLOAD' },
  { label: 'Can edit', value: 'EDIT' },
]

async function loadShares() {
  if (!props.fileId && !props.folderId) return
  
  try {
    isLoading.value = true
    // TODO: Implement load shares API
    shares.value = []
  } catch (error) {
    console.error('Failed to load shares:', error)
  } finally {
    isLoading.value = false
  }
}

async function handleShare() {
  if (!shareForm.email) return

  try {
    isLoading.value = true
    // TODO: Implement share API
    toast.add({
      title: 'Success',
      description: `Shared with ${shareForm.email}`,
      color: 'success',
    })
    shareForm.email = ''
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to share',
      color: 'error',
    })
  } finally {
    isLoading.value = false
  }
}

async function createPublicLink() {
  try {
    isLoading.value = true
    // TODO: Implement create public link API
    publicLink.value = 'https://fileman.internal/share/abc-123'
  } catch (error) {
    console.error('Failed to create public link:', error)
  } finally {
    isLoading.value = false
  }
}

function copyLink() {
  navigator.clipboard.writeText(publicLink.value)
  toast.add({
    title: 'Copied',
    description: 'Link copied to clipboard',
    color: 'success',
  })
}

watch(() => props.modelValue, (val) => {
  if (val) {
    loadShares()
  } else {
    shareForm.email = ''
    publicLink.value = ''
  }
})
</script>

<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-gray-900 dark:text-white">
            Share "{{ fileName || folderName }}"
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark"
            size="sm"
            @click="isOpen = false"
          />
        </div>
      </template>

      <div class="space-y-6">
        <!-- Share with People -->
        <div class="space-y-4">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white">Share with people</h4>
          <form @submit.prevent="handleShare" class="flex gap-2">
            <UInput
              v-model="shareForm.email"
              type="email"
              placeholder="Enter email address"
              icon="i-heroicons-user-plus"
              class="flex-1"
            />
            <USelect
              v-model="shareForm.permission"
              :options="permissions"
              option-attribute="label"
              value-attribute="value"
            />
            <UButton
              type="submit"
              color="primary"
              :loading="isLoading"
              :disabled="!shareForm.email"
            >
              Share
            </UButton>
          </form>

          <!-- Shared Users List -->
          <div v-if="shares.length > 0" class="space-y-2">
            <div
              v-for="share in shares"
              :key="share.id"
              class="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
            >
              <div class="flex items-center gap-2">
                <UAvatar
                  :alt="share.user.name"
                  size="xs"
                />
                <div class="text-sm">
                  <p class="font-medium text-gray-900 dark:text-white">{{ share.user.name }}</p>
                  <p class="text-xs text-gray-500">{{ share.user.email }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">
                  {{ share.permission }}
                </span>
                <UButton
                  color="red"
                  variant="ghost"
                  icon="i-heroicons-trash"
                  size="xs"
                />
              </div>
            </div>
          </div>
        </div>

        <UDivider />

        <!-- Public Link -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">Public access</h4>
            <UButton
              v-if="!publicLink"
              variant="soft"
              size="xs"
              @click="createPublicLink"
            >
              Create link
            </UButton>
          </div>

          <div v-if="publicLink" class="flex gap-2">
            <UInput
              :model-value="publicLink"
              readonly
              icon="i-heroicons-link"
              class="flex-1"
            />
            <UButton
              color="gray"
              variant="solid"
              icon="i-heroicons-clipboard"
              @click="copyLink"
            >
              Copy
            </UButton>
          </div>
        </div>
      </div>
    </UCard>
  </UModal>
</template>
