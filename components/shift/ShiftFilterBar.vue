<template>
    <div class="flex items-center gap-4">
        <Select 
            :model-value="modelValue.shiftType"
            @update:model-value="updateFilter('shiftType', $event)"
        >
            <SelectTrigger class="w-[180px]">
                <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="SECURITY">Security</SelectItem>
                <SelectItem value="CLEANING">Cleaning</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                <SelectItem value="RECEPTION">Reception</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
        </Select>

        <Select 
            :model-value="modelValue.status"
            @update:model-value="updateFilter('status', $event)"
        >
            <SelectTrigger class="w-[180px]">
                <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
        </Select>

        <Button variant="outline" @click="$emit('clear')" size="sm">
            Clear Filters
        </Button>
    </div>
</template>

<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Button } from '~/components/ui/button'

interface Filters {
    shiftType?: string
    status?: string
}

const props = defineProps<{
    modelValue: Filters
}>()

const emit = defineEmits<{
    'update:modelValue': [value: Filters]
    clear: []
}>()

const updateFilter = (key: keyof Filters, value: string) => {
    emit('update:modelValue', {
        ...props.modelValue,
        [key]: value
    })
}
</script>
