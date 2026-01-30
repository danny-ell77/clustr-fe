<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl text-foreground">Emergency Alerts</h1>
                <p class="text-muted-foreground">Manage and respond to emergency alerts</p>
            </div>

            <Button @click="showCreateDialog = true" class="bg-red-600 hover:bg-red-700">
                <Icon name="alert-triangle" class="w-4 h-4 mr-2" />
                Create Alert
            </Button>
        </div>

        <EmergencyActiveAlertCard v-if="activeAlerts?.length" :alerts="activeAlerts" @view="viewAlert" />

        <EmergencyAlertsTable :alerts="alerts" :is-loading="isLoading" :filters="filters.currentQuery.value"
            @search="setSearch" @view="viewAlert" @acknowledge="handleAcknowledge" @resolve="openResolveDialog"
            @clear-filters="filters.clearFilters">
            <template #filters>
                <EmergencyFilterForm v-model="filtersModel" :result-count="alerts.length" />
            </template>
        </EmergencyAlertsTable>

        <EmergencyCreateDialog v-model:open="showCreateDialog" @success="onAlertCreated" />

        <EmergencyResolveDialog v-model:open="showResolveDialog" :alert-id="selectedAlertId"
            @success="onAlertResolved" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { Button } from '~/components/ui/button'
import Icon from '~/components/Icon.vue'
import EmergencyActiveAlertCard from '~/components/portal/emergency/EmergencyActiveAlertCard.vue'
import EmergencyAlertsTable from '~/components/portal/emergency/EmergencyAlertsTable.vue'
import EmergencyFilterForm from '~/components/portal/emergency/EmergencyFilterForm.vue'
import EmergencyCreateDialog from '~/components/portal/emergency/EmergencyCreateDialog.vue'
import EmergencyResolveDialog from '~/components/portal/emergency/EmergencyResolveDialog.vue'
import { emergencyApi, type EmergencyAlert } from '~/services/api/emergency.api'
import { queryKeys } from '~/constants/query-keys'

definePageMeta({
    title: 'Emergency Alerts',
    layout: 'default'
})

const queryClient = useQueryClient()
const toast = useToast()

const filterDefinitions = [
    {
        field: 'status',
        type: 'select' as const,
        label: 'Status',
        options: [
            { value: 'active', label: 'Active' },
            { value: 'acknowledged', label: 'Acknowledged' },
            { value: 'responding', label: 'Responding' },
            { value: 'resolved', label: 'Resolved' },
            { value: 'cancelled', label: 'Cancelled' }
        ]
    },
    {
        field: 'emergencyType',
        type: 'select' as const,
        label: 'Emergency Type',
        options: [
            { value: 'health', label: 'Health Emergency' },
            { value: 'theft', label: 'Theft/Robbery' },
            { value: 'domestic_violence', label: 'Domestic Violence' },
            { value: 'fire', label: 'Fire Emergency' },
            { value: 'security', label: 'Security Issue' },
            { value: 'accident', label: 'Accident' },
            { value: 'other', label: 'Other' }
        ]
    },
    {
        field: 'priority',
        type: 'select' as const,
        label: 'Priority',
        options: [
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'critical', label: 'Critical' }
        ]
    }
]

const filters = useDataFilters(filterDefinitions, {
    persistKey: 'emergency-filters'
})

const filtersModel = computed({
    get: () => filters.currentQuery.value,
    set: (newFilters: any) => {
        Object.entries(newFilters).forEach(([key, value]) => {
            filters.setFilter(key, value as string)
        })
    }
})

const setSearch = (value: string) => {
    filters.setFilter('search', value)
}

const alertsQuery = useQuery({
    queryKey: computed(() => queryKeys.emergency.alerts.list(filters.currentQuery.value)),
    queryFn: () => emergencyApi.getAlerts(filters.currentQuery.value)
})

const activeAlertsQuery = useQuery({
    queryKey: queryKeys.emergency.alerts.active(),
    queryFn: () => emergencyApi.getActiveAlerts(),
    refetchInterval: 30000
})

const acknowledgeMutation = useMutation({
    mutationFn: emergencyApi.acknowledgeAlert,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.emergency.alerts.all() })
        toast.success('Alert acknowledged successfully')
    },
    onError: (error: any) => {
        toast.error(error.message || 'Failed to acknowledge alert')
    }
})

const alerts = computed(() => alertsQuery.data.value?.results || [])
const activeAlerts = computed(() => activeAlertsQuery.data.value)
const isLoading = computed(() => alertsQuery.isLoading.value)

const showCreateDialog = ref(false)
const showResolveDialog = ref(false)
const selectedAlertId = ref<string | null>(null)

const viewAlert = (alert: EmergencyAlert) => {
    navigateTo(`/portal/emergency/${alert.id}`)
}

const handleAcknowledge = (alert: EmergencyAlert) => {
    acknowledgeMutation.mutate(alert.id)
}

const openResolveDialog = (alert: EmergencyAlert) => {
    selectedAlertId.value = alert.id
    showResolveDialog.value = true
}

const onAlertCreated = () => {
    showCreateDialog.value = false
}

const onAlertResolved = () => {
    showResolveDialog.value = false
    selectedAlertId.value = null
}
</script>
