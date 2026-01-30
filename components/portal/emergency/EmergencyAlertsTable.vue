<template>
    <Card>
        <div class="flex items-center justify-between px-4 py-3 border-b">
            <div class="relative">
                <Icon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="text" placeholder="Search alerts..." class="rounded-full w-64 pl-10"
                    @input="(e: Event) => $emit('search', (e.target as HTMLInputElement).value)" />
            </div>

            <Popover v-model:open="showFilters">
                <PopoverTrigger as-child>
                    <Button variant="outline" size="sm" class="gap-2 h-8 border-gray-200 shadow-sm">
                        <Icon name="filter" class="w-4 h-4" />
                        <span class="font-medium">Filter</span>
                        <span v-if="activeFilterCount > 0"
                            class="ml-1 flex items-center justify-center w-4 h-4 text-[10px] bg-primary text-primary-foreground rounded-full">
                            {{ activeFilterCount }}
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent class="w-96" align="end">
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <h4 class="font-medium">Filters</h4>
                            <Button v-if="activeFilterCount > 0" variant="ghost" size="sm" @click="$emit('clear-filters')">
                                Clear All
                            </Button>
                        </div>
                        <slot name="filters" />
                    </div>
                </PopoverContent>
            </Popover>
        </div>

        <GenericTable :data="alerts" :columns="tableColumns" :row-actions="tableActions" :loading="isLoading"
            :enable-search="false" empty-message="No alerts found" @view="(alert) => $emit('view', alert)"
            @acknowledge="(alert) => $emit('acknowledge', alert)" @resolve="(alert) => $emit('resolve', alert)">

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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import GenericTable from '~/components/shared/GenericTable.vue'
import Icon from '~/components/Icon.vue'
import type { EmergencyAlert } from '~/services/api/emergency.api'

interface Props {
    alerts: EmergencyAlert[]
    isLoading: boolean
    filters?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
    filters: () => ({})
})

defineEmits<{
    search: [value: string]
    view: [alert: EmergencyAlert]
    acknowledge: [alert: EmergencyAlert]
    resolve: [alert: EmergencyAlert]
    'clear-filters': []
}>()

const showFilters = ref(false)

const activeFilterCount = computed(() => {
    return Object.keys(props.filters).filter(key =>
        props.filters[key] !== null &&
        props.filters[key] !== undefined &&
        props.filters[key] !== '' &&
        props.filters[key] !== 'All'
    ).length
})

const tableColumns = [
    { key: 'alertId', label: 'Alert ID', sortable: true },
    { key: 'emergencyType', label: 'Type', sortable: true },
    { key: 'priority', label: 'Priority', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'location', label: 'Location', sortable: false },
    { key: 'createdAt', label: 'Created', sortable: true }
]

const tableActions = [
    { key: 'view', label: 'View', icon: 'eye' },
    { key: 'acknowledge', label: 'Acknowledge', icon: 'check' },
    { key: 'resolve', label: 'Resolve', icon: 'check-circle' }
]

const getPriorityClass = (priority: string) => {
    const classes: Record<string, string> = {
        low: 'bg-gray-100 text-gray-800',
        medium: 'bg-primary/15 text-primary',
        high: 'bg-orange-100 text-orange-800',
        critical: 'bg-red-100 text-red-800'
    }
    return classes[priority] || classes.high
}

const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
        active: 'bg-red-100 text-red-800',
        acknowledged: 'bg-yellow-100 text-yellow-800',
        responding: 'bg-primary/15 text-primary',
        resolved: 'bg-green-100 text-green-800',
        cancelled: 'bg-gray-100 text-gray-800',
        false_alarm: 'bg-purple-100 text-purple-800'
    }
    return classes[status] || classes.active
}
</script>
