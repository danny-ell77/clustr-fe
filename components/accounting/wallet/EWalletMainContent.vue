<template>
  <div class="space-y-6">
    <!-- Wallet and Transaction Section -->
    <div class="space-y-6">
      <WalletCard
        :balance="walletBalance"
        @fund="$emit('fundWallet')"
        @refresh="$emit('refreshBalance')"
        @bill-payment="$emit('billPayment')"
        @schedule-payment="$emit('schedulePayment')"
      />

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionHistory
            :transactions="transactions"
            @export="$emit('exportTransactions')"
            @filter="$emit('filterTransactions')"
          />
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import WalletCard from './WalletCard.vue'
import TransactionHistory from './TransactionHistory.vue'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '~/components/ui/card'

defineProps({
  walletBalance: {
    type: Number,
    required: true
  },
  transactions: {
    type: Array,
    required: true
  }
})

defineEmits([
  'fundWallet',
  'refreshBalance', 
  'billPayment',
  'schedulePayment',
  'exportTransactions',
  'filterTransactions'
])
</script>