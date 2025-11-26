import type { PaginatedResponse } from '~/types/api'
import type {
    Announcement,
    CreateAnnouncementDto,
    UpdateAnnouncementDto,
    AnnouncementComment,
    CreateAnnouncementCommentDto,
    AnnouncementAttachment,
    AnnouncementEngagementMetrics,
    AnnouncementCategory
} from '~/types/announcements'

export interface AnnouncementFilters {
    category?: AnnouncementCategory
    isPublished?: boolean
    search?: string
    ordering?: string
    page?: number
    pageSize?: number
}

export interface CategoryOption {
    value: string
    label: string
}

export interface AddAttachmentDto {
    attachmentId: string
}

export interface RemoveAttachmentDto {
    attachmentId: string
}

export const announcementsApi = {
    getAll: (params?: AnnouncementFilters) => {
        const { $api } = useNuxtApp()
        return $api<PaginatedResponse<Announcement>>('/management/announcements/', {
            method: 'GET',
            query: params
        })
    },

    getById: (id: string) => {
        const { $api } = useNuxtApp()
        return $api<Announcement>(`/management/announcements/${id}/`, {
            method: 'GET'
        })
    },

    create: (data: CreateAnnouncementDto) => {
        const { $api } = useNuxtApp()
        return $api<Announcement>('/management/announcements/', {
            method: 'POST',
            body: data
        })
    },

    update: (id: string, data: UpdateAnnouncementDto) => {
        const { $api } = useNuxtApp()
        return $api<Announcement>(`/management/announcements/${id}/`, {
            method: 'PATCH',
            body: data
        })
    },

    delete: (id: string) => {
        const { $api } = useNuxtApp()
        return $api(`/management/announcements/${id}/`, {
            method: 'DELETE'
        })
    },

    publish: (id: string) => {
        const { $api } = useNuxtApp()
        return $api<Announcement>(`/management/announcements/${id}/publish/`, {
            method: 'POST'
        })
    },

    unpublish: (id: string) => {
        const { $api } = useNuxtApp()
        return $api<Announcement>(`/management/announcements/${id}/unpublish/`, {
            method: 'POST'
        })
    },

    getComments: (id: string, params?: { page?: number; pageSize?: number }) => {
        const { $api } = useNuxtApp()
        return $api<PaginatedResponse<AnnouncementComment>>(`/management/announcements/${id}/comments/`, {
            method: 'GET',
            query: params
        })
    },

    addComment: (id: string, data: CreateAnnouncementCommentDto) => {
        const { $api } = useNuxtApp()
        return $api<AnnouncementComment>(`/management/announcements/${id}/add_comment/`, {
            method: 'POST',
            body: data
        })
    },

    getEngagementMetrics: (id: string) => {
        const { $api } = useNuxtApp()
        return $api<AnnouncementEngagementMetrics>(`/management/announcements/${id}/engagement_metrics/`, {
            method: 'GET'
        })
    },

    getCategories: () => {
        const { $api } = useNuxtApp()
        return $api<CategoryOption[]>('/management/announcements/categories/', {
            method: 'GET'
        })
    },

    getAttachments: (id: string) => {
        const { $api } = useNuxtApp()
        return $api<AnnouncementAttachment[]>(`/management/announcements/${id}/attachments/`, {
            method: 'GET'
        })
    },

    addAttachment: (id: string, data: AddAttachmentDto) => {
        const { $api } = useNuxtApp()
        return $api<AnnouncementAttachment>(`/management/announcements/${id}/add_attachment/`, {
            method: 'POST',
            body: data
        })
    },

    removeAttachment: (id: string, data: RemoveAttachmentDto) => {
        const { $api } = useNuxtApp()
        return $api(`/management/announcements/${id}/remove_attachment/`, {
            method: 'DELETE',
            body: data
        })
    },

    comments: {
        delete: (commentId: string) => {
            const { $api } = useNuxtApp()
            return $api(`/management/announcement-comments/${commentId}/`, {
                method: 'DELETE'
            })
        }
    },

    // Aliases
    getAnnouncements: (params?: AnnouncementFilters) => announcementsApi.getAll(params),
    getAnnouncementById: (id: string) => announcementsApi.getById(id),
    createAnnouncement: (data: CreateAnnouncementDto) => announcementsApi.create(data),
    updateAnnouncement: (id: string, data: UpdateAnnouncementDto) => announcementsApi.update(id, data),
    deleteAnnouncement: (id: string) => announcementsApi.delete(id),
    publishAnnouncement: (id: string) => announcementsApi.publish(id)
}
