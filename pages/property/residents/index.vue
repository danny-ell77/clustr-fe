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

        <Card>
            <CardHeader>
                <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label>Approval Status</Label>
                        <Select
                            @update:model-value="(value) => setFilter('approvedByAdmin', value === 'true' ? true : value === 'false' ? false : undefined)">
                            <SelectTrigger>
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="true">Approved</SelectItem>
                                <SelectItem value="false">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Verification Status</Label>
                        <Select
                            @update:model-value="(value) => setFilter('isVerified', value === 'true' ? true : value === 'false' ? false : undefined)">
                            <SelectTrigger>
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="true">Verified</SelectItem>
                                <SelectItem value="false">Unverified</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Search</Label>
                        <Input type="text" placeholder="Search by name, email, or phone..."
                            @input="(e: Event) => setSearch((e.target as HTMLInputElement).value)" />
                    </div>
                </div>

                <div class="flex items-center justify-between mt-4">
                    <div class="text-sm text-muted-foreground">
                        Showing {{ residents.length }} of {{ residentsQuery.data.value?.count || 0 }} residents
                    </div>
                    <Button variant="outline" size="sm" @click="clearFilters">Clear Filters</Button>
                </div>
            </CardContent>
        </Card>

        <Card>
            <BaseTable :loading="isLoading" :is-empty="residents.length === 0" :column-count="8"
                empty-message="No residents found">
                <template #column-headers>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Approval Status</TableHead>
                    <TableHead>Apartment</TableHead>
                    <TableHead>Bills</TableHead>
                    <TableHead class="text-right">Actions</TableHead>
                </template>

                <template #table-body>
                    <TableRow v-for="resident in residents" :key="resident.id" class="cursor-pointer hover:bg-muted/50"
                        @click="viewResident(resident.id)">
                        <TableCell class="font-medium">
                            <div class="flex items-center gap-2">
                                <div v-if="resident.profileImageUrl" class="w-8 h-8 rounded-full overflow-hidden">
                                    <img :src="resident.profileImageUrl" :alt="resident.name"
                                        class="w-full h-full object-cover" />
                                </div>
                                <div v-else class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span class="text-xs font-medium text-primary">{{ getInitials(resident.name)
                                        }}</span>
                                </div>
                                <span>{{ resident.name }}</span>
                            </div>
                        </TableCell>
                        <TableCell>{{ resident.phoneNumber }}</TableCell>
                        <TableCell>{{ resident.emailAddress }}</TableCell>
                        <TableCell>{{ resident.unitAddress || '-' }}</TableCell>
                        <TableCell>
                            <Badge :variant="resident.approvedByAdmin ? 'default' : 'secondary'">
                                {{ resident.approvedByAdmin ? 'Approved' : 'Pending' }}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge :variant="resident.apartmentStatus === 'OCCUPIED' ? 'default' : 'outline'">
                                {{ resident.apartmentStatus }}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <BillsSummaryBadge :paid-count="resident.billsSummary.paid"
                                :total-count="resident.billsSummary.total" />
                        </TableCell>
                        <TableCell class="text-right">
                            <div class="flex items-center justify-end gap-2" @click.stop>
                                <Button v-if="!resident.approvedByAdmin" variant="ghost" size="sm"
                                    @click="handleApprove(resident.id)">
                                    Approve
                                </Button>
                                <Button variant="ghost" size="sm" @click="handleEdit(resident)">
                                    Edit
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                </template>

                <template #footer-content>
                    <div class="flex items-center justify-between">
                        <div class="text-sm text-muted-foreground">
                            Page {{ currentPage }} of {{ totalPages }}
                        </div>
                        <div class="flex items-center gap-2">
                            <Button variant="outline" size="sm" :disabled="currentPage <= 1"
                                @click="handlePageChange(currentPage - 1)">
                                Previous
                            </Button>
                            <Button variant="outline" size="sm" :disabled="currentPage >= totalPages"
                                @click="handlePageChange(currentPage + 1)">
                                Next
                            </Button>
                        </div>
                    </div>
                </template>
            </BaseTable>
        </Card>

        <ResidentFormDialog v-model:open="showCreateDialog" :resident="editingResident" @success="onResidentSaved" />

        <ImportDialog v-model:open="showImportDialog" @import="handleImport" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Badge } from '~/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { TableHead, TableCell, TableRow } from '~/components/ui/table'
import Icon from '~/components/Icon.vue'
import StatPane from '~/components/common/StatPane.vue'
import BaseTable from '~/components/shared/BaseTable.vue'
import BillsSummaryBadge from '~/components/property/residents/BillsSummaryBadge.vue'
import ResidentFormDialog from '~/components/property/residents/ResidentFormDialog.vue'
import ImportDialog from '~/components/property/residents/ImportDialog.vue'
import { useResidents } from '~/composables/property/useResidents'
import type { ResidentFilters } from '~/types/residents'

definePageMeta({
    title: 'Residents'
})

const {
    useResidents: useResidentsQuery,
    useResidentStats,
    updateApprovalStatusMutation,
    exportResidentsMutation,
    importResidentsMutation
} = useResidents()

const filters = ref<ResidentFilters>({
    page: 1,
    pageSize: 20
})

const setFilter = (field: string, value: any) => {
    if (value === undefined || value === '') {
        delete (filters.value as any)[field]
    } else {
        (filters.value as any)[field] = value
    }
    filters.value.page = 1
}

const setSearch = (value: string) => {
    if (value === '') {
        delete filters.value.search
    } else {
        filters.value.search = value
    }
    filters.value.page = 1
}

const clearFilters = () => {
    filters.value = {
        page: 1,
        pageSize: 20
    }
}

const residentsQuery = useResidentsQuery(filters)
const statsQuery = useResidentStats()
const exportMutation = exportResidentsMutation

const residents = computed(() => residentsQuery.data.value?.results || [])
const stats = computed(() => statsQuery.data.value)
const isLoading = computed(() => residentsQuery.isLoading.value)

const currentPage = computed(() => filters.value.page || 1)
const totalPages = computed(() => {
    const total = residentsQuery.data.value?.count || 0
    const pageSize = filters.value.pageSize || 20
    return Math.ceil(total / pageSize)
})

const residentStats = computed(() => [
    { title: 'Total Residents', value: stats.value?.totalResidents, color: '#0ea5e9' },
    { title: 'Approved', value: stats.value?.approvedResidents, color: '#10b981' },
    { title: 'Pending Approval', value: stats.value?.pendingApproval, color: '#eab308' },
    { title: 'Total Bills', value: stats.value?.totalBills, color: '#a855f7' }
])

const showCreateDialog = ref(false)
const showImportDialog = ref(false)
const editingResident = ref<any>(null)

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

const viewResident = (id: string) => {
    navigateTo(`/property/residents/${id}`)
}

const handleEdit = (resident: any) => {
    editingResident.value = resident
    showCreateDialog.value = true
}

const handleApprove = async (id: string) => {
    await updateApprovalStatusMutation.mutateAsync({ id, approved: true })
}

const handleExport = async () => {
    await exportMutation.mutateAsync(filters.value)
}

const handleImport = async (file: File) => {
    await importResidentsMutation.mutateAsync(file)
    showImportDialog.value = false
}

const handlePageChange = (page: number) => {
    filters.value.page = page
}

const onResidentSaved = () => {
    showCreateDialog.value = false
    editingResident.value = null
}
</script>
