import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import { managementShiftsApi, type ShiftFilters, type ShiftSwapRequestFilters, type StaffScheduleFilters } from '~/services/api/shifts.api'
import { queryKeys } from '~/constants/query-keys'
import type {
    CreateShiftDto,
    UpdateShiftDto,
    CreateShiftSwapRequestDto,
    ShiftSwapResponseDto,
    ClockInOutDto
} from '~/types/shifts'

export const useShifts = () => {
    const queryClient = useQueryClient()
    const toast = useToast()

    const useShifts = (filters: Ref<ShiftFilters>) => {
        return useQuery({
            queryKey: computed(() => queryKeys.shifts.list(filters.value)),
            queryFn: () => managementShiftsApi.shifts.getAll(filters.value)
        })
    }

    const useShiftsCalendar = (params: Ref<{ startDate: string; endDate: string; staffId?: number; status?: string; shiftType?: string }>) => {
        return useQuery({
            queryKey: computed(() => ['shifts', 'calendar', params.value]),
            queryFn: () => managementShiftsApi.shifts.getCalendar(params.value)
        })
    }

    const useShift = (id: Ref<string | undefined>) => {
        return useQuery({
            queryKey: computed(() => queryKeys.shifts.detail(id.value!)),
            queryFn: () => managementShiftsApi.shifts.getById(id.value!),
            enabled: computed(() => !!id.value)
        })
    }

    const useSwapRequests = (filters?: Ref<ShiftSwapRequestFilters>) => {
        const filterValue = filters?.value || {}
        return useQuery({
            queryKey: computed(() => queryKeys.shifts.swapRequests.list(filterValue)),
            queryFn: () => managementShiftsApi.swapRequests.getAll(filterValue)
        })
    }

    const useStaffSchedule = (staffId: Ref<string | undefined>, filters?: Ref<StaffScheduleFilters>) => {
        const filterValue = filters?.value || {}
        return useQuery({
            queryKey: computed(() => queryKeys.shifts.schedules.staff(staffId.value!)),
            queryFn: () => managementShiftsApi.schedules.getStaffSchedule(staffId.value!, filterValue),
            enabled: computed(() => !!staffId.value)
        })
    }

    const useShiftStats = () => {
        return useQuery({
            queryKey: queryKeys.shifts.statistics(),
            queryFn: () => managementShiftsApi.shifts.getStatistics(),
            refetchInterval: 30000
        })
    }

    const useStaffList = (queryParams = {}) => {
        return useQuery({
            queryKey: [queryKeys.staff.all, 'active'],
            queryFn: () => managementShiftsApi.staff.getAll(queryParams)
        })
    }

    const createShiftMutation = useMutation({
        mutationFn: (data: CreateShiftDto) =>
            managementShiftsApi.shifts.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.shifts.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.shifts.statistics() })
            toast.success('Shift created successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to create shift', error.message || 'Please try again')
        }
    })

    const updateShiftMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateShiftDto }) =>
            managementShiftsApi.shifts.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.shifts.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.shifts.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.shifts.statistics() })
            toast.success('Shift updated successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to update shift', error.message || 'Please try again')
        }
    })

    const clockInMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data?: ClockInOutDto }) =>
            managementShiftsApi.shifts.clockIn(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.shifts.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.shifts.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.shifts.statistics() })
            toast.success('Clocked in successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to clock in', error.message || 'Please try again')
        }
    })

    const clockOutMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data?: ClockInOutDto }) =>
            managementShiftsApi.shifts.clockOut(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.shifts.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.shifts.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.shifts.statistics() })
            toast.success('Clocked out successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to clock out', error.message || 'Please try again')
        }
    })

    const cancelShiftMutation = useMutation({
        mutationFn: (id: string) =>
            managementShiftsApi.shifts.cancel(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.shifts.detail(id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.shifts.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.shifts.statistics() })
            toast.success('Shift cancelled successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to cancel shift', error.message || 'Please try again')
        }
    })

    const approveSwapMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: ShiftSwapResponseDto }) =>
            managementShiftsApi.swapRequests.respond(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.shifts.swapRequests.all() })
            queryClient.invalidateQueries({ queryKey: queryKeys.shifts.all })
            toast.success('Swap request processed successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to process swap request', error.message || 'Please try again')
        }
    })

    return {
        useShifts,
        useShift,
        useSwapRequests,
        useStaffSchedule,
        useShiftStats,
        useStaffList,
        useShiftsCalendar,
        createShiftMutation,
        updateShiftMutation,
        clockInMutation,
        clockOutMutation,
        cancelShiftMutation,
        approveSwapMutation
    }
}
