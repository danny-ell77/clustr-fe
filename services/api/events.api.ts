import type { PaginatedResponse } from '~/types/api'
import type {
    Event,
    CreateEventDto,
    UpdateEventDto,
    EventGuest,
    CreateEventGuestDto,
    BulkGuestCreateDto,
    EventGuestCheckInDto,
    EventGuestCheckOutDto,
    EventStatus,
    EventGuestStatus
} from '~/types/events'

export interface EventFilters {
    status?: EventStatus
    isPublic?: boolean
    startDate?: string
    endDate?: string
    search?: string
    ordering?: string
    page?: number
    pageSize?: number
}

export interface EventGuestFilters {
    event?: string
    status?: EventGuestStatus
    search?: string
    ordering?: string
    page?: number
    pageSize?: number
}

export const managementEventsApi = {
    events: {
        getAll: (params?: EventFilters) => {
            const { $api } = useNuxtApp()
            return $api<PaginatedResponse<Event>>('/management/events/', {
                method: 'GET',
                query: params
            })
        },

        getById: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<Event>(`/management/events/${id}/`, {
                method: 'GET'
            })
        },

        create: (data: CreateEventDto) => {
            const { $api } = useNuxtApp()
            return $api<Event>('/management/events/', {
                method: 'POST',
                body: data
            })
        },

        update: (id: string, data: UpdateEventDto) => {
            const { $api } = useNuxtApp()
            return $api<Event>(`/management/events/${id}/`, {
                method: 'PATCH',
                body: data
            })
        },

        delete: (id: string) => {
            const { $api } = useNuxtApp()
            return $api(`/management/events/${id}/`, {
                method: 'DELETE'
            })
        },

        publish: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string; event: Event }>(`/management/events/${id}/publish/`, {
                method: 'POST'
            })
        },

        cancel: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string; event: Event }>(`/management/events/${id}/cancel/`, {
                method: 'POST'
            })
        },

        complete: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string; event: Event }>(`/management/events/${id}/complete/`, {
                method: 'POST'
            })
        },

        getUpcoming: () => {
            const { $api } = useNuxtApp()
            return $api<Event[]>('/management/events/upcoming/', {
                method: 'GET'
            })
        }
    },

    guests: {
        getAll: (params?: EventGuestFilters) => {
            const { $api } = useNuxtApp()
            return $api<PaginatedResponse<EventGuest>>('/management/event-guests/', {
                method: 'GET',
                query: params
            })
        },

        getById: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<EventGuest>(`/management/event-guests/${id}/`, {
                method: 'GET'
            })
        },

        getByEvent: (eventId: string) => {
            const { $api } = useNuxtApp()
            return $api<EventGuest[]>(`/management/events/${eventId}/guests/`, {
                method: 'GET'
            })
        },

        create: (eventId: string, data: CreateEventGuestDto) => {
            const { $api } = useNuxtApp()
            return $api<EventGuest>(`/management/events/${eventId}/add_guest/`, {
                method: 'POST',
                body: data
            })
        },

        bulkCreate: (eventId: string, data: BulkGuestCreateDto) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string; guests: EventGuest[] }>(`/management/events/${eventId}/bulk_add_guests/`, {
                method: 'POST',
                body: data
            })
        },

        delete: (id: string) => {
            const { $api } = useNuxtApp()
            return $api(`/management/event-guests/${id}/`, {
                method: 'DELETE'
            })
        },

        checkIn: (id: string, data?: EventGuestCheckInDto) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string; guest: EventGuest }>(`/management/event-guests/${id}/check_in/`, {
                method: 'POST',
                body: data || {}
            })
        },

        checkOut: (id: string, data?: EventGuestCheckOutDto) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string; guest: EventGuest }>(`/management/event-guests/${id}/check_out/`, {
                method: 'POST',
                body: data || {}
            })
        },

        confirm: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string; guest: EventGuest }>(`/management/event-guests/${id}/confirm/`, {
                method: 'POST'
            })
        },

        decline: (id: string) => {
            const { $api } = useNuxtApp()
            return $api<{ message: string; guest: EventGuest }>(`/management/event-guests/${id}/decline/`, {
                method: 'POST'
            })
        }
    }
}
