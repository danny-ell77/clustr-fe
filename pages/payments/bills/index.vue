<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl">Bills Management</h1>
                <p class="text-muted-foreground">Create and manage bills for residents</p>
            </div>
            <div class="flex gap-2">
                <Button v-if="hasPermission(PERMISSIONS.PAYMENTS.MANAGE_BILL)" variant="outline"
                    @click="showBulkDialog = true">
                    <Icon name="layers" class="w-4 h-4 mr-2" />
                    Bulk Bills
                </Button>
                <Button v-if="hasPermission(PERMISSIONS.PAYMENTS.MANAGE_BILL)" @click="showCreateDialog = true">
                    <Icon name="plus" class="w-4 h-4 mr-2" />
                    Create Bill
                </Button>
            </div>
        </div>

        <UnifiedView page-key="bills" :data="bills" :is-loading="billsQuery.isLoading.value"
            :available-views="['grid', 'table']" default-view-mode="grid">
            <template #filters="{ filters, applyFilters }">
                <div class="space-y-3">
                    <div>
                        <Label>Status</Label>
                        <Select :model-value="filters.status || 'All'"
                            @update:model-value="(value) => applyFilters({ status: value === 'All' ? undefined : value })">
                            <SelectTrigger>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Statuses</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="PAID">Paid</SelectItem>
                                <SelectItem value="OVERDUE">Overdue</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                <SelectItem value="DISPUTED">Disputed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Bill Type</Label>
                        <Select :model-value="filters.type || 'All'"
                            @update:model-value="(value) => applyFilters({ type: value === 'All' ? undefined : value })">
                            <SelectTrigger>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Types</SelectItem>
                                <SelectItem value="ELECTRICITY">Electricity</SelectItem>
                                <SelectItem value="WATER">Water</SelectItem>
                                <SelectItem value="SECURITY">Security</SelectItem>
                                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                <SelectItem value="SERVICE_CHARGE">Service Charge</SelectItem>
                                <SelectItem value="WASTE_MANAGEMENT">Waste Management</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Date From</Label>
                        <Input type="date" :model-value="filters.date_from || ''"
                            @change="(e: Event) => applyFilters({ date_from: (e.target as HTMLInputElement).value })" />
                    </div>

                    <div>
                        <Label>Search</Label>
                        <Input type="text" placeholder="Search bills..." :model-value="filters.search || ''"
                            @input="(e: Event) => applyFilters({ search: (e.target as HTMLInputElement).value })" />
                    </div>
                </div>
            </template>

            <template #modal-filters="{ filters: modalFilters, setFilter }">
                <div class="space-y-3">
                    <div>
                        <Label>Status</Label>
                        <Select :model-value="modalFilters.status || 'All'"
                            @update:model-value="(value) => setFilter('status', value === 'All' ? undefined : value)">
                            <SelectTrigger>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Statuses</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="PAID">Paid</SelectItem>
                                <SelectItem value="OVERDUE">Overdue</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                <SelectItem value="DISPUTED">Disputed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Bill Type</Label>
                        <Select :model-value="modalFilters.type || 'All'"
                            @update:model-value="(value) => setFilter('type', value === 'All' ? undefined : value)">
                            <SelectTrigger>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Types</SelectItem>
                                <SelectItem value="ELECTRICITY">Electricity</SelectItem>
                                <SelectItem value="WATER">Water</SelectItem>
                                <SelectItem value="SECURITY">Security</SelectItem>
                                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                <SelectItem value="SERVICE_CHARGE">Service Charge</SelectItem>
                                <SelectItem value="WASTE_MANAGEMENT">Waste Management</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Date From</Label>
                        <Input type="date" :model-value="modalFilters.date_from || ''"
                            @change="(e: Event) => setFilter('date_from', (e.target as HTMLInputElement).value)" />
                    </div>

                    <div>
                        <Label>Search</Label>
                        <Input type="text" placeholder="Search bills..." :model-value="modalFilters.search || ''"
                            @input="(e: Event) => setFilter('search', (e.target as HTMLInputElement).value)" />
                    </div>
                </div>
            </template>

            <template #grid="{ data, isLoading }">
                <SectionGrid :data="data" :is-loading="isLoading" empty-title="No bills found"
                    empty-description="Create your first bill to get started" empty-action-label="Create Bill"
                    @empty-action="showCreateDialog = true">
                    <template #card="{ item }">
                        <BillCard :bill="item" :can-edit="hasPermission(PERMISSIONS.PAYMENTS.MANAGE_BILL)"
                            :can-cancel="hasPermission(PERMISSIONS.PAYMENTS.MANAGE_BILL)" @view="viewBill"
                            @edit="editBill" @cancel="cancelBill" />
                    </template>
                </SectionGrid>
            </template>

            <template #table="{ data, isLoading }">
                <Card>
                    <CardContent class="p-0">
                        <div v-if="isLoading" class="p-6 space-y-4">
                            <Skeleton v-for="i in 5" :key="i" class="h-16 w-full" />
                        </div>

                        <div v-else-if="data.length === 0" class="text-center py-12">
                            <EmptyState title="No bills found" description="Create your first bill to get started"
                                action-label="Create Bill" @action="showCreateDialog = true" />
                        </div>

                        <Table v-else>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Bill Number</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead class="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-for="bill in data" :key="bill.id" class="cursor-pointer hover:bg-muted/50"
                                    @click="viewBill(bill)">
                                    <TableCell class="font-medium">{{ bill.billNumber }}</TableCell>
                                    <TableCell>
                                        <div>
                                            <p class="font-medium">{{ bill.title }}</p>
                                            <p v-if="bill.isClusterWide" class="text-xs text-primary">Cluster-wide</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{{ formatBillType(bill.type) }}</TableCell>
                                    <TableCell>{{ formatCurrency(bill.amount) }}</TableCell>
                                    <TableCell :class="{ 'text-red-600': bill.isOverdue }">
                                        {{ formatDate(bill.dueDate) }}
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge :status="getBillStatus(bill)" />
                                    </TableCell>
                                    <TableCell class="text-right">
                                        <div class="flex justify-end gap-2">
                                            <Button
                                                v-if="!bill.isFullyPaid && hasPermission(PERMISSIONS.PAYMENTS.MANAGE_BILL)"
                                                variant="ghost" size="sm" @click.stop="editBill(bill)">
                                                Edit
                                            </Button>
                                            <Button
                                                v-if="!bill.isFullyPaid && hasPermission(PERMISSIONS.PAYMENTS.MANAGE_BILL)"
                                                variant="ghost" size="sm" @click.stop="cancelBill(bill)">
                                                Cancel
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </template>
        </UnifiedView>

        <CreateBillDialog v-model:open="showCreateDialog" :users="users" @submit="handleCreateBill" />
        <BulkBillDialog v-model:open="showBulkDialog" :users="users" @submit="handleBulkBills" />
        <ConfirmDialog v-model:open="showCancelDialog" title="Cancel Bill"
            description="Are you sure you want to cancel this bill? This action cannot be undone."
            confirm-text="Cancel Bill" @confirm="confirmCancelBill" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import Icon from '~/components/Icon.vue'
import UnifiedView from '~/components/common/UnifiedView.vue'
import SectionGrid from '~/components/common/SectionGrid.vue'
import BillCard from '~/components/payments/BillCard.vue'
import CreateBillDialog from '~/components/payments/CreateBillDialog.vue'
import BulkBillDialog from '~/components/payments/BulkBillDialog.vue'
import EmptyState from '~/components/common/EmptyState.vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import ConfirmDialog from '~/components/common/ConfirmDialog.vue'
import { usePayments } from '~/composables/payments/usePayments'
import { usePermissions } from '~/composables/auth/usePermissions'
import { useSavedViews } from '~/composables/useSavedViews'
import type { Bill, CreateBillDto, BulkBillsDto, BillStatus } from '~/types/payments'
import type { BillFilters } from '~/services/api/payments.api'

const { hasPermission, PERMISSIONS } = usePermissions()
const { useBills, createBillMutation, createBulkBillsMutation, updateBillStatusMutation } = usePayments()

definePageMeta({
    title: 'Bills Management',
    layout: 'default'
})

const { filters } = useSavedViews('bills')

const billFilters = computed<BillFilters>(() => ({
    status: filters.value.status,
    type: filters.value.type,
    dateFrom: filters.value.date_from,
    search: filters.value.search
}))

const billsQuery = useBills(billFilters)
const bills = computed(() => billsQuery.data.value?.bills || [])

const showCreateDialog = ref(false)
const showBulkDialog = ref(false)
const showCancelDialog = ref(false)
const selectedBill = ref<Bill | null>(null)

const users = ref([
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
])

watch(filters, () => {
    billsQuery.refetch()
}, { deep: true })

const handleCreateBill = async (data: CreateBillDto) => {
    await createBillMutation.mutateAsync(data)
    showCreateDialog.value = false
    billsQuery.refetch()
}

const handleBulkBills = async (data: BulkBillsDto) => {
    await createBulkBillsMutation.mutateAsync(data)
    showBulkDialog.value = false
    billsQuery.refetch()
}

const viewBill = (bill: Bill) => {
    navigateTo(`/payments/bills/${bill.id}`)
}

const editBill = (bill: Bill) => {
    selectedBill.value = bill
    showCreateDialog.value = true
}

const cancelBill = (bill: Bill) => {
    selectedBill.value = bill
    showCancelDialog.value = true
}

const confirmCancelBill = async () => {
    if (!selectedBill.value) return
    await updateBillStatusMutation.mutateAsync({
        billId: selectedBill.value.id,
        status: 'CANCELLED' as BillStatus
    })
    showCancelDialog.value = false
    selectedBill.value = null
    billsQuery.refetch()
}

const getBillStatus = (bill: Bill) => {
    if (bill.isFullyPaid) return 'PAID'
    if (bill.isOverdue) return 'OVERDUE'
    if (bill.isDisputed) return 'DISPUTED'
    return 'PENDING'
}

const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
    }).format(num)
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

const formatBillType = (type: string) => {
    return type.split('_').map(word =>
        word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')
}
</script>
