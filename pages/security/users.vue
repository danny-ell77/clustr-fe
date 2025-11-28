<template>
    <div>
        <div class="flex justify-between items-center mb-6">
            <div>
                <h1 class="text-2xl text-foreground">Users</h1>
                <p class="text-muted-foreground">Manage system users and their access</p>
            </div>
            <button @click="showAddUserDialog = true"
                class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                <Icon name="user-plus" class="w-4 h-4 mr-2 inline" />
                Add User
            </button>
        </div>

        <div class="mb-4 flex gap-4">
            <input v-model="filters.search" type="text" placeholder="Search users..."
                class="px-4 py-2 border rounded-lg" />
            <select v-model="filters.role" class="px-4 py-2 border rounded-lg">
                <option value="All">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Property Manager</option>
                <option value="accountant">Accountant</option>
            </select>
        </div>

        <div v-if="usersQuery.isLoading.value" class="text-center py-8">
            <p class="text-muted-foreground">Loading users...</p>
        </div>

        <div v-else-if="usersQuery.isError.value" class="text-center py-8">
            <p class="text-red-600">Error loading users: {{ usersQuery.error.value?.message }}</p>
            <button @click="usersQuery.refetch()"
                class="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                Retry
            </button>
        </div>

        <div v-else class="card overflow-hidden">
            <table class="table">
                <thead class="">
                    <tr>
                        <th
                            class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            User
                        </th>
                        <th
                            class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Role
                        </th>
                        <th
                            class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Status
                        </th>
                        <th
                            class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Contact
                        </th>
                        <th
                            class="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-border">
                    <tr v-for="user in usersQuery.data.value?.results" :key="user.id"
                        @mouseenter="prefetchUserDetails(user.id)">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                    <span class="text-sm font-medium text-white">{{ user.name.charAt(0) }}</span>
                                </div>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-foreground">{{ user.name }}</div>
                                    <div class="text-sm text-muted-foreground">{{ user.emailAddress }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex flex-wrap gap-1">
                                <span v-for="role in user.roles" :key="role"
                                    class="badge-info px-2 py-1 text-xs rounded-full">
                                    {{ role }}
                                </span>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 py-1 text-xs rounded-full"
                                :class="user.isVerified ? 'badge-success' : 'badge-warning'">
                                {{ user.isVerified ? 'Verified' : 'Pending' }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {{ user.phoneNumber }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <NuxtLink :to="`/security/users/${user.id}`" class="text-primary hover:text-primary mr-3">
                                View
                            </NuxtLink>
                            <button @click="handleEdit(user)" class="text-primary hover:text-primary mr-3">
                                Edit
                            </button>
                            <button @click="handleDelete(user.id)" :disabled="deleteMutation.isPending.value"
                                class="text-red-600 hover:text-red-900 disabled:opacity-50">
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-if="usersQuery.data.value" class="px-6 py-4 border-t flex justify-between items-center">
                <p class="text-sm text-muted-foreground">
                    Total: {{ usersQuery.data.value.count }} users
                </p>
                <div class="flex gap-2">
                    <button @click="goToPreviousPage" :disabled="!usersQuery.data.value.previous"
                        class="px-3 py-1 border rounded disabled:opacity-50">
                        Previous
                    </button>
                    <button @click="goToNextPage" :disabled="!usersQuery.data.value.next"
                        class="px-3 py-1 border rounded disabled:opacity-50">
                        Next
                    </button>
                </div>
            </div>
        </div>

        <div v-if="showAddUserDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded-lg max-w-md w-full">
                <h2 class="text-xl mb-4">Add User</h2>
                <p class="text-muted-foreground mb-4">User creation form would go here</p>
                <button @click="showAddUserDialog = false" class="px-4 py-2 bg-gray-200 rounded-lg">
                    Close
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { queryKeys } from '~/constants/query-keys'
import { usersApi } from '~/services/api'

definePageMeta({
    title: 'Users',
    description: 'Manage system users and their access',
    requiresPermission: 'security.users.view'
})

const queryClient = useQueryClient()
const showAddUserDialog = ref(false)
const currentPage = ref(1)

const filters = reactive({
    search: '',
    role: '',
})

const queryFilters = computed(() => ({
    page: currentPage.value,
    search: filters.search || undefined,
    role: filters.role || undefined,
}))

const usersQuery = useQuery({
    queryKey: computed(() => queryKeys.users.list(queryFilters.value)),
    queryFn: () => usersApi.getAll(queryFilters.value),
    staleTime: 1000 * 60 * 5,
})

const prefetchUserDetails = (userId: string) => {
    queryClient.prefetchQuery({
        queryKey: queryKeys.users.detail(userId),
        queryFn: () => usersApi.getById(userId),
        staleTime: 5000
    })
}

const deleteMutation = useMutation({
    mutationFn: (userId: string) => usersApi.delete(userId),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
        useToast().success('User deleted successfully')
    },
    onError: (error: any) => {
        useToast().error(error.message || 'Failed to delete user')
    }
})

const handleEdit = (user: any) => {
    console.log('Edit user:', user)
}

const handleDelete = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
        deleteMutation.mutate(userId)
    }
}

const goToNextPage = () => {
    if (usersQuery.data.value?.next) {
        currentPage.value++
    }
}

const goToPreviousPage = () => {
    if (usersQuery.data.value?.previous && currentPage.value > 1) {
        currentPage.value--
    }
}
</script>
