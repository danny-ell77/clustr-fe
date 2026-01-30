<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl">Cluster Wallet</h1>
                <p class="text-muted-foreground">Manage cluster wallet and transactions</p>
            </div>
            <div class="flex gap-2">
                <Button v-if="hasPermission(PERMISSIONS.PAYMENTS.MANAGE_WALLET)" variant="outline"
                    @click="openWalletDialog('debit')">
                    <Icon name="arrow-up" class="w-4 h-4 mr-2" />
                    Debit
                </Button>
                <Button v-if="hasPermission(PERMISSIONS.PAYMENTS.MANAGE_WALLET)" @click="openWalletDialog('credit')">
                    <Icon name="arrow-down" class="w-4 h-4 mr-2" />
                    Credit
                </Button>
            </div>
        </div>

        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card v-for="i in 4" :key="i">
                <CardContent class="pt-6">
                    <Skeleton class="h-20 w-full" />
                </CardContent>
            </Card>
        </div>

        <div v-else-if="walletData" class="space-y-6">
            <StatPane :stats="walletStats" />

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Wallet Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                                <div>
                                    <p class="text-sm text-muted-foreground">Net Balance</p>
                                    <p class="text-lg">{{ formatCurrency(walletData.analytics.netBalance) }}
                                    </p>
                                </div>
                                <Icon name="trending-up" class="w-8 h-8 text-primary" />
                            </div>
                            <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div>
                                    <p class="text-sm text-muted-foreground">Bill Payment Revenue</p>
                                    <p class="text-lg">{{
                                        formatCurrency(walletData.analytics.billPaymentRevenue) }}</p>
                                </div>
                                <Icon name="file-text" class="w-8 h-8 text-green-600" />
                            </div>
                            <div class="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                <div>
                                    <p class="text-sm text-muted-foreground">Total Transactions</p>
                                    <p class="text-lg">{{ walletData.analytics.totalTransactions }}</p>
                                </div>
                                <Icon name="activity" class="w-8 h-8 text-purple-600" />
                            </div>
                            <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                <div>
                                    <p class="text-sm text-muted-foreground">Bill Payments</p>
                                    <p class="text-lg">{{ walletData.analytics.billPaymentCount }}</p>
                                </div>
                                <Icon name="check-circle" class="w-8 h-8 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Wallet Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-4">
                            <div>
                                <p class="text-sm text-muted-foreground">Wallet Created</p>
                                <p class="text-sm font-medium">{{ walletData.analytics.walletCreatedAt ?
                                    formatDate(walletData.analytics.walletCreatedAt) : 'N/A' }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-muted-foreground">Last Transaction</p>
                                <p class="text-sm font-medium">{{ walletData.analytics.lastTransactionAt ?
                                    formatDate(walletData.analytics.lastTransactionAt) : 'No transactions yet' }}</p>
                            </div>
                            <div class="p-4 bg-muted rounded-lg">
                                <div class="flex items-center gap-2 mb-2">
                                    <Icon name="info" class="w-5 h-5 text-primary" />
                                    <p class="text-sm font-medium">Balance Breakdown</p>
                                </div>
                                <div class="space-y-2 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-muted-foreground">Current Balance:</span>
                                        <span class="font-medium">{{ formatCurrency(walletData.analytics.currentBalance)
                                        }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-muted-foreground">Pending Transactions:</span>
                                        <span class="font-medium">{{
                                            formatCurrency(parseFloat(walletData.analytics.currentBalance) -
                                                parseFloat(walletData.analytics.availableBalance)) }}</span>
                                    </div>
                                    <div class="flex justify-between border-t pt-2">
                                        <span class="text-muted-foreground">Available Balance:</span>
                                        <span class="font-medium text-green-600">{{
                                            formatCurrency(walletData.analytics.availableBalance) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <RecentTransactionsContent
                :transactions="walletData.recentTransactions"
                @view-all="navigateTo('/payments/transactions')"
                @click="viewTransaction"
            />
        </div>

        <WalletDialog v-model:open="showWalletDialog" :operation="walletOperation" :wallet="walletInfo"
            @submit="handleWalletOperation" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import Icon from '~/components/Icon.vue'
import StatPane from '~/components/common/StatPane.vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import WalletDialog from '~/components/payments/WalletDialog.vue'
import { usePayments } from '~/composables/payments/usePayments'
import { usePermissions } from '~/composables/auth/usePermissions'
import type { ClusterWalletCreditDto, ClusterWalletTransferDto } from '~/types/payments'

const { hasPermission, PERMISSIONS } = usePermissions()
const { useClusterWallet, walletCreditMutation, walletDebitMutation } = usePayments()

definePageMeta({
    title: 'Cluster Wallet',
    layout: 'default'
})

const walletQuery = useClusterWallet()
const walletData = computed(() => walletQuery.data.value)

const walletStats = computed(() => [
    { title: 'Current Balance', value: formatCurrency(walletData.value?.analytics.currentBalance), color: '#0ea5e9' },
    { title: 'Available Balance', value: formatCurrency(walletData.value?.analytics.availableBalance), color: '#10b981' },
    { title: 'Total Deposits', value: formatCurrency(walletData.value?.analytics.totalDeposits), color: '#10b981' },
    { title: 'Total Withdrawals', value: formatCurrency(walletData.value?.analytics.totalWithdrawals), color: '#ef4444' }
])
const isLoading = computed(() => walletQuery.isLoading.value)

const walletInfo = computed(() => {
    if (!walletData.value) return undefined
    return {
        balance: walletData.value.analytics.currentBalance,
        availableBalance: walletData.value.analytics.availableBalance
    }
})

const showWalletDialog = ref(false)
const walletOperation = ref<'credit' | 'debit'>('credit')

const openWalletDialog = (operation: 'credit' | 'debit') => {
    walletOperation.value = operation
    showWalletDialog.value = true
}

const handleWalletOperation = async (data: ClusterWalletCreditDto | ClusterWalletTransferDto) => {
    if (walletOperation.value === 'credit') {
        await walletCreditMutation.mutateAsync(data as ClusterWalletCreditDto)
    } else {
        await walletDebitMutation.mutateAsync(data as ClusterWalletTransferDto)
    }
    showWalletDialog.value = false
}

const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(num)) return '₦0.00'
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(num)
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
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

const getTransactionBg = (type: string) => {
    const colors: Record<string, string> = {
        DEPOSIT: 'bg-green-100',
        WITHDRAWAL: 'bg-red-100',
        BILL_PAYMENT: 'bg-primary/15',
        TRANSFER: 'bg-purple-100',
        REFUND: 'bg-yellow-100'
    }
    return colors[type] || 'bg-gray-100'
}

const getTransactionColor = (type: string) => {
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
