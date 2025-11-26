import type { PaginatedResponse } from '~/types/api'
import type {
    Invitation,
    CreateInvitationDto,
    InvitationStatus
} from '~/types/invitations'

export interface InvitationFilters {
    status?: InvitationStatus
    email?: string
    search?: string
    ordering?: string
    page?: number
    pageSize?: number
}

export const managementInvitationsApi = {
    getAll: (params?: InvitationFilters) => {
        const { $api } = useNuxtApp()
        return $api<PaginatedResponse<Invitation>>('/management/invitations/', {
            method: 'GET',
            query: params
        })
    },

    getById: (id: string) => {
        const { $api } = useNuxtApp()
        return $api<Invitation>(`/management/invitations/${id}/`, {
            method: 'GET'
        })
    },

    create: (data: CreateInvitationDto) => {
        const { $api } = useNuxtApp()
        return $api<Invitation>('/management/invitations/', {
            method: 'POST',
            body: data
        })
    },

    resend: (id: string) => {
        const { $api } = useNuxtApp()
        return $api<{ message: string; invitation: Invitation }>(`/management/invitations/${id}/resend/`, {
            method: 'POST'
        })
    },

    revoke: (id: string) => {
        const { $api } = useNuxtApp()
        return $api<{ message: string; invitation: Invitation }>(`/management/invitations/${id}/revoke/`, {
            method: 'POST'
        })
    },

    delete: (id: string) => {
        const { $api } = useNuxtApp()
        return $api(`/management/invitations/${id}/`, {
            method: 'DELETE'
        })
    },

    getPending: () => {
        const { $api } = useNuxtApp()
        return $api<Invitation[]>('/management/invitations/pending/', {
            method: 'GET'
        })
    },

    getExpired: () => {
        const { $api } = useNuxtApp()
        return $api<Invitation[]>('/management/invitations/expired/', {
            method: 'GET'
        })
    }
}
