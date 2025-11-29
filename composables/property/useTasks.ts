import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import { managementTasksApi, type TaskFilters, type TaskStatisticsFilters } from '~/services/api/tasks.api'
import { queryKeys } from '~/constants/query-keys'
import type {
    CreateTaskDto,
    UpdateTaskDto,
    TaskAssignmentRequestDto,
    TaskStatusUpdateDto,
    TaskEscalationRequestDto,
    CreateTaskCommentDto
} from '~/types/tasks'

export const useTasks = () => {
    const queryClient = useQueryClient()
    const toast = useToast()

    const useTasks = (filters: Ref<TaskFilters>) => {
        return useQuery({
            queryKey: computed(() => queryKeys.tasks.list(filters.value)),
            queryFn: () => managementTasksApi.getAll(filters.value)
        })
    }

    const useTask = (id: Ref<string | undefined>) => {
        return useQuery({
            queryKey: computed(() => queryKeys.tasks.detail(id.value!)),
            queryFn: () => managementTasksApi.getById(id.value!),
            enabled: computed(() => !!id.value)
        })
    }

    const useTaskComments = (taskId: Ref<string | undefined>) => {
        return useQuery({
            queryKey: computed(() => queryKeys.tasks.comments(taskId.value!)),
            queryFn: () => managementTasksApi.comments.getAll(taskId.value!),
            enabled: computed(() => !!taskId.value)
        })
    }

    const useTaskStats = () => {
        return useQuery({
            queryKey: queryKeys.tasks.statistics(),
            queryFn: () => managementTasksApi.getStatistics(),
            refetchInterval: 30000
        })
    }

    const useTaskAnalytics = (filters?: Ref<TaskStatisticsFilters>) => {
        const filterValue = filters?.value || {}
        return useQuery({
            queryKey: computed(() => [...queryKeys.tasks.statistics(), filterValue]),
            queryFn: () => managementTasksApi.getStatistics(filterValue)
        })
    }

    const useOverdueTasks = () => {
        return useQuery({
            queryKey: queryKeys.tasks.overdue(),
            queryFn: () => managementTasksApi.getOverdue(),
            refetchInterval: 60000
        })
    }

    const useDueSoonTasks = () => {
        return useQuery({
            queryKey: queryKeys.tasks.dueSoon(),
            queryFn: () => managementTasksApi.getDueSoon(),
            refetchInterval: 60000
        })
    }

    const createTaskMutation = useMutation({
        mutationFn: (data: CreateTaskDto) =>
            managementTasksApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.statistics() })
            toast.success('Task created successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to create task', error.message || 'Please try again')
        }
    })

    const updateTaskMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTaskDto }) =>
            managementTasksApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.statistics() })
            toast.success('Task updated successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to update task', error.message || 'Please try again')
        }
    })

    const assignTaskMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: TaskAssignmentRequestDto }) =>
            managementTasksApi.assign(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.statistics() })
            toast.success('Task assigned successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to assign task', error.message || 'Please try again')
        }
    })

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: TaskStatusUpdateDto }) =>
            managementTasksApi.updateStatus(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.statistics() })
            toast.success('Task status updated successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to update task status', error.message || 'Please try again')
        }
    })

    const escalateTaskMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: TaskEscalationRequestDto }) =>
            managementTasksApi.escalate(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.statistics() })
            toast.success('Task escalated successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to escalate task', error.message || 'Please try again')
        }
    })

    const completeTaskMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: { completion_notes?: string; actual_hours?: number } }) =>
            managementTasksApi.complete(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.statistics() })
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.overdue() })
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.dueSoon() })
            toast.success('Task completed successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to complete task', error.message || 'Please try again')
        }
    })

    const startTaskMutation = useMutation({
        mutationFn: (id: string) =>
            managementTasksApi.start(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.statistics() })
            toast.success('Task started successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to start task', error.message || 'Please try again')
        }
    })

    const deleteTaskMutation = useMutation({
        mutationFn: (id: string) =>
            managementTasksApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.statistics() })
            toast.success('Task deleted successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to delete task', error.message || 'Please try again')
        }
    })

    const addCommentMutation = useMutation({
        mutationFn: ({ taskId, data }: { taskId: string; data: CreateTaskCommentDto }) =>
            managementTasksApi.comments.create(taskId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.comments(variables.taskId) })
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(variables.taskId) })
            toast.success('Comment added successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to add comment', error.message || 'Please try again')
        }
    })

    const deleteCommentMutation = useMutation({
        mutationFn: ({ taskId, commentId }: { taskId: string; commentId: string }) =>
            managementTasksApi.comments.delete(taskId, commentId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.comments(variables.taskId) })
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(variables.taskId) })
            toast.success('Comment deleted successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to delete comment', error.message || 'Please try again')
        }
    })

    const uploadAttachmentMutation = useMutation({
        mutationFn: ({ taskId, file, attachmentType }: { taskId: string; file: File; attachmentType?: string }) =>
            managementTasksApi.attachments.upload(taskId, file, attachmentType),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(variables.taskId) })
            toast.success('Attachment uploaded successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to upload attachment', error.message || 'Please try again')
        }
    })

    const deleteAttachmentMutation = useMutation({
        mutationFn: ({ taskId, attachmentId }: { taskId: string; attachmentId: string }) =>
            managementTasksApi.attachments.delete(taskId, attachmentId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(variables.taskId) })
            toast.success('Attachment deleted successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to delete attachment', error.message || 'Please try again')
        }
    })

    return {
        useTasks,
        useTask,
        useTaskComments,
        useTaskStats,
        useTaskAnalytics,
        useOverdueTasks,
        useDueSoonTasks,
        createTaskMutation,
        updateTaskMutation,
        assignTaskMutation,
        updateStatusMutation,
        escalateTaskMutation,
        completeTaskMutation,
        startTaskMutation,
        deleteTaskMutation,
        addCommentMutation,
        deleteCommentMutation,
        uploadAttachmentMutation,
        deleteAttachmentMutation
    }
}
