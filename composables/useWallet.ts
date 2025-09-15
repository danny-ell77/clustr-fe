import { ref, computed } from 'vue'
import { useToast } from '~/composables/useToast'
import { useSuccessModal } from '~/composables/useSuccessModal'

interface Transaction {
  id: string
  type: string
  date: Date
  amount: number
  status: string
  recipient?: string
  description?: string
}

interface ScheduledPayment {
  id: string
  type: string
  recipient: string
  amount: number
  date: Date
  time: string
  status: string
}

export const useWallet = () => {
  const toast = useToast()
  const successModal = useSuccessModal()
  
  const balance = ref(0)
  const isLoading = ref(false)
  const transactions = ref&lt;Transaction[]&gt;([])
  const scheduledPayments = ref&lt;ScheduledPayment[]&gt;([])

  // Computed properties
  const pendingPayments = computed(() => {
    return scheduledPayments.value.filter(payment => 
      payment.status === 'pending' || payment.status === 'scheduled'
    )
  })

  // Methods
  const fetchBalance = async () => {
    try {
      isLoading.value = true
      // API call to fetch balance would go here
      // For now using mock data
      balance.value = 415072.60
    } catch (error) {
      toast.error('Failed to fetch wallet balance')
    } finally {
      isLoading.value = false
    }
  }

  const fetchTransactions = async () => {
    try {
      isLoading.value = true
      // API call to fetch transactions would go here
      // Mock data for now
      transactions.value = [
        {
          id: '1',
          type: 'electricity',
          date: new Date(),
          amount: 45000,
          status: 'successful'
        }
        // Add more mock transactions as needed
      ]
    } catch (error) {
      toast.error('Failed to fetch transactions')
    } finally {
      isLoading.value = false
    }
  }

  const fundWallet = async (amount: number, paymentMethod: string, cardDetails?: any) => {
    try {
      isLoading.value = true
      // API call to process payment would go here
      
      // Simulate successful payment
      balance.value += amount
      
      // Add transaction record
      transactions.value.unshift({
        id: Date.now().toString(),
        type: 'wallet_funding',
        date: new Date(),
        amount: amount,
        status: 'successful'
      })

      successModal.show({
        title: 'Payment Successful',
        message: \`Successfully added ₦\${amount.toLocaleString()} to your wallet\`
      })
    } catch (error) {
      toast.error('Failed to process payment')
    } finally {
      isLoading.value = false
    }
  }

  const schedulePayment = async (payment: Omit&lt;ScheduledPayment, 'id' | 'status'&gt;) => {
    try {
      isLoading.value = true
      // API call to schedule payment would go here
      
      // Add to scheduled payments
      scheduledPayments.value.unshift({
        ...payment,
        id: Date.now().toString(),
        status: 'scheduled'
      })

      successModal.show({
        title: 'Payment Scheduled',
        message: 'Your payment has been scheduled successfully'
      })
    } catch (error) {
      toast.error('Failed to schedule payment')
    } finally {
      isLoading.value = false
    }
  }

  const cancelScheduledPayment = async (paymentId: string) => {
    try {
      isLoading.value = true
      // API call to cancel payment would go here
      
      // Update payment status
      const payment = scheduledPayments.value.find(p => p.id === paymentId)
      if (payment) {
        payment.status = 'cancelled'
      }

      successModal.show({
        title: 'Payment Cancelled',
        message: 'Scheduled payment cancelled successfully'
      })
    } catch (error) {
      toast.error('Failed to cancel payment')
    } finally {
      isLoading.value = false
    }
  }

  // Initialize
  fetchBalance()
  fetchTransactions()

  return {
    // State
    balance,
    isLoading,
    transactions,
    scheduledPayments,
    pendingPayments,

    // Methods
    fetchBalance,
    fetchTransactions,
    fundWallet,
    schedulePayment,
    cancelScheduledPayment
  }
}