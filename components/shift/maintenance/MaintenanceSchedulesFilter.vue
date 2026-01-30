<template>
    <div class="flex gap-4">
        <Input 
            :model-value="modelValue.search" 
            @update:model-value="updateFilter('search', $event as string)"
            placeholder="Search schedules..." 
            class="max-w-sm" 
        />
        <Select 
            :model-value="modelValue.frequency" 
            @update:model-value="updateFilter('frequency', $event)"
        >
            <SelectTrigger class="w-48">
                <SelectValue placeholder="Frequency" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="All">All Frequencies</SelectItem>
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
            </SelectContent>
        </Select>
    </div>
</template>

<script setup lang="ts">
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

interface Filters {
    search?: string
    frequency?: string
}

const props = defineProps<{
    modelValue: Filters
}>()

const emit = defineEmits<{
    'update:modelValue': [value: Filters]
}>()

const updateFilter = (key: keyof Filters, value: string) => {
    emit('update:modelValue', {
        ...props.modelValue,
        [key]: value
    })
}
</script>
