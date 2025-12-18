import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import {
    managementChildrenApi,
    type ChildFilters,
    type ExitRequestFilters,
    type EntryExitLogFilters
} from '~/services/api/children.api'
import { queryKeys } from '~/constants/query-keys'
import type {
    CreateChildDto,
    UpdateChildDto,
    CreateExitRequestDto,
    UpdateExitRequestDto,
    CreateEntryExitLogDto,
    UpdateEntryExitLogDto
} from '~/types/children'

export const useChildren = () => {
    const queryClient = useQueryClient()
    const toast = useToast()

    const useChildren = (filters: Ref<ChildFilters>) => {
        return useQuery({
            queryKey: computed(() => queryKeys.children.list(filters.value)),
            queryFn: () => managementChildrenApi.children.getAll(filters.value)
        })
    }

    const useChild = (id: Ref<string | undefined>) => {
        return useQuery({
            queryKey: computed(() => queryKeys.children.detail(id.value!)),
            queryFn: () => managementChildrenApi.children.getById(id.value!),
            enabled: computed(() => !!id.value)
        })
    }

    const useExitRequests = (filters?: Ref<ExitRequestFilters>) => {
        return useQuery({
            queryKey: computed(() =>
                filters
                    ? queryKeys.children.exitRequests.list(filters.value)
                    : queryKeys.children.exitRequests.all()
            ),
            queryFn: () => managementChildrenApi.exitRequests.getAll(filters?.value)
        })
    }

    const usePendingExitRequests = () => {
        return useQuery({
            queryKey: queryKeys.children.exitRequests.pending(),
            queryFn: () => managementChildrenApi.exitRequests.getPending(),
            refetchInterval: 30000
        })
    }

    const useEntryExitLogs = (filters?: Ref<EntryExitLogFilters>) => {
        return useQuery({
            queryKey: computed(() =>
                filters
                    ? queryKeys.children.logs.list(filters.value)
                    : queryKeys.children.logs.all()
            ),
            queryFn: () => managementChildrenApi.entryExitLogs.getAll(filters?.value)
        })
    }

    const useChildEntryExitLogs = (childId: Ref<string | undefined>) => {
        return useQuery({
            queryKey: computed(() => queryKeys.children.logs.byChild(childId.value!)),
            queryFn: () => managementChildrenApi.entryExitLogs.getByChild(childId.value!),
            enabled: computed(() => !!childId.value)
        })
    }

    const createChildMutation = useMutation({
        mutationFn: (data: CreateChildDto) =>
            managementChildrenApi.children.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.children.all })
            toast.success('Child profile created successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to create child profile', error.message || 'Please try again')
        }
    })

    const updateChildMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateChildDto }) =>
            managementChildrenApi.children.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.children.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.children.all })
            toast.success('Child profile updated successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to update child profile', error.message || 'Please try again')
        }
    })

    const uploadPhotoMutation = useMutation({
        mutationFn: ({ id, file }: { id: string; file: File }) =>
            managementChildrenApi.children.uploadPhoto(id, file),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.children.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.children.all })
            toast.success('Photo uploaded successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to upload photo', error.message || 'Please try again')
        }
    })

    const deleteChildMutation = useMutation({
        mutationFn: (id: string) =>
            managementChildrenApi.children.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.children.all })
            toast.success('Child profile deleted successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to delete child profile', error.message || 'Please try again')
        }
    })

    const createExitRequestMutation = useMutation({
        mutationFn: (data: CreateExitRequestDto) =>
            managementChildrenApi.exitRequests.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.children.exitRequests.all() })
            toast.success('Exit request created successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to create exit request', error.message || 'Please try again')
        }
    })

    const updateExitRequestMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateExitRequestDto }) =>
            managementChildrenApi.exitRequests.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.children.exitRequests.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.children.exitRequests.all() })
            toast.success('Exit request updated successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to update exit request', error.message || 'Please try again')
        }
    })

    const approveExitMutation = useMutation({
        mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
            managementChildrenApi.exitRequests.approve(id, reason),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.children.exitRequests.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.children.exitRequests.all() })
            queryClient.invalidateQueries({ queryKey: queryKeys.children.exitRequests.pending() })
            toast.success('Exit request approved successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to approve exit request', error.message || 'Please try again')
        }
    })

    const rejectExitMutation = useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) =>
            managementChildrenApi.exitRequests.deny(id, reason),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.children.exitRequests.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.children.exitRequests.all() })
            queryClient.invalidateQueries({ queryKey: queryKeys.children.exitRequests.pending() })
            toast.success('Exit request rejected successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to reject exit request', error.message || 'Please try again')
        }
    })

    const deleteExitRequestMutation = useMutation({
        mutationFn: (id: string) =>
            managementChildrenApi.exitRequests.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.children.exitRequests.all() })
            toast.success('Exit request deleted successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to delete exit request', error.message || 'Please try again')
        }
    })

    const createEntryExitLogMutation = useMutation({
        mutationFn: (data: CreateEntryExitLogDto) =>
            managementChildrenApi.entryExitLogs.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.children.logs.all() })
            toast.success('Entry/exit log created successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to create entry/exit log', error.message || 'Please try again')
        }
    })

    const updateEntryExitLogMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateEntryExitLogDto }) =>
            managementChildrenApi.entryExitLogs.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.children.logs.all() })
            toast.success('Entry/exit log updated successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to update entry/exit log', error.message || 'Please try again')
        }
    })

    const checkInMutation = useMutation({
        mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
            managementChildrenApi.entryExitLogs.markEntry(id, notes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.children.logs.all() })
            toast.success('Child checked in successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to check in child', error.message || 'Please try again')
        }
    })

    const checkOutMutation = useMutation({
        mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
            managementChildrenApi.entryExitLogs.markExit(id, notes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.children.logs.all() })
            toast.success('Child checked out successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to check out child', error.message || 'Please try again')
        }
    })

    const deleteEntryExitLogMutation = useMutation({
        mutationFn: (id: string) =>
            managementChildrenApi.entryExitLogs.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.children.logs.all() })
            toast.success('Entry/exit log deleted successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to delete entry/exit log', error.message || 'Please try again')
        }
    })

    return {
        useChildren,
        useChild,
        useExitRequests,
        usePendingExitRequests,
        useEntryExitLogs,
        useChildEntryExitLogs,
        createChildMutation,
        updateChildMutation,
        uploadPhotoMutation,
        deleteChildMutation,
        createExitRequestMutation,
        updateExitRequestMutation,
        approveExitMutation,
        rejectExitMutation,
        deleteExitRequestMutation,
        createEntryExitLogMutation,
        updateEntryExitLogMutation,
        checkInMutation,
        checkOutMutation,
        deleteEntryExitLogMutation
    }
}
