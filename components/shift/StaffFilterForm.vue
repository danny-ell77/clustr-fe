<template>
    <div class="space-y-3">
        <div>
            <Label>Staff Type</Label>
            <Select :model-value="modelValue.staffType || 'all'"
                @update:model-value="updateFilter('staffType', $event === 'all' ? undefined : $event)">
                <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="SECURITY">Security</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    <SelectItem value="CLEANING">Cleaning</SelectItem>
                    <SelectItem value="RECEPTION">Reception</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div>
            <Label>Status</Label>
            <Select :model-value="getActiveValue(modelValue.isActive)"
                @update:model-value="updateFilter('isActive', $event === 'all' ? undefined : $event === 'true')">
                <SelectTrigger>
                    <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div>
            <Label>Search</Label>
            <Input type="text" placeholder="Search by name, email, phone..." :model-value="modelValue.search || ''"
                @input="updateFilter('search', ($event.target as HTMLInputElement).value)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Input } from '~/components/ui/input'
import type { StaffFilters } from '~/types/shifts'

/**
 * Staff filter form component for managing staff list filters.
 */

const props = defineProps<{
    modelValue: Partial<StaffFilters>
}>()

const emit = defineEmits<{
    'update:modelValue': [value: Partial<StaffFilters>]
}>()

const getActiveValue = (value: boolean | undefined) => {
    if (value === undefined) return 'all'
    return value ? 'true' : 'false'
}

const updateFilter = (key: keyof StaffFilters, value: any) => {
    emit('update:modelValue', {
        ...props.modelValue,
        [key]: value
    })
}
</script>
