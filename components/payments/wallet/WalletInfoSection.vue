<template>
    <Card>
        <CardHeader>
            <CardTitle>Wallet Information</CardTitle>
        </CardHeader>
        <CardContent>
            <div class="space-y-4">
                <div>
                    <p class="text-sm text-muted-foreground">Wallet Created</p>
                    <p class="text-sm font-medium">{{ walletCreatedAt ? formatDate(walletCreatedAt) : 'N/A' }}</p>
                </div>
                <div>
                    <p class="text-sm text-muted-foreground">Last Transaction</p>
                    <p class="text-sm font-medium">{{ lastTransactionAt ? formatDate(lastTransactionAt) : 'No transactions yet' }}</p>
                </div>
                <div class="p-4 bg-muted rounded-lg">
                    <div class="flex items-center gap-2 mb-2">
                        <Icon name="info" class="w-5 h-5 text-primary" />
                        <p class="text-sm font-medium">Balance Breakdown</p>
                    </div>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">Current Balance:</span>
                            <span class="font-medium">{{ formatCurrency(currentBalance) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">Pending Transactions:</span>
                            <span class="font-medium">{{ formatCurrency(pendingAmount) }}</span>
                        </div>
                        <div class="flex justify-between border-t pt-2">
                            <span class="text-muted-foreground">Available Balance:</span>
                            <span class="font-medium text-green-600">{{ formatCurrency(availableBalance) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import Icon from '~/components/Icon.vue'

interface Props {
    walletCreatedAt?: string | null
    lastTransactionAt?: string | null
    currentBalance: string | number
    availableBalance: string | number
}

const props = defineProps<Props>()

const pendingAmount = computed(() => {
    return parseFloat(String(props.currentBalance)) - parseFloat(String(props.availableBalance))
})

const formatDate = (dateString: string) =>{
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
    }).format(Number(amount))
}
</script>
