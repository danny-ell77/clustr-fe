<template>
    <div class="p-6 space-y-6">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <Button @click="router.back()" variant="ghost" size="sm">
                    ← Back
                </Button>
                <div>
                    <h1 class="text-2xl font-bold">Maintenance Log Details</h1>
                    <p class="text-muted-foreground">{{ logQuery.data.value?.maintenanceNumber }}</p>
                </div>
            </div>
            <div class="flex gap-2">
                <Button @click="editLog" variant="outline">
                    Edit
                </Button>
                <Button @click="deleteLog" variant="destructive">
                    Delete
                </Button>
            </div>
        </div>

        <div v-if="logQuery.isLoading.value" class="bg-white border rounded-lg p-8 text-center">
            <p class="text-muted-foreground">Loading log details...</p>
        </div>

        <div v-else-if="logQuery.isError.value" class="bg-white border rounded-lg p-8 text-center">
            <p class="text-red-600">Error loading log details</p>
            <Button @click="logQuery.refetch()" variant="outline" class="mt-4">
                Retry
            </Button>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 space-y-6">
                <div class="bg-white border rounded-lg p-6">
                    <h2 class="text-lg font-semibold mb-4">Basic Information</h2>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-sm text-muted-foreground">Title</label>
                            <p class="font-medium">{{ logQuery.data.value?.title }}</p>
                        </div>
                        <div>
                            <label class="text-sm text-muted-foreground">Maintenance Number</label>
                            <p class="font-medium">{{ logQuery.data.value?.maintenanceNumber }}</p>
                        </div>
                        <div>
                            <label class="text-sm text-muted-foreground">Type</label>
                            <p class="font-medium">{{ logQuery.data.value?.maintenanceType }}</p>
                        </div>
                        <div>
                            <label class="text-sm text-muted-foreground">Property Type</label>
                            <p class="font-medium">{{ logQuery.data.value?.propertyType }}</p>
                        </div>
                        <div>
                            <label class="text-sm text-muted-foreground">Location</label>
                            <p class="font-medium">{{ logQuery.data.value?.propertyLocation }}</p>
                        </div>
                        <div>
                            <label class="text-sm text-muted-foreground">Priority</label>
                            <Badge :variant="getPriorityVariant(logQuery.data.value?.priority)">
                                {{ logQuery.data.value?.priority }}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div class="bg-white border rounded-lg p-6">
                    <h2 class="text-lg font-semibold mb-4">Description</h2>
                    <p class="text-foreground">{{ logQuery.data.value?.description }}</p>
                </div>

                <div class="bg-white border rounded-lg p-6">
                    <h2 class="text-lg font-semibold mb-4">Timeline</h2>
                    <div class="space-y-3">
                        <div v-if="logQuery.data.value?.scheduledDate">
                            <label class="text-sm text-muted-foreground">Scheduled Date</label>
                            <p class="font-medium">{{ formatDate(logQuery.data.value.scheduledDate) }}</p>
                        </div>
                        <div v-if="logQuery.data.value?.estimatedDuration">
                            <label class="text-sm text-muted-foreground">Estimated Duration</label>
                            <p class="font-medium">{{ logQuery.data.value.estimatedDuration }}</p>
                        </div>
                        <div v-if="logQuery.data.value?.actualDuration">
                            <label class="text-sm text-muted-foreground">Actual Duration</label>
                            <p class="font-medium">{{ logQuery.data.value.actualDuration }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="space-y-6">
                <div class="bg-white border rounded-lg p-6">
                    <h2 class="text-lg font-semibold mb-4">Status</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="text-sm text-muted-foreground">Current Status</label>
                            <div class="mt-2">
                                <Badge :variant="getStatusVariant(logQuery.data.value?.status)">
                                    {{ logQuery.data.value?.status }}
                                </Badge>
                            </div>
                        </div>
                        <div>
                            <label class="text-sm text-muted-foreground block mb-2">Update Status</label>
                            <Select :model-value="newStatus" @update:model-value="(val: any) => updateStatus(val)">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div class="bg-white border rounded-lg p-6">
                    <h2 class="text-lg font-semibold mb-4">Cost</h2>
                    <div v-if="logQuery.data.value?.cost">
                        <p class="text-2xl font-bold text-green-600">
                            {{ formatCurrency(logQuery.data.value.cost) }}
                        </p>
                    </div>
                    <p v-else class="text-muted-foreground">No cost recorded</p>
                </div>

                <div class="bg-white border rounded-lg p-6">
                    <h2 class="text-lg font-semibold mb-4">Metadata</h2>
                    <div class="space-y-2 text-sm">
                        <div>
                            <span class="text-muted-foreground">Created:</span>
                            <span class="ml-2">{{ formatDate(logQuery.data.value?.createdAt) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { maintenanceApi } from '~/services/api/maintenance.api'
import { queryKeys } from '~/constants/query-keys'

definePageMeta({
    title: 'Maintenance Log Details',
    description: 'View maintenance log details',
    requiresPermission: 'property.maintenance.view'
})

const route = useRoute()
const router = useRouter()
const queryClient = useQueryClient()

const logId = route.params.id as string
const newStatus = ref('')

const logQuery = useQuery({
    queryKey: queryKeys.maintenance.logs.detail(logId),
    queryFn: () => maintenanceApi.getLogById(logId)
})

const updateStatusMutation = useMutation({
    mutationFn: (status: string) => maintenanceApi.updateStatus(logId, status),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.maintenance.logs.detail(logId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.maintenance.logs.all() })
    }
})

const deleteMutation = useMutation({
    mutationFn: () => maintenanceApi.deleteLog(logId),
    onSuccess: () => {
        router.push('/property/maintenance/logs')
    }
})

const updateStatus = (status: string | null) => {
    if (status && status !== logQuery.data.value?.status) {
        updateStatusMutation.mutate(status)
    }
}

const editLog = () => {
    console.log('Edit log')
}

const deleteLog = () => {
    if (confirm('Are you sure you want to delete this maintenance log?')) {
        deleteMutation.mutate()
    }
}

const getPriorityVariant = (priority?: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
        LOW: 'secondary',
        MEDIUM: 'default',
        HIGH: 'outline',
        URGENT: 'destructive'
    }
    return variants[priority || ''] || 'default'
}

const getStatusVariant = (status?: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
        PENDING: 'secondary',
        IN_PROGRESS: 'default',
        COMPLETED: 'secondary',
        CANCELLED: 'destructive'
    }
    return variants[status || ''] || 'default'
}

const formatDate = (date?: string) => {
    return date ? new Date(date).toLocaleDateString() : 'N/A'
}

const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(numAmount)
}
</script>
