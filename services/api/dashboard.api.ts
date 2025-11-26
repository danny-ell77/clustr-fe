export interface DashboardStats {
    totalResidents: number
    totalApartments: number
    totalVacant: number
}

export interface RevenueExpenseData {
    month: string
    revenue: number
    expenses: number
}

export interface DashboardRevenue {
    period: string
    data: RevenueExpenseData[]
}

export const dashboardApi = {
    getStats: () => {
        const { $api } = useNuxtApp()
        return $api<DashboardStats>('/management/dashboard/stats/')
    },

    getRevenueExpenses: (period: string = 'last_7_months') => {
        const { $api } = useNuxtApp()
        return $api<DashboardRevenue>('/management/dashboard/revenue-expenses/', {
            method: 'GET',
            query: { period }
        })
    }
}
