import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import {
    managementPaymentsApi,
    type BillFilters,
    type TransactionFilters,
    type RecurringPaymentFilters
} from '~/services/api/payments.api'
import { queryKeys } from '~/constants/query-keys'
import type {
    CreateBillDto,
    BulkBillsDto,
    UpdateBillStatusDto,
    CreateRecurringPaymentDto,
    UpdateRecurringPaymentDto,
    ClusterWalletCreditDto,
    ClusterWalletTransferDto
} from '~/types/payments'

export const usePayments = () => {
    const queryClient = useQueryClient()
    const toast = useToast()

    const usePaymentDashboard = () => {
        return useQuery({
            queryKey: [...queryKeys.payments.all, 'dashboard'] as const,
            queryFn: () => managementPaymentsApi.getDashboard(),
            refetchInterval: 60000
        })
    }

    const useBills = (filters: Ref<BillFilters>) => {
        return useQuery({
            queryKey: computed(() => queryKeys.bills.list(filters.value)),
            queryFn: () => managementPaymentsApi.bills.getAll(filters.value)
        })
    }

    const useBill = (billId: string) => {
        return useQuery({
            queryKey: queryKeys.bills.detail(billId),
            queryFn: () => managementPaymentsApi.bills.getById(billId),
            enabled: !!billId
        })
    }

    const useTransactions = (filters: Ref<TransactionFilters>) => {
        return useQuery({
            queryKey: computed(() => queryKeys.payments.transactions.list(filters.value)),
            queryFn: () => managementPaymentsApi.transactions.getAll(filters.value)
        })
    }

    const useTransaction = (transactionId: string) => {
        return useQuery({
            queryKey: queryKeys.payments.transactions.detail(transactionId),
            queryFn: () => managementPaymentsApi.transactions.getById(transactionId),
            enabled: !!transactionId
        })
    }

    const useRecurringPayments = (filters?: Ref<RecurringPaymentFilters>) => {
        return useQuery({
            queryKey: computed(() =>
                filters
                    ? queryKeys.payments.recurringPayments.list(filters.value)
                    : queryKeys.payments.recurringPayments.all()
            ),
            queryFn: () => managementPaymentsApi.recurringPayments.getAll(filters?.value)
        })
    }

    const useClusterWallet = () => {
        return useQuery({
            queryKey: queryKeys.payments.wallet(),
            queryFn: () => managementPaymentsApi.clusterWallet.get(),
            refetchInterval: 30000
        })
    }

    const createBillMutation = useMutation({
        mutationFn: (data: CreateBillDto) =>
            managementPaymentsApi.bills.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.bills.all })
            queryClient.invalidateQueries({ queryKey: [...queryKeys.payments.all, 'dashboard'] })
            toast.success('Bill created successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to create bill', error.message || 'Please try again')
        }
    })

    const createBulkBillsMutation = useMutation({
        mutationFn: (data: BulkBillsDto) =>
            managementPaymentsApi.bills.createBulk(data),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.bills.all })
            queryClient.invalidateQueries({ queryKey: [...queryKeys.payments.all, 'dashboard'] })
            toast.success(`${response.createdCount} bills created successfully`)
        },
        onError: (error: any) => {
            toast.error('Failed to create bulk bills', error.message || 'Please try again')
        }
    })

    const updateBillStatusMutation = useMutation({
        mutationFn: (data: UpdateBillStatusDto) =>
            managementPaymentsApi.bills.updateStatus(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.bills.detail(variables.billId) })
            queryClient.invalidateQueries({ queryKey: queryKeys.bills.all })
            queryClient.invalidateQueries({ queryKey: [...queryKeys.payments.all, 'dashboard'] })
            toast.success('Bill status updated successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to update bill status', error.message || 'Please try again')
        }
    })

    const createRecurringMutation = useMutation({
        mutationFn: (data: CreateRecurringPaymentDto) =>
            managementPaymentsApi.recurringPayments.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.payments.recurringPayments.all() })
            queryClient.invalidateQueries({ queryKey: [...queryKeys.payments.all, 'dashboard'] })
            toast.success('Recurring payment created successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to create recurring payment', error.message || 'Please try again')
        }
    })

    const updateRecurringMutation = useMutation({
        mutationFn: (data: UpdateRecurringPaymentDto) =>
            managementPaymentsApi.recurringPayments.update(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.payments.recurringPayments.detail(variables.paymentId) })
            queryClient.invalidateQueries({ queryKey: queryKeys.payments.recurringPayments.all() })
            toast.success('Recurring payment updated successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to update recurring payment', error.message || 'Please try again')
        }
    })

    const pauseRecurringMutation = useMutation({
        mutationFn: (paymentId: string) =>
            managementPaymentsApi.recurringPayments.pause({ paymentId }),
        onSuccess: (_, paymentId) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.payments.recurringPayments.detail(paymentId) })
            queryClient.invalidateQueries({ queryKey: queryKeys.payments.recurringPayments.all() })
            toast.success('Recurring payment paused successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to pause recurring payment', error.message || 'Please try again')
        }
    })

    const resumeRecurringMutation = useMutation({
        mutationFn: (paymentId: string) =>
            managementPaymentsApi.recurringPayments.resume({ paymentId }),
        onSuccess: (_, paymentId) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.payments.recurringPayments.detail(paymentId) })
            queryClient.invalidateQueries({ queryKey: queryKeys.payments.recurringPayments.all() })
            toast.success('Recurring payment resumed successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to resume recurring payment', error.message || 'Please try again')
        }
    })

    const cancelRecurringMutation = useMutation({
        mutationFn: (paymentId: string) =>
            managementPaymentsApi.recurringPayments.cancel({ payment_id: paymentId }),
        onSuccess: (_, paymentId) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.payments.recurringPayments.detail(paymentId) })
            queryClient.invalidateQueries({ queryKey: queryKeys.payments.recurringPayments.all() })
            toast.success('Recurring payment cancelled successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to cancel recurring payment', error.message || 'Please try again')
        }
    })

    const walletCreditMutation = useMutation({
        mutationFn: (data: ClusterWalletCreditDto) =>
            managementPaymentsApi.clusterWallet.credit(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.payments.wallet() })
            queryClient.invalidateQueries({ queryKey: queryKeys.payments.transactions.all() })
            queryClient.invalidateQueries({ queryKey: [...queryKeys.payments.all, 'dashboard'] })
            toast.success('Wallet credited successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to credit wallet', error.message || 'Please try again')
        }
    })

    const walletDebitMutation = useMutation({
        mutationFn: (data: ClusterWalletTransferDto) =>
            managementPaymentsApi.clusterWallet.transfer(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.payments.wallet() })
            queryClient.invalidateQueries({ queryKey: queryKeys.payments.transactions.all() })
            queryClient.invalidateQueries({ queryKey: [...queryKeys.payments.all, 'dashboard'] })
            toast.success('Wallet debited successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to debit wallet', error.message || 'Please try again')
        }
    })

    const retryFailedPaymentMutation = useMutation({
        mutationFn: (errorId: string) =>
            managementPaymentsApi.transactions.retryFailed({ errorId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.payments.transactions.all() })
            queryClient.invalidateQueries({ queryKey: [...queryKeys.payments.all, 'dashboard'] })
            toast.success('Payment retry initiated successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to retry payment', error.message || 'Please try again')
        }
    })

    const acknowledgeBillMutation = useMutation({
        mutationFn: ({ billId }: { billId: string }) =>
            managementPaymentsApi.bills.acknowledge(billId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.bills.detail(variables.billId) })
            queryClient.invalidateQueries({ queryKey: queryKeys.bills.all })
            toast.success('Bill acknowledged successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to acknowledge bill', error.message || 'Please try again')
        }
    })

    const disputeBillMutation = useMutation({
        mutationFn: ({ billId, reason }: { billId: string; reason: string }) =>
            managementPaymentsApi.bills.dispute(billId, reason),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.bills.detail(variables.billId) })
            queryClient.invalidateQueries({ queryKey: queryKeys.bills.all })
            toast.success('Bill disputed successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to dispute bill', error.message || 'Please try again')
        }
    })

    const payBillMutation = useMutation({
        mutationFn: ({ billId, amount }: { billId: string; amount?: string }) =>
            managementPaymentsApi.bills.pay(billId, amount),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.bills.detail(variables.billId) })
            queryClient.invalidateQueries({ queryKey: queryKeys.bills.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.payments.wallet() })
            queryClient.invalidateQueries({ queryKey: queryKeys.payments.transactions.all() })
            toast.success('Bill paid successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to pay bill', error.message || 'Please try again')
        }
    })

    return {
        usePaymentDashboard,
        useBills,
        useBill,
        useTransactions,
        useTransaction,
        useRecurringPayments,
        useClusterWallet,
        createBillMutation,
        createBulkBillsMutation,
        updateBillStatusMutation,
        createRecurringMutation,
        updateRecurringMutation,
        pauseRecurringMutation,
        resumeRecurringMutation,
        cancelRecurringMutation,
        walletCreditMutation,
        walletDebitMutation,
        retryFailedPaymentMutation,
        acknowledgeBillMutation,
        disputeBillMutation,
        payBillMutation
    }
}
