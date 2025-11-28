<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent class="max-w-2xl">
            <div class="space-y-4">
                <div>
                    <h2 class="text-2xl">{{ payment ? 'Edit Recurring Payment' : 'Create Recurring Payment' }}
                    </h2>
                    <p class="text-sm text-muted-foreground">
                        {{ payment ? 'Update recurring payment schedule' : 'Set up automatic recurring payment' }}
                    </p>
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div>
                        <Label for="title">Title *</Label>
                        <Input id="title" v-model="formData.title" placeholder="e.g., Monthly Electricity Bill"
                            required />
                    </div>

                    <div>
                        <Label for="description">Description</Label>
                        <Textarea id="description" v-model="formData.description" placeholder="Additional details"
                            rows="2" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <Label for="amount">Amount (NGN) *</Label>
                            <Input id="amount" v-model="formData.amount" type="number" step="0.01" min="0"
                                placeholder="0.00" required />
                        </div>

                        <div>
                            <Label for="frequency">Frequency *</Label>
                            <Select v-model="formData.frequency" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DAILY">Daily</SelectItem>
                                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                                    <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                                    <SelectItem value="YEARLY">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <Label for="startDate">Start Date *</Label>
                            <Input id="startDate" v-model="formData.startDate" type="date" required />
                        </div>

                        <div>
                            <Label for="endDate">End Date (Optional)</Label>
                            <Input id="endDate" v-model="formData.endDate" type="date" />
                        </div>
                    </div>

                    <div>
                        <Label for="walletId">Wallet *</Label>
                        <Select v-model="formData.walletId" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select wallet" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="wallet in wallets" :key="wallet.id" :value="wallet.id">
                                    {{ wallet.accountNumber }} - {{ formatCurrency(wallet.balance) }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div v-if="bills.length > 0">
                        <Label for="billId">Link to Bill (Optional)</Label>
                        <Select v-model="formData.billId">
                            <SelectTrigger>
                                <SelectValue placeholder="Select bill" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">None</SelectItem>
                                <SelectItem v-for="bill in bills" :key="bill.id" :value="bill.id">
                                    {{ bill.title }} - {{ formatCurrency(bill.amount) }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label for="spendingLimit">Spending Limit (Optional)</Label>
                        <Input id="spendingLimit" v-model="formData.spendingLimit" type="number" step="0.01" min="0"
                            placeholder="0.00" />
                        <p class="text-xs text-muted-foreground mt-1">Maximum amount that can be charged per payment</p>
                    </div>

                    <div class="flex items-center space-x-2 p-4 bg-muted rounded-lg">
                        <Icon name="info" class="w-5 h-5 text-primary" />
                        <p class="text-sm">
                            Payments will be automatically processed {{ formatFrequency(formData.frequency) }} starting
                            from {{ formatDate(formData.startDate) }}
                        </p>
                    </div>

                    <div class="flex gap-2 pt-4 border-t">
                        <Button type="button" variant="outline" class="flex-1"
                            @click="$emit('update:open', false)">Cancel</Button>
                        <Button type="submit" class="flex-1" :disabled="isSubmitting">
                            {{ isSubmitting ? 'Saving...' : payment ? 'Update Schedule' : 'Create Schedule' }}
                        </Button>
                    </div>
                </form>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Dialog, DialogContent } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import Icon from '~/components/Icon.vue'
import type { RecurringPayment, CreateRecurringPaymentDto, RecurringPaymentFrequency, Wallet, Bill } from '~/types/payments'

interface Props {
    open: boolean
    payment?: RecurringPayment
    wallets?: Wallet[]
    bills?: Bill[]
}

const props = withDefaults(defineProps<Props>(), {
    wallets: () => [],
    bills: () => []
})

const emit = defineEmits<{
    'update:open': [value: boolean]
    'submit': [data: CreateRecurringPaymentDto]
}>()

const isSubmitting = ref(false)

const formData = ref<CreateRecurringPaymentDto>({
    title: '',
    description: '',
    amount: '',
    frequency: 'MONTHLY' as RecurringPaymentFrequency,
    startDate: '',
    endDate: '',
    walletId: '',
    billId: '',
    spendingLimit: ''
})

watch(() => props.payment, (payment) => {
    if (payment) {
        formData.value = {
            title: payment.title,
            description: payment.description || '',
            amount: payment.amount,
            frequency: payment.frequency,
            startDate: payment.startDate.split('T')[0],
            endDate: payment.endDate ? payment.endDate.split('T')[0] : '',
            walletId: payment.wallet,
            billId: payment.bill || '',
            spendingLimit: payment.spendingLimit || ''
        }
    } else {
        formData.value = {
            title: '',
            description: '',
            amount: '',
            frequency: 'MONTHLY' as RecurringPaymentFrequency,
            startDate: '',
            endDate: '',
            walletId: '',
            billId: '',
            spendingLimit: ''
        }
    }
}, { immediate: true })

const handleSubmit = async () => {
    isSubmitting.value = true
    try {
        emit('submit', formData.value)
    } finally {
        isSubmitting.value = false
    }
}

const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(num)
}

const formatDate = (date: string) => {
    if (!date) return 'the selected date'
    return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const formatFrequency = (frequency: string) => {
    const map: Record<string, string> = {
        DAILY: 'daily',
        WEEKLY: 'weekly',
        MONTHLY: 'monthly',
        QUARTERLY: 'quarterly',
        YEARLY: 'yearly'
    }
    return map[frequency] || frequency.toLowerCase()
}
</script>
