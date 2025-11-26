import type { PaginatedResponse } from '~/types/api'
import type { Bill, Transaction, WalletBalance, UtilityProvider, RecurringUtilityPayment, Report } from '~/types/accounting'

export interface CreateBillDto {
    title: string
    description?: string
    type: string
    amount: string
    dueDate: string
    userId?: string
    applyToAll?: boolean
}

export const accountingApi = {
    getBills: (params?: Record<string, any>) => {
        const { $api } = useNuxtApp()
        return $api<PaginatedResponse<Bill>>('/management/payments/bills/', {
            method: 'GET',
            query: params
        })
    },

    getBillById: (id: string) => {
        const { $api } = useNuxtApp()
        return $api<Bill>(`/management/payments/bills/${id}/`, {
            method: 'GET'
        })
    },

    createBill: (data: CreateBillDto) => {
        const { $api } = useNuxtApp()
        return $api<Bill>('/management/payments/create_bill/', {
            method: 'POST',
            body: data
        })
    },

    createBulkBills: (data: { bills: CreateBillDto[] }) => {
        const { $api } = useNuxtApp()
        return $api('/management/payments/create_bulk_bills/', {
            method: 'POST',
            body: data
        })
    },

    updateBill: (id: string, data: Partial<Bill>) => {
        const { $api } = useNuxtApp()
        return $api<Bill>(`/management/payments/bills/${id}/`, {
            method: 'PATCH',
            body: data
        })
    },

    deleteBill: (id: string) => {
        const { $api } = useNuxtApp()
        return $api(`/management/payments/bills/${id}/`, {
            method: 'DELETE'
        })
    },

    getPaymentDashboard: () => {
        const { $api } = useNuxtApp()
        return $api('/management/payments/dashboard/')
    },

    getClusterWallet: () => {
        const { $api } = useNuxtApp()
        return $api<WalletBalance>('/management/payments/cluster_wallet/')
    },

    getTransactions: (params?: Record<string, any>) => {
        const { $api } = useNuxtApp()
        return $api<PaginatedResponse<Transaction>>('/management/payments/transactions/', {
            method: 'GET',
            query: params
        })
    },

    fundWallet: (data: { amount: string; paymentMethod: string }) => {
        const { $api } = useNuxtApp()
        return $api('/management/payments/fund_wallet/', {
            method: 'POST',
            body: data
        })
    },

    getUtilityProviders: (params?: Record<string, any>) => {
        const { $api } = useNuxtApp()
        return $api<PaginatedResponse<UtilityProvider>>('/management/payments/utility_providers/', {
            method: 'GET',
            query: params
        })
    },

    getRecurringPayments: (params?: Record<string, any>) => {
        const { $api } = useNuxtApp()
        return $api<PaginatedResponse<RecurringUtilityPayment>>('/management/payments/recurring_payments/', {
            method: 'GET',
            query: params
        })
    },

    getReports: () => {
        const { $api } = useNuxtApp()
        return $api<{ reports: Report[] }>('/api/accounting/reports')
    },

    getReportById: (id: string) => {
        const { $api } = useNuxtApp()
        return $api<{ report: Report }>(`/api/accounting/reports/${id}`)
    },

    updateReport: (id: string, patch: Partial<Report>) => {
        const { $api } = useNuxtApp()
        return $api<{ report: Report }>(`/api/accounting/reports/${id}`, {
            method: 'PUT',
            body: patch
        })
    }
}
