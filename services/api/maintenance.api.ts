import type { PaginatedResponse } from '~/types/api'
import type {
    MaintenanceLog,
    CreateMaintenanceLogDto,
    UpdateMaintenanceLogDto,
    MaintenanceAnalytics,
    MaintenanceOptimization,
    MaintenanceType,
    MaintenancePriority,
    MaintenanceStatus,
    PropertyType
} from '~/types/maintenance'

export interface MaintenanceLogFilters {
    maintenanceType?: MaintenanceType
    propertyType?: PropertyType
    priority?: MaintenancePriority
    status?: MaintenanceStatus
    assignedTo?: string
    propertyLocation?: string
    equipmentName?: string
    dateFrom?: string
    dateTo?: string
    search?: string
    ordering?: string
    page?: number
    pageSize?: number
}

export interface MaintenanceSchedule {
    id: string
    name: string
    description: string
    propertyType: PropertyType
    propertyTypeDisplay: string
    propertyLocation: string
    equipmentName?: string
    frequencyType: string
    frequencyTypeDisplay: string
    frequencyValue: number
    nextDueDate: string
    lastPerformedDate?: string
    estimatedDuration?: string
    estimatedCost?: string
    instructions?: string
    materialsNeeded?: string
    toolsNeeded?: string
    isActive: boolean
    createdAt: string
    lastModifiedAt: string
}

export interface CreateMaintenanceScheduleDto {
    name: string
    description: string
    propertyType: PropertyType
    propertyLocation: string
    equipmentName?: string
    frequencyType: string
    frequencyValue: number
    nextDueDate: string
    estimatedDuration?: string
    estimatedCost?: string
    instructions?: string
    materialsNeeded?: string
    toolsNeeded?: string
}

export interface UpdateMaintenanceScheduleDto {
    name?: string
    description?: string
    propertyType?: PropertyType
    propertyLocation?: string
    equipmentName?: string
    frequencyType?: string
    frequencyValue?: number
    nextDueDate?: string
    estimatedDuration?: string
    estimatedCost?: string
    instructions?: string
    materialsNeeded?: string
    toolsNeeded?: string
    isActive?: boolean
}

export interface MaintenanceScheduleFilters {
    propertyType?: PropertyType
    propertyLocation?: string
    equipmentName?: string
    isActive?: boolean
    search?: string
    ordering?: string
    page?: number
    pageSize?: number
}

export interface MaintenanceAttachment {
    id: string
    file: string
    fileName: string
    fileSize: number
    attachmentType: string
    attachmentTypeDisplay: string
    description?: string
    uploadedBy: string
    uploadedByName?: string
    uploadedAt: string
}

export interface MaintenanceHistory {
    id: string
    maintenanceNumber: string
    title: string
    description: string
    maintenanceType: MaintenanceType
    maintenanceTypeDisplay: string
    propertyType: PropertyType
    propertyTypeDisplay: string
    propertyLocation: string
    equipmentName?: string
    status: MaintenanceStatus
    statusDisplay: string
    completedAt?: string
    cost?: string
    createdAt: string
}

export interface MaintenanceHistoryFilters {
    propertyLocation?: string
    equipmentName?: string
    propertyType?: PropertyType
    limit?: number
}

export interface MaintenanceAnalyticsFilters {
    startDate?: string
    endDate?: string
}

export interface AssignMaintenanceDto {
    assignedTo: string
}

export interface UploadAttachmentDto {
    file: File
    attachmentType?: string
    description?: string
}

export interface ChoiceOption {
    value: string
    label: string
}

export interface MaintenanceChoices {
    maintenanceTypes: ChoiceOption[]
    maintenanceStatuses: ChoiceOption[]
    maintenancePriorities: ChoiceOption[]
    propertyTypes: ChoiceOption[]
}

export interface MaintenanceCategoryFilters {
    propertyType?: PropertyType
    maintenanceType?: MaintenanceType
}

export const managementMaintenanceApi = {
    logs: {
        getAll: (params?: MaintenanceLogFilters) => {
            const { $api } = useNuxtApp()
            return $api<PaginatedResponse<MaintenanceLog>>('/management/maintenance/logs/', {
                method: 'GET',
                query: params
            })
        },

        getById: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<MaintenanceLog>(`/management/maintenance/logs/${id}/`, {
                method: 'GET'
            })
        },

        create: (data: CreateMaintenanceLogDto) => {
            const { $api } = useNuxtApp()
            return $api<MaintenanceLog>('/management/maintenance/logs/', {
                method: 'POST',
                body: data
            })
        },

        update: (id: string, data: UpdateMaintenanceLogDto) => {
            const { $api } = useNuxtApp()
            return $api<MaintenanceLog>(`/management/maintenance/logs/${id}/`, {
                method: 'PATCH',
                body: data
            })
        },

        delete: (id: string) => {
            const { $api } = useNuxtApp()
            return $api(`/management/maintenance/logs/${id}/`, {
                method: 'DELETE'
            })
        },

        assign: (id: string, assignedTo: string) => {
            const { $api } = useNuxtApp()
            return $api<MaintenanceLog>(`/management/maintenance/logs/${id}/assign_maintenance/`, {
                method: 'POST',
                body: { assignedTo: assignedTo }
            })
        },

        uploadAttachment: (id: string, file: File, attachmentType?: string, description?: string) => {
            const { $api } = useNuxtApp()
            const formData = new FormData()
            formData.append('file', file)
            if (attachmentType) {
                formData.append('attachmentType', attachmentType)
            }
            if (description) {
                formData.append('description', description)
            }

            return $api<MaintenanceAttachment>(`/management/maintenance/logs/${id}/upload_attachment/`, {
                method: 'POST',
                body: formData
            })
        },

        getHistory: (params?: MaintenanceHistoryFilters) => {
            const { $api } = useNuxtApp()
            return $api<MaintenanceHistory[]>('/management/maintenance/logs/history/', {
                method: 'GET',
                query: params
            })
        },

        getAnalytics: (params?: MaintenanceAnalyticsFilters) => {
            const { $api } = useNuxtApp()
            return $api<MaintenanceAnalytics>('/management/maintenance/logs/analytics/', {
                method: 'GET',
                query: params
            })
        },

        getOptimizations: () => {
            const { $api } = useNuxtApp()
            return $api<MaintenanceOptimization[]>('/management/maintenance/logs/optimizations/', {
                method: 'GET'
            })
        }
    },

    schedules: {
        getAll: (params?: MaintenanceScheduleFilters) => {
            const { $api } = useNuxtApp()
            return $api<PaginatedResponse<MaintenanceSchedule>>('/management/maintenance/schedules/', {
                method: 'GET',
                query: params
            })
        },

        getById: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<MaintenanceSchedule>(`/management/maintenance/schedules/${id}/`, {
                method: 'GET'
            })
        },

        create: (data: CreateMaintenanceScheduleDto) => {
            const { $api } = useNuxtApp()
            return $api<MaintenanceSchedule>('/management/maintenance/schedules/', {
                method: 'POST',
                body: data
            })
        },

        update: (id: string, data: UpdateMaintenanceScheduleDto) => {
            const { $api } = useNuxtApp()
            return $api<MaintenanceSchedule>(`/management/maintenance/schedules/${id}/`, {
                method: 'PATCH',
                body: data
            })
        },

        delete: (id: string) => {
            const { $api } = useNuxtApp()
            return $api(`/management/maintenance/schedules/${id}/`, {
                method: 'DELETE'
            })
        }
    },

    getChoices: () => {
        const { $api } = useNuxtApp()
        return $api<MaintenanceChoices>('/management/maintenance/choices/', {
            method: 'GET'
        })
    },

    getCategories: (params?: MaintenanceCategoryFilters) => {
        const { $api } = useNuxtApp()
        return $api('/management/maintenance/categories/', {
            method: 'GET',
            query: params
        })
    }
}
