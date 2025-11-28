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

        <Card>
            <CardHeader>
                <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <Label>Status</Label>
                        <Select @update:model-value="(value) => setFilter('status', value)">
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
                        <Select @update:model-value="(value) => setFilter('type', value)">
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
                        <Label>Date Range</Label>
                        <Input type="date"
                            @change="(e: Event) => setFilter('date_from', (e.target as HTMLInputElement).value)" />
                    </div>

                    <div>
                        <Label>Search</Label>
                        <Input type="text" placeholder="Search bills..."
                            @input="(e: Event) => setSearch((e.target as HTMLInputElement).value)" />
                    </div>
                </div>

                <div class="flex items-center justify-between mt-4">
                    <div class="text-sm text-muted-foreground">
                        Showing {{ bills.length }} of {{ billsQuery.data.value?.count || 0 }} bills
                    </div>
                    <Button variant="outline" @click="clearFilters">Clear Filters</Button>
                </div>
            </CardContent>
        </Card>

        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card v-for="i in 6" :key="i">
                <CardContent class="pt-6">
                    <Skeleton class="h-32 w-full" />
                </CardContent>
            </Card>
        </div>

        <div v-else-if="bills.length === 0" class="text-center py-12">
            <EmptyState title="No bills found" description="Create your first bill to get started"
                action-label="Create Bill" @action="showCreateDialog = true" />
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <BillCard v-for="bill in bills" :key="bill.id" :bill="bill"
                :can-edit="hasPermission(PERMISSIONS.PAYMENTS.MANAGE_BILL)"
                :can-cancel="hasPermission(PERMISSIONS.PAYMENTS.MANAGE_BILL)" @view="viewBill" @edit="editBill"
                @cancel="cancelBill" />
        </div>

        <CreateBillDialog v-model:open="showCreateDialog" :users="users" @submit="handleCreateBill" />

        <BulkBillDialog v-model:open="showBulkDialog" :users="users" @submit="handleBulkBills" />

        <ConfirmDialog v-model:open="showCancelDialog" title="Cancel Bill"
            description="Are you sure you want to cancel this bill? This action cannot be undone."
            confirm-text="Cancel Bill" @confirm="confirmCancelBill" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import Icon from '~/components/Icon.vue'
import BillCard from '~/components/payments/BillCard.vue'
import CreateBillDialog from '~/components/payments/CreateBillDialog.vue'
import BulkBillDialog from '~/components/payments/BulkBillDialog.vue'
import EmptyState from '~/components/common/EmptyState.vue'
import ConfirmDialog from '~/components/common/ConfirmDialog.vue'
import { usePayments } from '~/composables/payments/usePayments'
import { usePermissions } from '~/composables/auth/usePermissions'
import { useDataFilters } from '~/composables/useDataFilters'
import type { Bill, CreateBillDto, BulkBillsDto, BillStatus } from '~/types/payments'

const { hasPermission, PERMISSIONS } = usePermissions()
const { useBills, createBillMutation, createBulkBillsMutation, updateBillStatusMutation } = usePayments()

definePageMeta({
    title: 'Bills Management',
    layout: 'default'
})

const filterDefinitions = [
    { field: 'status', type: 'select' as const },
    { field: 'type', type: 'select' as const },
    { field: 'date_from', type: 'date' as const },
    { field: 'search', type: 'text' as const }
]

const { currentQuery, setFilter, clearFilters, setSearch } = useDataFilters(filterDefinitions, {
    persistKey: 'bills-filters'
})

const billsQuery = useBills(currentQuery)
const bills = computed(() => billsQuery.data.value?.results || [])
const isLoading = computed(() => billsQuery.isLoading.value)

const showCreateDialog = ref(false)
const showBulkDialog = ref(false)
const showCancelDialog = ref(false)
const selectedBill = ref<Bill | null>(null)

const users = ref([
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
])

const handleCreateBill = async (data: CreateBillDto) => {
    await createBillMutation.mutateAsync(data)
    showCreateDialog.value = false
}

const handleBulkBills = async (data: BulkBillsDto) => {
    await createBulkBillsMutation.mutateAsync(data)
    showBulkDialog.value = false
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
}
</script>
