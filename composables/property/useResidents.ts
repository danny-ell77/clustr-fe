import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import {
    residentsApi,
    type ResidentFilters,
    type CreateResidentDto,
    type UpdateResidentDto
} from '~/services/api/property/residents.api'
import { queryKeys } from '~/constants/query-keys'

export const useResidents = () => {
    const queryClient = useQueryClient()
    const toast = useToast()

    const useResidents = (filters: Ref<ResidentFilters>) => {
        return useQuery({
            queryKey: computed(() => queryKeys.residents.list(filters.value)),
            queryFn: () => residentsApi.getResidents(filters.value)
        })
    }

    const useResident = (id: Ref<string | undefined>) => {
        return useQuery({
            queryKey: computed(() => queryKeys.residents.detail(id.value!)),
            queryFn: () => residentsApi.getResident(id.value!),
            enabled: computed(() => !!id.value)
        })
    }

    const useResidentStats = () => {
        return useQuery({
            queryKey: queryKeys.residents.stats(),
            queryFn: () => residentsApi.getResidentStats(),
            refetchInterval: 30000
        })
    }

    const createResidentMutation = useMutation({
        mutationFn: (data: CreateResidentDto) =>
            residentsApi.createResident(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.residents.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.residents.stats() })
            toast.success('Resident created successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to create resident', error.message || 'Please try again')
        }
    })

    const updateResidentMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateResidentDto }) =>
            residentsApi.updateResident(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.residents.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.residents.all })
            toast.success('Resident updated successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to update resident', error.message || 'Please try again')
        }
    })

    const updateApprovalStatusMutation = useMutation({
        mutationFn: ({ id, approved }: { id: string; approved: boolean }) =>
            residentsApi.updateApprovalStatus(id, approved),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.residents.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.residents.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.residents.stats() })
            toast.success(`Resident ${variables.approved ? 'approved' : 'rejected'} successfully`)
        },
        onError: (error: any) => {
            toast.error('Failed to update approval status', error.message || 'Please try again')
        }
    })

    const exportResidentsMutation = useMutation({
        mutationFn: (filters?: ResidentFilters) =>
            residentsApi.exportResidents(filters),
        onSuccess: (blob) => {
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `residents-export-${new Date().toISOString().split('T')[0]}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            toast.success('Residents exported successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to export residents', error.message || 'Please try again')
        }
    })

    const importResidentsMutation = useMutation({
        mutationFn: (file: File) =>
            residentsApi.importResidents(file),
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.residents.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.residents.stats() })

            if (result.errors.length > 0) {
                toast.error(
                    `Import completed with errors`,
                    `Created: ${result.created}, Updated: ${result.updated}, Errors: ${result.errors.length}`
                )
            } else {
                toast.success(
                    'Residents imported successfully',
                    `Created: ${result.created}, Updated: ${result.updated}`
                )
            }
        },
        onError: (error: any) => {
            toast.error('Failed to import residents', error.message || 'Please try again')
        }
    })

    return {
        useResidents,
        useResident,
        useResidentStats,
        createResidentMutation,
        updateResidentMutation,
        updateApprovalStatusMutation,
        exportResidentsMutation,
        importResidentsMutation
    }
}
