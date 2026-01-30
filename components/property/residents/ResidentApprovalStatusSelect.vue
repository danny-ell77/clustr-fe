<template>
    <Select :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
        <SelectTrigger>
            <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Approved</SelectItem>
            <SelectItem value="false">Pending</SelectItem>
        </SelectContent>
    </Select>
</template>

<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

/**
 * Resident approval status select component.
 */

defineProps<{
    modelValue: string
}>()

defineEmits<{
    'update:modelValue': [value: string]
}>()
</script>
