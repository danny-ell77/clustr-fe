<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent class="max-w-2xl">
            <DialogHeader>
                <DialogTitle>{{ bill ? 'Edit Bill' : 'Create Bill' }}</DialogTitle>
                <DialogDescription>
                    {{ bill ? 'Update bill details' : 'Create a new bill for a user' }}
                </DialogDescription>
            </DialogHeader>

            <DialogBody>
                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div>
                        <Label for="title">Title *</Label>
                        <Input id="title" v-model="formData.title" placeholder="e.g., Monthly Service Charge"
                            required />
                    </div>

                    <div>
                        <Label for="description">Description</Label>
                        <Textarea id="description" v-model="formData.description"
                            placeholder="Additional details about the bill" rows="3" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <Label for="type">Bill Type *</Label>
                            <Select v-model="formData.type" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ELECTRICITY">Electricity</SelectItem>
                                    <SelectItem value="WATER">Water</SelectItem>
                                    <SelectItem value="SECURITY">Security</SelectItem>
                                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                    <SelectItem value="SERVICE_CHARGE">Service Charge</SelectItem>
                                    <SelectItem value="WASTE_MANAGEMENT">Waste Management</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label for="amount">Amount (NGN) *</Label>
                            <Input id="amount" v-model="formData.amount" type="number" step="0.01" min="0"
                                placeholder="0.00" required />
                        </div>
                    </div>

                    <div>
                        <Label for="dueDate">Due Date *</Label>
                        <Input id="dueDate" v-model="formData.dueDate" type="date" required />
                    </div>

                    <div v-if="!isClusterWide" class="space-y-2">
                        <Label for="userId">User *</Label>
                        <Select v-model="formData.userId" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select user" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="user in users" :key="user.id" :value="user.id">
                                    {{ user.name }} ({{ user.email }})
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="flex items-center space-x-2">
                        <input id="allowPaymentAfterDue" v-model="formData.allowPaymentAfterDue" type="checkbox"
                            class="rounded border-gray-300" />
                        <Label for="allowPaymentAfterDue" class="cursor-pointer">
                            Allow payment after due date
                        </Label>
                    </div>

                </form>
            </DialogBody>

            <DialogFooter>
                <Button type="button" variant="outline" @click="$emit('update:open', false)">
                    Cancel
                </Button>
                <Button type="submit" :disabled="isSubmitting" @click="handleSubmit">
                    {{ isSubmitting ? 'Saving...' : bill ? 'Update Bill' : 'Create Bill' }}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import type { Bill, CreateBillDto, BillType } from '~/types/payments'

interface Props {
    open: boolean
    bill?: Bill
    users?: Array<{ id: string; name: string; email: string }>
    isClusterWide?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    users: () => [],
    isClusterWide: false
})

const emit = defineEmits<{
    'update:open': [value: boolean]
    'submit': [data: CreateBillDto]
}>()

const isSubmitting = ref(false)

const formData = ref<CreateBillDto>({
    title: '',
    description: '',
    type: 'SERVICE_CHARGE' as BillType,
    amount: '',
    dueDate: '',
    allowPaymentAfterDue: false,
    userId: undefined
})

watch(() => props.bill, (bill) => {
    if (bill) {
        formData.value = {
            title: bill.title,
            description: bill.description || '',
            type: bill.type,
            amount: bill.amount,
            dueDate: bill.dueDate.split('T')[0],
            allowPaymentAfterDue: bill.allowPaymentAfterDue,
            userId: bill.userId
        }
    } else {
        formData.value = {
            title: '',
            description: '',
            type: 'SERVICE_CHARGE' as BillType,
            amount: '',
            dueDate: '',
            allowPaymentAfterDue: false,
            userId: undefined
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
</script>
