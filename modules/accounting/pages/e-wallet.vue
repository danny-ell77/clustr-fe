<template>
  <div class="p-6 space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Main Content Area -->
      <div class="lg:col-span-3">
        <EWalletMainContent
          :wallet-balance="walletBalance"
          :transactions="transactionHistory"
          @fund-wallet="showFundWallet = true"
          @refresh-balance="refreshBalance"
          @bill-payment="showBillPayment = true"
          @schedule-payment="showSchedulePayment = true"
          @export-transactions="exportTransactions"
          @filter-transactions="filterTransactions"
        />
      </div>

      <!-- Right Sidebar -->
      <div class="lg:col-span-1">
        <EWalletSidebar
          :notifications="notifications"
          :scheduled-payments="scheduledPayments"
          :pending-payments="pendingPayments"
          @see-all-notifications="handleSeeAllNotifications"
          @notification-click="handleNotificationClick"
          @see-all-scheduled="handleSeeAllScheduled"
          @edit-scheduled-payment="editScheduledPayment"
          @cancel-scheduled-payment="cancelScheduledPayment"
          @see-all-pending="handleSeeAllPending"
          @pending-payment-click="handlePendingPaymentClick"
        />
      </div>
    </div>

    <!-- Modals -->
    <FundWalletModal
      :open="showFundWallet"
      :on-close="() => showFundWallet = false"
      @close="showFundWallet = false"
      @proceed="handleFundWallet"
    />

    <Dialog v-model:open="showSchedulePayment">
      <DialogContent class="sm:max-w-2xl">
        <SchedulePaymentForm
          :balance="walletBalance"
          :card-holder="cardHolder"
          @close="showSchedulePayment = false"
          @submit="handleSchedulePayment"
        />
      </DialogContent>
    </Dialog>

    <BillPaymentModal
      v-model:open="showBillPayment"
      :wallet-balance="walletBalance"
      @submit="handleBillPayment"
      @cancel="showBillPayment = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { definePageMeta } from '#imports'
import { useFormatters } from '~/composables/useFormatters'
import { useToast } from '~/composables/useToast'

// Import split components
import EWalletMainContent from '~/components/accounting/wallet/EWalletMainContent.vue'
import EWalletSidebar from '~/components/accounting/wallet/EWalletSidebar.vue'
import FundWalletModal from '~/components/accounting/wallet/FundWalletModal.vue'
import SchedulePaymentForm from '~/components/accounting/wallet/SchedulePaymentForm.vue'
import BillPaymentModal from '~/components/accounting/wallet/BillPaymentModal.vue'

import {
  Dialog,
  DialogContent,
} from '~/components/ui/dialog'

definePageMeta({
  title: 'E-Wallet',
  description: 'Manage your digital wallet and transactions'
})

const { formatCurrency, formatDate, formatTime } = useFormatters()
const { showToast } = useToast()

// Wallet state
const walletBalance = ref(415072.60)
const cardHolder = ref('ClustR Admin')

// Modal states
const showFundWallet = ref(false)
const showBillPayment = ref(false)
const showSchedulePayment = ref(false)

// Transaction history data
const transactionHistory = ref([
  {
    id: '1',
    type: 'electricity',
    date: new Date('2023-11-15T22:31:00'),
    amount: 25000,
    status: 'successful'
  },
  {
    id: '2',
    type: 'water_supply',
    date: new Date('2023-11-15T22:31:00'),
    amount: 15000,
    status: 'successful'
  },
  {
    id: '3',
    type: 'wallet_funding',
    date: new Date('2023-11-15T22:31:00'),
    amount: 50000,
    status: 'failed'
  },
  {
    id: '4',
    type: 'security',
    date: new Date('2023-11-15T22:31:00'),
    amount: 8000,
    status: 'successful'
  },
  {
    id: '5',
    type: 'wallet_funding',
    date: new Date('2023-11-15T22:31:00'),
    amount: 100000,
    status: 'successful'
  },
  {
    id: '6',
    type: 'electricity',
    date: new Date('2023-11-14T18:31:00'),
    amount: 30000,
    status: 'failed'
  },
  {
    id: '7',
    type: 'water_supply',
    date: new Date('2023-11-14T18:31:00'),
    amount: 12000,
    status: 'successful'
  },
  {
    id: '8',
    type: 'security',
    date: new Date('2023-11-14T18:31:00'),
    amount: 8000,
    status: 'failed'
  }
])

// Notifications data
const notifications = ref([
  {
    id: 1,
    message: 'You have 3 unread message',
    time: '2 hours ago'
  },
  {
    id: 2,
    message: 'Maintenance updated',
    time: '4 hours ago'
  },
  {
    id: 3,
    message: 'Your account payment...',
    time: '1 day ago'
  }
])

// Scheduled payments data
const scheduledPayments = ref([
  {
    id: '1',
    type: 'electricity',
    recipient: 'PHCN',
    amount: 25000,
    date: new Date('2023-11-20'),
    time: '10:00 AM',
    status: 'scheduled'
  },
  {
    id: '2',
    type: 'water_supply',
    recipient: 'Water Corp',
    amount: 15000,
    date: new Date('2023-11-22'),
    time: '02:00 PM',
    status: 'scheduled'
  },
  {
    id: '3',
    type: 'internet',
    recipient: 'MTN',
    amount: 12000,
    date: new Date('2023-11-25'),
    time: '09:00 AM',
    status: 'scheduled'
  }
])

// Pending payments data
const pendingPayments = ref([
  {
    id: 1,
    description: 'Property Tax',
    dueDate: 'Nov 18, 2023',
    icon: 'home'
  },
  {
    id: 2,
    description: 'Service Charge',
    dueDate: 'Nov 19, 2023',
    icon: 'settings'
  },
  {
    id: 3,
    description: 'Cable TV',
    dueDate: 'Nov 20, 2023',
    icon: 'tv'
  }
])

// Methods
const refreshBalance = () => {
  showToast('Wallet balance refreshed', 'success')
}

const handleFundWallet = async (data) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  walletBalance.value += data.amount
  
  // Add transaction to history
  transactionHistory.value.unshift({
    id: Date.now().toString(),
    type: 'wallet_funding',
    date: new Date(),
    amount: data.amount,
    status: 'successful'
  })

  showFundWallet.value = false
  showToast('Wallet funded successfully', 'success')
}

const handleSchedulePayment = async (data) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Add to scheduled payments
  scheduledPayments.value.unshift({
    id: Date.now().toString(),
    type: data.type,
    recipient: 'Service Provider',
    amount: data.amount,
    date: new Date(data.date),
    time: data.time,
    status: 'scheduled'
  })

  showSchedulePayment.value = false
  showToast('Payment scheduled successfully', 'success')
}

const handleBillPayment = async (data) => {
  if (data.amount > walletBalance.value) {
    showToast('Insufficient wallet balance', 'error')
    return
  }

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  walletBalance.value -= data.amount
  
  // Add transaction to history
  transactionHistory.value.unshift({
    id: Date.now().toString(),
    type: data.type,
    date: new Date(),
    amount: data.amount,
    status: 'successful'
  })

  showBillPayment.value = false
  showToast('Bill payment successful', 'success')
}

const editScheduledPayment = (payment) => {
  showToast(`Editing scheduled payment for ${payment.type}`, 'info')
  // Implementation for edit scheduled payment
}

const cancelScheduledPayment = (paymentId) => {
  const index = scheduledPayments.value.findIndex(p => p.id === paymentId)
  if (index > -1) {
    scheduledPayments.value.splice(index, 1)
    showToast('Scheduled payment cancelled', 'success')
  }
}

const exportTransactions = () => {
  showToast('Exporting transactions...', 'info')
  // Implementation for export functionality
}

const filterTransactions = () => {
  showToast('Opening transaction filters...', 'info')
  // Implementation for filter functionality
}

// Sidebar event handlers
const handleSeeAllNotifications = () => {
  showToast('Opening all notifications...', 'info')
}

const handleNotificationClick = (notification) => {
  showToast(`Clicked notification: ${notification.message}`, 'info')
}

const handleSeeAllScheduled = () => {
  navigateTo('/accounting/scheduled-payments')
}

const handleSeeAllPending = () => {
  showToast('Opening all pending payments...', 'info')
}

const handlePendingPaymentClick = (payment) => {
  showToast(`Clicked pending payment: ${payment.description}`, 'info')
}
</script>
