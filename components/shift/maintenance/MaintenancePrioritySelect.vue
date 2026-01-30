<template>
    <Select :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
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
</template>

<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

/**
 * Maintenance priority select component.
 */

defineProps<{
    modelValue: string
}>()

defineEmits<{
    'update:modelValue': [value: string]
}>()
</script>
