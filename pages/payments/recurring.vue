<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl">Recurring Payments</h1>
                <p class="text-muted-foreground">Manage automatic payment schedules</p>
            </div>
            <Button v-if="hasPermission(PERMISSIONS.PAYMENTS.MANAGE_WALLET)" @click="showCreateDialog = true">
                <Icon name="plus" class="w-4 h-4 mr-2" />
                Create Schedule
            </Button>
        </div>

        <StatPane :stats="recurringStats" />

        <Card>
            <CardHeader>
                <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label>Status</Label>
                        <Select @update:model-value="(value) => setFilter('status', value)">
                            <SelectTrigger>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Statuses</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="PAUSED">Paused</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                <SelectItem value="EXPIRED">Expired</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Frequency</Label>
                        <Select @update:model-value="(value) => setFilter('frequency', value)">
                            <SelectTrigger>
                                <SelectValue placeholder="All Frequencies" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Frequencies</SelectItem>
                                <SelectItem value="DAILY">Daily</SelectItem>
                                <SelectItem value="WEEKLY">Weekly</SelectItem>
                                <SelectItem value="MONTHLY">Monthly</SelectItem>
                                <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                                <SelectItem value="YEARLY">Yearly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="flex items-end">
                        <Button variant="outline" @click="clearFilters">Clear Filters</Button>
                    </div>
                </div>
            </CardContent>
        </Card>

        <RecurringPaymentsListContent
            :payments="recurringPayments"
            :is-loading="isLoading"
            :can-manage="true"
            @click="viewPayment"
            @pause="pausePayment"
            @resume="resumePayment"
            @edit="editPayment"
            @cancel="cancelPayment"
            @create="showCreateDialog = true"
        />
        <RecurringPaymentDialog v-model:open="showCreateDialog" :payment="selectedPayment" :wallets="wallets"
            :bills="bills" @submit="handleSubmit" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import Icon from '~/components/Icon.vue'
import StatPane from '~/components/common/StatPane.vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import EmptyState from '~/components/common/EmptyState.vue'
import RecurringPaymentDialog from '~/components/payments/RecurringPaymentDialog.vue'
import { usePayments } from '~/composables/payments/usePayments'
import { usePermissions } from '~/composables/auth/usePermissions'
import { useDataFilters } from '~/composables/useDataFilters'
import type { RecurringPayment, CreateRecurringPaymentDto } from '~/types/payments'

const { hasPermission, PERMISSIONS } = usePermissions()
const { useRecurringPayments, createRecurringMutation, updateRecurringMutation, pauseRecurringMutation, resumeRecurringMutation, cancelRecurringMutation } = usePayments()

definePageMeta({
    title: 'Recurring Payments',
    layout: 'default'
})

const filterDefinitions = [
    { field: 'status', type: 'select' as const, label: 'Status' },
    { field: 'frequency', type: 'select' as const, label: 'Frequency' }
]

const { currentQuery, setFilter, clearFilters } = useDataFilters(filterDefinitions, {
    persistKey: 'recurring-payments-filters'
})

const recurringQuery = useRecurringPayments(ref({}))
const recurringPayments = computed(() => recurringQuery.data.value?.recurringPayments || [])
const isLoading = computed(() => recurringQuery.isLoading.value)

const summary = ref({
    activePayments: 0,
    pausedPayments: 0,
    activeMonthlyAmount: '0'
})

const recurringStats = computed(() => [
    { title: 'Active Schedules', value: summary.value?.activePayments || 0, color: '#10b981' },
    { title: 'Paused Schedules', value: summary.value?.pausedPayments || 0, color: '#eab308' },
    { title: 'Monthly Amount', value: formatCurrency(summary.value?.activeMonthlyAmount || '0'), color: '#0ea5e9' }
])

const showCreateDialog = ref(false)
const selectedPayment = ref<RecurringPayment | undefined>()

const wallets = ref([])
const bills = ref([])

const handleSubmit = async (data: CreateRecurringPaymentDto) => {
    if (selectedPayment.value) {
        await updateRecurringMutation.mutateAsync({ paymentId: selectedPayment.value.id, ...data })
    } else {
        await createRecurringMutation.mutateAsync(data)
    }
    showCreateDialog.value = false
    selectedPayment.value = undefined
}

const editPayment = (payment: RecurringPayment) => {
    selectedPayment.value = payment
    showCreateDialog.value = true
}

const viewPayment = (payment: RecurringPayment) => {
    editPayment(payment)
}

const pausePayment = async (paymentId: string) => {
    await pauseRecurringMutation.mutateAsync(paymentId)
}

const resumePayment = async (paymentId: string) => {
    await resumeRecurringMutation.mutateAsync(paymentId)
}

const cancelPayment = async (paymentId: string) => {
    if (!confirm('Are you sure you want to cancel this recurring payment?')) return
    await cancelRecurringMutation.mutateAsync(paymentId)
}

const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(num)
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatFrequency = (frequency: string) => {
    return frequency.charAt(0) + frequency.slice(1).toLowerCase()
}
</script>
