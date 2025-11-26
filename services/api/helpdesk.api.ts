import type { PaginatedResponse } from '~/types/api'
import type {
    IssueTicket,
    IssueTicketDetail,
    CreateIssueTicketDto,
    UpdateIssueTicketDto,
    IssueComment,
    CreateIssueCommentDto,
    IssueAttachment,
    CreateIssueAttachmentDto,
    HelpdeskStatistics,
    IssueType,
    IssuePriority,
    IssueStatus
} from '~/types/helpdesk'

export interface IssueTicketFilters {
    status?: IssueStatus
    type?: IssueType
    priority?: IssuePriority
    assignedTo?: number
    dateFrom?: string
    dateTo?: string
    search?: string
    ordering?: string
    page?: number
    pageSize?: number
}

export interface IssueCommentFilters {
    page?: number
    pageSize?: number
}

export interface AssignTicketDto {
    assignedTo: string
}

export interface ChoiceOption {
    value: string
    label: string
}

export const managementHelpdeskApi = {
    tickets: {
        getAll: (params?: IssueTicketFilters) => {
            const { $api } = useNuxtApp()
            return $api<PaginatedResponse<IssueTicket>>('/management/helpdesk/issues/', {
                method: 'GET',
                query: params
            })
        },

        getById: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<IssueTicketDetail>(`/management/helpdesk/issues/${id}/`, {
                method: 'GET'
            })
        },

        create: (data: CreateIssueTicketDto) => {
            const { $api } = useNuxtApp()
            return $api<IssueTicket>('/management/helpdesk/issues/', {
                method: 'POST',
                body: data
            })
        },

        update: (id: string, data: UpdateIssueTicketDto) => {
            const { $api } = useNuxtApp()
            return $api<IssueTicket>(`/management/helpdesk/issues/${id}/`, {
                method: 'PATCH',
                body: data
            })
        },

        delete: (id: string) => {
            const { $api } = useNuxtApp()
            return $api(`/management/helpdesk/issues/${id}/`, {
                method: 'DELETE'
            })
        },

        assign: (id: string, assignedTo: string) => {
            const { $api } = useNuxtApp()
            return $api<IssueTicket>(`/management/helpdesk/issues/${id}/assign/`, {
                method: 'POST',
                body: { assignedTo }
            })
        },

        escalate: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<IssueTicket>(`/management/helpdesk/issues/${id}/escalate/`, {
                method: 'POST'
            })
        },

        getStatistics: () => {
            const { $api } = useNuxtApp()
            return $api<HelpdeskStatistics>('/management/helpdesk/issues/statistics/', {
                method: 'GET'
            })
        }
    },

    comments: {
        getAll: (issueId: string, params?: IssueCommentFilters) => {
            const { $api } = useNuxtApp()
            return $api<IssueComment[]>(`/management/helpdesk/issues/${issueId}/comments/`, {
                method: 'GET',
                query: params
            })
        },

        getById: (issueId: string, commentId: string) => {
            const { $api } = useNuxtApp()
            return $api<IssueComment>(`/management/helpdesk/issues/${issueId}/comments/${commentId}/`, {
                method: 'GET'
            })
        },

        create: (issueId: string, data: CreateIssueCommentDto) => {
            const { $api } = useNuxtApp()
            return $api<IssueComment>(`/management/helpdesk/issues/${issueId}/comments/`, {
                method: 'POST',
                body: data
            })
        },

        update: (issueId: string, commentId: string, data: Partial<CreateIssueCommentDto>) => {
            const { $api } = useNuxtApp()
            return $api<IssueComment>(`/management/helpdesk/issues/${issueId}/comments/${commentId}/`, {
                method: 'PATCH',
                body: data
            })
        },

        delete: (issueId: string, commentId: string) => {
            const { $api } = useNuxtApp()
            return $api(`/management/helpdesk/issues/${issueId}/comments/${commentId}/`, {
                method: 'DELETE'
            })
        }
    },

    attachments: {
        getAll: (issueId: string) => {
            const { $api } = useNuxtApp()
            return $api<IssueAttachment[]>(`/management/helpdesk/issues/${issueId}/attachments/`, {
                method: 'GET'
            })
        },

        getById: (issueId: string, attachmentId: string) => {
            const { $api } = useNuxtApp()
            return $api<IssueAttachment>(`/management/helpdesk/issues/${issueId}/attachments/${attachmentId}/`, {
                method: 'GET'
            })
        },

        upload: (issueId: string, file: File) => {
            const { $api } = useNuxtApp()
            const formData = new FormData()
            formData.append('file', file)

            return $api<IssueAttachment>(`/management/helpdesk/issues/${issueId}/attachments/`, {
                method: 'POST',
                body: formData
            })
        },

        delete: (issueId: string, attachmentId: string) => {
            const { $api } = useNuxtApp()
            return $api(`/management/helpdesk/issues/${issueId}/attachments/${attachmentId}/`, {
                method: 'DELETE'
            })
        }
    }
}
