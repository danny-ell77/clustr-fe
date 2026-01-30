<template>
    <div class="grid grid-cols-2 gap-4">
        <div>
            <Label class="text-sm">Status</Label>
            <Select :model-value="modelValue.status || 'All'"
                @update:model-value="(value) => updateFilter('status', value === 'All' ? undefined : value)">
                <SelectTrigger class="h-9">
                    <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="responding">Responding</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div>
            <Label class="text-sm">Emergency Type</Label>
            <Select :model-value="modelValue.emergencyType || 'All'"
                @update:model-value="(value) => updateFilter('emergencyType', value === 'All' ? undefined : value)">
                <SelectTrigger class="h-9">
                    <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
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
            <Label class="text-sm">Priority</Label>
            <Select :model-value="modelValue.priority || 'All'"
                @update:model-value="(value) => updateFilter('priority', value === 'All' ? undefined : value)">
                <SelectTrigger class="h-9">
                    <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All Priorities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div class="flex items-end">
            <div class="text-sm text-muted-foreground">
                {{ resultCount }} result{{ resultCount !== 1 ? 's' : '' }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

interface EmergencyFilters {
    status?: string
    emergencyType?: string
    priority?: string
}

interface Props {
    modelValue: EmergencyFilters
    resultCount?: number
}

const props = withDefaults(defineProps<Props>(), {
    resultCount: 0
})

const emit = defineEmits<{
    'update:modelValue': [value: EmergencyFilters]
}>()

const updateFilter = (key: keyof EmergencyFilters, value: string | undefined) => {
    const newFilters = { ...props.modelValue }
    if (value === '' || value === undefined) {
        delete newFilters[key]
    } else {
        newFilters[key] = value
    }
    emit('update:modelValue', newFilters)
}
</script>
