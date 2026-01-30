<template>
    <div class="space-y-3">
        <div>
            <Label>Status</Label>
            <MaintenanceStatusSelect :model-value="modelValue.status || 'All'"
                @update:model-value="updateFilter('status', $event === 'All' ? undefined : $event)" />
        </div>

        <div>
            <Label>Priority</Label>
            <MaintenancePrioritySelect :model-value="modelValue.priority || 'All'"
                @update:model-value="updateFilter('priority', $event === 'All' ? undefined : $event)" />
        </div>

        <div>
            <Label>Type</Label>
            <MaintenanceTypeSelect :model-value="modelValue.maintenanceType || 'All'"
                @update:model-value="updateFilter('maintenanceType', $event === 'All' ? undefined : $event)" />
        </div>

        <div>
            <Label>Search</Label>
            <Input type="text" placeholder="Search logs..." :model-value="modelValue.search || ''"
                @input="updateFilter('search', ($event.target as HTMLInputElement).value)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import MaintenanceStatusSelect from './MaintenanceStatusSelect.vue'
import MaintenancePrioritySelect from './MaintenancePrioritySelect.vue'
import MaintenanceTypeSelect from './MaintenanceTypeSelect.vue'
import type { MaintenanceLogFilters } from '~/types/maintenance'

/**
 * Maintenance logs filter form component for managing log list filters.
 */

const props = defineProps<{
    modelValue: Partial<MaintenanceLogFilters>
}>()

const emit = defineEmits<{
    'update:modelValue': [value: Partial<MaintenanceLogFilters>]
}>()

const updateFilter = (key: keyof MaintenanceLogFilters, value: any) => {
    emit('update:modelValue', {
        ...props.modelValue,
        [key]: value
    })
}
</script>
