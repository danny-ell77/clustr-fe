import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import { announcementsApi, type AnnouncementFilters } from '~/services/api/announcements.api'
import { queryKeys } from '~/constants/query-keys'
import type {
    CreateAnnouncementDto,
    UpdateAnnouncementDto,
    CreateAnnouncementCommentDto
} from '~/types/announcements'

export const useAnnouncements = () => {
    const queryClient = useQueryClient()
    const toast = useToast()

    const useAnnouncements = (filters: Ref<AnnouncementFilters>) => {
        return useQuery({
            queryKey: computed(() => queryKeys.announcements.list(filters.value)),
            queryFn: () => announcementsApi.getAll(filters.value)
        })
    }

    const useAnnouncement = (id: Ref<string | undefined>) => {
        return useQuery({
            queryKey: computed(() => queryKeys.announcements.detail(id.value!)),
            queryFn: () => announcementsApi.getById(id.value!),
            enabled: computed(() => !!id.value)
        })
    }

    const useAnnouncementMetrics = (id: Ref<string | undefined>) => {
        return useQuery({
            queryKey: computed(() => [...queryKeys.announcements.detail(id.value!), 'metrics'] as const),
            queryFn: () => announcementsApi.getEngagementMetrics(id.value!),
            enabled: computed(() => !!id.value),
            refetchInterval: 30000
        })
    }

    const createAnnouncementMutation = useMutation({
        mutationFn: (data: CreateAnnouncementDto) =>
            announcementsApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all })
            toast.success('Announcement created successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to create announcement', error.message || 'Please try again')
        }
    })

    const updateAnnouncementMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateAnnouncementDto }) =>
            announcementsApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.announcements.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all })
            toast.success('Announcement updated successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to update announcement', error.message || 'Please try again')
        }
    })

    const publishMutation = useMutation({
        mutationFn: (id: string) =>
            announcementsApi.publish(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.announcements.detail(id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.announcements.published() })
            toast.success('Announcement published successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to publish announcement', error.message || 'Please try again')
        }
    })

    const unpublishMutation = useMutation({
        mutationFn: (id: string) =>
            announcementsApi.unpublish(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.announcements.detail(id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.announcements.published() })
            toast.success('Announcement unpublished successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to unpublish announcement', error.message || 'Please try again')
        }
    })

    const uploadAttachmentMutation = useMutation({
        mutationFn: ({ id, attachmentId }: { id: string; attachmentId: string }) =>
            announcementsApi.addAttachment(id, { attachmentId }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.announcements.detail(variables.id) })
            toast.success('Attachment added successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to add attachment', error.message || 'Please try again')
        }
    })

    const removeAttachmentMutation = useMutation({
        mutationFn: ({ id, attachmentId }: { id: string; attachmentId: string }) =>
            announcementsApi.removeAttachment(id, { attachmentId }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.announcements.detail(variables.id) })
            toast.success('Attachment removed successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to remove attachment', error.message || 'Please try again')
        }
    })

    const addCommentMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: CreateAnnouncementCommentDto }) =>
            announcementsApi.addComment(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.announcements.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: [...queryKeys.announcements.detail(variables.id), 'metrics'] })
            toast.success('Comment added successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to add comment', error.message || 'Please try again')
        }
    })

    const deleteCommentMutation = useMutation({
        mutationFn: ({ announcementId, commentId }: { announcementId: string; commentId: string }) =>
            announcementsApi.comments.delete(commentId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.announcements.detail(variables.announcementId) })
            queryClient.invalidateQueries({ queryKey: [...queryKeys.announcements.detail(variables.announcementId), 'metrics'] })
            toast.success('Comment deleted successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to delete comment', error.message || 'Please try again')
        }
    })

    return {
        useAnnouncements,
        useAnnouncement,
        useAnnouncementMetrics,
        createAnnouncementMutation,
        updateAnnouncementMutation,
        publishMutation,
        unpublishMutation,
        uploadAttachmentMutation,
        removeAttachmentMutation,
        addCommentMutation,
        deleteCommentMutation
    }
}
