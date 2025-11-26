import type { PaginatedResponse } from '~/types/api'
import type {
    Announcement,
    AnnouncementCreate,
    AnnouncementUpdate,
    Event,
    EventCreate,
    EventUpdate,
    EventGuest,
    EventGuestCreate,
    EventGuestUpdate,
    Conversation,
    ChatMessage,
    Meeting,
    Notification
} from '~/types/portal'

const getApi = () => {
    const { $api } = useNuxtApp()
    return $api
}

export const portalApi = {
    announcements: {
        getAll: (params?: Record<string, any>) => {
            return getApi()<PaginatedResponse<Announcement>>('/management/announcements/', {
                method: 'GET',
                query: params
            })
        },

        getById: (id: string) => {
            return getApi()<Announcement>(`/management/announcements/${id}/`, {
                method: 'GET'
            })
        },

        create: (data: AnnouncementCreate) => {
            return getApi()<Announcement>('/management/announcements/', {
                method: 'POST',
                body: data
            })
        },

        update: (id: string, data: AnnouncementUpdate) => {
            return getApi()<Announcement>(`/management/announcements/${id}/`, {
                method: 'PATCH',
                body: data
            })
        },

        delete: (id: string) => {
            return getApi()(`/management/announcements/${id}/`, {
                method: 'DELETE'
            })
        },

        publish: (id: string) => {
            return getApi()(`/management/announcements/${id}/publish/`, {
                method: 'POST'
            })
        }
    },

    events: {
        getAll: (params?: Record<string, any>) => {
            return getApi()<PaginatedResponse<Event>>('/management/events/', {
                method: 'GET',
                query: params
            })
        },

        getById: (id: string) => {
            return getApi()<Event>(`/management/events/${id}/`, {
                method: 'GET'
            })
        },

        create: (data: EventCreate) => {
            return getApi()<Event>('/management/events/', {
                method: 'POST',
                body: data
            })
        },

        update: (id: string, data: EventUpdate) => {
            return getApi()<Event>(`/management/events/${id}/`, {
                method: 'PATCH',
                body: data
            })
        },

        delete: (id: string) => {
            return getApi()(`/management/events/${id}/`, {
                method: 'DELETE'
            })
        }
    },

    eventGuests: {
        getAll: (eventId: string, params?: Record<string, any>) => {
            return getApi()<PaginatedResponse<EventGuest>>(`/management/events/${eventId}/guests/`, {
                method: 'GET',
                query: params
            })
        },

        create: (data: EventGuestCreate) => {
            return getApi()<EventGuest>('/management/event-guests/', {
                method: 'POST',
                body: data
            })
        },

        update: (id: string, data: EventGuestUpdate) => {
            return getApi()<EventGuest>(`/management/event-guests/${id}/`, {
                method: 'PATCH',
                body: data
            })
        },

        checkIn: (id: string) => {
            return getApi()<EventGuest>(`/management/event-guests/${id}/check-in/`, {
                method: 'POST'
            })
        },

        checkOut: (id: string) => {
            return getApi()<EventGuest>(`/management/event-guests/${id}/check-out/`, {
                method: 'POST'
            })
        }
    },

    chat: {
        getConversations: (params?: Record<string, any>) => {
            return getApi()<{ conversations: Conversation[] }>('/api/portal/chat/conversations', {
                method: 'GET',
                query: params
            })
        },

        getMessages: (conversationId: string) => {
            return getApi()<{ messages: ChatMessage[] }>('/api/portal/chat/messages', {
                method: 'GET',
                query: { conversationId }
            })
        },

        sendMessage: (conversationId: string, text: string, attachments: { name: string; url: string }[]) => {
            return getApi()<{ message: ChatMessage }>('/api/portal/chat/messages', {
                method: 'POST',
                body: { conversationId, text, attachments }
            })
        }
    },

    meetings: {
        getAll: (params?: Record<string, any>) => {
            return getApi()<{ events: Meeting[] }>('/api/portal/meetings', {
                method: 'GET',
                query: params
            })
        },

        create: (data: Meeting) => {
            return getApi()<{ event: Meeting }>('/api/portal/meetings', {
                method: 'POST',
                body: data
            })
        }
    },

    notifications: {
        getAll: (params?: Record<string, any>) => {
            return getApi()<PaginatedResponse<Notification>>('/management/notifications/', {
                method: 'GET',
                query: params
            })
        },

        markAsRead: (id: string) => {
            return getApi()<Notification>(`/management/notifications/${id}/mark-read/`, {
                method: 'POST'
            })
        },

        markAllAsRead: () => {
            return getApi()('/management/notifications/mark-all-read/', {
                method: 'POST'
            })
        }
    }
}
