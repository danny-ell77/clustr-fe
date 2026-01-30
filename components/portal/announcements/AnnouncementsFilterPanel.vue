<template>
    <div class="grid grid-cols-2 gap-4">
        <div>
            <Label class="text-sm">Category</Label>
            <Select :model-value="modelValue.category || 'All'"
                @update:model-value="(value) => updateFilter('category', value === 'All' ? undefined : value)">
                <SelectTrigger class="h-9">
                    <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="GENERAL">General</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    <SelectItem value="SECURITY">Security</SelectItem>
                    <SelectItem value="EVENT">Event</SelectItem>
                    <SelectItem value="EMERGENCY">Emergency</SelectItem>
                    <SelectItem value="BILLING">Billing</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div>
            <Label class="text-sm">Status</Label>
            <Select :model-value="modelValue.isPublished || 'All'"
                @update:model-value="(value) => updateFilter('isPublished', value === 'All' ? undefined : value)">
                <SelectTrigger class="h-9">
                    <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="true">Published</SelectItem>
                    <SelectItem value="false">Draft</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div>
            <Label class="text-sm">Sort By</Label>
            <Select :model-value="modelValue.ordering || '-createdAt'"
                @update:model-value="(value) => updateFilter('ordering', value)">
                <SelectTrigger class="h-9">
                    <SelectValue placeholder="Most Recent" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="-createdAt">Most Recent</SelectItem>
                    <SelectItem value="createdAt">Oldest First</SelectItem>
                    <SelectItem value="-publishedAt">Recently Published</SelectItem>
                    <SelectItem value="-viewsCount">Most Viewed</SelectItem>
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

interface AnnouncementFilters {
    category?: string
    isPublished?: string
    ordering?: string
}

interface Props {
    modelValue: AnnouncementFilters
    resultCount?: number
}

const props = withDefaults(defineProps<Props>(), {
    resultCount: 0
})

const emit = defineEmits<{
    'update:modelValue': [value: AnnouncementFilters]
}>()

const updateFilter = (key: keyof AnnouncementFilters, value: string | undefined) => {
    const newFilters = { ...props.modelValue }
    if (value === '' || value === undefined) {
        delete newFilters[key]
    } else {
        newFilters[key] = value
    }
    emit('update:modelValue', newFilters)
}
</script>
