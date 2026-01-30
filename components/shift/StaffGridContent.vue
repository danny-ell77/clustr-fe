<template>
    <SectionGrid :data="data" :is-loading="isLoading" empty-title="No staff found"
        empty-description="Add your first staff member to get started" empty-action-label="Add Staff"
        @empty-action="$emit('add')">
        <template #card="{ item }">
            <StaffCard :staff="item" @view="$emit('view', item)" @edit="$emit('edit', item)"
                @toggle-active="$emit('toggle-active', item)" />
        </template>
    </SectionGrid>
</template>

<script setup lang="ts">
import SectionGrid from '~/components/common/SectionGrid.vue'
import StaffCard from '~/components/shift/StaffCard.vue'
import type { Staff } from '~/types/shifts'

/**
 * Staff grid content component for displaying staff members in a grid view.
 */

defineProps<{
    data: Staff[]
    isLoading: boolean
}>()

defineEmits<{
    view: [staff: Staff]
    edit: [staff: Staff]
    'toggle-active': [staff: Staff]
    add: []
}>()
</script>
