# Transaction Form Component
```vue
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="space-y-4 bg-gray-50 p-6 rounded-lg">
      <!-- Date Input -->
      <div class="form-group">
        <Label for="date">Date</Label>
        <div class="relative">
          <Input
            id="date"
            v-model="formData.date"
            type="date"
            required
            :class="{'border-red-500': errors.date}"
          />
          <span v-if="errors.date" class="text-xs text-red-500">{{ errors.date }}</span>
        </div>
      </div>

      <!-- Receipt/Invoice Number -->
      <div class="form-group">
        <Label for="reference">{{ type === 'expense' ? 'Receipt Number' : 'Invoice Number' }}</Label>
        <Input
          id="reference"
          v-model="formData.reference"
          type="text"
          required
          :placeholder="`Enter ${type === 'expense' ? 'receipt' : 'invoice'} number`"
          :class="{'border-red-500': errors.reference}"
        />
        <span v-if="errors.reference" class="text-xs text-red-500">{{ errors.reference }}</span>
      </div>

      <!-- Description -->
      <div class="form-group">
        <Label for="description">Description</Label>
        <Textarea
          id="description"
          v-model="formData.description"
          required
          placeholder="Enter description"
          :class="{'border-red-500': errors.description}"
        />
        <span v-if="errors.description" class="text-xs text-red-500">{{ errors.description }}</span>
      </div>

      <!-- Vendor/Client -->
      <div class="form-group">
        <Label for="party">{{ type === 'expense' ? 'Vendor/Service Provider' : 'Client' }}</Label>
        <Input
          id="party"
          v-model="formData.party"
          type="text"
          required
          :placeholder="type === 'expense' ? 'Enter vendor name' : 'Enter client name'"
          :class="{'border-red-500': errors.party}"
        />
        <span v-if="errors.party" class="text-xs text-red-500">{{ errors.party }}</span>
      </div>

      <!-- Amount -->
      <div class="form-group">
        <Label for="amount">Amount</Label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
          <Input
            id="amount"
            v-model="formData.amount"
            type="number"
            required
            class="pl-8"
            min="0"
            step="0.01"
            :class="{'border-red-500': errors.amount}"
          />
        </div>
        <span v-if="errors.amount" class="text-xs text-red-500">{{ errors.amount }}</span>
      </div>

      <!-- Payment Method -->
      <div class="form-group">
        <Label for="paymentMethod">Method of payment</Label>
        <Select
          id="paymentMethod"
          v-model="formData.paymentMethod"
          required
          :class="{'border-red-500': errors.paymentMethod}"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select method of payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="card">Card Payment</SelectItem>
            <SelectItem value="cheque">Cheque</SelectItem>
          </SelectContent>
        </Select>
        <span v-if="errors.paymentMethod" class="text-xs text-red-500">{{ errors.paymentMethod }}</span>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="flex justify-end">
      <Button type="submit" class="bg-blue-600 hover:bg-blue-700">
        Save
      </Button>
    </div>
  </form>

  <!-- Success Modal -->
  <Dialog :open="showSuccess" @update:open="showSuccess = $event">
    <DialogContent class="max-w-md text-center">
      <div class="flex flex-col items-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Icon name="check" class="w-8 h-8 text-green-600" />
        </div>
        <DialogTitle class="mb-2">
          {{ type === 'expense' ? 'Expense' : 'Income' }} added successfully
        </DialogTitle>
        <Button @click="handleSuccessClose" class="mt-4">
          Back
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogTitle
} from '~/components/ui/dialog'
import Icon from '~/components/Icon.vue'

const props = defineProps<{
  type: 'income' | 'expense'
}>()

const emit = defineEmits<{
  (e: 'submit', data: any): void
  (e: 'success'): void
}>()

const formData = reactive({
  date: '',
  reference: '',
  description: '',
  party: '',
  amount: '',
  paymentMethod: ''
})

const errors = reactive({
  date: '',
  reference: '',
  description: '',
  party: '',
  amount: '',
  paymentMethod: ''
})

const showSuccess = ref(false)

const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  if (!formData.date) {
    errors.date = 'Date is required'
    isValid = false
  }

  if (!formData.reference) {
    errors.reference = `${props.type === 'expense' ? 'Receipt' : 'Invoice'} number is required`
    isValid = false
  }

  if (!formData.description) {
    errors.description = 'Description is required'
    isValid = false
  }

  if (!formData.party) {
    errors.party = `${props.type === 'expense' ? 'Vendor' : 'Client'} is required`
    isValid = false
  }

  if (!formData.amount || Number(formData.amount) <= 0) {
    errors.amount = 'Valid amount is required'
    isValid = false
  }

  if (!formData.paymentMethod) {
    errors.paymentMethod = 'Payment method is required'
    isValid = false
  }

  return isValid
}

const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', {
      ...formData,
      amount: Number(formData.amount),
      type: props.type
    })
    showSuccess.value = true
  }
}

const handleSuccessClose = () => {
  showSuccess.value = false
  emit('success')
}
</script>
```