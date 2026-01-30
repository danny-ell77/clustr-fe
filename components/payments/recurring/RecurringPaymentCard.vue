<template>
    <Card class="hover:shadow-md transition-shadow cursor-pointer" @click="$emit('click', payment)">
        <CardContent class="pt-6">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="flex items-center gap-2">
                        <h3 class="font-semibold text-lg">{{ payment.title }}</h3>
                        <StatusBadge :status="payment.status" />
                    </div>
                    <p v-if="payment.description" class="text-sm text-muted-foreground mt-1">{{ payment.description }}</p>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                            <p class="text-xs text-muted-foreground">Amount</p>
                            <p class="text-sm font-medium">{{ formatCurrency(payment.amount) }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-muted-foreground">Frequency</p>
                            <p class="text-sm font-medium">{{ formatFrequency(payment.frequency) }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-muted-foreground">Next Payment</p>
                            <p class="text-sm font-medium">{{ payment.nextPaymentDate ? formatDate(payment.nextPaymentDate) : 'N/A' }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-muted-foreground">Total Payments</p>
                            <p class="text-sm font-medium">{{ payment.totalPayments }}</p>
                        </div>
                    </div>

                    <div v-if="payment.failedAttempts > 0" class="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div class="flex items-center gap-2">
                            <Icon name="alert-triangle" class="w-4 h-4 text-yellow-600" />
                            <p class="text-sm text-yellow-900">{{ payment.failedAttempts }} failed attempt(s)</p>
                        </div>
                    </div>
                </div>

                <div class="flex gap-2 ml-4" @click.stop>
                    <Button v-if="payment.status === 'ACTIVE' && canManage" variant="outline" size="sm"
                        @click="$emit('pause', payment.id)">
                        <Icon name="pause" class="w-4 h-4" />
                    </Button>
                    <Button v-if="payment.status === 'PAUSED' && canManage" variant="outline" size="sm"
                        @click="$emit('resume', payment.id)">
                        <Icon name="play" class="w-4 h-4" />
                    </Button>
                    <Button v-if="canManage" variant="outline" size="sm" @click="$emit('edit', payment)">
                        <Icon name="edit-2" class="w-4 h-4" />
                    </Button>
                    <Button v-if="canManage" variant="destructive" size="sm" @click="$emit('cancel', payment.id)">
                        <Icon name="x" class="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import Icon from '~/components/Icon.vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import type { RecurringPayment } from '~/types/payments'

interface Props {
    payment: RecurringPayment
    canManage?: boolean
}

withDefaults(defineProps<Props>(), {
    canManage: false
})

defineEmits<{
    click: [payment: RecurringPayment]
    pause: [id: string]
    resume: [id: string]
    edit: [payment: RecurringPayment]
    cancel: [id: string]
}>()

const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
    }).format(Number(amount))
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

const formatFrequency = (frequency: string) => {
    return frequency.charAt(0) + frequency.slice(1).toLowerCase()
}
</script>
