import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import {
    managementVisitorsApi,
    type VisitorFilters,
    type VisitorLogFilters
} from '~/services/api/visitors.api'
import { queryKeys } from '~/constants/query-keys'
import type {
    CreateVisitorDto,
    UpdateVisitorDto,
    CheckInDto,
    CheckOutDto
} from '~/types/visitors'

export const useVisitors = () => {
    const queryClient = useQueryClient()
    const toast = useToast()

    const useVisitors = (filters: Ref<VisitorFilters>) => {
        return useQuery({
            queryKey: computed(() => queryKeys.visitors.list(filters.value)),
            queryFn: () => managementVisitorsApi.visitors.getAll(filters.value)
        })
    }

    const useVisitor = (id: Ref<string | undefined>) => {
        return useQuery({
            queryKey: computed(() => queryKeys.visitors.detail(id.value!)),
            queryFn: () => managementVisitorsApi.visitors.getById(id.value!),
            enabled: computed(() => !!id.value)
        })
    }

    const useVisitorLogs = (filters?: Ref<VisitorLogFilters>) => {
        return useQuery({
            queryKey: computed(() =>
                filters
                    ? queryKeys.visitors.logs.list(filters.value)
                    : [...queryKeys.visitors.all, 'logs']
            ),
            queryFn: () => managementVisitorsApi.logs.getAll(filters?.value)
        })
    }

    const useActiveVisitors = () => {
        return useQuery({
            queryKey: [...queryKeys.visitors.all, 'active'] as const,
            queryFn: () => managementVisitorsApi.visitors.getActive(),
            refetchInterval: 30000
        })
    }

    const registerVisitorMutation = useMutation({
        mutationFn: (data: CreateVisitorDto) =>
            managementVisitorsApi.visitors.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.visitors.all })
            toast.success('Visitor registered successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to register visitor', error.message || 'Please try again')
        }
    })

    const updateVisitorMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateVisitorDto }) =>
            managementVisitorsApi.visitors.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.visitors.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.visitors.all })
            toast.success('Visitor updated successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to update visitor', error.message || 'Please try again')
        }
    })

    const checkInMutation = useMutation({
        mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
            managementVisitorsApi.visitors.checkIn(id, notes),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.visitors.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.visitors.all })
            queryClient.invalidateQueries({ queryKey: [...queryKeys.visitors.all, 'active'] })
            queryClient.invalidateQueries({ queryKey: [...queryKeys.visitors.all, 'logs'] })
            toast.success('Visitor checked in successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to check in visitor', error.message || 'Please try again')
        }
    })

    const checkOutMutation = useMutation({
        mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
            managementVisitorsApi.visitors.checkOut(id, notes),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.visitors.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.visitors.all })
            queryClient.invalidateQueries({ queryKey: [...queryKeys.visitors.all, 'active'] })
            queryClient.invalidateQueries({ queryKey: [...queryKeys.visitors.all, 'logs'] })
            toast.success('Visitor checked out successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to check out visitor', error.message || 'Please try again')
        }
    })

    const generatePassMutation = useMutation({
        mutationFn: (id: string) =>
            managementVisitorsApi.visitors.generatePass(id),
        onSuccess: (response, id) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.visitors.detail(id) })
            toast.success('Visitor pass generated successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to generate visitor pass', error.message || 'Please try again')
        }
    })

    const deleteVisitorMutation = useMutation({
        mutationFn: (id: string) =>
            managementVisitorsApi.visitors.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.visitors.all })
            toast.success('Visitor deleted successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to delete visitor', error.message || 'Please try again')
        }
    })

    return {
        useVisitors,
        useVisitor,
        useVisitorLogs,
        useActiveVisitors,
        registerVisitorMutation,
        updateVisitorMutation,
        checkInMutation,
        checkOutMutation,
        generatePassMutation,
        deleteVisitorMutation
    }
}
