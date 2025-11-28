import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import {
    maintenanceApi,
    type MaintenanceLogFilters,
    type MaintenanceScheduleFilters,
    type MaintenanceAnalyticsFilters
} from '~/services/api/maintenance.api'
import { queryKeys } from '~/constants/query-keys'
import type {
    CreateMaintenanceLogDto,
    UpdateMaintenanceLogDto,
    CreateMaintenanceScheduleDto,
    UpdateMaintenanceScheduleDto
} from '~/types/maintenance'

export const useMaintenance = () => {
    const queryClient = useQueryClient()
    const toast = useToast()

    const useMaintenanceLogs = (filters: Ref<MaintenanceLogFilters>) => {
        return useQuery({
            queryKey: computed(() => queryKeys.maintenance.logs.list(filters.value)),
            queryFn: () => maintenanceApi.logs.getAll(filters.value)
        })
    }

    const useMaintenanceLog = (id: Ref<string | undefined>) => {
        return useQuery({
            queryKey: computed(() => queryKeys.maintenance.logs.detail(id.value!)),
            queryFn: () => maintenanceApi.logs.getById(id.value!),
            enabled: computed(() => !!id.value)
        })
    }

    const useMaintenanceSchedules = (filters?: Ref<MaintenanceScheduleFilters>) => {
        return useQuery({
            queryKey: computed(() =>
                filters
                    ? queryKeys.maintenance.schedules.list(filters.value)
                    : queryKeys.maintenance.schedules.all()
            ),
            queryFn: () => maintenanceApi.schedules.getAll(filters?.value)
        })
    }

    const useMaintenanceAnalytics = (filters?: Ref<MaintenanceAnalyticsFilters>) => {
        return useQuery({
            queryKey: computed(() =>
                filters
                    ? [...queryKeys.maintenance.analytics(), filters.value]
                    : queryKeys.maintenance.analytics()
            ),
            queryFn: () => maintenanceApi.logs.getAnalytics(filters?.value),
            refetchInterval: 60000
        })
    }

    const createLogMutation = useMutation({
        mutationFn: (data: CreateMaintenanceLogDto) =>
            maintenanceApi.logs.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.maintenance.logs.all() })
            queryClient.invalidateQueries({ queryKey: queryKeys.maintenance.analytics() })
            toast.success('Maintenance log created successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to create maintenance log', error.message || 'Please try again')
        }
    })

    const updateLogMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateMaintenanceLogDto }) =>
            maintenanceApi.logs.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.maintenance.logs.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.maintenance.logs.all() })
            queryClient.invalidateQueries({ queryKey: queryKeys.maintenance.analytics() })
            toast.success('Maintenance log updated successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to update maintenance log', error.message || 'Please try again')
        }
    })

    const assignLogMutation = useMutation({
        mutationFn: ({ id, assignedTo }: { id: string; assignedTo: string }) =>
            maintenanceApi.logs.assign(id, assignedTo),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.maintenance.logs.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.maintenance.logs.all() })
            toast.success('Maintenance log assigned successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to assign maintenance log', error.message || 'Please try again')
        }
    })

    const uploadAttachmentMutation = useMutation({
        mutationFn: ({ id, file, attachmentType, description }: {
            id: string
            file: File
            attachmentType?: string
            description?: string
        }) => maintenanceApi.logs.uploadAttachment(id, file, attachmentType, description),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.maintenance.logs.detail(variables.id) })
            toast.success('Attachment uploaded successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to upload attachment', error.message || 'Please try again')
        }
    })

    const createScheduleMutation = useMutation({
        mutationFn: (data: CreateMaintenanceScheduleDto) =>
            maintenanceApi.schedules.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.maintenance.schedules.all() })
            toast.success('Maintenance schedule created successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to create maintenance schedule', error.message || 'Please try again')
        }
    })

    const updateScheduleMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateMaintenanceScheduleDto }) =>
            maintenanceApi.schedules.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.maintenance.schedules.all() })
            toast.success('Maintenance schedule updated successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to update maintenance schedule', error.message || 'Please try again')
        }
    })

    const deleteScheduleMutation = useMutation({
        mutationFn: (id: string) =>
            maintenanceApi.schedules.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.maintenance.schedules.all() })
            toast.success('Maintenance schedule deleted successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to delete maintenance schedule', error.message || 'Please try again')
        }
    })

    return {
        useMaintenanceLogs,
        useMaintenanceLog,
        useMaintenanceSchedules,
        useMaintenanceAnalytics,
        createLogMutation,
        updateLogMutation,
        assignLogMutation,
        uploadAttachmentMutation,
        createScheduleMutation,
        updateScheduleMutation,
        deleteScheduleMutation
    }
}
