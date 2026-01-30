<template>
    <Card>
        <div class="flex items-center justify-between px-4 py-3 border-b">
            <div class="relative">
                <Icon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="text" placeholder="Search announcements..." class="rounded-full w-64 pl-10"
                    @input="(e: Event) => $emit('search', (e.target as HTMLInputElement).value)" />
            </div>

            <Popover v-model:open="showFilters">
                <PopoverTrigger as-child>
                    <Button variant="outline" size="sm" class="gap-2 h-8 border-gray-200 shadow-sm">
                        <Icon name="filter" class="w-4 h-4" />
                        <span class="font-medium">Filter</span>
                        <span v-if="activeFilterCount > 0"
                            class="ml-1 flex items-center justify-center w-4 h-4 text-[10px] bg-primary text-primary-foreground rounded-full">
                            {{ activeFilterCount }}
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent class="w-96" align="end">
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <h4 class="font-medium">Filters</h4>
                            <Button v-if="activeFilterCount > 0" variant="ghost" size="sm"
                                @click="$emit('clear-filters')">
                                Clear All
                            </Button>
                        </div>
                        <slot name="filters" />
                    </div>
                </PopoverContent>
            </Popover>
        </div>

        <div class="p-4">
            <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card v-for="i in 6" :key="i">
                    <CardContent class="pt-6">
                        <Skeleton class="h-48 w-full" />
                    </CardContent>
                </Card>
            </div>

            <div v-else-if="announcements.length === 0" class="text-center py-12">
                <EmptyState title="No announcements found" description="Create your first announcement to get started"
                    action-label="Create Announcement" @action="$emit('create')" />
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnnouncementCard v-for="announcement in announcements" :key="announcement.id"
                    :announcement="announcement" @click="$emit('view', announcement)" />
            </div>
        </div>
    </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Skeleton } from '~/components/ui/skeleton'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import AnnouncementCard from '~/components/portal/announcements/AnnouncementCard.vue'
import EmptyState from '~/components/common/EmptyState.vue'
import Icon from '~/components/Icon.vue'
import type { Announcement } from '~/types/announcements'

interface Props {
    announcements: Announcement[]
    isLoading: boolean
    filters?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
    filters: () => ({})
})

defineEmits<{
    search: [value: string]
    view: [announcement: Announcement]
    create: []
    'clear-filters': []
}>()

const showFilters = ref(false)

const activeFilterCount = computed(() => {
    return Object.keys(props.filters).filter(key =>
        props.filters[key] !== null &&
        props.filters[key] !== undefined &&
        props.filters[key] !== '' &&
        props.filters[key] !== 'All' &&
        key !== 'search'
    ).length
})
</script>
