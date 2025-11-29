import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { managementChatApi } from '~/services/api/chat.api'
import { queryKeys } from '~/constants/query-keys'
import type { CreateChatDto, CreateMessageDto } from '~/types/chat'

export const useChat = () => {
    const queryClient = useQueryClient()
    const toast = useToast()

    const useConversations = (filters: Ref<any> = ref({})) => {
        return useQuery({
            queryKey: computed(() => queryKeys.chat.conversations.list(filters.value)),
            queryFn: () => managementChatApi.conversations.getAll(filters.value),
            select: (data) => ({
                conversations: data.results || [],
                pagination: {
                    total: data.count || 0,
                    next: data.next,
                    previous: data.previous
                }
            })
        })
    }

    const useConversation = (id: Ref<string | undefined>) => {
        return useQuery({
            queryKey: computed(() => queryKeys.chat.conversations.detail(id.value!)),
            queryFn: () => managementChatApi.conversations.getById(id.value!),
            enabled: computed(() => !!id.value)
        })
    }

    const useMessages = (conversationId: Ref<string | undefined>, params: Ref<any> = ref({})) => {
        return useQuery({
            queryKey: computed(() =>
                queryKeys.chat.messages.byConversation(conversationId.value!)
            ),
            queryFn: () =>
                managementChatApi.messages.getByConversation(conversationId.value!, params.value),
            enabled: computed(() => !!conversationId.value),
            select: (data) => ({
                messages: data.results || [],
                pagination: {
                    total: data.count || 0,
                    next: data.next,
                    previous: data.previous
                }
            })
        })
    }

    const createConversationMutation = useMutation({
        mutationFn: (data: CreateChatDto) => managementChatApi.conversations.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations.all() })
            toast.success('Conversation created successfully')
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create conversation')
        }
    })

    const sendMessageMutation = useMutation({
        mutationFn: ({ conversationId, data }: { conversationId: string, data: CreateMessageDto }) =>
            managementChatApi.messages.send(conversationId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.chat.messages.byConversation(variables.conversationId)
            })
            queryClient.invalidateQueries({
                queryKey: queryKeys.chat.conversations.detail(variables.conversationId)
            })
            queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations.all() })
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to send message')
        }
    })

    const uploadAttachmentMutation = useMutation({
        mutationFn: ({ conversationId, file }: { conversationId: string, file: File }) =>
            managementChatApi.attachments.upload(conversationId, file),
        onSuccess: () => {
            toast.success('Attachment uploaded successfully')
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to upload attachment')
        }
    })

    const markAsReadMutation = useMutation({
        mutationFn: (conversationId: string) =>
            managementChatApi.conversations.markAsRead(conversationId),
        onSuccess: (_, conversationId) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.chat.conversations.detail(conversationId)
            })
            queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations.all() })
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to mark as read')
        }
    })

    const archiveConversationMutation = useMutation({
        mutationFn: (conversationId: string) =>
            managementChatApi.conversations.archive(conversationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations.all() })
            toast.success('Conversation archived')
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to archive conversation')
        }
    })

    const deleteConversationMutation = useMutation({
        mutationFn: (conversationId: string) =>
            managementChatApi.conversations.delete(conversationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations.all() })
            toast.success('Conversation deleted')
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete conversation')
        }
    })

    return {
        useConversations,
        useConversation,
        useMessages,
        createConversationMutation,
        sendMessageMutation,
        uploadAttachmentMutation,
        markAsReadMutation,
        archiveConversationMutation,
        deleteConversationMutation
    }
}
