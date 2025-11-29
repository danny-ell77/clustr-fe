<template>
    <div>
        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card v-for="i in skeletonCount" :key="i">
                <CardContent class="pt-6">
                    <Skeleton class="h-32 w-full" />
                </CardContent>
            </Card>
        </div>

        <div v-else-if="data.length === 0" class="text-center py-12">
            <EmptyState :title="emptyTitle" :description="emptyDescription" :action-label="emptyActionLabel"
                @action="$emit('emptyAction')" />
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <slot name="card" v-for="item in data" :item="item" :key="getItemKey(item)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Card, CardContent } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import EmptyState from '~/components/common/EmptyState.vue'

interface Props {
    data: any[]
    isLoading?: boolean
    skeletonCount?: number
    emptyTitle?: string
    emptyDescription?: string
    emptyActionLabel?: string
    itemKey?: string
}

const props = withDefaults(defineProps<Props>(), {
    isLoading: false,
    skeletonCount: 6,
    emptyTitle: 'No items found',
    emptyDescription: 'Get started by creating your first item',
    emptyActionLabel: 'Create Item',
    itemKey: 'id'
})

defineEmits<{
    emptyAction: []
}>()

const getItemKey = (item: any) => {
    return item[props.itemKey] || item.id || Math.random()
}
</script>
