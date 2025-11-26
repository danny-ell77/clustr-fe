import type { PaginatedResponse } from '~/types/api'
import type { Shift, ShiftCreate, ShiftUpdate } from '~/types/shift'

export interface ShiftStatistics {
    totalShifts: number
    completedShifts: number
    noShowShifts: number
    cancelledShifts: number
    attendanceRate: number
    averageOvertimeHours: number
}

export const shiftApi = {
    getAll: (params?: Record<string, any>) => {
        const { $api } = useNuxtApp()
        return $api<PaginatedResponse<Shift>>('/management/shifts/', {
            method: 'GET',
            query: params
        })
    },

    getById: (id: string) => {
        const { $api } = useNuxtApp()
        return $api<Shift>(`/management/shifts/${id}/`, {
            method: 'GET'
        })
    },

    create: (data: ShiftCreate) => {
        const { $api } = useNuxtApp()
        return $api<Shift>('/management/shifts/', {
            method: 'POST',
            body: data
        })
    },

    update: (id: string, data: ShiftUpdate) => {
        const { $api } = useNuxtApp()
        return $api<Shift>(`/management/shifts/${id}/`, {
            method: 'PATCH',
            body: data
        })
    },

    clockIn: (id: string, timestamp?: string, notes?: string) => {
        const { $api } = useNuxtApp()
        return $api<Shift>(`/management/shifts/${id}/clock_in/`, {
            method: 'POST',
            body: { timestamp, notes }
        })
    },

    clockOut: (id: string, timestamp?: string, notes?: string) => {
        const { $api } = useNuxtApp()
        return $api<Shift>(`/management/shifts/${id}/clock_out/`, {
            method: 'POST',
            body: { timestamp, notes }
        })
    },

    getStatistics: (startDate?: string, endDate?: string) => {
        const { $api } = useNuxtApp()
        return $api<ShiftStatistics>('/management/shifts/statistics/', {
            method: 'GET',
            query: { startDate, endDate }
        })
    },

    getUpcoming: () => {
        const { $api } = useNuxtApp()
        return $api<Shift[]>('/management/shifts/upcoming/', {
            method: 'GET'
        })
    },

    cancel: (id: string) => {
        const { $api } = useNuxtApp()
        return $api<Shift>(`/management/shifts/${id}/cancel/`, {
            method: 'POST'
        })
    },

    markNoShow: (id: string) => {
        const { $api } = useNuxtApp()
        return $api<Shift>(`/management/shifts/${id}/mark_no_show/`, {
            method: 'POST'
        })
    }
}
