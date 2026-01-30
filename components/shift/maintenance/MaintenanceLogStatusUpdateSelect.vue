<template>
    <Select :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
        <SelectTrigger>
            <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
        </SelectContent>
    </Select>
</template>

<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

/**
 * Maintenance log status update select component for detail page.
 */

defineProps<{
    modelValue: string
}>()

defineEmits<{
    'update:modelValue': [value: string]
}>()
</script>
