<template>
    <div>
        <div v-if="userQuery.isLoading.value" class="text-center py-8">
            <p class="text-muted-foreground">Loading user details...</p>
        </div>

        <div v-else-if="userQuery.isError.value" class="text-center py-8">
            <p class="text-red-600">Error loading user: {{ userQuery.error.value?.message }}</p>
            <button @click="userQuery.refetch()"
                class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Retry
            </button>
        </div>

        <div v-else-if="userQuery.data.value">
            <div class="mb-6">
                <button @click="$router.back()" class="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                    <Icon name="arrow-left" class="w-4 h-4" />
                    Back to Users
                </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-1">
                    <div class="card">
                        <div class="flex flex-col items-center">
                            <div class="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                                <span class="text-3xl font-medium text-white">
                                    {{ userQuery.data.value.name.charAt(0) }}
                                </span>
                            </div>
                            <h2 class="text-xl font-bold text-foreground">{{ userQuery.data.value.name }}</h2>
                            <p class="text-muted-foreground">{{ userQuery.data.value.emailAddress }}</p>
                            <p class="text-muted-foreground">{{ userQuery.data.value.phoneNumber }}</p>

                            <div class="mt-4">
                                <span class="px-3 py-1 text-sm rounded-full"
                                    :class="userQuery.data.value.isVerified ? 'badge-success' : 'badge-warning'">
                                    {{ userQuery.data.value.isVerified ? 'Verified' : 'Pending Verification' }}
                                </span>
                            </div>

                            <div class="mt-6 w-full space-y-2">
                                <button @click="showEditDialog = true"
                                    class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Edit Profile
                                </button>
                                <button @click="handleDelete" :disabled="deleteMutation.isPending.value"
                                    class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                                    {{ deleteMutation.isPending.value ? 'Deleting...' : 'Delete User' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-2 space-y-6">
                    <div class="card">
                        <h3 class="text-lg font-semibold mb-4">Roles</h3>
                        <div class="flex flex-wrap gap-2">
                            <span v-for="role in userQuery.data.value.roles" :key="role"
                                class="badge-info px-3 py-1 text-sm rounded-full">
                                {{ role }}
                            </span>
                            <span v-if="!userQuery.data.value.roles.length" class="text-muted-foreground">
                                No roles assigned
                            </span>
                        </div>
                    </div>

                    <div class="card">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold">Permissions</h3>
                            <button @click="permissionsQuery.refetch()"
                                class="text-blue-600 hover:text-blue-800 text-sm">
                                Refresh
                            </button>
                        </div>

                        <div v-if="permissionsQuery.isLoading.value" class="text-muted-foreground">
                            Loading permissions...
                        </div>

                        <div v-else-if="permissionsQuery.isError.value" class="text-red-600">
                            Error loading permissions
                        </div>

                        <div v-else class="space-y-2">
                            <div v-for="permission in userQuery.data.value.permissions" :key="permission"
                                class="flex items-center gap-2 text-sm">
                                <Icon name="check" class="w-4 h-4 text-green-600" />
                                <span>{{ permission }}</span>
                            </div>
                            <span v-if="!userQuery.data.value.permissions.length" class="text-muted-foreground">
                                No permissions assigned
                            </span>
                        </div>
                    </div>

                    <div class="card">
                        <h3 class="text-lg font-semibold mb-4">Recent Activity</h3>
                        <p class="text-muted-foreground">Activity tracking coming soon...</p>
                    </div>
                </div>
            </div>

            <div v-if="showEditDialog"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white p-6 rounded-lg max-w-md w-full">
                    <h2 class="text-xl font-bold mb-4">Edit User</h2>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Name</label>
                            <input v-model="editForm.name" type="text" class="w-full px-3 py-2 border rounded-lg" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-1">Email</label>
                            <input v-model="editForm.emailAddress" type="email"
                                class="w-full px-3 py-2 border rounded-lg" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-1">Phone</label>
                            <input v-model="editForm.phoneNumber" type="tel"
                                class="w-full px-3 py-2 border rounded-lg" />
                        </div>
                    </div>

                    <div class="mt-6 flex gap-2">
                        <button @click="handleUpdate" :disabled="updateMutation.isPending.value"
                            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                            {{ updateMutation.isPending.value ? 'Saving...' : 'Save Changes' }}
                        </button>
                        <button @click="showEditDialog = false"
                            class="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { useRoute, useRouter } from 'vue-router'
import { queryKeys } from '~/constants/query-keys'
import { usersApi } from '~/services/api'

definePageMeta({
    title: 'User Details',
    description: 'View and manage user details',
    requiresPermission: 'security.users.view'
})

const route = useRoute()
const router = useRouter()
const queryClient = useQueryClient()
const showEditDialog = ref(false)

const userId = computed(() => route.params.id as string)

const userQuery = useQuery({
    queryKey: computed(() => queryKeys.users.detail(userId.value)),
    queryFn: () => usersApi.getById(userId.value),
    staleTime: 1000 * 60 * 5,
})

const permissionsQuery = useQuery({
    queryKey: computed(() => queryKeys.users.permissions(userId.value)),
    queryFn: () => usersApi.getPermissions(userId.value),
    staleTime: 1000 * 60 * 30,
})

const editForm = reactive({
    name: '',
    emailAddress: '',
    phoneNumber: '',
})

watch(() => userQuery.data.value, (user) => {
    if (user) {
        editForm.name = user.name
        editForm.emailAddress = user.emailAddress
        editForm.phoneNumber = user.phoneNumber
    }
}, { immediate: true })

const updateMutation = useMutation({
    mutationFn: (data: Partial<typeof editForm>) =>
        usersApi.update(userId.value, data),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId.value) })
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
        showEditDialog.value = false
        useToast().success('User updated successfully')
    },
    onError: (error: any) => {
        useToast().error(error.message || 'Failed to update user')
    }
})

const deleteMutation = useMutation({
    mutationFn: () => usersApi.delete(userId.value),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
        useToast().success('User deleted successfully')
        router.push('/security/users')
    },
    onError: (error: any) => {
        useToast().error(error.message || 'Failed to delete user')
    }
})

const handleUpdate = () => {
    updateMutation.mutate(editForm)
}

const handleDelete = () => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        deleteMutation.mutate()
    }
}
</script>
