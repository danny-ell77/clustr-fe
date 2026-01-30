<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-semibold">Staff Management</h1>
                <p class="text-muted-foreground">Manage on-site staff members</p>
            </div>

            <div class="flex items-center gap-2">
                <Button variant="outline" @click="handleExport" :disabled="exportMutation.isPending.value">
                    <Icon name="download" class="w-4 h-4 mr-2" />
                    {{ exportMutation.isPending.value ? 'Exporting...' : 'Export' }}
                </Button>
                <Button @click="showCreateDialog = true">
                    <Icon name="plus" class="w-4 h-4 mr-2" />
                    Add Staff
                </Button>
            </div>
        </div>

        <StatPane v-if="!statsQuery.isLoading.value && statistics" :stats="staffStats" />

        <UnifiedView page-key="staff" :data="staffList" :is-loading="staffQuery.isLoading.value"
            :available-views="['grid', 'table']" default-view-mode="table">
            <template #filters="{ filters: viewFilters, applyFilters }">
                <StaffFilterForm :model-value="viewFilters" @update:model-value="applyFilters" />
            </template>

            <template #modal-filters="{ filters: modalFilters, setFilter }">
                <StaffFilterForm :model-value="modalFilters" @update:model-value="(filters) => {
                    Object.entries(filters).forEach(([key, value]) => setFilter(key, value as string))
                }" />
            </template>

            <template #grid="{ data, isLoading }">
                <StaffGridContent :data="data" :is-loading="isLoading" @add="showCreateDialog = true" @view="viewStaff"
                    @edit="handleEdit" @toggle-active="handleToggleActive" />
            </template>

            <template #table="{ data, isLoading }">
                <StaffTableContent :data="data" :is-loading="isLoading" @add="showCreateDialog = true" @view="viewStaff"
                    @edit="handleEdit" @toggle-active="handleToggleActive" />
            </template>
        </UnifiedView>

        <StaffFormDialog v-model:open="showCreateDialog" :staff="editingStaff" @submit="handleStaffSubmit" />
    </div>
</template>

<script setup lang="ts">
import Icon from '~/components/Icon.vue'
import StatPane from '~/components/common/StatPane.vue'
import UnifiedView from '~/components/common/UnifiedView.vue'
import StaffFilterForm from '~/components/shift/StaffFilterForm.vue'
import StaffTableContent from '~/components/shift/StaffTableContent.vue'
import StaffGridContent from '~/components/shift/StaffGridContent.vue'
import StaffFormDialog from '~/components/shift/StaffFormDialog.vue'
import { Button } from '~/components/ui/button'
import { useStaff } from '~/composables/shift/useStaff'
import { useSavedViews } from '~/composables/useSavedViews'
import type { Staff, StaffFilters } from '~/types/shifts'

/**
 * Staff Management page.
 * Uses UnifiedView to display staff members in grid and table views.
 */

definePageMeta({
    title: 'Staff Management'
})

const {
    useStaffList,
    useStaffStats,
    createStaffMutation,
    updateStaffMutation,
    activateStaffMutation,
    deactivateStaffMutation,
    exportStaffMutation
} = useStaff()

const { filters } = useSavedViews('staff')

const staffFilters = computed<StaffFilters>(() => ({
    page: 1,
    pageSize: 50,
    staffType: filters.value.staffType,
    isActive: filters.value.isActive,
    search: filters.value.search
}))

const staffQuery = useStaffList(staffFilters)
const statsQuery = useStaffStats()
const exportMutation = exportStaffMutation

const staffList = computed(() => staffQuery.data.value?.results || [])
const statistics = computed(() => statsQuery.data.value)

const staffStats = computed(() => [
    { title: 'Total Staff', value: statistics.value?.totalStaff || 0, color: '#0ea5e9' },
    { title: 'Active', value: statistics.value?.activeStaff || 0, color: '#10b981' },
    { title: 'Inactive', value: statistics.value?.inactiveStaff || 0, color: '#eab308' }
])

const showCreateDialog = ref(false)
const editingStaff = ref<Staff | null>(null)

const viewStaff = (staff: Staff) => {
    navigateTo(`/shift/staff/${staff.id}`)
}

const handleEdit = (staff: Staff) => {
    editingStaff.value = staff
    showCreateDialog.value = true
}

const handleToggleActive = async (staff: Staff) => {
    if (staff.isActive) {
        await deactivateStaffMutation.mutateAsync(staff.id)
    } else {
        await activateStaffMutation.mutateAsync(staff.id)
    }
}

const handleStaffSubmit = async (data: any) => {
    try {
        if (editingStaff.value) {
            await updateStaffMutation.mutateAsync({
                id: editingStaff.value.id,
                data
            })
        } else {
            await createStaffMutation.mutateAsync(data)
        }
        showCreateDialog.value = false
        editingStaff.value = null
    } catch (error) {
        console.error('Failed to save staff:', error)
    }
}

const handleExport = async () => {
    await exportMutation.mutateAsync(staffFilters.value)
}
</script>
