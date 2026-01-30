<template>
    <SectionGrid :data="data" :is-loading="isLoading" empty-title="No residents found"
        empty-description="Add your first resident to get started" empty-action-label="Add Resident"
        @empty-action="$emit('add')">
        <template #card="{ item }">
            <ResidentCard :resident="item" @view="$emit('view', item)" @edit="$emit('edit', item)"
                @approve="$emit('approve', item.id)" />
        </template>
    </SectionGrid>
</template>

<script setup lang="ts">
import SectionGrid from '~/components/common/SectionGrid.vue'
import ResidentCard from './ResidentCard.vue'
import type { Resident } from '~/types/residents'

/**
 * Resident grid content component for displaying residents in a grid view.
 */

defineProps<{
    data: Resident[]
    isLoading: boolean
}>()

defineEmits<{
    view: [resident: Resident]
    edit: [resident: Resident]
    approve: [id: string]
    add: []
}>()
</script>
