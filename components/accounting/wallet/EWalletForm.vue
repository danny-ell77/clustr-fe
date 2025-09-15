# E-wallet Form Component
```vue
<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg p-6">
      <h2 class="text-lg font-semibold mb-4">Add funds to your e-wallet</h2>
      
      <!-- Amount Input -->
      <div class="space-y-2 mb-6">
        <Label>Amount</Label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
          <Input
            v-model="amount"
            type="number"
            min="0"
            step="0.01"
            class="pl-8"
            placeholder="Enter amount"
          />
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="space-y-4">
        <h3 class="text-sm font-medium">Choose a payment method</h3>
        
        <!-- Payment Method Cards -->
        <div class="space-y-3">
          <!-- Paystack -->
          <div
            class="border rounded-lg p-4 cursor-pointer transition-colors"
            :class="selectedMethod === 'paystack' ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'"
            @click="selectMethod('paystack')"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <img src="/images/paystack-logo.svg" alt="Paystack" class="h-6" />
                <span class="font-medium">Paystack</span>
              </div>
              <Icon
                name="check-circle"
                class="w-5 h-5"
                :class="selectedMethod === 'paystack' ? 'text-blue-500' : 'text-gray-300'"
              />
            </div>
          </div>

          <!-- Flutterwave -->
          <div
            class="border rounded-lg p-4 cursor-pointer transition-colors"
            :class="selectedMethod === 'flutterwave' ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'"
            @click="selectMethod('flutterwave')"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <img src="/images/flutterwave-logo.svg" alt="Flutterwave" class="h-6" />
                <span class="font-medium">Flutterwave</span>
              </div>
              <Icon
                name="check-circle"
                class="w-5 h-5"
                :class="selectedMethod === 'flutterwave' ? 'text-blue-500' : 'text-gray-300'"
              />
            </div>
          </div>

          <!-- Credit Card -->
          <div
            class="border rounded-lg p-4 cursor-pointer transition-colors"
            :class="selectedMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'"
            @click="selectMethod('card')"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="flex space-x-2">
                  <img src="/images/visa-logo.svg" alt="Visa" class="h-6" />
                  <img src="/images/mastercard-logo.svg" alt="Mastercard" class="h-6" />
                </div>
                <span class="font-medium">Credit card</span>
              </div>
              <Icon
                name="check-circle"
                class="w-5 h-5"
                :class="selectedMethod === 'card' ? 'text-blue-500' : 'text-gray-300'"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Button -->
    <div class="flex justify-end">
      <Button
        @click="proceed"
        :disabled="!canProceed"
        class="bg-blue-600 hover:bg-blue-700"
      >
        Proceed
        <Icon name="arrow-right" class="w-4 h-4 ml-2" />
      </Button>
    </div>

    <!-- Payment Details Modal -->
    <Dialog :open="showPaymentModal" @update:open="showPaymentModal = $event">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle>Add payment details</DialogTitle>
        </DialogHeader>
        
        <form @submit.prevent="handlePayment" class="space-y-4">
          <div class="space-y-2">
            <Label for="cardHolder">Cardholder name</Label>
            <Input
              id="cardHolder"
              v-model="paymentDetails.cardHolder"
              required
              placeholder="Enter cardholder name"
            />
          </div>

          <div class="space-y-2">
            <Label for="cardNumber">Card number</Label>
            <Input
              id="cardNumber"
              v-model="paymentDetails.cardNumber"
              required
              placeholder="4242 4242 4242 4242"
              maxlength="19"
              @input="formatCardNumber"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="expiry">Expiry date</Label>
              <Input
                id="expiry"
                v-model="paymentDetails.expiry"
                required
                placeholder="MM/YY"
                maxlength="5"
                @input="formatExpiry"
              />
            </div>

            <div class="space-y-2">
              <Label for="cvc">CVC</Label>
              <Input
                id="cvc"
                v-model="paymentDetails.cvc"
                required
                type="password"
                maxlength="4"
                placeholder="123"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              @click="showPaymentModal = false"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              class="bg-blue-600 hover:bg-blue-700"
              :disabled="isProcessing"
            >
              {{ isProcessing ? 'Processing...' : 'Proceed' }}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Success Modal -->
    <Dialog :open="showSuccess" @update:open="showSuccess = $event">
      <DialogContent class="max-w-md text-center">
        <div class="flex flex-col items-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Icon name="check" class="w-8 h-8 text-green-600" />
          </div>
          <DialogTitle class="mb-2">Payment Successful!</DialogTitle>
          <p class="text-gray-500 mb-6">
            ₦{{ formatNumber(+amount) }} has been added to your wallet
          </p>
          <Button @click="handleSuccess">Continue</Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFormatters } from '~/composables/useFormatters'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import Icon from '~/components/Icon.vue'

const { formatNumber } = useFormatters()

const amount = ref('')
const selectedMethod = ref('')
const showPaymentModal = ref(false)
const showSuccess = ref(false)
const isProcessing = ref(false)

const paymentDetails = ref({
  cardHolder: '',
  cardNumber: '',
  expiry: '',
  cvc: ''
})

const canProceed = computed(() => {
  return amount.value && Number(amount.value) > 0 && selectedMethod.value
})

const selectMethod = (method: string) => {
  selectedMethod.value = method
}

const proceed = () => {
  if (canProceed.value) {
    showPaymentModal.value = true
  }
}

const formatCardNumber = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  value = value.replace(/(\d{4})/g, '$1 ').trim()
  paymentDetails.value.cardNumber = value
}

const formatExpiry = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2)
  }
  paymentDetails.value.expiry = value
}

const handlePayment = async () => {
  isProcessing.value = true
  try {
    // TODO: Implement payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    showPaymentModal.value = false
    showSuccess.value = true
  } catch (error) {
    console.error('Payment failed:', error)
  } finally {
    isProcessing.value = false
  }
}

const handleSuccess = () => {
  showSuccess.value = false
  // Reset form
  amount.value = ''
  selectedMethod.value = ''
  paymentDetails.value = {
    cardHolder: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  }
  // Emit success event
  emit('success')
}

const emit = defineEmits<{
  (e: 'success'): void
}>()
</script>
```