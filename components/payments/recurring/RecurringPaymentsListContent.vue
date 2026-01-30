<template>
    <div v-if="isLoading" class="space-y-4">
        <Card v-for="i in 3" :key="i">
            <CardContent class="pt-6">
                <Skeleton class="h-24 w-full" />
            </CardContent>
        </Card>
    </div>

    <div v-else-if="payments.length === 0" class="text-center py-12">
        <EmptyState 
            title="No recurring payments" 
            description="Create your first recurring payment schedule"
            action-label="Create Schedule" 
            @action="$emit('create')" 
        />
    </div>

    <div v-else class="space-y-4">
        <RecurringPaymentCard
            v-for="payment in payments"
            :key="payment.id"
            :payment="payment"
            :can-manage="canManage"
            @click="$emit('click', payment)"
            @pause="$emit('pause', $event)"
            @resume="$emit('resume', $event)"
            @edit="$emit('edit', $event)"
            @cancel="$emit('cancel', $event)"
        />
    </div>
</template>

<script setup lang="ts">
import { Card, CardContent } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import EmptyState from '~/components/common/EmptyState.vue'
import RecurringPaymentCard from '~/components/payments/recurring/RecurringPaymentCard.vue'
import type { RecurringPayment } from '~/types/payments'

interface Props {
    payments: RecurringPayment[]
    isLoading: boolean
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
    create: []
}>()
</script>
