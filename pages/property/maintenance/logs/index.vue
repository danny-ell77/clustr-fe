<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl">Maintenance Logs</h1>
                <p class="text-muted-foreground">Track and manage all maintenance activities</p>
            </div>
            <Button @click="showCreateDialog = true">
                <Icon name="plus" class="w-4 h-4 mr-2" />
                Create Log
            </Button>
        </div>

        <StatPane v-if="!analyticsQuery.isLoading.value" :stats="maintenanceStats" />

        <UnifiedView page-key="maintenance-logs" :data="logs" :is-loading="logsQuery.isLoading.value"
            :available-views="['table']">
            <template #filters="{ filters, applyFilters }">
                <div class="space-y-3">
                    <div>
                        <Label>Status</Label>
                        <Select :model-value="filters.status || 'All'"
                            @update:model-value="(value) => applyFilters({ status: value === 'All' ? undefined : value })">
                            <SelectTrigger>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                <SelectItem value="ON_HOLD">On Hold</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Priority</Label>
                        <Select :model-value="filters.priority || 'All'"
                            @update:model-value="(value) => applyFilters({ priority: value === 'All' ? undefined : value })">
                            <SelectTrigger>
                                <SelectValue placeholder="All Priorities" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="LOW">Low</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="HIGH">High</SelectItem>
                                <SelectItem value="URGENT">Urgent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Type</Label>
                        <Select :model-value="filters.maintenanceType || 'All'"
                            @update:model-value="(value) => applyFilters({ maintenanceType: value === 'All' ? undefined : value })">
                            <SelectTrigger>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="PREVENTIVE">Preventive</SelectItem>
                                <SelectItem value="CORRECTIVE">Corrective</SelectItem>
                                <SelectItem value="EMERGENCY">Emergency</SelectItem>
                                <SelectItem value="ROUTINE">Routine</SelectItem>
                                <SelectItem value="INSPECTION">Inspection</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Search</Label>
                        <Input type="text" placeholder="Search logs..." :model-value="filters.search || ''"
                            @input="(e: Event) => applyFilters({ search: (e.target as HTMLInputElement).value })" />
                    </div>
                </div>
            </template>

            <template #modal-filters="{ filters, setFilter }">
                <div class="space-y-3">
                    <div>
                        <Label>Status</Label>
                        <Select :model-value="filters.status || 'All'"
                            @update:model-value="(value) => setFilter('status', value === 'All' ? undefined : value)">
                            <SelectTrigger>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                <SelectItem value="ON_HOLD">On Hold</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Priority</Label>
                        <Select :model-value="filters.priority || 'All'"
                            @update:model-value="(value) => setFilter('priority', value === 'All' ? undefined : value)">
                            <SelectTrigger>
                                <SelectValue placeholder="All Priorities" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="LOW">Low</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="HIGH">High</SelectItem>
                                <SelectItem value="URGENT">Urgent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Type</Label>
                        <Select :model-value="filters.maintenanceType || 'All'"
                            @update:model-value="(value) => setFilter('maintenanceType', value === 'All' ? undefined : value)">
                            <SelectTrigger>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="PREVENTIVE">Preventive</SelectItem>
                                <SelectItem value="CORRECTIVE">Corrective</SelectItem>
                                <SelectItem value="EMERGENCY">Emergency</SelectItem>
                                <SelectItem value="ROUTINE">Routine</SelectItem>
                                <SelectItem value="INSPECTION">Inspection</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Search</Label>
                        <Input type="text" placeholder="Search logs..." :model-value="filters.search || ''"
                            @input="(e: Event) => setFilter('search', (e.target as HTMLInputElement).value)" />
                    </div>
                </div>
            </template>

            <template #table="{ data, isLoading }">
                <Card>
                    <CardContent class="p-0">
                        <div v-if="isLoading" class="p-6">
                            <Skeleton class="h-64 w-full" />
                        </div>

                        <div v-else-if="data.length === 0" class="text-center py-12">
                            <EmptyState title="No maintenance logs found"
                                description="Create your first log to get started" action-label="Create Log"
                                @action="showCreateDialog = true" />
                        </div>

                        <div v-else class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-muted/50 border-b">
                                    <tr>
                                        <th class="px-4 py-3 text-left text-sm font-medium">Log #</th>
                                        <th class="px-4 py-3 text-left text-sm font-medium">Title</th>
                                        <th class="px-4 py-3 text-left text-sm font-medium">Type</th>
                                        <th class="px-4 py-3 text-left text-sm font-medium">Property</th>
                                        <th class="px-4 py-3 text-left text-sm font-medium">Priority</th>
                                        <th class="px-4 py-3 text-left text-sm font-medium">Status</th>
                                        <th class="px-4 py-3 text-left text-sm font-medium">Assigned To</th>
                                        <th class="px-4 py-3 text-left text-sm font-medium">Date</th>
                                        <th class="px-4 py-3 text-left text-sm font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="log in data" :key="log.id"
                                        class="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                                        @click="viewLog(log)">
                                        <td class="px-4 py-3 text-sm">{{ log.maintenanceNumber }}</td>
                                        <td class="px-4 py-3 text-sm font-medium">{{ log.title }}</td>
                                        <td class="px-4 py-3 text-sm">
                                            <span class="text-xs px-2 py-1 rounded-full bg-primary/15 text-primary">
                                                {{ log.maintenanceTypeDisplay }}
                                            </span>
                                        </td>
                                        <td class="px-4 py-3 text-sm">{{ log.propertyLocation }}</td>
                                        <td class="px-4 py-3 text-sm">
                                            <PriorityBadge :priority="log.priority" />
                                        </td>
                                        <td class="px-4 py-3 text-sm">
                                            <StatusBadge :status="log.status" />
                                        </td>
                                        <td class="px-4 py-3 text-sm">{{ log.performedBy?.name || 'Unassigned' }}</td>
                                        <td class="px-4 py-3 text-sm">{{ formatDate(log.createdAt) }}</td>
                                        <td class="px-4 py-3 text-sm">
                                            <div class="flex gap-2" @click.stop>
                                                <Button variant="ghost" size="sm" @click="openAssignDialog(log)">
                                                    Assign
                                                </Button>
                                                <Button variant="ghost" size="sm" @click="openEditDialog(log)">
                                                    Edit
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </template>
        </UnifiedView>

        <MaintenanceFormDialog v-model:open="showCreateDialog" @success="onLogCreated" />
        <MaintenanceFormDialog v-if="selectedLog" v-model:open="showEditDialog" :log="selectedLog"
            @success="onLogUpdated" />
        <MaintenanceAssignDialog v-if="selectedLog" v-model:open="showAssignDialog" :log="selectedLog"
            @success="onLogAssigned" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import Icon from '~/components/Icon.vue'
import StatPane from '~/components/common/StatPane.vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import PriorityBadge from '~/components/common/PriorityBadge.vue'
import EmptyState from '~/components/common/EmptyState.vue'
import UnifiedView from '~/components/common/UnifiedView.vue'
import MaintenanceFormDialog from '~/components/property/maintenance/MaintenanceFormDialog.vue'
import MaintenanceAssignDialog from '~/components/property/maintenance/MaintenanceAssignDialog.vue'
import { useMaintenance } from '~/composables/property/useMaintenance'
import { useSavedViews } from '~/composables/useSavedViews'
import type { MaintenanceLog } from '~/types/maintenance'

definePageMeta({
    title: 'Maintenance Logs'
})

const { useMaintenanceLogs, useMaintenanceAnalytics } = useMaintenance()
const { filters } = useSavedViews('maintenance-logs')

const logsQuery = useMaintenanceLogs(filters)
const analyticsQuery = useMaintenanceAnalytics()

const maintenanceStats = computed(() => [
    { title: 'Total Logs', value: analytics.value?.totalLogs, color: '#0ea5e9' },
    { title: 'In Progress', value: analytics.value?.inProgressLogs, color: '#eab308' },
    { title: 'Completed', value: analytics.value?.completedLogs, color: '#10b981' },
    { title: 'Overdue', value: analytics.value?.overdueCount, color: '#ef4444' }
])

const logs = computed(() => logsQuery.data.value?.results || [])
const analytics = computed(() => analyticsQuery.data.value)

const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showAssignDialog = ref(false)
const selectedLog = ref<MaintenanceLog | null>(null)

watch(filters, () => {
    logsQuery.refetch()
}, { deep: true })

const viewLog = (log: MaintenanceLog) => {
    navigateTo(`/property/maintenance/logs/${log.id}`)
}

const openEditDialog = (log: MaintenanceLog) => {
    selectedLog.value = log
    showEditDialog.value = true
}

const openAssignDialog = (log: MaintenanceLog) => {
    selectedLog.value = log
    showAssignDialog.value = true
}

const onLogCreated = () => {
    showCreateDialog.value = false
    logsQuery.refetch()
}

const onLogUpdated = () => {
    showEditDialog.value = false
    selectedLog.value = null
    logsQuery.refetch()
}

const onLogAssigned = () => {
    showAssignDialog.value = false
    selectedLog.value = null
    logsQuery.refetch()
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}
</script>
