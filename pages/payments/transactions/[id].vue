<template>
    <div class="space-y-6">
        <div class="flex items-center gap-4">
            <Button variant="ghost" size="sm" @click="$router.back()">
                <Icon name="arrow-left" class="w-4 h-4 mr-2" />
                Back
            </Button>
        </div>

        <div v-if="transactionQuery.isLoading.value" class="space-y-4">
            <Skeleton class="h-32 w-full" />
            <Skeleton class="h-64 w-full" />
        </div>

        <div v-else-if="transaction" class="space-y-6">
            <Card>
                <CardHeader>
                    <div class="flex items-start justify-between">
                        <div class="space-y-1">
                            <CardTitle class="text-2xl">Transaction Details</CardTitle>
                            <p class="text-sm text-muted-foreground">{{ transaction.transactionId }}</p>
                        </div>
                        <StatusBadge :status="transaction.status" />
                    </div>
                </CardHeader>
                <CardContent class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p class="text-sm text-muted-foreground">Amount</p>
                            <p class="text-3xl font-semibold" :class="getAmountClass(transaction.type)">
                                {{ getAmountPrefix(transaction.type) }}{{ formatCurrency(transaction.amount) }}
                            </p>
                        </div>
                        <div>
                            <p class="text-sm text-muted-foreground">Type</p>
                            <p class="text-lg font-medium">{{ formatTransactionType(transaction.type) }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-muted-foreground">Provider</p>
                            <p class="text-lg font-medium">{{ transaction.provider }}</p>
                        </div>
                    </div>

                    <Separator />

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p class="text-sm text-muted-foreground">Reference</p>
                            <p class="font-mono text-sm">{{ transaction.reference }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-muted-foreground">Currency</p>
                            <p class="font-medium">{{ transaction.currency }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-muted-foreground">Created At</p>
                            <p class="font-medium">{{ formatDateTime(transaction.createdAt) }}</p>
                        </div>
                        <div v-if="transaction.processedAt">
                            <p class="text-sm text-muted-foreground">Processed At</p>
                            <p class="font-medium">{{ formatDateTime(transaction.processedAt) }}</p>
                        </div>
                        <div v-if="transaction.failedAt">
                            <p class="text-sm text-muted-foreground">Failed At</p>
                            <p class="font-medium text-red-600">{{ formatDateTime(transaction.failedAt) }}</p>
                        </div>
                    </div>

                    <div v-if="transaction.description">
                        <Separator />
                        <div>
                            <p class="text-sm text-muted-foreground mb-2">Description</p>
                            <p class="text-sm">{{ transaction.description }}</p>
                        </div>
                    </div>

                    <div v-if="transaction.failureReason">
                        <Separator />
                        <Card class="border-red-200 bg-red-50">
                            <CardContent class="pt-6">
                                <div class="flex gap-3">
                                    <Icon name="alert-circle" class="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 class="font-semibold text-red-900">Transaction Failed</h4>
                                        <p class="text-sm text-red-800 mt-1">{{ transaction.failureReason }}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div v-if="transaction.failedPayments && transaction.failedPayments.length > 0">
                        <Separator />
                        <div class="space-y-4">
                            <h3 class="font-semibold">Payment Errors</h3>
                            <div v-for="error in transaction.failedPayments" :key="error.id">
                                <Card class="border-yellow-200 bg-yellow-50">
                                    <CardContent class="pt-6">
                                        <div class="flex gap-3">
                                            <Icon name="alert-triangle"
                                                class="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                                            <div class="flex-1 space-y-2">
                                                <h4 class="font-semibold text-yellow-900">{{ error.errorType }} - {{
                                                    error.severity }}</h4>
                                                <p class="text-sm text-yellow-800">{{ error.userFriendlyMessage }}</p>
                                                <p v-if="error.providerErrorMessage" class="text-xs text-yellow-700">
                                                    Provider: {{ error.providerErrorMessage }}
                                                </p>
                                                <div v-if="error.recoveryOptions.length > 0">
                                                    <p class="text-xs font-semibold text-yellow-900">Recovery Options:
                                                    </p>
                                                    <ul class="text-xs list-disc list-inside text-yellow-800">
                                                        <li v-for="option in error.recoveryOptions" :key="option">{{
                                                            option }}</li>
                                                    </ul>
                                                </div>
                                                <p class="text-xs text-yellow-700">
                                                    Retry: {{ error.retryCount }}/{{ error.maxRetries }}
                                                    <span v-if="error.canRetry" class="text-green-600 font-medium"> (Can
                                                        retry)</span>
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>

                    <div v-if="transaction.metadata && Object.keys(transaction.metadata).length > 0">
                        <Separator />
                        <div class="space-y-2">
                            <h3 class="font-semibold">Additional Information</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div v-for="(value, key) in transaction.metadata" :key="key">
                                    <p class="text-sm text-muted-foreground">{{ formatMetadataKey(key) }}</p>
                                    <p class="text-sm font-medium">{{ value }}</p>
                                </div>
                            </div>
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
import { Skeleton } from '~/components/ui/skeleton'
import { Separator } from '~/components/ui/separator'
import Icon from '~/components/Icon.vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import { usePayments } from '~/composables/payments/usePayments'
import { TransactionType } from '~/types/payments'

definePageMeta({
    title: 'Transaction Details',
    layout: 'default'
})

const route = useRoute()
const transactionId = route.params.id as string

const { useTransaction } = usePayments()

const transactionQuery = useTransaction(transactionId)
const transaction = computed(() => transactionQuery.data.value)

const getAmountClass = (type: TransactionType) => {
    if (type === TransactionType.DEPOSIT || type === TransactionType.REFUND) {
        return 'text-green-600'
    }
    if (type === TransactionType.WITHDRAWAL || type === TransactionType.BILL_PAYMENT) {
        return 'text-red-600'
    }
    return ''
}

const getAmountPrefix = (type: TransactionType) => {
    if (type === TransactionType.DEPOSIT || type === TransactionType.REFUND) {
        return '+'
    }
    if (type === TransactionType.WITHDRAWAL || type === TransactionType.BILL_PAYMENT) {
        return '-'
    }
    return ''
}

const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
    }).format(num)
}

const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const formatTransactionType = (type: string) => {
    return type.split('_').map(word =>
        word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')
}

const formatMetadataKey = (key: string) => {
    return key.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ')
}
</script>
