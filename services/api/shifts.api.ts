import type { PaginatedResponse } from '~/types/api'
import type {
    Shift,
    CreateShiftDto,
    UpdateShiftDto,
    ShiftSwapRequest,
    CreateShiftSwapRequestDto,
    ShiftSwapResponseDto,
    ClockInOutDto,
    ShiftStatistics,
    ShiftType,
    ShiftStatus,
    ShiftSwapStatus
} from '~/types/shifts'

export interface ShiftFilters {
    staffId?: number
    status?: ShiftStatus
    shiftTpe?: ShiftType
    startDate?: string
    endDte?: string
    search?: string
    ordering?: string
    page?: number
    pageSze?: number
}

export interface ShiftSwapRequestFilters {
    status?: ShiftSwapStatus
    ordering?: string
    page?: number
    pageSe?: number
}

export interface ShiftStatisticsFilters {
    startDte?: string
    endD?: string
}

export interface StaffScheduleFilters {
    startD?: string
    endDate?: string
}

export interface StaffSchedule {
    staffMmber: {
        id: string
        name: string
        email: string
    }
    shifts: Shift[]
}

export interface ShiftReportFilters {
    startDte?: string
    endDate?: string
    type?: 'summary' | 'detailed'
}

export interface ShiftReportSummary {
    overallStatistics: ShiftStatistics
    staffStatistics: Record<string, {
        totalShifts: number
        completedShifts: number
        noShowShifts: number
        cancelledShifts: number
    }>
    period: {
        startDate?: string
        endDate?: string
    }
}

export interface ShiftReportDetailed {
    shifts: Shift[]
    period: {
        startDate?: string
        endDate?: string
    }
}

export const managementShiftsApi = {
    shifts: {
        getAll: (params?: ShiftFilters) => {
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

        create: (data: CreateShiftDto) => {
            const { $api } = useNuxtApp()
            return $api<Shift>('/management/shifts/', {
                method: 'POST',
                body: data
            })
        },

        update: (id: string, data: UpdateShiftDto) => {
            const { $api } = useNuxtApp()
            return $api<Shift>(`/management/shifts/${id}/`, {
                method: 'PATCH',
                body: data
            })
        },

        delete: (id: string) => {
            const { $api } = useNuxtApp()
            return $api(`/management/shifts/${id}/`, {
                method: 'DELETE'
            })
        },

        clockIn: (id: string, data?: ClockInOutDto) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string; shift: Shift }>(`/management/shifts/${id}/clock_in/`, {
                method: 'POST',
                body: data || {}
            })
        },

        clockOut: (id: string, data?: ClockInOutDto) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string; shift: Shift }>(`/management/shifts/${id}/clock_out/`, {
                method: 'POST',
                body: data || {}
            })
        },

        markNoShow: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string; shift: Shift }>(`/management/shifts/${id}/mark_no_show/`, {
                method: 'POST'
            })
        },

        cancel: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string; shift: Shift }>(`/management/shifts/${id}/cancel/`, {
                method: 'POST'
            })
        },

        getStatistics: (params?: ShiftStatisticsFilters) => {
            const { $api } = useNuxtApp()
            return $api<ShiftStatistics>('/management/shifts/statistics/', {
                method: 'GET',
                query: params
            })
        },

        getUpcoming: () => {
            const { $api } = useNuxtApp()
            return $api<Shift[]>('/management/shifts/upcoming/', {
                method: 'GET'
            })
        },

        getOverdue: () => {
            const { $api } = useNuxtApp()
            return $api<Shift[]>('/management/shifts/overdue/', {
                method: 'GET'
            })
        }
    },

    swapRequests: {
        getAll: (params?: ShiftSwapRequestFilters) => {
            const { $api } = useNuxtApp()
            return $api<PaginatedResponse<ShiftSwapRequest>>('/management/shift-swap-requests/', {
                method: 'GET',
                query: params
            })
        },

        getById: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<ShiftSwapRequest>(`/management/shift-swap-requests/${id}/`, {
                method: 'GET'
            })
        },

        create: (data: CreateShiftSwapRequestDto) => {
            const { $api } = useNuxtApp()
            return $api<ShiftSwapRequest>('/management/shift-swap-requests/', {
                method: 'POST',
                body: data
            })
        },

        respond: (id: string, data: ShiftSwapResponseDto) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string; swapRequest: ShiftSwapRequest }>(`/management/shift-swap-requests/${id}/respond/`, {
                method: 'POST',
                body: data
            })
        },

        delete: (id: string) => {
            const { $api } = useNuxtApp()
            return $api(`/management/shift-swap-requests/${id}/`, {
                method: 'DELETE'
            })
        }
    },

    schedules: {
        getStaffSchedule: (staffId: string, params?: StaffScheduleFilters) => {
            const { $api } = useNuxtApp()
            return $api<StaffSchedule>(`/management/staff-schedule/${staffId}/`, {
                method: 'GET',
                query: params
            })
        },

        getAllStaffSchedules: (params?: StaffScheduleFilters) => {
            const { $api } = useNuxtApp()
            return $api<{ schedules: StaffSchedule[] }>('/management/staff-schedule/', {
                method: 'GET',
                query: params
            })
        }
    },

    reports: {
        generate: (params?: ShiftReportFilters) => {
            const { $api } = useNuxtApp()
            return $api<ShiftReportSummary | ShiftReportDetailed>('/management/shift-reports/', {
                method: 'GET',
                query: params
            })
        }
    }
}
