<template>
  <Dialog :open="props.open" @update:open="props.onClose" >
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Add funds to your e-wallet</DialogTitle>
      </DialogHeader>
      
      <div class="space-y-6">
        <div class="space-y-2">
          <Label for="amount">Enter amount to fund wallet</Label>
          <Input
            id="amount"
            v-model="amount"
            type="number"
            placeholder="Enter amount"
            min="0"
            step="0.01"
          />
        </div>

        <div class="space-y-2">
          <Label>Choose a payment method</Label>
          <div class="space-y-3">
            <Card
              v-for="method in paymentMethods"
              :key="method.id"
              :class="[
                'cursor-pointer transition-colors border-2',
                selectedMethod === method.id
                  ? 'border-primary bg-primary/5'
                  : 'hover:bg-muted'
              ]"
              @click="selectedMethod = method.id">
              <CardContent class="flex items-center p-4">
                <div class="flex-1">
                  <div class="flex items-center space-x-3">
                    <img :src="method.logo" :alt="method.name" class="h-8 w-auto" />
                    <span class="font-medium">{{ method.name }}</span>
                  </div>
                </div>
                <div class="ml-4">
                  <div 
                    :class="[
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                      selectedMethod === method.id
                        ? 'border-primary'
                        : 'border-muted-foreground'
                    ]">
                    <div 
                      v-if="selectedMethod === method.id"
                      class="w-3 h-3 rounded-full bg-primary">
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div v-if="selectedMethod === 'card'" class="space-y-4">
          <div class="space-y-2">
            <Label for="cardHolder">Card holder</Label>
            <Input
              id="cardHolder"
              v-model="cardDetails.holder"
              type="text"
              placeholder="Name on card"
            />
          </div>

          <div class="space-y-2">
            <Label for="cardNumber">Card number</Label>
            <Input
              id="cardNumber"
              v-model="cardDetails.number"
              type="text"
              placeholder="4302 4002 4032"
              maxlength="19"
              @input="formatCardNumberInput"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="expiry">Expiry date</Label>
              <Input
                id="expiry"
                v-model="cardDetails.expiry"
                type="text"
                placeholder="MM/YY"
                maxlength="5"
                @input="formatExpiryInput"
              />
            </div>

            <div class="space-y-2">
              <Label for="cvc">CVC</Label>
              <Input
                id="cvc"
                v-model="cardDetails.cvc"
                type="text"
                placeholder="123"
                maxlength="4"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-4 pt-4">
        <Button 
          variant="outline"
          @click="$emit('close')">
          Cancel
        </Button>
        <Button
          :disabled="!isValid"
          @click="handleProceed">
          Proceed
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent } from '~/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { formatCardNumber, isValidExpiryDate } from '~/utils/wallet-formatters'

const props = defineProps<{
  open: boolean
  onClose: () => void
}>()

const paymentMethods = [
  {
    id: 'paystack',
    name: 'Paystack',
    logo: '/images/paystack-logo.svg'
  },
  {
    id: 'flutterwave',
    name: 'Flutterwave',
    logo: '/images/flutterwave-logo.svg'
  },
  {
    id: 'card',
    name: 'Credit card',
    logo: '/images/credit-card.svg'
  }
]

const amount = ref('')
const selectedMethod = ref('')
const cardDetails = ref({
  holder: '',
  number: '',
  expiry: '',
  cvc: ''
})

const formatCardNumberInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  if (value.length > 0) {
    value = value.match(/.{1,4}/g)?.join(' ') || value
  }
  cardDetails.value.number = value
}

const formatExpiryInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2)
  }
  
  cardDetails.value.expiry = value
}

const isValid = computed(() => {
  if (!amount.value || !selectedMethod.value) return false
  
  if (selectedMethod.value === 'card') {
    return (
      cardDetails.value.holder &&
      cardDetails.value.number.length >= 16 &&
      isValidExpiryDate(cardDetails.value.expiry) &&
      cardDetails.value.cvc.length >= 3
    )
  }
  
  return true
})

const handleProceed = () => {
  emit('proceed', {
    amount: Number(amount.value),
    method: selectedMethod.value,
    cardDetails: selectedMethod.value === 'card' ? {
      ...cardDetails.value,
      number: formatCardNumber(cardDetails.value.number)
    } : undefined
  })
}

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'proceed', data: {
    amount: number
    method: string
    cardDetails?: {
      holder: string
      number: string
      expiry: string
      cvc: string
    }
  }): void
}>()
</script>