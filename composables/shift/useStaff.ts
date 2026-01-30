import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { managementShiftsApi } from '~/services/api/shifts.api'
import { queryKeys } from '~/constants/query-keys'
import type { Staff, StaffFilters, CreateStaffDto, UpdateStaffDto } from '~/types/shifts'

export const useStaff = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  const useStaffList = (filters: Ref<StaffFilters>) => {
    return useQuery({
      queryKey: [queryKeys.staff.list, filters],
      queryFn: () => managementShiftsApi.staff.getAll(filters.value)
    })
  }

  const useStaffMember = (id: Ref<string>) => {
    return useQuery({
      queryKey: [queryKeys.staff.detail, id],
      queryFn: () => managementShiftsApi.staff.getById(id.value),
      enabled: computed(() => !!id.value)
    })
  }

  const useStaffStats = () => {
    return useQuery({
      queryKey: [queryKeys.staff.statistics],
      queryFn: () => managementShiftsApi.staff.getStatistics()
    })
  }

  const useStaffShifts = (id: Ref<string>, filters: Ref<any>) => {
    return useQuery({
      queryKey: [queryKeys.staff.shifts, id, filters],
      queryFn: () => managementShiftsApi.staff.getShifts(id.value, filters.value),
      enabled: computed(() => !!id.value)
    })
  }

  const createStaffMutation = useMutation({
    mutationFn: (data: CreateStaffDto) => managementShiftsApi.staff.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.staff.list] })
      queryClient.invalidateQueries({ queryKey: [queryKeys.staff.statistics] })
      toast.success('Success', 'Staff member created successfully')
    },
    onError: (error: any) => {
      toast.error('Error', error.response?.data?.message || 'Failed to create staff member')
    }
  })

  const updateStaffMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStaffDto }) => 
      managementShiftsApi.staff.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.staff.list] })
      queryClient.invalidateQueries({ queryKey: [queryKeys.staff.detail, variables.id] })
      toast.success('Success', 'Staff member updated successfully')
    },
    onError: (error: any) => {
      toast.error('Error', error.response?.data?.message || 'Failed to update staff member')
    }
  })

  const deactivateStaffMutation = useMutation({
    mutationFn: (id: string) => managementShiftsApi.staff.deactivate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.staff.list] })
      queryClient.invalidateQueries({ queryKey: [queryKeys.staff.detail, id] })
      queryClient.invalidateQueries({ queryKey: [queryKeys.staff.statistics] })
      toast.success('Success', 'Staff member deactivated successfully')
    },
    onError: (error: any) => {
      toast.error('Error', error.response?.data?.message || 'Failed to deactivate staff member')
    }
  })

  const activateStaffMutation = useMutation({
    mutationFn: (id: string) => managementShiftsApi.staff.activate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.staff.list] })
      queryClient.invalidateQueries({ queryKey: [queryKeys.staff.detail, id] })
      queryClient.invalidateQueries({ queryKey: [queryKeys.staff.statistics] })
      toast.success('Success', 'Staff member activated successfully')
    },
    onError: (error: any) => {
      toast.error('Error', error.response?.data?.message || 'Failed to activate staff member')
    }
  })

  const exportStaffMutation = useMutation({
    mutationFn: (filters?: StaffFilters) => managementShiftsApi.staff.export(filters),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `staff_export_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success('Success', 'Staff list exported successfully')
    },
    onError: (error: any) => {
      toast.error('Error', error.response?.data?.message || 'Failed to export staff list')
    }
  })

  return {
    useStaffList,
    useStaffMember,
    useStaffStats,
    useStaffShifts,
    createStaffMutation,
    updateStaffMutation,
    deactivateStaffMutation,
    activateStaffMutation,
    exportStaffMutation
  }
}
