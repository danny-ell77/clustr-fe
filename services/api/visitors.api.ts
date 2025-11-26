import type { PaginatedResponse } from '~/types/api'
import type {
    Visitor,
    CreateVisitorDto,
    UpdateVisitorDto,
    VisitorLog,
    CreateVisitorLogDto,
    UpdateVisitorLogDto,
    VisitorStatus,
    VisitorLogStatus
} from '~/types/visitors'

export interface VisitorFilters {
    status?: VisitorStatus
    host?: string
    search?: string
    ordering?: string
    page?: number
    pageSize?: number
}

export interface VisitorLogFilters {
    visitor?: string
    status?: VisitorLogStatus
    startDate?: string
    endDate?: string
    search?: string
    ordering?: string
    page?: number
    pageSize?: number
}

export const managementVisitorsApi = {
    visitors: {
        getAll: (params?: VisitorFilters) => {
            const { $api } = useNuxtApp()
            return $api<PaginatedResponse<Visitor>>('/management/visitors/', {
                method: 'GET',
                query: params
            })
        },

        getById: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<Visitor>(`/management/visitors/${id}/`, {
                method: 'GET'
            })
        },

        create: (data: CreateVisitorDto) => {
            const { $api } = useNuxtApp()
            return $api<Visitor>('/management/visitors/', {
                method: 'POST',
                body: data
            })
        },

        update: (id: string, data: UpdateVisitorDto) => {
            const { $api } = useNuxtApp()
            return $api<Visitor>(`/management/visitors/${id}/`, {
                method: 'PATCH',
                body: data
            })
        },

        delete: (id: string) => {
            const { $api } = useNuxtApp()
            return $api(`/management/visitors/${id}/`, {
                method: 'DELETE'
            })
        },

        checkIn: (id: string, notes?: string) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string; visitor: Visitor }>(`/management/visitors/${id}/check_in/`, {
                method: 'POST',
                body: { notes }
            })
        },

        checkOut: (id: string, notes?: string) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string; visitor: Visitor }>(`/management/visitors/${id}/check_out/`, {
                method: 'POST',
                body: { notes }
            })
        },

        generatePass: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string; pass_url: string; qr_code: string }>(`/management/visitors/${id}/generate_pass/`, {
                method: 'POST'
            })
        },

        getActive: () => {
            const { $api } = useNuxtApp()
            return $api<Visitor[]>('/management/visitors/active/', {
                method: 'GET'
            })
        }
    },

    logs: {
        getAll: (params?: VisitorLogFilters) => {
            const { $api } = useNuxtApp()
            return $api<PaginatedResponse<VisitorLog>>('/management/visitor-logs/', {
                method: 'GET',
                query: params
            })
        },

        getById: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<VisitorLog>(`/management/visitor-logs/${id}/`, {
                method: 'GET'
            })
        },

        getByVisitor: (visitorId: string) => {
            const { $api } = useNuxtApp()
            return $api<VisitorLog[]>(`/management/visitors/${visitorId}/logs/`, {
                method: 'GET'
            })
        },

        create: (data: CreateVisitorLogDto) => {
            const { $api } = useNuxtApp()
            return $api<VisitorLog>('/management/visitor-logs/', {
                method: 'POST',
                body: data
            })
        },

        update: (id: string, data: UpdateVisitorLogDto) => {
            const { $api } = useNuxtApp()
            return $api<VisitorLog>(`/management/visitor-logs/${id}/`, {
                method: 'PATCH',
                body: data
            })
        },

        delete: (id: string) => {
            const { $api } = useNuxtApp()
            return $api(`/management/visitor-logs/${id}/`, {
                method: 'DELETE'
            })
        }
    }
}
