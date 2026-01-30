<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-semibold">Residents</h1>
                <p class="text-muted-foreground">Manage residents and view their payment history</p>
            </div>

            <div class="flex items-center gap-2">
                <Button variant="outline" @click="handleExport" :disabled="exportMutation.isPending.value">
                    <Icon name="download" class="w-4 h-4 mr-2" />
                    {{ exportMutation.isPending.value ? 'Exporting...' : 'Export' }}
                </Button>
                <Button variant="outline" @click="showImportDialog = true">
                    <Icon name="upload" class="w-4 h-4 mr-2" />
                    Import
                </Button>
                <Button @click="showCreateDialog = true">
                    <Icon name="plus" class="w-4 h-4 mr-2" />
                    Add Resident
                </Button>
            </div>
        </div>

        <StatPane v-if="!statsQuery.isLoading.value" :stats="residentStats" />

        <UnifiedView page-key="residents" :data="residents" :is-loading="residentsQuery.isLoading.value"
            :available-views="['grid', 'table']" default-view-mode="table">
            <template #filters="{ filters: viewFilters, applyFilters }">
                <ResidentFilterForm :model-value="viewFilters" @update:model-value="applyFilters" />
            </template>

            <template #modal-filters="{ filters: modalFilters, setFilter }">
                <ResidentFilterForm :model-value="modalFilters" @update:model-value="(filters) => {
                    Object.entries(filters).forEach(([key, value]) => setFilter(key, value as string))
                }" />
            </template>

            <template #grid="{ data, isLoading }">
                <ResidentGridContent :data="data" :is-loading="isLoading" @add="showCreateDialog = true"
                    @view="viewResident" @edit="handleEdit" @approve="handleApprove" />
            </template>

            <template #table="{ data, isLoading }">
                <ResidentTableContent :data="data" :is-loading="isLoading" @add="showCreateDialog = true"
                    @view="viewResident" @edit="handleEdit" @approve="handleApprove" />
            </template>
        </UnifiedView>

        <ResidentFormDialog v-model:open="showCreateDialog" :resident="editingResident" @submit="handleResidentSubmit" />

        <ImportDialog v-model:open="showImportDialog" @import="handleImport" />
    </div>
</template>

<script setup lang="ts">
import Icon from '~/components/Icon.vue'
import StatPane from '~/components/common/StatPane.vue'
import UnifiedView from '~/components/common/UnifiedView.vue'
import ResidentFilterForm from '~/components/property/residents/ResidentFilterForm.vue'
import ResidentTableContent from '~/components/property/residents/ResidentTableContent.vue'
import ResidentGridContent from '~/components/property/residents/ResidentGridContent.vue'
import ResidentFormDialog from '~/components/property/residents/ResidentFormDialog.vue'
import ImportDialog from '~/components/property/residents/ImportDialog.vue'
import { Button } from '~/components/ui/button'
import { useResidents } from '~/composables/property/useResidents'
import { useSavedViews } from '~/composables/useSavedViews'
import type { ResidentFilters } from '~/types/residents'

definePageMeta({
    title: 'Residents'
})

const {
    useResidents: useResidentsQuery,
    useResidentStats,
    createResidentMutation,
    updateResidentMutation,
    updateApprovalStatusMutation,
    exportResidentsMutation,
    importResidentsMutation
} = useResidents()

const { filters } = useSavedViews('residents')

const residentFilters = computed<ResidentFilters>(() => ({
    page: 1,
    pageSize: 20,
    approvedByAdmin: filters.value.approvedByAdmin,
    isVerified: filters.value.isVerified,
    search: filters.value.search
}))

const residentsQuery = useResidentsQuery(residentFilters)
const statsQuery = useResidentStats()
const exportMutation = exportResidentsMutation

const residents = computed(() => residentsQuery.data.value?.results || [])
const stats = computed(() => statsQuery.data.value)

watch(filters, () => {
    residentsQuery.refetch()
}, { deep: true })

const residentStats = computed(() => [
    { title: 'Total Residents', value: stats.value?.totalResidents, color: '#0ea5e9' },
    { title: 'Approved', value: stats.value?.approvedResidents, color: '#10b981' },
    { title: 'Pending Approval', value: stats.value?.pendingApproval, color: '#eab308' },
    { title: 'Total Bills', value: stats.value?.totalBills, color: '#a855f7' }
])

const showCreateDialog = ref(false)
const showImportDialog = ref(false)
const editingResident = ref<any>(null)



const viewResident = (resident: any) => {
    navigateTo(`/property/residents/${resident.id}`)
}

const handleEdit = (resident: any) => {
    editingResident.value = resident
    showCreateDialog.value = true
}

const handleApprove = async (id: string) => {
    await updateApprovalStatusMutation.mutateAsync({ id, approved: true })
}

const handleExport = async () => {
    await exportMutation.mutateAsync(residentFilters.value)
}

const handleImport = async (file: File) => {
    await importResidentsMutation.mutateAsync(file)
    showImportDialog.value = false
}

const handleResidentSubmit = async (data: any) => {
    try {
        if (editingResident.value) {
            await updateResidentMutation.mutateAsync({ 
                id: editingResident.value.id, 
                data 
            })
        } else {
            await createResidentMutation.mutateAsync(data)
        }
        showCreateDialog.value = false
        editingResident.value = null
    } catch (error) {
        console.error('Failed to save resident:', error)
    }
}
</script>
