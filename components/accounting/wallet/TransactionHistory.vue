<template>
  <div class="transaction-history">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-medium">Transaction history</h3>
      <div class="flex space-x-4">
        <Button 
          v-for="tab in tabs" 
          :key="tab.value"
          variant="ghost"
          size="sm"
          @click="activeTab = tab.value"
          :class="[
            activeTab === tab.value 
              ? 'text-primary border-b-2 border-primary bg-primary/5'
              : 'text-muted-foreground'
          ]">
          {{ tab.label }}
        </Button>
      </div>
    </div>

    <DataTable 
      :data="filteredTransactions"
      :columns="transactionColumns"
      search-placeholder="Search transactions..."
      empty-message="No transactions found"
      :show-row-actions="false"
      @export="handleExport"
      @filter="handleFilter"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import DataTable from '~/components/shared/DataTable.vue'
import { 
  formatTransactionType,
  formatWalletBalance,
  getTransactionStatusStyle
} from '~/utils/wallet-formatters'
import { formatDate, formatTime } from '~/utils/formatters'

interface Transaction {
  id: string
  type: string
  date: Date
  amount: number
  status: string
}

interface Props {
  transactions: Transaction[]
}

const props = defineProps<Props>()

const tabs = [
  { label: 'Bill payment', value: 'bill' },
  { label: 'Schedule payment', value: 'schedule' }
]

const activeTab = ref('bill')

const transactionColumns = [
  {
    key: 'type',
    label: 'Type',
    format: (value: string) => formatTransactionType(value)
  },
  {
    key: 'date',
    label: 'Date',
    format: (value: Date) => formatDate(value)
  },
  {
    key: 'date',
    label: 'Time',
    format: (value: Date) => formatTime(value.toISOString())
  },
  {
    key: 'amount',
    label: 'Amount',
    align: 'right',
    format: (value: number) => formatWalletBalance(value)
  },
  {
    key: 'status',
    label: 'Status',
    format: (value: string) => {
      const statusStyle = getTransactionStatusStyle(value)
      return h(Badge, {
        class: `${statusStyle.color} ${statusStyle.backgroundColor} border-0`
      }, () => value.charAt(0).toUpperCase() + value.slice(1))
    }
  }
]

const filteredTransactions = computed(() => {
  // Filter transactions based on active tab if needed
  return props.transactions
})

const handleExport = () => {
  // Handle export functionality
  console.log('Export transactions')
}

const handleFilter = () => {
  // Handle filter functionality
  console.log('Filter transactions')
}
</script>