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
            <template #filters="{ filters: viewFilters, applyFilters }">
                <MaintenanceLogsFilterForm :model-value="viewFilters" @update:model-value="applyFilters" />
            </template>

            <template #modal-filters="{ filters: modalFilters, setFilter }">
                <MaintenanceLogsFilterForm :model-value="modalFilters" @update:model-value="(filters) => {
                    Object.entries(filters).forEach(([key, value]) => setFilter(key, value as string))
                }" />
            </template>

            <template #table="{ data, isLoading }">
                <MaintenanceLogsTableContent :data="data" :is-loading="isLoading" @add="showCreateDialog = true"
                    @view="viewLog" @edit="openEditDialog" @assign="openAssignDialog" />
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
import Icon from '~/components/Icon.vue'
import StatPane from '~/components/common/StatPane.vue'
import UnifiedView from '~/components/common/UnifiedView.vue'
import MaintenanceLogsFilterForm from '~/components/shift/maintenance/MaintenanceLogsFilterForm.vue'
import MaintenanceLogsTableContent from '~/components/shift/maintenance/MaintenanceLogsTableContent.vue'
import MaintenanceFormDialog from '~/components/shift/maintenance/MaintenanceFormDialog.vue'
import MaintenanceAssignDialog from '~/components/shift/maintenance/MaintenanceAssignDialog.vue'
import { Button } from '~/components/ui/button'
import { useMaintenance } from '~/composables/property/useMaintenance'
import { useSavedViews } from '~/composables/useSavedViews'
import type { MaintenanceLog } from '~/types/maintenance'

/**
 * Maintenance Logs page.
 * Uses UnifiedView to display maintenance logs in a table view.
 */

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
    navigateTo(`/shift/maintenance/logs/${log.id}`)
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
</script>

