<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl">Transaction History</h1>
                <p class="text-muted-foreground">View all payment transactions</p>
            </div>
            <Button variant="outline" @click="exportTransactions">
                <Icon name="download" class="w-4 h-4 mr-2" />
                Export
            </Button>
        </div>

        <UnifiedView page-key="transactions" :data="transactions" :is-loading="transactionsQuery.isLoading.value"
            :available-views="['table']">
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
                                <SelectItem value="PROCESSING">Processing</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="FAILED">Failed</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Transaction Type</Label>
                        <Select :model-value="filters.type || 'All'"
                            @update:model-value="(value) => applyFilters({ type: value === 'All' ? undefined : value })">
                            <SelectTrigger>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Types</SelectItem>
                                <SelectItem value="DEPOSIT">Deposit</SelectItem>
                                <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
                                <SelectItem value="BILL_PAYMENT">Bill Payment</SelectItem>
                                <SelectItem value="TRANSFER">Transfer</SelectItem>
                                <SelectItem value="REFUND">Refund</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Date From</Label>
                        <Input type="date" :model-value="filters.date_from || ''"
                            @change="(e: Event) => applyFilters({ date_from: (e.target as HTMLInputElement).value })" />
                    </div>

                    <div>
                        <Label>Date To</Label>
                        <Input type="date" :model-value="filters.date_to || ''"
                            @change="(e: Event) => applyFilters({ date_to: (e.target as HTMLInputElement).value })" />
                    </div>

                    <div>
                        <Label>Search</Label>
                        <Input type="text" placeholder="Search transactions..." :model-value="filters.search || ''"
                            @input="(e: Event) => applyFilters({ search: (e.target as HTMLInputElement).value })" />
                    </div>
                </div>
            </template>

            <template #modal-filters="{ filters, setFilter }">
                <div class="space-y-3">
                    <div>
                        <Label>Status</Label>
                        <Select :model-value="filters.status || 'All'"
                            @update:model-value="(value) => setFilter('status', value === 'All' ? undefined : value)">
                            <SelectTrigger>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Statuses</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="PROCESSING">Processing</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="FAILED">Failed</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Transaction Type</Label>
                        <Select :model-value="filters.type || 'All'"
                            @update:model-value="(value) => setFilter('type', value === 'All' ? undefined : value)">
                            <SelectTrigger>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Types</SelectItem>
                                <SelectItem value="DEPOSIT">Deposit</SelectItem>
                                <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
                                <SelectItem value="BILL_PAYMENT">Bill Payment</SelectItem>
                                <SelectItem value="TRANSFER">Transfer</SelectItem>
                                <SelectItem value="REFUND">Refund</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Date From</Label>
                        <Input type="date" :model-value="filters.date_from || ''"
                            @change="(e: Event) => setFilter('date_from', (e.target as HTMLInputElement).value)" />
                    </div>

                    <div>
                        <Label>Date To</Label>
                        <Input type="date" :model-value="filters.date_to || ''"
                            @change="(e: Event) => setFilter('date_to', (e.target as HTMLInputElement).value)" />
                    </div>

                    <div>
                        <Label>Search</Label>
                        <Input type="text" placeholder="Search transactions..." :model-value="filters.search || ''"
                            @input="(e: Event) => setFilter('search', (e.target as HTMLInputElement).value)" />
                    </div>
                </div>
            </template>

            <template #table="{ data, isLoading }">
                <Card>
                    <CardContent class="p-0">
                        <div v-if="isLoading" class="p-6 space-y-4">
                            <Skeleton v-for="i in 5" :key="i" class="h-16 w-full" />
                        </div>

                        <div v-else-if="data.length === 0" class="text-center py-12">
                            <EmptyState title="No transactions found"
                                description="No transactions match your filters" />
                        </div>

                        <div v-else class="divide-y">
                            <div v-for="transaction in data" :key="transaction.id"
                                class="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                                @click="viewTransaction(transaction)">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-4 flex-1">
                                        <div :class="[
                                            'w-12 h-12 rounded-full flex items-center justify-center',
                                            getTransactionIconBg(transaction.type)
                                        ]">
                                            <Icon :name="getTransactionIcon(transaction.type)"
                                                :class="`w-6 h-6 ${getTransactionIconColor(transaction.type)}`" />
                                        </div>
                                        <div class="flex-1">
                                            <div class="flex items-center gap-2">
                                                <p class="font-medium">{{ transaction.description }}</p>
                                                <StatusBadge :status="transaction.status" />
                                            </div>
                                            <div class="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                                <span>{{ transaction.transactionId }}</span>
                                                <span>•</span>
                                                <span>{{ formatTransactionType(transaction.type) }}</span>
                                                <span>•</span>
                                                <span>{{ formatDate(transaction.createdAt) }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <p :class="['text-lg', getAmountColor(transaction.type)]">
                                            {{ getAmountPrefix(transaction.type) }}{{ formatCurrency(transaction.amount)
                                            }}
                                        </p>
                                        <p class="text-sm text-muted-foreground">{{ transaction.provider }}</p>
                                    </div>
                                </div>

                                <div v-if="transaction.failedPayments && transaction.failedPayments.length > 0"
                                    class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <div class="flex items-start gap-2">
                                        <Icon name="alert-circle" class="w-5 h-5 text-red-600 mt-0.5" />
                                        <div class="flex-1">
                                            <p class="text-sm font-medium text-red-900">Payment Failed</p>
                                            <p class="text-xs text-red-700">{{
                                                transaction.failedPayments[0].userFriendlyMessage
                                            }}</p>
                                            <Button v-if="transaction.failedPayments[0].canRetry" variant="outline"
                                                size="sm" class="mt-2"
                                                @click.stop="retryPayment(transaction.failedPayments[0].id)">
                                                Retry Payment
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </template>
        </UnifiedView>
    </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import Icon from '~/components/Icon.vue'
import UnifiedView from '~/components/common/UnifiedView.vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import EmptyState from '~/components/common/EmptyState.vue'
import { usePayments } from '~/composables/payments/usePayments'
import { useSavedViews } from '~/composables/useSavedViews'
import type { Transaction } from '~/types/payments'

const { useTransactions, retryFailedPaymentMutation } = usePayments()

definePageMeta({
    title: 'Transaction History',
    layout: 'default'
})

const { filters } = useSavedViews('transactions')

const transactionsQuery = useTransactions(filters)
const transactions = computed(() => transactionsQuery.data.value?.transactions || [])

watch(filters, () => {
    transactionsQuery.refetch()
}, { deep: true })

const viewTransaction = (transaction: Transaction) => {
    navigateTo(`/payments/transactions/${transaction.id}`)
}

const retryPayment = async (errorId: string) => {
    await retryFailedPaymentMutation.mutateAsync(errorId)
    transactionsQuery.refetch()
}

const exportTransactions = () => {
    console.log('Export transactions')
}

const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(num)
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const formatTransactionType = (type: string) => {
    return type.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')
}

const getTransactionIcon = (type: string) => {
    const icons: Record<string, string> = {
        DEPOSIT: 'arrow-down-circle',
        WITHDRAWAL: 'arrow-up-circle',
        BILL_PAYMENT: 'file-text',
        TRANSFER: 'arrow-right-circle',
        REFUND: 'rotate-ccw'
    }
    return icons[type] || 'activity'
}

const getTransactionIconBg = (type: string) => {
    const colors: Record<string, string> = {
        DEPOSIT: 'bg-green-100',
        WITHDRAWAL: 'bg-red-100',
        BILL_PAYMENT: 'bg-primary/15',
        TRANSFER: 'bg-purple-100',
        REFUND: 'bg-yellow-100'
    }
    return colors[type] || 'bg-gray-100'
}

const getTransactionIconColor = (type: string) => {
    const colors: Record<string, string> = {
        DEPOSIT: 'text-green-600',
        WITHDRAWAL: 'text-red-600',
        BILL_PAYMENT: 'text-primary',
        TRANSFER: 'text-purple-600',
        REFUND: 'text-yellow-600'
    }
    return colors[type] || 'text-gray-600'
}

const getAmountColor = (type: string) => {
    return type === 'DEPOSIT' || type === 'REFUND' ? 'text-green-600' : 'text-red-600'
}

const getAmountPrefix = (type: string) => {
    return type === 'DEPOSIT' || type === 'REFUND' ? '+' : '-'
}
</script>
