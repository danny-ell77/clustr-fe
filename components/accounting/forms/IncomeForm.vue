<template>
    <div class="bg-white rounded-xl p-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-8">New Income</h2>

        <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid grid-cols-2 gap-6">
                <div>
                    <Label for="date" class="text-gray-700">Date</Label>
                    <div class="mt-1 relative">
                        <Input 
                            id="date" 
                            type="date" 
                            v-model="form.date" 
                            required
                            class="pl-10" 
                        />
                        <Icon 
                            name="calendar" 
                            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                        />
                    </div>
                </div>

                <div>
                    <Label for="receiptNumber" class="text-gray-700">Receipt Number</Label>
                    <Input 
                        id="receiptNumber" 
                        v-model="form.receiptNumber" 
                        placeholder="Enter receipt number"
                        required 
                        class="mt-1"
                    />
                </div>
            </div>

            <div>
                <Label for="description" class="text-gray-700">Description</Label>
                <Textarea 
                    id="description" 
                    v-model="form.description" 
                    placeholder="Enter a detailed description"
                    rows="3"
                    class="mt-1"
                />
            </div>

            <div class="grid grid-cols-2 gap-6">
                <div>
                    <Label for="payer" class="text-gray-700">Payer/Source</Label>
                    <Input 
                        id="payer" 
                        v-model="form.payer" 
                        placeholder="Enter payer name"
                        required 
                        class="mt-1"
                    />
                </div>

                <div>
                    <Label for="amount" class="text-gray-700">Amount</Label>
                    <div class="mt-1 relative">
                        <Input 
                            id="amount" 
                            type="number" 
                            step="0.01" 
                            v-model="form.amount" 
                            placeholder="0.00"
                            required
                            class="pl-8" 
                        />
                        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₦</span>
                    </div>
                </div>
            </div>

            <div>
                <Label for="method" class="text-gray-700">Method of Payment</Label>
                <Select v-model="form.method" class="mt-1">
                    <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                        <SelectItem value="credit-card">Credit Card</SelectItem>
                        <SelectItem value="e-wallet">E-Wallet</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div class="flex justify-end gap-4 pt-6">
                <Button 
                    type="button" 
                    variant="outline" 
                    @click="$emit('cancel')"
                >
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    :disabled="isSubmitting" 
                    class="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
                >
                    {{ isSubmitting ? 'Saving...' : 'Save' }}
                </Button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { useSuccessModal } from '~/composables/useSuccessModal'
import { useToast } from '~/composables/useToast'
import Icon from '~/components/Icon.vue'

const form = ref({
    date: new Date().toISOString().split('T')[0],
    receiptNumber: '',
    description: '',
    payer: '',
    amount: '',
    method: ''
})

const isSubmitting = ref(false)
const { showIncomeAdded } = useSuccessModal()
const { error } = useToast()

const submitForm = async () => {
    isSubmitting.value = true

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        console.log('Income added:', form.value)

        // Reset form
        form.value = {
            date: new Date().toISOString().split('T')[0],
            account: '',
            description: '',
            amount: '',
            method: ''
        }

        // Show success modal
        showIncomeAdded()

    } catch (err) {
        error('Error', 'Failed to add income. Please try again.')
    } finally {
        isSubmitting.value = false
    }
}
</script>