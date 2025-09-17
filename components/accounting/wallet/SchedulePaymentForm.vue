<template>
  <div class="schedule-payment space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-medium">Schedule Payment</h2>
      <button @click="$emit('close')" class="text-muted-foreground hover:text-foreground">
        <Icon name="x" class="w-5 h-5" />
      </button>
    </div>

    <div class="payment-card bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-xl text-white">
      <div class="flex justify-between items-start mb-8">
        <div class="space-y-1">
          <p class="text-sm opacity-90">Available Balance</p>
          <p class="text-2xl font-bold">{{ formatWalletBalance(balance) }}</p>
        </div>
        <!-- <img src="/images/chip.svg" alt="Card Chip" class="w-10" /> -->
      </div>
      <p class="text-lg font-medium">{{ cardHolder }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="space-y-4">
        <div class="form-group">
          <label class="text-sm font-medium">Payment Type</label>
          <select 
            v-model="form.type"
            class="w-full px-3 py-2 border rounded-md bg-background">
            <option value="electricity">Electricity</option>
            <option value="water">Water Supply</option>
            <option value="security">Security</option>
          </select>
        </div>

        <div class="form-group">
          <label class="text-sm font-medium">Meter Number</label>
          <input
            v-model="form.meterNumber"
            type="text"
            class="w-full px-3 py-2 border rounded-md"
            placeholder="Enter meter number"
          />
        </div>

        <div class="form-group">
          <label class="text-sm font-medium">Amount</label>
          <input
            v-model="form.amount"
            type="number"
            class="w-full px-3 py-2 border rounded-md"
            placeholder="Enter amount"
            min="0"
            :max="balance"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label class="text-sm font-medium">Date</label>
            <input
              v-model="form.date"
              type="date"
              class="w-full px-3 py-2 border rounded-md"
              :min="minDate"
            />
          </div>

          <div class="form-group">
            <label class="text-sm font-medium">Time</label>
            <input
              v-model="form.time"
              type="time"
              class="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-4">
        <button 
          type="button"
          class="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          @click="$emit('close')">
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          :disabled="!isValid || isSubmitting">
          Schedule Payment
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatWalletBalance } from '~/utils/wallet-formatters'

interface Props {
  balance: number
  cardHolder: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: {
    type: string
    meterNumber: string
    amount: number
    date: string
    time: string
  }): void
}>()

const form = ref({
  type: 'electricity',
  meterNumber: '',
  amount: 0,
  date: '',
  time: ''
})

const isSubmitting = ref(false)

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const isValid = computed(() => {
  return (
    form.value.type &&
    form.value.meterNumber &&
    form.value.amount > 0 &&
    form.value.amount <= props.balance &&
    form.value.date &&
    form.value.time
  )
})

const handleSubmit = async () => {
  if (!isValid.value) return

  isSubmitting.value = true
  try {
    await emit('submit', form.value)
  } finally {
    isSubmitting.value = false
  }
}
</script>