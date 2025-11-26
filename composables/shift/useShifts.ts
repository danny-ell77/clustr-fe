import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { queryKeys } from '~/constants/query-keys'
import { shiftApi } from '~/services/api/shift.api'
import type { ShiftCreate, ShiftUpdate } from '~/types/shift'

export const useShifts = () => {
    const queryClient = useQueryClient()
    const toast = useToast()

    const getShifts = (params?: Record<string, any>) => {
        return useQuery({
            queryKey: computed(() => queryKeys.shifts.list(params || {})),
            queryFn: () => shiftApi.getAll(params)
        })
    }

    const getShiftById = (id: Ref<string> | string) => {
        const shiftId = computed(() => typeof id === 'string' ? id : id.value)
        return useQuery({
            queryKey: computed(() => queryKeys.shifts.detail(shiftId.value)),
            queryFn: () => shiftApi.getById(shiftId.value),
            enabled: computed(() => !!shiftId.value)
        })
    }

    const createShift = () => {
        return useMutation({
            mutationFn: (data: ShiftCreate) => shiftApi.create(data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.shifts.all })
                toast.success('Shift created successfully')
            },
            onError: (error: any) => {
                toast.error(error.message || 'Failed to create shift')
            }
        })
    }

    const updateShift = () => {
        return useMutation({
            mutationFn: ({ id, data }: { id: string; data: ShiftUpdate }) =>
                shiftApi.update(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.shifts.all })
                toast.success('Shift updated successfully')
            },
            onError: (error: any) => {
                toast.error(error.message || 'Failed to update shift')
            }
        })
    }

    const clockIn = () => {
        return useMutation({
            mutationFn: ({ id, timestamp, notes }: { id: string; timestamp?: string; notes?: string }) =>
                shiftApi.clockIn(id, timestamp, notes),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.shifts.all })
                toast.success('Clocked in successfully')
            },
            onError: (error: any) => {
                toast.error(error.message || 'Failed to clock in')
            }
        })
    }

    const clockOut = () => {
        return useMutation({
            mutationFn: ({ id, timestamp, notes }: { id: string; timestamp?: string; notes?: string }) =>
                shiftApi.clockOut(id, timestamp, notes),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.shifts.all })
                toast.success('Clocked out successfully')
            },
            onError: (error: any) => {
                toast.error(error.message || 'Failed to clock out')
            }
        })
    }

    const cancelShift = () => {
        return useMutation({
            mutationFn: (id: string) => shiftApi.cancel(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.shifts.all })
                toast.success('Shift cancelled successfully')
            },
            onError: (error: any) => {
                toast.error(error.message || 'Failed to cancel shift')
            }
        })
    }

    const markNoShow = () => {
        return useMutation({
            mutationFn: (id: string) => shiftApi.markNoShow(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.shifts.all })
                toast.success('Shift marked as no-show')
            },
            onError: (error: any) => {
                toast.error(error.message || 'Failed to mark no-show')
            }
        })
    }

    const getStatistics = (params?: { startDate?: string; endDate?: string }) => {
        return useQuery({
            queryKey: queryKeys.shifts.statistics(),
            queryFn: () => shiftApi.getStatistics(params?.startDate, params?.endDate)
        })
    }

    const getUpcoming = () => {
        return useQuery({
            queryKey: queryKeys.shifts.upcoming(),
            queryFn: () => shiftApi.getUpcoming()
        })
    }

    return {
        getShifts,
        getShiftById,
        createShift,
        updateShift,
        clockIn,
        clockOut,
        cancelShift,
        markNoShow,
        getStatistics,
        getUpcoming
    }
}
