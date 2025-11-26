import type { PaginatedResponse } from '~/types/api'
import type {
    Child,
    CreateChildDto,
    UpdateChildDto,
    ExitRequest,
    CreateExitRequestDto,
    UpdateExitRequestDto,
    ExitRequestApprovalDto,
    EntryExitLog,
    CreateEntryExitLogDto,
    UpdateEntryExitLogDto,
    EntryExitActionDto,
    ExitRequestStatus,
    EntryExitLogType,
    EntryExitStatus
} from '~/types/children'

export interface ChildFilters {
    parent?: string
    houseNumber?: string
    isActive?: boolean
    search?: string
    ordering?: string
    page?: number
    pageSize?: number
}

export interface ExitRequestFilters {
    child?: string
    status?: ExitRequestStatus
    requestedBy?: string
    isExpired?: boolean
    isPending?: boolean
    ordering?: string
    page?: number
    pageSize?: number
}

export interface EntryExitLogFilters {
    child?: string
    logType?: EntryExitLogType
    status?: EntryExitStatus
    isOverdue?: boolean
    startDate?: string
    endDate?: string
    ordering?: string
    page?: number
    pageSize?: number
}

export const managementChildrenApi = {
    children: {
        getAll: (params?: ChildFilters) => {
            const { $api } = useNuxtApp()
            return $api<PaginatedResponse<Child>>('/management/children/', {
                method: 'GET',
                query: params
            })
        },

        getById: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<Child>(`/management/children/${id}/`, {
                method: 'GET'
            })
        },

        create: (data: CreateChildDto) => {
            const { $api } = useNuxtApp()
            return $api<Child>('/management/children/', {
                method: 'POST',
                body: data
            })
        },

        update: (id: string, data: UpdateChildDto) => {
            const { $api } = useNuxtApp()
            return $api<Child>(`/management/children/${id}/`, {
                method: 'PATCH',
                body: data
            })
        },

        delete: (id: string) => {
            const { $api } = useNuxtApp()
            return $api(`/management/children/${id}/`, {
                method: 'DELETE'
            })
        },

        uploadPhoto: (id: string, file: File) => {
            const { $api } = useNuxtApp()
            const formData = new FormData()
            formData.append('profile_photo', file)
            return $api<Child>(`/management/children/${id}/upload_photo/`, {
                method: 'POST',
                body: formData
            })
        }
    },

    exitRequests: {
        getAll: (params?: ExitRequestFilters) => {
            const { $api } = useNuxtApp()
            return $api<PaginatedResponse<ExitRequest>>('/management/child-exit-requests/', {
                method: 'GET',
                query: params
            })
        },

        getById: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<ExitRequest>(`/management/child-exit-requests/${id}/`, {
                method: 'GET'
            })
        },

        create: (data: CreateExitRequestDto) => {
            const { $api } = useNuxtApp()
            return $api<ExitRequest>('/management/child-exit-requests/', {
                method: 'POST',
                body: data
            })
        },

        update: (id: string, data: UpdateExitRequestDto) => {
            const { $api } = useNuxtApp()
            return $api<ExitRequest>(`/management/child-exit-requests/${id}/`, {
                method: 'PATCH',
                body: data
            })
        },

        delete: (id: string) => {
            const { $api } = useNuxtApp()
            return $api(`/management/child-exit-requests/${id}/`, {
                method: 'DELETE'
            })
        },

        approve: (id: string, reason?: string) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string; exit_request: ExitRequest }>(`/management/child-exit-requests/${id}/approve/`, {
                method: 'POST',
                body: { reason }
            })
        },

        deny: (id: string, reason: string) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string; exit_request: ExitRequest }>(`/management/child-exit-requests/${id}/deny/`, {
                method: 'POST',
                body: { reason }
            })
        },

        getPending: () => {
            const { $api } = useNuxtApp()
            return $api<ExitRequest[]>('/management/child-exit-requests/pending/', {
                method: 'GET'
            })
        }
    },

    entryExitLogs: {
        getAll: (params?: EntryExitLogFilters) => {
            const { $api } = useNuxtApp()
            return $api<PaginatedResponse<EntryExitLog>>('/management/child-entry-exit-logs/', {
                method: 'GET',
                query: params
            })
        },

        getById: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<EntryExitLog>(`/management/child-entry-exit-logs/${id}/`, {
                method: 'GET'
            })
        },

        create: (data: CreateEntryExitLogDto) => {
            const { $api } = useNuxtApp()
            return $api<EntryExitLog>('/management/child-entry-exit-logs/', {
                method: 'POST',
                body: data
            })
        },

        update: (id: string, data: UpdateEntryExitLogDto) => {
            const { $api } = useNuxtApp()
            return $api<EntryExitLog>(`/management/child-entry-exit-logs/${id}/`, {
                method: 'PATCH',
                body: data
            })
        },

        delete: (id: string) => {
            const { $api } = useNuxtApp()
            return $api(`/management/child-entry-exit-logs/${id}/`, {
                method: 'DELETE'
            })
        },

        markExit: (id: string, notes?: string) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string; log: EntryExitLog }>(`/management/child-entry-exit-logs/${id}/mark_exit/`, {
                method: 'POST',
                body: { notes }
            })
        },

        markEntry: (id: string, notes?: string) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string; log: EntryExitLog }>(`/management/child-entry-exit-logs/${id}/mark_entry/`, {
                method: 'POST',
                body: { notes }
            })
        },

        getByChild: (childId: string) => {
            const { $api } = useNuxtApp()
            return $api<EntryExitLog[]>(`/management/child-entry-exit-logs/by_child/${childId}/`, {
                method: 'GET'
            })
        }
    }
}
