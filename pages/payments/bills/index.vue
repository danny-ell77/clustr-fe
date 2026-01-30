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
                <BillsFilterForm :model-value="filters" @update:model-value="applyFilters" />
            </template>

            <template #modal-filters="{ filters: modalFilters, setFilter }">
                <BillsFilterForm :model-value="modalFilters" @update:model-value="(filters) => {
                    Object.entries(filters).forEach(([key, value]) => setFilter(key, value))
                }" />
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
                <BillsTableContent 
                    :data="data" 
                    :is-loading="isLoading"
                    :can-manage="hasPermission(PERMISSIONS.PAYMENTS.MANAGE_BILL)"
                    @view="viewBill"
                    @edit="editBill"
                    @cancel="cancelBill"
                    @create="showCreateDialog = true"
                />
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
import { computed, ref, watch } from 'vue'
import Icon from '~/components/Icon.vue'
import ConfirmDialog from '~/components/common/ConfirmDialog.vue'
import SectionGrid from '~/components/common/SectionGrid.vue'
import UnifiedView from '~/components/common/UnifiedView.vue'
import BillCard from '~/components/payments/BillCard.vue'
import BulkBillDialog from '~/components/payments/BulkBillDialog.vue'
import CreateBillDialog from '~/components/payments/CreateBillDialog.vue'
import { Button } from '~/components/ui/button'
import { usePermissions } from '~/composables/auth/usePermissions'
import { usePayments } from '~/composables/payments/usePayments'
import { useSavedViews } from '~/composables/useSavedViews'
import type { BillFilters } from '~/services/api/payments.api'
import type { Bill, BillStatus, BulkBillsDto, CreateBillDto } from '~/types/payments'

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
