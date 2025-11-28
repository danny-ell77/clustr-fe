import type { PaginatedResponse } from '~/types/api'
import type {
    SOSAlert,
    EmergencyContact,
    EmergencyResponse,
    CreateSOSAlertDto,
    UpdateSOSAlertDto,
    CreateEmergencyContactDto,
    UpdateEmergencyContactDto,
    CreateEmergencyResponseDto,
    EmergencyStatistics,
    EmergencyReport,
    IncidentReport,
    EmergencyReportFilters,
    EmergencyType,
    EmergencyContactType,
    EmergencyStatus
} from '~/types/emergency'

export interface SOSAlertFilters {
    status?: EmergencyStatus
    emergencyType?: EmergencyType
    priority?: string
    user?: string
    isActive?: boolean
    search?: string
    ordering?: string
    page?: number
    pageSize?: number
}

export interface EmergencyContactFilters {
    contactType?: EmergencyContactType
    emergencyType?: EmergencyType
    isActive?: boolean
    isPrimary?: boolean
    user?: string
    search?: string
    ordering?: string
    page?: number
    pageSize?: number
}

export interface EmergencyResponseFilters {
    alert?: string
    responder?: string
    responseType?: string
    ordering?: string
    page?: number
    pageSize?: number
}

export interface ChoiceOption {
    value: string
    label: string
}

export interface AcknowledgeAlertDto {
    notes?: string
}

export interface ResolveAlertDto {
    notes: string
}

export interface CancelAlertDto {
    reason: string
}

export interface ExportReportParams {
    startDate?: string
    endDate?: string
    emergencyType?: EmergencyType
    status?: EmergencyStatus
    format?: 'json' | 'csv' | 'pdf'
}

export const emergencyApi = {
    sosAlerts: {
        getAll: (params?: SOSAlertFilters) => {
            const { $api } = useNuxtApp()
            return $api<PaginatedResponse<SOSAlert>>('/management/emergency/sos-alerts/', {
                method: 'GET',
                query: params
            })
        },

        getById: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<SOSAlert>(`/management/emergency/sos-alerts/${id}/`, {
                method: 'GET'
            })
        },

        create: (data: CreateSOSAlertDto & { userId: string }) => {
            const { $api } = useNuxtApp()
            return $api<SOSAlert>('/management/emergency/sos-alerts/', {
                method: 'POST',
                body: data
            })
        },

        update: (id: string, data: UpdateSOSAlertDto) => {
            const { $api } = useNuxtApp()
            return $api<SOSAlert>(`/management/emergency/sos-alerts/${id}/`, {
                method: 'PATCH',
                body: data
            })
        },

        delete: (id: string) => {
            const { $api } = useNuxtApp()
            return $api(`/management/emergency/sos-alerts/${id}/`, {
                method: 'DELETE'
            })
        },

        getActive: () => {
            const { $api } = useNuxtApp()
            return $api<SOSAlert[]>('/management/emergency/sos-alerts/active/', {
                method: 'GET'
            })
        },

        acknowledge: (id: string, data?: AcknowledgeAlertDto) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string }>(`/management/emergency/sos-alerts/${id}/acknowledge/`, {
                method: 'POST',
                body: data
            })
        },

        startResponse: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string }>(`/management/emergency/sos-alerts/${id}/start_response/`, {
                method: 'POST'
            })
        },

        resolve: (id: string, data: ResolveAlertDto) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string }>(`/management/emergency/sos-alerts/${id}/resolve/`, {
                method: 'POST',
                body: data
            })
        },

        cancel: (id: string, data: CancelAlertDto) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string }>(`/management/emergency/sos-alerts/${id}/cancel/`, {
                method: 'POST',
                body: data
            })
        },

        getStatistics: () => {
            const { $api } = useNuxtApp()
            return $api<EmergencyStatistics>('/management/emergency/sos-alerts/statistics/', {
                method: 'GET'
            })
        },

        getEmergencyTypes: () => {
            const { $api } = useNuxtApp()
            return $api<ChoiceOption[]>('/management/emergency/sos-alerts/emergency_types/', {
                method: 'GET'
            })
        },

        getStatusChoices: () => {
            const { $api } = useNuxtApp()
            return $api<ChoiceOption[]>('/management/emergency/sos-alerts/status_choices/', {
                method: 'GET'
            })
        },

        getResponses: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<EmergencyResponse[]>(`/management/emergency/sos-alerts/${id}/responses/`, {
                method: 'GET'
            })
        },

        generateReport: (filters: EmergencyReportFilters) => {
            const { $api } = useNuxtApp()
            return $api<EmergencyReport>('/management/emergency/sos-alerts/generate_report/', {
                method: 'POST',
                body: filters
            })
        },

        getIncidentReport: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<IncidentReport>(`/management/emergency/sos-alerts/${id}/incident_report/`, {
                method: 'GET'
            })
        },

        exportReport: (params: ExportReportParams) => {
            const { $api } = useNuxtApp()
            return $api('/management/emergency/sos-alerts/export_report/', {
                method: 'GET',
                query: params
            })
        }
    },

    contacts: {
        getAll: (params?: EmergencyContactFilters) => {
            const { $api } = useNuxtApp()
            return $api<PaginatedResponse<EmergencyContact>>('/management/emergency/contacts/', {
                method: 'GET',
                query: params
            })
        },

        getById: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<EmergencyContact>(`/management/emergency/contacts/${id}/`, {
                method: 'GET'
            })
        },

        create: (data: CreateEmergencyContactDto) => {
            const { $api } = useNuxtApp()
            return $api<EmergencyContact>('/management/emergency/contacts/', {
                method: 'POST',
                body: data
            })
        },

        update: (id: string, data: UpdateEmergencyContactDto) => {
            const { $api } = useNuxtApp()
            return $api<EmergencyContact>(`/management/emergency/contacts/${id}/`, {
                method: 'PATCH',
                body: data
            })
        },

        delete: (id: string) => {
            const { $api } = useNuxtApp()
            return $api(`/management/emergency/contacts/${id}/`, {
                method: 'DELETE'
            })
        },

        getEstateWide: (emergencyType?: EmergencyType) => {
            const { $api } = useNuxtApp()
            return $api<EmergencyContact[]>('/management/emergency/contacts/estate_wide/', {
                method: 'GET',
                query: emergencyType ? { emergencyType } : undefined
            })
        },

        getByType: (emergencyType: EmergencyType) => {
            const { $api } = useNuxtApp()
            return $api<EmergencyContact[]>('/management/emergency/contacts/by_type/', {
                method: 'GET',
                query: { emergencyType }
            })
        },

        getEmergencyTypes: () => {
            const { $api } = useNuxtApp()
            return $api<ChoiceOption[]>('/management/emergency/contacts/emergency_types/', {
                method: 'GET'
            })
        },

        getContactTypes: () => {
            const { $api } = useNuxtApp()
            return $api<ChoiceOption[]>('/management/emergency/contacts/contact_types/', {
                method: 'GET'
            })
        }
    },

    responses: {
        getAll: (params?: EmergencyResponseFilters) => {
            const { $api } = useNuxtApp()
            return $api<PaginatedResponse<EmergencyResponse>>('/management/emergency/responses/', {
                method: 'GET',
                query: params
            })
        },

        getById: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<EmergencyResponse>(`/management/emergency/responses/${id}/`, {
                method: 'GET'
            })
        },

        create: (data: CreateEmergencyResponseDto) => {
            const { $api } = useNuxtApp()
            return $api<EmergencyResponse>('/management/emergency/responses/', {
                method: 'POST',
                body: data
            })
        },

        update: (id: string, data: Partial<CreateEmergencyResponseDto>) => {
            const { $api } = useNuxtApp()
            return $api<EmergencyResponse>(`/management/emergency/responses/${id}/`, {
                method: 'PATCH',
                body: data
            })
        },

        delete: (id: string) => {
            const { $api } = useNuxtApp()
            return $api(`/management/emergency/responses/${id}/`, {
                method: 'DELETE'
            })
        }
    },

    // Aliases
    getAlerts: (params?: SOSAlertFilters) => emergencyApi.sosAlerts.getAll(params),
    getActiveAlerts: () => emergencyApi.sosAlerts.getActive(),
    createAlert: (data: CreateSOSAlertDto & { userId: string }) => emergencyApi.sosAlerts.create(data),
    acknowledgeAlert: (id: string, data?: AcknowledgeAlertDto) => emergencyApi.sosAlerts.acknowledge(id, data),
    resolveAlert: (id: string, data: ResolveAlertDto) => emergencyApi.sosAlerts.resolve(id, data),
    getAlertById: (id: string) => emergencyApi.sosAlerts.getById(id)
}
