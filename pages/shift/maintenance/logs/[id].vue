<template>
    <div class="p-6 space-y-6">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <Button @click="router.back()" variant="ghost" size="sm">
                    ← Back
                </Button>
                <div>
                    <h1 class="text-2xl">Maintenance Log Details</h1>
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

        <MaintenanceLogDetailContent v-else-if="logQuery.data.value" :log="logQuery.data.value">
            <template #status-section>
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
                            <MaintenanceLogStatusUpdateSelect :model-value="newStatus"
                                @update:model-value="updateStatus" />
                        </div>
                    </div>
                </div>
            </template>
        </MaintenanceLogDetailContent>
    </div>
</template>

<script setup lang="ts">
import MaintenanceLogDetailContent from '~/components/shift/maintenance/MaintenanceLogDetailContent.vue'
import MaintenanceLogStatusUpdateSelect from '~/components/shift/maintenance/MaintenanceLogStatusUpdateSelect.vue'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { maintenanceApi } from '~/services/api/maintenance.api'
import { queryKeys } from '~/constants/query-keys'

/**
 * Maintenance Log Detail page.
 * Displays maintenance log information using extracted components.
 */

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
    queryFn: () => maintenanceApi.logs.getById(logId)
})

const updateStatusMutation = useMutation({
    mutationFn: (status: string) => maintenanceApi.logs.update(logId, { status }),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.maintenance.logs.detail(logId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.maintenance.logs.all() })
    }
})

const deleteMutation = useMutation({
    mutationFn: () => maintenanceApi.logs.delete(logId),
    onSuccess: () => {
        router.push('/shift/maintenance/logs')
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

const getStatusVariant = (status?: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
        PENDING: 'secondary',
        IN_PROGRESS: 'default',
        COMPLETED: 'secondary',
        CANCELLED: 'destructive'
    }
    return variants[status || ''] || 'default'
}
</script>

