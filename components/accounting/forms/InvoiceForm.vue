<template>
    <div class="bg-white rounded-xl p-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-8">Create Invoice</h2>

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
                    <Label for="invoiceNumber" class="text-gray-700">Invoice Number</Label>
                    <Input 
                        id="invoiceNumber" 
                        v-model="form.invoiceNumber" 
                        placeholder="Enter invoice number"
                        required 
                        class="mt-1"
                    />
                </div>
            </div>

            <div class="grid grid-cols-2 gap-6">
                <div>
                    <Label for="clientName" class="text-gray-700">Client Name</Label>
                    <Input 
                        id="clientName" 
                        v-model="form.clientName" 
                        placeholder="Enter client name"
                        required 
                        class="mt-1"
                    />
                </div>

                <div>
                    <Label for="clientEmail" class="text-gray-700">Client Email</Label>
                    <Input 
                        id="clientEmail" 
                        type="email"
                        v-model="form.clientEmail" 
                        placeholder="Enter client email"
                        required 
                        class="mt-1"
                    />
                </div>
            </div>

            <div class="grid grid-cols-2 gap-6">
                <div>
                    <Label for="phone" class="text-gray-700">Phone Number</Label>
                    <Input 
                        id="phone" 
                        type="tel"
                        v-model="form.phone" 
                        placeholder="Enter phone number"
                        required 
                        class="mt-1"
                    />
                </div>

                <div>
                    <Label for="dueDate" class="text-gray-700">Due Date</Label>
                    <div class="mt-1 relative">
                        <Input 
                            id="dueDate" 
                            type="date" 
                            v-model="form.dueDate" 
                            required
                            class="pl-10" 
                        />
                        <Icon 
                            name="calendar" 
                            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                        />
                    </div>
                </div>
            </div>

            <div>
                <Label for="address" class="text-gray-700">Client Address</Label>
                <Textarea 
                    id="address" 
                    v-model="form.address" 
                    placeholder="Enter client address"
                    rows="3"
                    class="mt-1"
                    required
                />
            </div>

            <div class="border rounded-lg p-4 space-y-4">
                <h3 class="font-medium text-gray-900">Invoice Items</h3>
                
                <div v-for="(item, index) in form.items" :key="index" class="grid grid-cols-12 gap-4">
                    <div class="col-span-5">
                        <Input 
                            v-model="item.description" 
                            placeholder="Item description"
                            required
                        />
                    </div>
                    <div class="col-span-2">
                        <Input 
                            type="number" 
                            v-model="item.quantity" 
                            placeholder="Qty"
                            required
                            min="1"
                        />
                    </div>
                    <div class="col-span-2">
                        <div class="relative">
                            <Input 
                                type="number" 
                                v-model="item.price" 
                                placeholder="0.00"
                                required
                                min="0"
                                step="0.01"
                                class="pl-8"
                            />
                            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₦</span>
                        </div>
                    </div>
                    <div class="col-span-2">
                        <div class="relative">
                            <Input 
                                :value="calculateItemTotal(item)"
                                readonly
                                class="pl-8 bg-gray-50"
                            />
                            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₦</span>
                        </div>
                    </div>
                    <div class="col-span-1">
                        <Button 
                            type="button"
                            variant="ghost"
                            size="icon"
                            @click="removeItem(index)"
                            v-if="form.items.length > 1"
                            class="text-red-500 hover:text-red-600"
                        >
                            <Icon name="trash-2" class="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    @click="addItem"
                    class="mt-2"
                >
                    <Icon name="plus" class="w-4 h-4 mr-2" />
                    Add Item
                </Button>
            </div>

            <div class="border-t pt-4 mt-6">
                <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-600">Subtotal</span>
                    <span class="font-medium">₦{{ calculateSubtotal.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between items-center text-sm mt-2">
                    <span class="text-gray-600">Tax (7.5%)</span>
                    <span class="font-medium">₦{{ calculateTax.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between items-center text-lg font-semibold mt-2 pt-2 border-t">
                    <span>Total</span>
                    <span>₦{{ calculateTotal.toLocaleString() }}</span>
                </div>
            </div>

            <div class="flex justify-end gap-4 pt-6">
                <Button 
                    type="button" 
                    variant="outline" 
                    @click="$emit('cancel')"
                >
                    Save as Draft
                </Button>
                <Button 
                    type="submit" 
                    :disabled="isSubmitting" 
                    class="bg-primary hover:bg-primary/90 min-w-[120px]"
                >
                    {{ isSubmitting ? 'Saving...' : 'Export Invoice' }}
                </Button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { useSuccessModal } from '~/composables/useSuccessModal'
import { useToast } from '~/composables/useToast'
import Icon from '~/components/Icon.vue'

const form = ref({
    date: new Date().toISOString().split('T')[0],
    invoiceNumber: '',
    clientName: '',
    clientEmail: '',
    phone: '',
    address: '',
    dueDate: '',
    items: [
        { description: '', quantity: 1, price: 0 }
    ]
})

const isSubmitting = ref(false)
const { showSuccess } = useSuccessModal()
const { error } = useToast()

const addItem = () => {
    form.value.items.push({ description: '', quantity: 1, price: 0 })
}

const removeItem = (index) => {
    form.value.items.splice(index, 1)
}

const calculateItemTotal = (item) => {
    return (item.quantity * item.price).toFixed(2)
}

const calculateSubtotal = computed(() => {
    return form.value.items.reduce((total, item) => {
        return total + (item.quantity * item.price)
    }, 0)
})

const calculateTax = computed(() => {
    return calculateSubtotal.value * 0.075 // 7.5% VAT
})

const calculateTotal = computed(() => {
    return calculateSubtotal.value + calculateTax.value
})

const resetForm = () => {
    form.value = {
        date: new Date().toISOString().split('T')[0],
        invoiceNumber: '',
        clientName: '',
        clientEmail: '',
        phone: '',
        address: '',
        dueDate: '',
        items: [
            { description: '', quantity: 1, price: 0 }
        ]
    }
}

const submitForm = async () => {
    isSubmitting.value = true

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        console.log('Invoice exported:', form.value)

        // Reset form
        resetForm()

        // Show success modal
        showSuccess('Invoice exported successfully')

    } catch (err) {
        error('Error', 'Failed to export invoice. Please try again.')
    } finally {
        isSubmitting.value = false
    }
}
</script>
