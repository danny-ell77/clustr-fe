import type { PaginatedResponse } from '~/types/api'
import type {
    Chat,
    Message,
    CreateChatDto,
    CreateMessageDto,
    MessageAttachment
} from '~/types/chat'

export interface ConversationFilters {
    search?: string
    hasUnread?: boolean
    ordering?: string
    page?: number
    pageSize?: number
}

export interface MessageFilters {
    conversation?: string
    search?: string
    ordering?: string
    page?: number
    pageSize?: number
}

export const managementChatApi = {
    conversations: {
        getAll: (params?: ConversationFilters) => {
            const { $api } = useNuxtApp()
            return $api<PaginatedResponse<Chat>>('/management/chat/conversations/', {
                method: 'GET',
                query: params
            })
        },

        getById: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<Chat>(`/management/chat/conversations/${id}/`, {
                method: 'GET'
            })
        },

        create: (data: CreateChatDto) => {
            const { $api } = useNuxtApp()
            return $api<Chat>('/management/chat/conversations/', {
                method: 'POST',
                body: data
            })
        },

        delete: (id: string) => {
            const { $api } = useNuxtApp()
            return $api(`/management/chat/conversations/${id}/`, {
                method: 'DELETE'
            })
        },

        markAsRead: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string }>(`/management/chat/conversations/${id}/mark_as_read/`, {
                method: 'POST'
            })
        },

        archive: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string; conversation: Chat }>(`/management/chat/conversations/${id}/archive/`, {
                method: 'POST'
            })
        },

        unarchive: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string; conversation: Chat }>(`/management/chat/conversations/${id}/unarchive/`, {
                method: 'POST'
            })
        }
    },

    messages: {
        getAll: (params?: MessageFilters) => {
            const { $api } = useNuxtApp()
            return $api<PaginatedResponse<Message>>('/management/chat/messages/', {
                method: 'GET',
                query: params
            })
        },

        getByConversation: (conversationId: string, params?: { page?: number; page_size?: number }) => {
            const { $api } = useNuxtApp()
            return $api<PaginatedResponse<Message>>(`/management/chat/conversations/${conversationId}/messages/`, {
                method: 'GET',
                query: params
            })
        },

        getById: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<Message>(`/management/chat/messages/${id}/`, {
                method: 'GET'
            })
        },

        send: (conversationId: string, data: CreateMessageDto) => {
            const { $api } = useNuxtApp()
            return $api<Message>(`/management/chat/conversations/${conversationId}/send_message/`, {
                method: 'POST',
                body: data
            })
        },

        delete: (id: string) => {
            const { $api } = useNuxtApp()
            return $api(`/management/chat/messages/${id}/`, {
                method: 'DELETE'
            })
        },

        markAsRead: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string }>(`/management/chat/messages/${id}/mark_as_read/`, {
                method: 'POST'
            })
        }
    },

    attachments: {
        upload: (conversationId: string, file: File) => {
            const { $api } = useNuxtApp()
            const formData = new FormData()
            formData.append('file', file)
            return $api<MessageAttachment>(`/management/chat/conversations/${conversationId}/upload_attachment/`, {
                method: 'POST',
                body: formData
            })
        },

        delete: (attachmentId: string) => {
            const { $api } = useNuxtApp()
            return $api(`/management/chat/attachments/${attachmentId}/`, {
                method: 'DELETE'
            })
        }
    }
}
