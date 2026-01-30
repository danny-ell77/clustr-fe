<template>
    <div class="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer"
        @click="$emit('click', transaction)">
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center"
                :class="transaction.transactionType === 'CREDIT' ? 'bg-green-100' : 'bg-red-100'">
                <Icon :name="transaction.transactionType === 'CREDIT' ? 'arrow-down-left' : 'arrow-up-right'"
                    :class="transaction.transactionType === 'CREDIT' ? 'text-green-600' : 'text-red-600'"
                    class="w-5 h-5" />
            </div>
            <div>
                <p class="font-medium">{{ transaction.description }}</p>
                <p class="text-sm text-muted-foreground">{{ formatDate(transaction.createdAt) }}</p>
            </div>
        </div>
        <div class="text-right">
            <p class="font-medium"
                :class="transaction.transactionType === 'CREDIT' ? 'text-green-600' : 'text-red-600'">
                {{ transaction.transactionType === 'CREDIT' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
            </p>
            <Badge :variant="getStatusVariant(transaction.status)">{{ transaction.statusDisplay }}</Badge>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Badge } from '~/components/ui/badge'
import Icon from '~/components/Icon.vue'
import type { Transaction } from '~/types/wallet'

interface Props {
    transaction: Transaction
}

defineProps<Props>()

defineEmits<{
    click: [transaction: Transaction]
}>()

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
    }).format(Number(amount))
}

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'COMPLETED':
            return 'default'
        case 'PENDING':
            return 'secondary'
        case 'FAILED':
            return 'destructive'
        default:
            return 'outline'
    }
}
</script>
