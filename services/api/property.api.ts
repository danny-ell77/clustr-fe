import type { PaginatedResponse } from '~/types/api'
import type {
    Property,
    PropertyCreate,
    PropertyUpdate,
    PropertyUnit,
    PropertyUnitCreate,
    PropertyUnitUpdate,
    Resident,
    MaintenanceRequest,
    MaintenanceRequestCreate,
    MaintenanceRequestUpdate,
    WorkOrder,
    WorkOrderCreate,
    WorkOrderUpdate
} from '~/types/property'

export const propertyApi = {
    getAll: (params?: Record<string, any>) => {
        const { $api } = useNuxtApp()
        return $api<PaginatedResponse<Property>>('/management/properties/', {
            method: 'GET',
            query: params
        })
    },

    getById: (id: string) => {
        const { $api } = useNuxtApp()
        return $api<Property>(`/management/properties/${id}/`, {
            method: 'GET'
        })
    },

    create: (data: PropertyCreate) => {
        const { $api } = useNuxtApp()
        return $api<Property>('/management/properties/', {
            method: 'POST',
            body: data
        })
    },

    update: (id: string, data: PropertyUpdate) => {
        const { $api } = useNuxtApp()
        return $api<Property>(`/management/properties/${id}/`, {
            method: 'PATCH',
            body: data
        })
    },

    delete: (id: string) => {
        const { $api } = useNuxtApp()
        return $api(`/management/properties/${id}/`, {
            method: 'DELETE'
        })
    },

    getUnits: (propertyId: string, params?: Record<string, any>) => {
        const { $api } = useNuxtApp()
        return $api<PaginatedResponse<PropertyUnit>>(`/management/properties/${propertyId}/units/`, {
            method: 'GET',
            query: params
        })
    },

    createUnit: (propertyId: string, data: PropertyUnitCreate) => {
        const { $api } = useNuxtApp()
        return $api<PropertyUnit>(`/management/properties/${propertyId}/units/`, {
            method: 'POST',
            body: data
        })
    },

    updateUnit: (propertyId: string, unitId: string, data: PropertyUnitUpdate) => {
        const { $api } = useNuxtApp()
        return $api<PropertyUnit>(`/management/properties/${propertyId}/units/${unitId}/`, {
            method: 'PATCH',
            body: data
        })
    },

    deleteUnit: (propertyId: string, unitId: string) => {
        const { $api } = useNuxtApp()
        return $api(`/management/properties/${propertyId}/units/${unitId}/`, {
            method: 'DELETE'
        })
    },

    getResidents: (params?: Record<string, any>) => {
        const { $api } = useNuxtApp()
        return $api<PaginatedResponse<Resident>>('/management/residents/', {
            method: 'GET',
            query: params
        })
    },

    getMaintenanceRequests: (params?: Record<string, any>) => {
        const { $api } = useNuxtApp()
        return $api<PaginatedResponse<MaintenanceRequest>>('/management/maintenance-requests/', {
            method: 'GET',
            query: params
        })
    },

    createMaintenanceRequest: (data: MaintenanceRequestCreate) => {
        const { $api } = useNuxtApp()
        return $api<MaintenanceRequest>('/management/maintenance-requests/', {
            method: 'POST',
            body: data
        })
    },

    updateMaintenanceRequest: (id: string, data: MaintenanceRequestUpdate) => {
        const { $api } = useNuxtApp()
        return $api<MaintenanceRequest>(`/management/maintenance-requests/${id}/`, {
            method: 'PATCH',
            body: data
        })
    },

    getWorkOrders: (params?: Record<string, any>) => {
        const { $api } = useNuxtApp()
        return $api<PaginatedResponse<WorkOrder>>('/management/work-orders/', {
            method: 'GET',
            query: params
        })
    },

    createWorkOrder: (data: WorkOrderCreate) => {
        const { $api } = useNuxtApp()
        return $api<WorkOrder>('/management/work-orders/', {
            method: 'POST',
            body: data
        })
    },

    updateWorkOrder: (id: string, data: WorkOrderUpdate) => {
        const { $api } = useNuxtApp()
        return $api<WorkOrder>(`/management/work-orders/${id}/`, {
            method: 'PATCH',
            body: data
        })
    }
}
