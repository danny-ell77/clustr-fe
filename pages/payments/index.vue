<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl">Payment Management</h1>
                <p class="text-muted-foreground">Overview of bills, transactions, and wallet</p>
            </div>
            <div class="flex gap-2">
                <Button v-if="hasPermission(PERMISSIONS.PAYMENTS.MANAGE_BILL)" variant="outline"
                    @click="navigateTo('/payments/bills')">
                    <Icon name="file-text" class="w-4 h-4 mr-2" />
                    Manage Bills
                </Button>
                <Button v-if="hasPermission(PERMISSIONS.PAYMENTS.MANAGE_WALLET)"
                    @click="navigateTo('/payments/wallet')">
                    <Icon name="wallet" class="w-4 h-4 mr-2" />
                    Cluster Wallet
                </Button>
            </div>
        </div>

        <PaymentDashboard :dashboard="dashboardData" :is-loading="isLoading" />

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <div class="flex items-center justify-between">
                        <CardTitle>Quick Actions</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div class="grid grid-cols-2 gap-3">
                        <Button v-if="hasPermission(PERMISSIONS.PAYMENTS.MANAGE_BILL)" variant="outline"
                            class="h-20 flex-col" @click="navigateTo('/payments/bills?action=create')">
                            <Icon name="plus-circle" class="w-6 h-6 mb-2" />
                            <span class="text-sm">Create Bill</span>
                        </Button>
                        <Button v-if="hasPermission(PERMISSIONS.PAYMENTS.MANAGE_BILL)" variant="outline"
                            class="h-20 flex-col" @click="navigateTo('/payments/bills?action=bulk')">
                            <Icon name="layers" class="w-6 h-6 mb-2" />
                            <span class="text-sm">Bulk Bills</span>
                        </Button>
                        <Button v-if="hasPermission(PERMISSIONS.PAYMENTS.VIEW_TRANSACTIONS)" variant="outline"
                            class="h-20 flex-col" @click="navigateTo('/payments/transactions')">
                            <Icon name="activity" class="w-6 h-6 mb-2" />
                            <span class="text-sm">Transactions</span>
                        </Button>
                        <Button v-if="hasPermission(PERMISSIONS.PAYMENTS.MANAGE_WALLET)" variant="outline"
                            class="h-20 flex-col" @click="navigateTo('/payments/recurring')">
                            <Icon name="repeat" class="w-6 h-6 mb-2" />
                            <span class="text-sm">Recurring</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payment Insights</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 bg-primary/15 rounded-full flex items-center justify-center">
                                    <Icon name="trending-up" class="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p class="text-sm font-medium">Revenue Growth</p>
                                    <p class="text-xs text-muted-foreground">Compared to last period</p>
                                </div>
                            </div>
                            <span class="text-lg text-primary">+12%</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <Icon name="check-circle" class="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p class="text-sm font-medium">Payment Success Rate</p>
                                    <p class="text-xs text-muted-foreground">Last 30 days</p>
                                </div>
                            </div>
                            <span class="text-lg text-green-600">98%</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <Icon name="clock" class="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p class="text-sm font-medium">Pending Bills</p>
                                    <p class="text-xs text-muted-foreground">Awaiting payment</p>
                                </div>
                            </div>
                            <span class="text-lg text-yellow-600">{{ dashboardData?.statistics.totalBills || 0
                            }}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import Icon from '~/components/Icon.vue'
import PaymentDashboard from '~/components/payments/PaymentDashboard.vue'
import { usePayments } from '~/composables/payments/usePayments'
import { usePermissions } from '~/composables/auth/usePermissions'

const { hasPermission, PERMISSIONS } = usePermissions()
const { usePaymentDashboard } = usePayments()

definePageMeta({
    title: 'Payment Management',
    layout: 'default'
})

const dashboardQuery = usePaymentDashboard()
const dashboardData = computed(() => dashboardQuery.data.value)
const isLoading = computed(() => dashboardQuery.isLoading.value)
</script>
