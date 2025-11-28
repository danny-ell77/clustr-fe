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

        <Card>
            <CardHeader>
                <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <Label>Status</Label>
                        <Select @update:model-value="(value) => setFilter('status', value as string)">
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
                        <Select @update:model-value="(value) => setFilter('priority', value as string)">
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
                        <Select @update:model-value="(value) => setFilter('maintenanceType', value as string)">
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
                        <Input type="text" placeholder="Search logs..."
                            @input="(e: Event) => setSearch((e.target as HTMLInputElement).value)" />
                    </div>
                </div>

                <div class="flex items-center justify-between mt-4">
                    <div class="text-sm text-muted-foreground">
                        Showing {{ logs.length }} of {{ logsQuery.data.value?.count || 0 }} logs
                    </div>
                    <Button variant="outline" @click="clearFilters">Clear Filters</Button>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardContent class="p-0">
                <div v-if="isLoading" class="p-6">
                    <Skeleton class="h-64 w-full" />
                </div>

                <div v-else-if="logs.length === 0" class="text-center py-12">
                    <EmptyState title="No maintenance logs found" description="Create your first log to get started"
                        action-label="Create Log" @action="showCreateDialog = true" />
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
                            <tr v-for="log in logs" :key="log.id"
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

        <MaintenanceFormDialog v-model:open="showCreateDialog" @success="onLogCreated" />

        <MaintenanceFormDialog v-if="selectedLog" v-model:open="showEditDialog" :log="selectedLog"
            @success="onLogUpdated" />

        <MaintenanceAssignDialog v-if="selectedLog" v-model:open="showAssignDialog" :log="selectedLog"
            @success="onLogAssigned" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
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
import MaintenanceFormDialog from '~/components/property/maintenance/MaintenanceFormDialog.vue'
import MaintenanceAssignDialog from '~/components/property/maintenance/MaintenanceAssignDialog.vue'
import { useMaintenance } from '~/composables/property/useMaintenance'
import type { MaintenanceLog } from '~/types/maintenance'
import type { MaintenanceLogFilters } from '~/services/api/maintenance.api'

definePageMeta({
    title: 'Maintenance Logs'
})

const { useMaintenanceLogs, useMaintenanceAnalytics } = useMaintenance()

const filters = ref<MaintenanceLogFilters>({})

const setFilter = (field: string, value: string) => {
    if (value === '') {
        delete filters.value[field as keyof MaintenanceLogFilters]
    } else {
        (filters.value as any)[field] = value
    }
}

const setSearch = (value: string) => {
    if (value === '') {
        delete filters.value.search
    } else {
        filters.value.search = value
    }
}

const clearFilters = () => {
    filters.value = {}
}

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
const isLoading = computed(() => logsQuery.isLoading.value)

const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showAssignDialog = ref(false)
const selectedLog = ref<MaintenanceLog | null>(null)

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
}

const onLogUpdated = () => {
    showEditDialog.value = false
    selectedLog.value = null
}

const onLogAssigned = () => {
    showAssignDialog.value = false
    selectedLog.value = null
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}
</script>
