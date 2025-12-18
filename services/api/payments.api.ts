import type { PaginatedResponse } from '~/types/api'
import type {
    Bill,
    Transaction,
    RecurringPayment,
    CreateBillDto,
    BulkBillsDto,
    UpdateBillStatusDto,
    CreateRecurringPaymentDto,
    UpdateRecurringPaymentDto,
    ClusterWalletTransferDto,
    ClusterWalletCreditDto,
    PaymentDashboard,
    ClusterWalletResponse,
    BillType,
    BillStatus,
    TransactionType,
    TransactionStatus,
    RecurringPaymentFrequency,
    RecurringPaymentStatus,
    PaymentError
} from '~/types/payments'

export interface BillFilters {
    userId?: string
    type?: BillType
    status?: BillStatus
    clusterWide?: boolean
    dateFrom?: string
    dateTo?: string
    search?: string
    ordering?: string
    page?: number
    pageSize?: number
}

export interface TransactionFilters {
    userId?: string
    type?: TransactionType
    status?: TransactionStatus
    dateFrom?: string
    dateTo?: string
    search?: string
    ordering?: string
    page?: number
    pageSize?: number
}

export interface RecurringPaymentFilters {
    userId?: string
    status?: RecurringPaymentStatus
    frequency?: RecurringPaymentFrequency
    search?: string
    ordering?: string
    page?: number
    pageSize?: number
}

export interface BillListResponse {
    bills: Bill[]
    pagination: {
        page: number
        pageSize: number
        totalCount: number
        totalPages: number
    }
}

export interface TransactionListResponse {
    transactions: Transaction[]
    pagination: {
        page: number
        pageSize: number
        totalCount: number
        totalPages: number
    }
}

export interface RecurringPaymentListResponse {
    recurringPayments: RecurringPayment[]
    pagination: {
        page: number
        pageSize: number
        totalCount: number
        totalPages: number
    }
}

export interface BulkBillsResponse {
    createdCount: number
    requestedCount: number
    bills: Bill[]
}

export interface PaymentProvider {
    code: string
    name: string
    available: boolean
}

export interface PaymentProvidersResponse {
    providers: PaymentProvider[]
}

export interface TransferResponse {
    transactionId: string
    amount: string
    currency: string
    description: string
    status: TransactionStatus
    processedAt?: string
    reference: string
    recipientAccount: {
        accountNumber: string
        accountName: string
        bankCode: string
    }
}

export interface VerifyManualCreditDto {
    transactionId: string
}

export interface VerifyManualCreditResponse {
    transactionId: string
    status: TransactionStatus
    amount: string
    processedAt?: string
    verified: boolean
}

export interface RetryFailedPaymentDto {
    errorId: string
}

export interface RetryFailedPaymentResponse {
    errorId: string
    transactionId: string
    retryCount: number
    status: TransactionStatus
}

export interface PauseRecurringPaymentDto {
    paymentId: string
}

export interface ResumeRecurringPaymentDto {
    paymentId: string
}

export interface CancelRecurringPaymentDto {
    payment_id: string
}

export const managementPaymentsApi = {
    getDashboard: () => {
        const { $api } = useNuxtApp()
        return $api<PaymentDashboard>('/management/payments/dashboard/', {
            method: 'GET'
        })
    },

    bills: {
        getAll: (params?: BillFilters) => {
            const { $api } = useNuxtApp()
            return $api<BillListResponse>('/management/payments/bills/', {
                method: 'GET',
                query: params
            })
        },

        getById: (billId: string) => {
            const { $api } = useNuxtApp()
            return $api<Bill>(`/management/payments/bills/${billId}/`, {
                method: 'GET'
            })
        },

        create: (data: CreateBillDto) => {
            const { $api } = useNuxtApp()
            return $api<Bill>('/management/payments/create_bill/', {
                method: 'POST',
                body: data
            })
        },

        createBulk: (data: BulkBillsDto) => {
            const { $api } = useNuxtApp()
            return $api<BulkBillsResponse>('/management/payments/create_bulk_bills/', {
                method: 'POST',
                body: data
            })
        },

        updateStatus: (data: UpdateBillStatusDto) => {
            const { $api } = useNuxtApp()
            return $api<Bill>('/management/payments/update_bill_status/', {
                method: 'POST',
                body: data
            })
        },

        acknowledge: (billId: string) => {
            const { $api } = useNuxtApp()
            return $api<Bill>('/management/payments/acknowledge_bill/', {
                method: 'POST',
                body: { bill_id: billId }
            })
        },

        dispute: (billId: string, reason: string) => {
            const { $api } = useNuxtApp()
            return $api<Bill>('/management/payments/dispute_bill/', {
                method: 'POST',
                body: { bill_id: billId, reason }
            })
        },

        pay: (billId: string, amount?: string) => {
            const { $api } = useNuxtApp()
            return $api<Transaction>('/management/payments/pay_bill/', {
                method: 'POST',
                body: { bill_id: billId, amount }
            })
        }
    },

    transactions: {
        getAll: (params?: TransactionFilters) => {
            const { $api } = useNuxtApp()
            return $api<TransactionListResponse>('/management/payments/transactions/', {
                method: 'GET',
                query: params
            })
        },

        getById: (transactionId: string) => {
            const { $api } = useNuxtApp()
            return $api<Transaction>(`/management/payments/transactions/${transactionId}/`, {
                method: 'GET'
            })
        },

        retryFailed: (data: RetryFailedPaymentDto) => {
            const { $api } = useNuxtApp()
            return $api<RetryFailedPaymentResponse>('/management/payments/retry_failed_payment/', {
                method: 'POST',
                body: data
            })
        }
    },

    recurringPayments: {
        getAll: (params?: RecurringPaymentFilters) => {
            const { $api } = useNuxtApp()
            return $api<RecurringPaymentListResponse>('/management/payments/recurring_payments/', {
                method: 'GET',
                query: params
            })
        },

        create: (data: CreateRecurringPaymentDto) => {
            const { $api } = useNuxtApp()
            return $api<RecurringPayment>('/management/payments/create_recurring_payment/', {
                method: 'POST',
                body: data
            })
        },

        update: (data: UpdateRecurringPaymentDto) => {
            const { $api } = useNuxtApp()
            return $api<RecurringPayment>('/management/payments/update_recurring_payment/', {
                method: 'PUT',
                body: data
            })
        },

        pause: (data: PauseRecurringPaymentDto) => {
            const { $api } = useNuxtApp()
            return $api<RecurringPayment>('/management/payments/pause_recurring_payment/', {
                method: 'POST',
                body: data
            })
        },

        resume: (data: ResumeRecurringPaymentDto) => {
            const { $api } = useNuxtApp()
            return $api<RecurringPayment>('/management/payments/resume_recurring_payment/', {
                method: 'POST',
                body: data
            })
        },

        cancel: (data: CancelRecurringPaymentDto) => {
            const { $api } = useNuxtApp()
            return $api<RecurringPayment>('/management/payments/cancel_recurring_payment/', {
                method: 'POST',
                body: data
            })
        }
    },

    clusterWallet: {
        get: () => {
            const { $api } = useNuxtApp()
            return $api<ClusterWalletResponse>('/management/payments/cluster_wallet/', {
                method: 'GET'
            })
        },

        transfer: (data: ClusterWalletTransferDto) => {
            const { $api } = useNuxtApp()
            return $api<TransferResponse>('/management/payments/cluster_wallet_transfer/', {
                method: 'POST',
                body: data
            })
        },

        credit: (data: ClusterWalletCreditDto) => {
            const { $api } = useNuxtApp()
            return $api<Transaction>('/management/payments/cluster_wallet_credit/', {
                method: 'POST',
                body: data
            })
        },

        verifyManualCredit: (data: VerifyManualCreditDto) => {
            const { $api } = useNuxtApp()
            return $api<VerifyManualCreditResponse>('/management/payments/verify_manual_credit/', {
                method: 'POST',
                body: data
            })
        }
    },

    getAvailableProviders: () => {
        const { $api } = useNuxtApp()
        return $api<PaymentProvidersResponse>('/management/payments/available_payment_providers/', {
            method: 'GET'
        })
    }
}
