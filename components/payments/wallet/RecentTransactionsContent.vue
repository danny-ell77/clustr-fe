<template>
    <Card>
        <CardHeader>
            <div class="flex items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <Button variant="outline" size="sm" @click="$emit('view-all')">
                    View All
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <div v-if="transactions.length === 0" class="text-center py-8 text-muted-foreground">
                No recent transactions
            </div>
            <div v-else class="divide-y">
                <TransactionListItem
                    v-for="transaction in transactions"
                    :key="transaction.id"
                    :transaction="transaction"
                    @click="$emit('click', transaction)"
                />
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import TransactionListItem from '~/components/payments/wallet/TransactionListItem.vue'
import type { Transaction } from '~/types/payments'

interface Props {
    transactions: Transaction[]
}

defineProps<Props>()

defineEmits<{
   'view-all': []
    click: [transaction: Transaction]
}>()
</script>
