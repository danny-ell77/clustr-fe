<template>
  <div class="scheduled-payments">
    <div class="space-y-4">
      <div v-for="payment in payments" :key="payment.id" class="payment-card">
        <div class="bg-card p-4 rounded-lg border shadow-sm">
          <div class="flex justify-between items-start mb-4">
            <div class="space-y-1">
              <h3 class="font-medium">{{ formatTransactionType(payment.type) }}</h3>
              <p class="text-sm text-muted-foreground">Recipient: {{ payment.recipient }}</p>
              <p class="text-sm text-muted-foreground">{{ formatScheduledDate(payment.date) }} at {{ payment.time }}</p>
            </div>
            <p class="font-medium">{{ formatWalletBalance(payment.amount) }}</p>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button
              class="btn-secondary text-sm"
              @click="$emit('edit', payment)">
              Edit schedule
            </button>
            <button
              class="btn-destructive text-sm"
              @click="handleCancel(payment)">
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div v-if="payments.length === 0" class="text-center py-8 text-muted-foreground">
        No scheduled payments
      </div>
    </div>

    <!-- Confirmation Modal -->
    <Dialog :open="showConfirmation" @update:open="closeConfirmation">
      <div class="space-y-4 p-6">
        <h3 class="text-lg font-medium">
          Are you sure you want to Cancel Scheduled {{ selectedPayment?.type }} Payment?
        </h3>
        
        <div class="flex justify-end space-x-3">
          <button class="btn-secondary" @click="closeConfirmation">
            No, don't cancel
          </button>
          <button class="btn-primary" @click="confirmCancel">
            Yes, cancel
          </button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Dialog } from '~/components/ui/dialog'
import { 
  formatTransactionType,
  formatWalletBalance,
  formatScheduledDate
} from '~/utils/wallet-formatters'

interface ScheduledPayment {
  id: string
  type: string
  recipient: string
  amount: number
  date: Date
  time: string
  status: string
}

interface Props {
  payments: ScheduledPayment[]
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'edit', payment: ScheduledPayment): void
  (e: 'cancel', paymentId: string): void
}>()

const showConfirmation = ref(false)
const selectedPayment = ref<ScheduledPayment | null>(null)

const handleCancel = (payment: ScheduledPayment) => {
  selectedPayment.value = payment
  showConfirmation.value = true
}

const closeConfirmation = () => {
  showConfirmation.value = false
  selectedPayment.value = null
}

const confirmCancel = () => {
  if (selectedPayment.value) {
    emit('cancel', selectedPayment.value.id)
  }
  closeConfirmation()
}
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90;
}

.btn-secondary {
  @apply px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80;
}

.btn-destructive {
  @apply px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90;
}
</style>