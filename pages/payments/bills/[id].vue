<template>
    <div class="space-y-6">
        <div class="flex items-center gap-4">
            <Button variant="ghost" size="sm" @click="$router.back()">
                <Icon name="arrow-left" class="w-4 h-4 mr-2" />
                Back
            </Button>
        </div>

        <div v-if="billQuery.isLoading.value" class="space-y-4">
            <Skeleton class="h-32 w-full" />
            <Skeleton class="h-64 w-full" />
        </div>

        <div v-else-if="bill" class="space-y-6">
            <Card>
                <CardHeader>
                    <div class="flex items-start justify-between">
                        <div class="space-y-1">
                            <CardTitle class="text-2xl">{{ bill.title }}</CardTitle>
                            <p class="text-sm text-muted-foreground">{{ bill.billNumber }}</p>
                        </div>
                        <StatusBadge :status="billStatus" />
                    </div>
                </CardHeader>
                <CardContent class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p class="text-sm text-muted-foreground">Amount</p>
                            <p class="text-2xl font-semibold">{{ formatCurrency(bill.amount) }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-muted-foreground">Paid Amount</p>
                            <p class="text-2xl font-semibold">{{ formatCurrency(bill.paidAmount) }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-muted-foreground">Remaining</p>
                            <p class="text-2xl font-semibold" :class="{ 'text-red-600': bill.isOverdue }">
                                {{ formatCurrency(bill.remainingAmount) }}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p class="text-sm text-muted-foreground">Bill Type</p>
                            <p class="font-medium">{{ formatBillType(bill.type) }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-muted-foreground">Due Date</p>
                            <p class="font-medium" :class="{ 'text-red-600': bill.isOverdue }">
                                {{ formatDate(bill.dueDate) }}
                            </p>
                        </div>
                        <div v-if="bill.category">
                            <p class="text-sm text-muted-foreground">Category</p>
                            <p class="font-medium">{{ bill.category }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-muted-foreground">Status</p>
                            <p class="font-medium">
                                {{ bill.isFullyPaid ? 'Fully Paid' : bill.isOverdue ? 'Overdue' : 'Pending' }}
                            </p>
                        </div>
                        <div v-if="bill.isClusterWide">
                            <p class="text-sm text-muted-foreground">Scope</p>
                            <p class="font-medium text-primary">Cluster-wide</p>
                        </div>
                        <div v-if="bill.paidAt">
                            <p class="text-sm text-muted-foreground">Paid At</p>
                            <p class="font-medium">{{ formatDateTime(bill.paidAt) }}</p>
                        </div>
                    </div>

                    <div v-if="bill.description">
                        <Separator />
                        <div>
                            <p class="text-sm text-muted-foreground mb-2">Description</p>
                            <p class="text-sm">{{ bill.description }}</p>
                        </div>
                    </div>

                    <Separator />

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p class="text-sm text-muted-foreground">Acknowledgments</p>
                            <p class="font-medium">{{ bill.acknowledgmentCount }} users</p>
                        </div>
                        <div v-if="bill.isDisputed">
                            <p class="text-sm text-muted-foreground">Disputes</p>
                            <p class="font-medium text-yellow-600">{{ bill.disputeCount }} active</p>
                        </div>
                        <div>
                            <p class="text-sm text-muted-foreground">Created</p>
                            <p class="font-medium">{{ formatDateTime(bill.createdAt) }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-muted-foreground">Last Modified</p>
                            <p class="font-medium">{{ formatDateTime(bill.lastModifiedAt) }}</p>
                        </div>
                    </div>

                    <div v-if="!bill.isFullyPaid" class="flex gap-2 pt-4">
                        <Button v-if="!isAcknowledged" @click="acknowledgeBill">
                            Acknowledge Bill
                        </Button>
                        <Button v-if="isAcknowledged && !bill.isDisputed" @click="showPaymentDialog = true">
                            Pay Bill
                        </Button>
                        <Button v-if="isAcknowledged" variant="outline" @click="showDisputeDialog = true">
                            Dispute Bill
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>

        <ConfirmDialog v-model:open="showPaymentDialog" title="Pay Bill"
            :description="`Pay ${formatCurrency(bill?.remainingAmount || '0')} for ${bill?.title}?`"
            confirm-text="Pay Now" @confirm="payBill" />

        <Dialog v-model:open="showDisputeDialog">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Dispute Bill</DialogTitle>
                    <DialogDescription>Provide a reason for disputing this bill</DialogDescription>
                </DialogHeader>
                <div class="space-y-4">
                    <div>
                        <Label>Reason</Label>
                        <Textarea v-model="disputeReason" placeholder="Enter dispute reason..." rows="4" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="showDisputeDialog = false">Cancel</Button>
                    <Button @click="disputeBill">Submit Dispute</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { Separator } from '~/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import Icon from '~/components/Icon.vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import ConfirmDialog from '~/components/common/ConfirmDialog.vue'
import { usePayments } from '~/composables/payments/usePayments'
import type { Bill } from '~/types/payments'

definePageMeta({
    title: 'Bill Details',
    layout: 'default'
})

const route = useRoute()
const router = useRouter()
const billId = route.params.id as string

const { useBill, acknowledgeBillMutation, disputeBillMutation, payBillMutation } = usePayments()

const billQuery = useBill(billId)
const bill = computed(() => billQuery.data.value)

const showPaymentDialog = ref(false)
const showDisputeDialog = ref(false)
const disputeReason = ref('')

const billStatus = computed(() => {
    if (!bill.value) return 'PENDING'
    if (bill.value.isFullyPaid) return 'PAID'
    if (bill.value.isOverdue) return 'OVERDUE'
    if (bill.value.isDisputed) return 'DISPUTED'
    return 'PENDING'
})

const isAcknowledged = computed(() => {
    return bill.value?.acknowledgedBy?.length > 0
})

const acknowledgeBill = async () => {
    if (!bill.value) return
    await acknowledgeBillMutation.mutateAsync({ billId: bill.value.id })
    billQuery.refetch()
}

const payBill = async () => {
    if (!bill.value) return
    await payBillMutation.mutateAsync({ billId: bill.value.id })
    showPaymentDialog.value = false
    billQuery.refetch()
}

const disputeBill = async () => {
    if (!bill.value || !disputeReason.value) return
    await disputeBillMutation.mutateAsync({
        billId: bill.value.id,
        reason: disputeReason.value
    })
    showDisputeDialog.value = false
    disputeReason.value = ''
    billQuery.refetch()
}

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

const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const formatBillType = (type: string) => {
    return type.split('_').map(word =>
        word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')
}
</script>
