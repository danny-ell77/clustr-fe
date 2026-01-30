<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent class="max-w-lg">
            <DialogHeader>
                <DialogTitle>{{ operation === 'credit' ? 'Credit Wallet' : 'Debit Wallet' }}</DialogTitle>
                <DialogDescription>{{ operation === 'credit' ? 'Add funds to cluster wallet' : 'Withdraw funds from cluster wallet' }}</DialogDescription>
            </DialogHeader>

            <DialogBody>
                <div class="space-y-4">
                    <div v-if="wallet" class="p-4 bg-muted rounded-lg">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-muted-foreground">Current Balance</p>
                                <p class="text-2xl">{{ formatCurrency(wallet.balance) }}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-sm text-muted-foreground">Available</p>
                                <p class="text-lg font-semibold">{{ formatCurrency(wallet.availableBalance) }}</p>
                            </div>
                        </div>
                    </div>

                    <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div>
                        <Label for="amount">Amount (NGN) *</Label>
                        <Input id="amount" v-model="formData.amount" type="number" step="0.01" min="0.01"
                            placeholder="0.00" required autofocus />
                        <p v-if="operation === 'debit' && wallet" class="text-xs text-muted-foreground mt-1">Maximum: {{
                            formatCurrency(wallet.availableBalance) }}</p>
                    </div>

                    <div>
                        <Label for="description">Description *</Label>
                        <Textarea id="description" v-model="formData.description"
                            placeholder="Reason for this transaction" rows="3" required />
                    </div>

                    <div v-if="operation === 'credit'">
                        <Label for="source">Payment Source (Optional)</Label>
                        <Input id="source" v-model="formData.source" placeholder="e.g., Bank Transfer, Cash Deposit" />
                    </div>

                    <div v-if="operation === 'debit'">
                        <Label for="recipientAccount">Recipient Account (Optional)</Label>
                        <Input id="recipientAccount" v-model="formData.recipientAccount"
                            placeholder="Account number or reference" />
                    </div>

                    <div v-if="newBalance !== null" class="p-4 border rounded-lg">
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-muted-foreground">New Balance</span>
                            <span class="text-lg"
                                :class="operation === 'credit' ? 'text-green-600' : 'text-red-600'">{{
                                formatCurrency(newBalance) }}</span>
                        </div>
                        <div class="flex items-center gap-2 mt-2 text-sm">
                            <Icon :name="operation === 'credit' ? 'arrow-up' : 'arrow-down'"
                                :class="operation === 'credit' ? 'text-green-600' : 'text-red-600'" class="w-4 h-4" />
                            <span :class="operation === 'credit' ? 'text-green-600' : 'text-red-600'">{{ operation ===
                                'credit' ? '+' : '-' }}{{ formatCurrency(formData.amount || '0') }}</span>
                        </div>
                    </div>

                    <div v-if="operation === 'debit' && exceedsBalance"
                        class="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div class="flex items-start gap-2">
                            <Icon name="alert-circle" class="w-5 h-5 text-red-600 mt-0.5" />
                            <div>
                                <p class="text-sm font-medium text-red-900">Insufficient Balance</p>
                                <p class="text-xs text-red-700">The amount exceeds available wallet balance</p>
                            </div>
                        </div>
                    </div>

                    </form>
                </div>
            </DialogBody>

            <DialogFooter>
                <Button type="button" variant="outline" @click="$emit('update:open', false)">Cancel</Button>
                <Button type="submit"
                    :variant="operation === 'credit' ? 'default' : 'destructive'"
                    :disabled="isSubmitting || exceedsBalance"
                    @click="handleSubmit">
                    {{ isSubmitting ? 'Processing...' : operation === 'credit' ? 'Credit Wallet' : 'Debit Wallet' }}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import Icon from '~/components/Icon.vue'
import type { ClusterWalletCreditDto, ClusterWalletTransferDto } from '~/types/payments'

interface Props {
    open: boolean
    operation: 'credit' | 'debit'
    wallet?: { balance: string; availableBalance: string }
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:open': [value: boolean]
    'submit': [data: ClusterWalletCreditDto | ClusterWalletTransferDto]
}>()

const isSubmitting = ref(false)

const formData = ref<{ amount: string; description: string; source?: string; recipientAccount?: string }>({
    amount: '',
    description: '',
    source: '',
    recipientAccount: ''
})

watch(() => props.open, (isOpen) => {
    if (!isOpen) {
        formData.value = { amount: '', description: '', source: '', recipientAccount: '' }
    }
})

const newBalance = computed(() => {
    if (!props.wallet || !formData.value.amount) return null
    const currentBalance = parseFloat(props.wallet.balance)
    const amount = parseFloat(formData.value.amount)
    if (isNaN(currentBalance) || isNaN(amount)) return null
    return props.operation === 'credit' ? currentBalance + amount : currentBalance - amount
})

const exceedsBalance = computed(() => {
    if (props.operation !== 'debit' || !props.wallet || !formData.value.amount) return false
    const availableBalance = parseFloat(props.wallet.availableBalance)
    const amount = parseFloat(formData.value.amount)
    return amount > availableBalance
})

const handleSubmit = async () => {
    if (exceedsBalance.value) return
    isSubmitting.value = true
    try {
        if (props.operation === 'credit') {
            const data: ClusterWalletCreditDto = { amount: formData.value.amount, description: formData.value.description, source: formData.value.source }
            emit('submit', data)
        } else {
            const data: ClusterWalletTransferDto = { amount: formData.value.amount, description: formData.value.description, recipientAccount: formData.value.recipientAccount }
            emit('submit', data)
        }
    } finally {
        isSubmitting.value = false
    }
}

const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(num)) return '₦0.00'
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(num)
}
</script>
