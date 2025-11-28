<template>
  <div class="space-y-6">
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card v-for="i in 4" :key="i">
        <CardContent class="pt-6">
          <Skeleton class="h-20 w-full" />
        </CardContent>
      </Card>
    </div>

    <div v-else-if="dashboard" class="space-y-6">
      <StatPane :stats="paymentStats" />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Last {{ dashboard.clusterRevenue.periodDays }} days</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Bill Payments</span>
                <span class="text-sm font-medium">{{ dashboard.clusterRevenue.billPaymentCount }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Total Transactions</span>
                <span class="text-sm font-medium">{{ dashboard.clusterRevenue.transactionsCount }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Current Balance</span>
                <span class="text-sm font-medium">{{ formatCurrency(dashboard.clusterRevenue.currentBalance) }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>Payment system statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Total Wallets</span>
                <span class="text-sm font-medium">{{ dashboard.statistics.totalWallets }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Total Bills</span>
                <span class="text-sm font-medium">{{ dashboard.statistics.totalBills }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Recurring Payments</span>
                <span class="text-sm font-medium">{{ dashboard.statistics.totalRecurringPayments }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Transaction Volume</span>
                <span class="text-sm font-medium">{{ formatCurrency(dashboard.statistics.totalTransactionVolume)
                }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest payment activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="dashboard.recentTransactions.length === 0" class="text-center py-8 text-muted-foreground">
              No recent transactions
            </div>
            <div v-else class="space-y-3">
              <div v-for="transaction in dashboard.recentTransactions.slice(0, 5)" :key="transaction.id"
                class="flex items-center justify-between py-2 border-b last:border-0">
                <div class="flex-1">
                  <p class="text-sm font-medium">{{ transaction.description }}</p>
                  <p class="text-xs text-muted-foreground">{{ formatDate(transaction.createdAt) }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium">{{ formatCurrency(transaction.amount) }}</p>
                  <StatusBadge :status="transaction.status" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Bills</CardTitle>
            <CardDescription>Latest bills created</CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="dashboard.recentBills.length === 0" class="text-center py-8 text-muted-foreground">
              No recent bills
            </div>
            <div v-else class="space-y-3">
              <div v-for="bill in dashboard.recentBills.slice(0, 5)" :key="bill.id"
                class="flex items-center justify-between py-2 border-b last:border-0">
                <div class="flex-1">
                  <p class="text-sm font-medium">{{ bill.title }}</p>
                  <p class="text-xs text-muted-foreground">Due: {{ formatDate(bill.dueDate) }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium">{{ formatCurrency(bill.amount) }}</p>
                  <StatusBadge :status="bill.isOverdue ? 'OVERDUE' : bill.isFullyPaid ? 'PAID' : 'PENDING'" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-muted-foreground">Failed to load dashboard data</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import StatPane from '~/components/common/StatPane.vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import type { PaymentDashboard } from '~/types/payments'

interface Props {
  dashboard?: PaymentDashboard
  isLoading?: boolean
}

const props = defineProps<Props>()

const paymentStats = computed(() => [
  { title: 'Total Revenue', value: formatCurrency(props.dashboard?.clusterRevenue.totalRevenue), color: '#10b981' },
  { title: 'Wallet Balance', value: formatCurrency(props.dashboard?.clusterWallet.balance), color: '#0ea5e9' },
  { title: 'Pending Bills', value: formatCurrency(props.dashboard?.statistics.totalPendingBillsAmount), color: '#eab308' },
  { title: 'Total Transactions', value: props.dashboard?.statistics.totalTransactions, color: '#a855f7' }
])

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
</script>
