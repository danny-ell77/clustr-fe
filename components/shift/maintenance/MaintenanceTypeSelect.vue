<template>
    <Select :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
        <SelectTrigger>
            <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="PREVENTIVE">Preventive</SelectItem>
            <SelectItem value="CORRECTIVE">Corrective</SelectItem>
            <SelectItem value="EMERGENCY">Emergency</SelectItem>
            <SelectItem value="ROUTINE">Routine</SelectItem>
            <SelectItem value="INSPECTION">Inspection</SelectItem>
        </SelectContent>
    </Select>
</template>

<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

/**
 * Maintenance type select component.
 */

defineProps<{
    modelValue: string
}>()

defineEmits<{
    'update:modelValue': [value: string]
}>()
</script>
