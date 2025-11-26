<template>
    <div class="emergency-management">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-2xl font-bold text-foreground">Emergency Alerts</h1>
                <p class="text-muted-foreground">Manage and respond to emergency alerts</p>
            </div>

            <div class="flex items-center space-x-3">
                <Button @click="showCreateModal = true" class="bg-red-600 hover:bg-red-700">
                    <Icon name="alert-triangle" class="w-4 h-4 mr-2" />
                    Create Alert
                </Button>
            </div>
        </div>

        <Card class="mb-6 border-red-200 bg-red-50" v-if="activeAlertsData && activeAlertsData.length > 0">
            <CardHeader>
                <CardTitle class="text-red-800">Active Alerts ({{ activeAlertsData.length }})</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="space-y-2">
                    <div v-for="alert in activeAlertsData" :key="alert.id"
                        class="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                        <div class="flex items-center space-x-3">
                            <Icon name="alert-circle" class="w-5 h-5 text-red-600" />
                            <div>
                                <div class="font-medium">{{ alert.emergencyTypeDisplay }}</div>
                                <div class="text-sm text-muted-foreground">{{ alert.userDetails?.name }} - {{
                                    alert.location }}</div>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span :class="getPriorityClass(alert.priority)"
                                class="px-2 py-1 rounded text-xs font-medium">
                                {{ alert.priorityDisplay }}
                            </span>
                            <Button size="sm" @click="viewAlert(alert)">View</Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card class="mb-6">
            <CardHeader>
                <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <Label>Status</Label>
                        <Select @update:model-value="(value) => filters.setFilter('status', value)">
                            <SelectTrigger>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Statuses</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                                <SelectItem value="responding">Responding</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Emergency Type</Label>
                        <Select @update:model-value="(value) => filters.setFilter('emergencyType', value)">
                            <SelectTrigger>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Types</SelectItem>
                                <SelectItem value="health">Health Emergency</SelectItem>
                                <SelectItem value="theft">Theft/Robbery</SelectItem>
                                <SelectItem value="domestic_violence">Domestic Violence</SelectItem>
                                <SelectItem value="fire">Fire Emergency</SelectItem>
                                <SelectItem value="security">Security Issue</SelectItem>
                                <SelectItem value="accident">Accident</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Priority</Label>
                        <Select @update:model-value="(value) => filters.setFilter('priority', value)">
                            <SelectTrigger>
                                <SelectValue placeholder="All Priorities" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Priorities</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Search</Label>
                        <Input type="text" placeholder="Search alerts..."
                            @input="(e: Event) => filters.setFilter('search', (e.target as HTMLInputElement).value)" />
                    </div>
                </div>

                <div class="flex items-center justify-between mt-4 pt-4 border-t">
                    <div class="text-sm text-muted-foreground">
                        Showing {{ alertsData?.results?.length || 0 }} alerts
                    </div>

                    <Button variant="outline" size="sm" @click="filters.clearFilters">
                        Clear Filters
                    </Button>
                </div>
            </CardContent>
        </Card>

        <Card>
            <GenericTable :data="alertsData?.results || []" :columns="tableColumns" :row-actions="tableActions"
                :loading="loading" :enable-search="false" empty-message="No alerts found" @view="viewAlert"
                @acknowledge="handleAcknowledge" @resolve="showResolveModal">

                <template #custom-cell-alertId="{ row }">
                    <span class="font-mono text-sm">{{ row.alertId }}</span>
                </template>

                <template #custom-cell-priority="{ row }">
                    <span :class="getPriorityClass(row.priority)" class="px-2 py-1 rounded text-xs font-medium">
                        {{ row.priorityDisplay }}
                    </span>
                </template>

                <template #custom-cell-status="{ row }">
                    <span :class="getStatusClass(row.status)" class="px-2 py-1 rounded text-xs font-medium">
                        {{ row.statusDisplay }}
                    </span>
                </template>

                <template #custom-cell-emergencyType="{ row }">
                    <span class="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                        {{ row.emergencyTypeDisplay }}
                    </span>
                </template>
            </GenericTable>
        </Card>

        <Dialog v-model:open="showCreateModal">
            <DialogContent class="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create Emergency Alert</DialogTitle>
                    <DialogDescription>
                        Create a new emergency alert on behalf of a resident
                    </DialogDescription>
                </DialogHeader>

                <form @submit.prevent="handleCreate" class="space-y-4">
                    <div>
                        <Label>User ID</Label>
                        <Input v-model="formData.userId" required placeholder="Enter user ID" />
                    </div>

                    <div>
                        <Label>Emergency Type</Label>
                        <Select v-model="formData.emergencyType">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="health">Health Emergency</SelectItem>
                                <SelectItem value="theft">Theft/Robbery</SelectItem>
                                <SelectItem value="domestic_violence">Domestic Violence</SelectItem>
                                <SelectItem value="fire">Fire Emergency</SelectItem>
                                <SelectItem value="security">Security Issue</SelectItem>
                                <SelectItem value="accident">Accident</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Description</Label>
                        <textarea v-model="formData.description"
                            class="w-full min-h-[120px] px-3 py-2 border rounded-md"
                            placeholder="Describe the emergency..." />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Location</Label>
                            <Input v-model="formData.location" placeholder="Emergency location" />
                        </div>

                        <div>
                            <Label>Priority</Label>
                            <Select v-model="formData.priority">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" @click="showCreateModal = false">
                            Cancel
                        </Button>
                        <Button type="submit" :disabled="createMutation.isPending.value"
                            class="bg-red-600 hover:bg-red-700">
                            {{ createMutation.isPending.value ? 'Creating...' : 'Create Alert' }}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="showResolveModalOpen">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Resolve Alert</DialogTitle>
                    <DialogDescription>
                        Mark this alert as resolved
                    </DialogDescription>
                </DialogHeader>

                <form @submit.prevent="handleResolve" class="space-y-4">
                    <div>
                        <Label>Resolution Notes</Label>
                        <textarea v-model="resolveFormData.notes"
                            class="w-full min-h-[120px] px-3 py-2 border rounded-md"
                            placeholder="Enter resolution notes..." />
                    </div>

                    <div class="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" @click="showResolveModalOpen = false">
                            Cancel
                        </Button>
                        <Button type="submit" :disabled="resolveMutation.isPending.value">
                            {{ resolveMutation.isPending.value ? 'Resolving...' : 'Resolve' }}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { queryKeys } from '~/constants/query-keys'
import { emergencyApi, type EmergencyAlert } from '~/services/api/emergency.api'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import GenericTable from '~/components/shared/GenericTable.vue'
import Icon from '~/components/Icon.vue'

const queryClient = useQueryClient()
const toast = useToast()

definePageMeta({
    title: 'Emergency Alerts',
    middleware: ['auth', 'permissions'],
    layout: 'default'
})

const showCreateModal = ref(false)
const showResolveModalOpen = ref(false)
const selectedAlertId = ref<string | null>(null)

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

const alertsQuery = useQuery({
    queryKey: computed(() => queryKeys.emergency.alerts.list(filters.currentQuery.value)),
    queryFn: () => emergencyApi.getAlerts(filters.currentQuery.value)
})

const activeAlertsQuery = useQuery({
    queryKey: queryKeys.emergency.alerts.active(),
    queryFn: () => emergencyApi.getActiveAlerts(),
    refetchInterval: 30000
})

const formData = reactive({
    userId: '',
    emergencyType: 'other',
    description: '',
    location: '',
    priority: 'high'
})

const resolveFormData = reactive({
    notes: ''
})

const createMutation = useMutation({
    mutationFn: emergencyApi.createAlert,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.emergency.alerts.all() })
        showCreateModal.value = false
        Object.assign(formData, {
            userId: '',
            emergencyType: 'other',
            description: '',
            location: '',
            priority: 'high'
        })
        toast.success('Emergency alert created successfully')
    },
    onError: (error: any) => {
        toast.error(error.message || 'Failed to create alert')
    }
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

const resolveMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
        emergencyApi.resolveAlert(id, notes),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.emergency.alerts.all() })
        if (selectedAlertId.value) {
            queryClient.invalidateQueries({
                queryKey: queryKeys.emergency.alerts.detail(selectedAlertId.value)
            })
        }
        showResolveModalOpen.value = false
        resolveFormData.notes = ''
        toast.success('Alert resolved successfully')
    },
    onError: (error: any) => {
        toast.error(error.message || 'Failed to resolve alert')
    }
})

const alertsData = computed(() => alertsQuery.data.value)
const activeAlertsData = computed(() => activeAlertsQuery.data.value)
const loading = computed(() => alertsQuery.isLoading.value)

const tableColumns = [
    { key: 'alertId', label: 'Alert ID', sortable: true },
    { key: 'emergencyType', label: 'Type', sortable: true },
    { key: 'priority', label: 'Priority', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'location', label: 'Location', sortable: false },
    { key: 'createdAt', label: 'Created', sortable: true }
]

const tableActions = computed(() => [
    { key: 'view', label: 'View', icon: 'eye' },
    { key: 'acknowledge', label: 'Acknowledge', icon: 'check' },
    { key: 'resolve', label: 'Resolve', icon: 'check-circle' }
])

const viewAlert = (alert: EmergencyAlert) => {
    navigateTo(`/portal/emergency/${alert.id}`)
}

const handleAcknowledge = (alert: EmergencyAlert) => {
    acknowledgeMutation.mutate(alert.id)
}

const showResolveModal = (alert: EmergencyAlert) => {
    selectedAlertId.value = alert.id
    showResolveModalOpen.value = true
}

const handleCreate = () => {
    createMutation.mutate(formData)
}

const handleResolve = () => {
    if (!selectedAlertId.value) return
    resolveMutation.mutate({
        id: selectedAlertId.value,
        notes: resolveFormData.notes
    })
}

const getPriorityClass = (priority: string) => {
    const classes = {
        low: 'bg-gray-100 text-gray-800',
        medium: 'bg-blue-100 text-blue-800',
        high: 'bg-orange-100 text-orange-800',
        critical: 'bg-red-100 text-red-800'
    }
    return classes[priority as keyof typeof classes] || classes.high
}

const getStatusClass = (status: string) => {
    const classes = {
        active: 'bg-red-100 text-red-800',
        acknowledged: 'bg-yellow-100 text-yellow-800',
        responding: 'bg-blue-100 text-blue-800',
        resolved: 'bg-green-100 text-green-800',
        cancelled: 'bg-gray-100 text-gray-800',
        false_alarm: 'bg-purple-100 text-purple-800'
    }
    return classes[status as keyof typeof classes] || classes.active
}
</script>
