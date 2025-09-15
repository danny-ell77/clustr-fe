<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Bill Payment</DialogTitle>
        <DialogDescription>
          Pay your bills using your wallet balance
        </DialogDescription>
      </DialogHeader>
      
      <form @submit.prevent="handleSubmit" class="space-y-4 py-4">
        <div class="space-y-2">
          <Label for="billType">Bill Type</Label>
          <DynamicSelect 
            v-model="form.billType"
            :options="billTypeOptions"
            placeholder="Select bill type"
            id="billType"
            required
          />
        </div>
        
        <div class="space-y-2">
          <Label for="meterNumber">Meter/Account Number</Label>
          <Input 
            id="meterNumber"
            v-model="form.meterNumber" 
            placeholder="Enter meter or account number"
            required
          />
        </div>
        
        <div class="space-y-2">
          <Label for="amount">Amount</Label>
          <div class="relative">
            <Input 
              id="amount"
              v-model="form.amount" 
              type="number" 
              placeholder="0.00" 
              class="pl-8"
              :max="walletBalance"
              min="1"
              step="0.01"
              required
            />
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₦</span>
          </div>
          <p class="text-xs text-gray-500">
            Available balance: {{ formatCurrency(walletBalance) }}
          </p>
        </div>
        
        <div class="space-y-2">
          <Label for="description">Description (Optional)</Label>
          <Input 
            id="description"
            v-model="form.description" 
            placeholder="Payment description"
          />
        </div>
        
        <div class="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" @click="handleCancel">
            Cancel
          </Button>
          <Button 
            type="submit" 
            :disabled="!isFormValid || isSubmitting"
            class="min-w-[100px]"
          >
            {{ isSubmitting ? 'Processing...' : 'Pay Bill' }}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useFormatters } from '~/composables/useFormatters'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import DynamicSelect from '~/components/shared/DynamicSelect.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  walletBalance: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:open', 'submit', 'cancel'])

const { formatCurrency } = useFormatters()

// Bill type options using object format with name/value pairs
const billTypeOptions = [
  { name: 'Electricity', value: 'electricity' },
  { name: 'Water', value: 'water' },
  { name: 'Internet', value: 'internet' },
  { name: 'Cable TV', value: 'cable' },
  { name: 'Security', value: 'security' }
]

const form = ref({
  billType: '',
  meterNumber: '',
  amount: '',
  description: ''
})

const isSubmitting = ref(false)

const isFormValid = computed(() => {
  return form.value.billType && 
         form.value.meterNumber && 
         form.value.amount && 
         parseFloat(form.value.amount) > 0 &&
         parseFloat(form.value.amount) <= props.walletBalance
})

// Reset form when modal closes
watch(() => props.open, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})

const resetForm = () => {
  form.value = {
    billType: '',
    meterNumber: '',
    amount: '',
    description: ''
  }
  isSubmitting.value = false
}

const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  isSubmitting.value = true
  
  try {
    await emit('submit', {
      type: form.value.billType,
      meterNumber: form.value.meterNumber,
      amount: parseFloat(form.value.amount),
      description: form.value.description || `${form.value.billType} bill payment`
    })
    
    resetForm()
  } catch (error) {
    console.error('Bill payment error:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  resetForm()
  emit('cancel')
}
</script>