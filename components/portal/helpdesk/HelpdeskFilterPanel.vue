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
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
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
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div>
            <Label class="text-sm">Type</Label>
            <Select :model-value="modelValue.type || 'All'"
                @update:model-value="(value) => updateFilter('type', value === 'All' ? undefined : value)">
                <SelectTrigger class="h-9">
                    <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    <SelectItem value="COMPLAINT">Complaint</SelectItem>
                    <SelectItem value="INQUIRY">Inquiry</SelectItem>
                    <SelectItem value="REQUEST">Request</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
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

interface HelpdeskFilters {
    status?: string
    priority?: string
    type?: string
}

interface Props {
    modelValue: HelpdeskFilters
    resultCount?: number
}

const props = withDefaults(defineProps<Props>(), {
    resultCount: 0
})

const emit = defineEmits<{
    'update:modelValue': [value: HelpdeskFilters]
}>()

const updateFilter = (key: keyof HelpdeskFilters, value: string | undefined) => {
    const newFilters = { ...props.modelValue }
    if (value === '' || value === undefined) {
        delete newFilters[key]
    } else {
        newFilters[key] = value
    }
    emit('update:modelValue', newFilters)
}
</script>
