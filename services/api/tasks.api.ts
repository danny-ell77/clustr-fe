import type { PaginatedResponse } from '~/types/api'
import type {
    Task,
    TaskDetail,
    CreateTaskDto,
    UpdateTaskDto,
    TaskAssignmentRequestDto,
    TaskStatusUpdateDto,
    TaskEscalationRequestDto,
    CreateTaskCommentDto,
    TaskComment,
    TaskStatistics,
    TaskStatus,
    TaskType,
    TaskPriority
} from '~/types/tasks'

export interface TaskFilters {
    status?: TaskStatus
    taskType?: TaskType
    priority?: TaskPriority
    assignedTo?: string
    createdBy?: string
    isOerdue?: boolean
    isDeSoon?: boolean
    search?: string
    ordering?: string
    page?: number
    pageSize?: number
}

export interface TaskStatisticsFilters {
    startDate?: string
    endDate?: string
    assignedTo?: string
}

export const managementTasksApi = {
    getAll: (params?: TaskFilters) => {
        const { $api } = useNuxtApp()
        return $api<PaginatedResponse<Task>>('/management/tasks/', {
            method: 'GET',
            query: params
        })
    },

    getById: (id: string) => {
        const { $api } = useNuxtApp()
        return $api<TaskDetail>(`/management/tasks/${id}/`, {
            method: 'GET'
        })
    },

    create: (data: CreateTaskDto) => {
        const { $api } = useNuxtApp()
        return $api<TaskDetail>('/management/tasks/', {
            method: 'POST',
            body: data
        })
    },

    update: (id: string, data: UpdateTaskDto) => {
        const { $api } = useNuxtApp()
        return $api<TaskDetail>(`/management/tasks/${id}/`, {
            method: 'PATCH',
            body: data
        })
    },

    delete: (id: string) => {
        const { $api } = useNuxtApp()
        return $api(`/management/tasks/${id}/`, {
            method: 'DELETE'
        })
    },

    assign: (id: string, data: TaskAssignmentRequestDto) => {
        const { $api } = useNuxtApp()
        return $api<{ message: string; task: TaskDetail }>(`/management/tasks/${id}/assign/`, {
            method: 'POST',
            body: data
        })
    },

    updateStatus: (id: string, data: TaskStatusUpdateDto) => {
        const { $api } = useNuxtApp()
        return $api<{ message: string; task: TaskDetail }>(`/management/tasks/${id}/update_status/`, {
            method: 'POST',
            body: data
        })
    },

    start: (id: string) => {
        const { $api } = useNuxtApp()
        return $api<{ message: string; task: TaskDetail }>(`/management/tasks/${id}/start/`, {
            method: 'POST'
        })
    },

    complete: (id: string, data: { completion_notes?: string; actual_hours?: number }) => {
        const { $api } = useNuxtApp()
        return $api<{ message: string; task: TaskDetail }>(`/management/tasks/${id}/complete/`, {
            method: 'POST',
            body: data
        })
    },

    escalate: (id: string, data: TaskEscalationRequestDto) => {
        const { $api } = useNuxtApp()
        return $api<{ message: string; task: TaskDetail }>(`/management/tasks/${id}/escalate/`, {
            method: 'POST',
            body: data
        })
    },

    getStatistics: (params?: TaskStatisticsFilters) => {
        const { $api } = useNuxtApp()
        return $api<TaskStatistics>('/management/tasks/statistics/', {
            method: 'GET',
            query: params
        })
    },

    getOverdue: () => {
        const { $api } = useNuxtApp()
        return $api<Task[]>('/management/tasks/overdue/', {
            method: 'GET'
        })
    },

    getDueSoon: () => {
        const { $api } = useNuxtApp()
        return $api<Task[]>('/management/tasks/due_soon/', {
            method: 'GET'
        })
    },

    comments: {
        getAll: (taskId: string) => {
            const { $api } = useNuxtApp()
            return $api<TaskComment[]>(`/management/tasks/${taskId}/comments/`, {
                method: 'GET'
            })
        },

        create: (taskId: string, data: CreateTaskCommentDto) => {
            const { $api } = useNuxtApp()
            return $api<TaskComment>(`/management/tasks/${taskId}/comments/`, {
                method: 'POST',
                body: data
            })
        },

        delete: (taskId: string, commentId: string) => {
            const { $api } = useNuxtApp()
            return $api(`/management/tasks/${taskId}/comments/${commentId}/`, {
                method: 'DELETE'
            })
        }
    },

    attachments: {
        upload: (taskId: string, file: File, attachmentType?: string) => {
            const { $api } = useNuxtApp()
            const formData = new FormData()
            formData.append('file', file)
            if (attachmentType) {
                formData.append('attachment_type', attachmentType)
            }
            return $api(`/management/tasks/${taskId}/upload_attachment/`, {
                method: 'POST',
                body: formData
            })
        },

        delete: (taskId: string, attachmentId: string) => {
            const { $api } = useNuxtApp()
            return $api(`/management/tasks/${taskId}/attachments/${attachmentId}/`, {
                method: 'DELETE'
            })
        }
    }
}
