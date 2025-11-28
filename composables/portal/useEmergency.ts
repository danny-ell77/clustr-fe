import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import { emergencyApi, type SOSAlertFilters, type EmergencyContactFilters, type AcknowledgeAlertDto, type ResolveAlertDto } from '~/services/api/emergency.api'
import { queryKeys } from '~/constants/query-keys'
import type {
    CreateEmergencyContactDto,
    UpdateEmergencyContactDto,
    CreateEmergencyResponseDto
} from '~/types/emergency'

export const useEmergency = () => {
    const queryClient = useQueryClient()
    const toast = useToast()

    const useSOSAlerts = (filters: Ref<SOSAlertFilters>) => {
        return useQuery({
            queryKey: computed(() => queryKeys.emergency.alerts.list(filters.value)),
            queryFn: () => emergencyApi.sosAlerts.getAll(filters.value),
            refetchInterval: 30000
        })
    }

    const useSOSAlert = (id: Ref<string | undefined>) => {
        return useQuery({
            queryKey: computed(() => queryKeys.emergency.alerts.detail(id.value!)),
            queryFn: () => emergencyApi.sosAlerts.getById(id.value!),
            enabled: computed(() => !!id.value),
            refetchInterval: 15000
        })
    }

    const useActiveAlerts = () => {
        return useQuery({
            queryKey: queryKeys.emergency.alerts.active(),
            queryFn: () => emergencyApi.sosAlerts.getActive(),
            refetchInterval: 15000
        })
    }

    const useEmergencyContacts = (filters?: Ref<EmergencyContactFilters>) => {
        return useQuery({
            queryKey: computed(() =>
                filters ? queryKeys.emergency.contacts() : queryKeys.emergency.contacts()
            ),
            queryFn: () => emergencyApi.contacts.getAll(filters?.value)
        })
    }

    const useEmergencyStats = () => {
        return useQuery({
            queryKey: [...queryKeys.emergency.all, 'statistics'] as const,
            queryFn: () => emergencyApi.sosAlerts.getStatistics(),
            refetchInterval: 60000
        })
    }

    const useAlertResponses = (alertId: Ref<string | undefined>) => {
        return useQuery({
            queryKey: computed(() => queryKeys.emergency.responses(alertId.value!)),
            queryFn: () => emergencyApi.sosAlerts.getResponses(alertId.value!),
            enabled: computed(() => !!alertId.value)
        })
    }

    const acknowledgeAlertMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data?: AcknowledgeAlertDto }) =>
            emergencyApi.sosAlerts.acknowledge(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.emergency.alerts.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.emergency.alerts.all() })
            queryClient.invalidateQueries({ queryKey: [...queryKeys.emergency.all, 'statistics'] })
            toast.success('Alert acknowledged successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to acknowledge alert', error.message || 'Please try again')
        }
    })

    const respondToAlertMutation = useMutation({
        mutationFn: (id: string) =>
            emergencyApi.sosAlerts.startResponse(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.emergency.alerts.detail(id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.emergency.alerts.all() })
            queryClient.invalidateQueries({ queryKey: [...queryKeys.emergency.all, 'statistics'] })
            toast.success('Response started successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to start response', error.message || 'Please try again')
        }
    })

    const resolveAlertMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: ResolveAlertDto }) =>
            emergencyApi.sosAlerts.resolve(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.emergency.alerts.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.emergency.alerts.all() })
            queryClient.invalidateQueries({ queryKey: [...queryKeys.emergency.all, 'statistics'] })
            toast.success('Alert resolved successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to resolve alert', error.message || 'Please try again')
        }
    })

    const cancelAlertMutation = useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) =>
            emergencyApi.sosAlerts.cancel(id, { reason }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.emergency.alerts.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.emergency.alerts.all() })
            queryClient.invalidateQueries({ queryKey: [...queryKeys.emergency.all, 'statistics'] })
            toast.success('Alert cancelled successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to cancel alert', error.message || 'Please try again')
        }
    })

    const createContactMutation = useMutation({
        mutationFn: (data: CreateEmergencyContactDto) =>
            emergencyApi.contacts.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.emergency.contacts() })
            toast.success('Emergency contact created successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to create contact', error.message || 'Please try again')
        }
    })

    const updateContactMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateEmergencyContactDto }) =>
            emergencyApi.contacts.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.emergency.contacts() })
            toast.success('Emergency contact updated successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to update contact', error.message || 'Please try again')
        }
    })

    const deleteContactMutation = useMutation({
        mutationFn: (id: string) =>
            emergencyApi.contacts.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.emergency.contacts() })
            toast.success('Emergency contact deleted successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to delete contact', error.message || 'Please try again')
        }
    })

    const addResponseMutation = useMutation({
        mutationFn: (data: CreateEmergencyResponseDto) =>
            emergencyApi.responses.create(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.emergency.responses(variables.alert) })
            queryClient.invalidateQueries({ queryKey: queryKeys.emergency.alerts.detail(variables.alert) })
            toast.success('Response added successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to add response', error.message || 'Please try again')
        }
    })

    return {
        useSOSAlerts,
        useSOSAlert,
        useActiveAlerts,
        useEmergencyContacts,
        useEmergencyStats,
        useAlertResponses,
        acknowledgeAlertMutation,
        respondToAlertMutation,
        resolveAlertMutation,
        cancelAlertMutation,
        createContactMutation,
        updateContactMutation,
        deleteContactMutation,
        addResponseMutation
    }
}
