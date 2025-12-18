import type { PaginatedResponse } from '~/types/api'
import type {
    Resident,
    ResidentDetail,
    ResidentStats,
    CreateResidentDto,
    UpdateResidentDto,
    ResidentFilters
} from '~/types/residents'

export interface ResidentImportResult {
    created: number
    updated: number
    errors: string[]
}

const toSnakeCase = (obj: any): any => {
    if (obj === null || obj === undefined) return obj
    if (Array.isArray(obj)) return obj.map(toSnakeCase)
    if (typeof obj !== 'object') return obj

    return Object.keys(obj).reduce((acc, key) => {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
        acc[snakeKey] = toSnakeCase(obj[key])
        return acc
    }, {} as any)
}

export const residentsApi = {
    getResidents: (params?: ResidentFilters) => {
        const { $api } = useNuxtApp()
        return $api<PaginatedResponse<Resident>>('/management/residents/', {
            method: 'GET',
            query: toSnakeCase(params)
        })
    },

    getResident: (id: string) => {
        const { $api } = useNuxtApp()
        return $api<ResidentDetail>(`/management/residents/${id}/`, {
            method: 'GET'
        })
    },

    getResidentStats: () => {
        const { $api } = useNuxtApp()
        return $api<ResidentStats>('/management/residents/stats/', {
            method: 'GET'
        })
    },

    createResident: (data: CreateResidentDto) => {
        const { $api } = useNuxtApp()
        return $api<Resident>('/management/residents/', {
            method: 'POST',
            body: toSnakeCase(data)
        })
    },

    updateResident: (id: string, data: UpdateResidentDto) => {
        const { $api } = useNuxtApp()
        return $api<Resident>(`/management/residents/${id}/`, {
            method: 'PATCH',
            body: toSnakeCase(data)
        })
    },

    updateApprovalStatus: (id: string, approved: boolean) => {
        const { $api } = useNuxtApp()
        return $api<{ approvedByAdmin: boolean }>(`/management/residents/${id}/update-approval-status/`, {
            method: 'POST',
            body: { approved }
        })
    },

    exportResidents: (params?: ResidentFilters) => {
        const { $api } = useNuxtApp()
        return $api<Blob>('/management/residents/export/', {
            method: 'GET',
            query: toSnakeCase(params),
            responseType: 'blob'
        })
    },

    importResidents: (file: File) => {
        const { $api } = useNuxtApp()
        const formData = new FormData()
        formData.append('file', file)

        return $api<ResidentImportResult>('/management/residents/import-csv/', {
            method: 'POST',
            body: formData
        })
    }
}
