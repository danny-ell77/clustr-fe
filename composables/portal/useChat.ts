import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { managementChatApi } from '~/services/api/chat.api'
import { queryKeys } from '~/constants/query-keys'
import type { CreateChatDto, CreateMessageDto, Chat, Message } from '~/types/chat'
import { ChatType, ChatStatus, MessageType, MessageStatus } from '~/types/chat'

const USE_MOCK_DATA = ref(true)

const mockConversations = ref<Chat[]>([
    {
        id: '1',
        chatType: ChatType.DIRECT,
        status: ChatStatus.ACTIVE,
        isPublic: false,
        isModerated: false,
        maxParticipants: 2,
        messageCount: 15,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        participants: [],
        unreadCount: 3,
        lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
        otherParticipant: {
            id: 'user-1',
            name: 'John Smith',
            emailAddress: 'john.smith@example.com'
        },
        lastMessage: {
            id: 'msg-1',
            content: 'Thanks for the update!',
            senderName: 'John Smith',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            messageType: MessageType.TEXT
        }
    },
    {
        id: '2',
        chatType: ChatType.GROUP,
        name: 'Maintenance Team',
        status: ChatStatus.ACTIVE,
        isPublic: false,
        isModerated: false,
        maxParticipants: 50,
        messageCount: 42,
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        participants: [],
        participantCount: 8,
        unreadCount: 0,
        lastMessageAt: new Date(Date.now() - 7200000).toISOString(),
        lastMessage: {
            id: 'msg-2',
            content: 'Meeting scheduled for tomorrow at 10 AM',
            senderName: 'Sarah Johnson',
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            messageType: MessageType.TEXT
        }
    },
    {
        id: '3',
        chatType: ChatType.DIRECT,
        status: ChatStatus.ACTIVE,
        isPublic: false,
        isModerated: false,
        maxParticipants: 2,
        messageCount: 8,
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        participants: [],
        unreadCount: 1,
        lastMessageAt: new Date(Date.now() - 1800000).toISOString(),
        otherParticipant: {
            id: 'user-2',
            name: 'Emily Davis',
            emailAddress: 'emily.davis@example.com'
        },
        lastMessage: {
            id: 'msg-3',
            content: 'Can you check the security logs?',
            senderName: 'Emily Davis',
            createdAt: new Date(Date.now() - 1800000).toISOString(),
            messageType: MessageType.TEXT
        }
    },
    {
        id: '4',
        chatType: ChatType.SUPPORT,
        name: 'Support Ticket #1234',
        status: ChatStatus.ACTIVE,
        isPublic: false,
        isModerated: true,
        maxParticipants: 10,
        messageCount: 5,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        participants: [],
        unreadCount: 0,
        lastMessageAt: new Date(Date.now() - 14400000).toISOString(),
        lastMessage: {
            id: 'msg-4',
            content: 'Issue has been resolved',
            senderName: 'Support Team',
            createdAt: new Date(Date.now() - 14400000).toISOString(),
            messageType: MessageType.TEXT
        }
    }
])

const mockMessages = ref<Record<string, Message[]>>({
    '1': [
        {
            id: 'msg-1-1',
            content: 'Hi, I wanted to follow up on the maintenance request',
            messageType: MessageType.TEXT,
            sender: { id: 'user-1', name: 'John Smith', emailAddress: 'john.smith@example.com' },
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            isEdited: false,
            status: MessageStatus.READ
        },
        {
            id: 'msg-1-2',
            content: 'Sure, let me check the status for you',
            messageType: MessageType.TEXT,
            sender: { id: 'current-user', name: 'You', emailAddress: 'you@example.com' },
            createdAt: new Date(Date.now() - 7000000).toISOString(),
            isEdited: false,
            status: MessageStatus.READ
        },
        {
            id: 'msg-1-3',
            content: 'The maintenance team will be there tomorrow morning',
            messageType: MessageType.TEXT,
            sender: { id: 'current-user', name: 'You', emailAddress: 'you@example.com' },
            createdAt: new Date(Date.now() - 6800000).toISOString(),
            isEdited: false,
            status: MessageStatus.READ
        },
        {
            id: 'msg-1-4',
            content: 'Thanks for the update!',
            messageType: MessageType.TEXT,
            sender: { id: 'user-1', name: 'John Smith', emailAddress: 'john.smith@example.com' },
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            isEdited: false,
            status: MessageStatus.READ
        }
    ],
    '2': [
        {
            id: 'msg-2-1',
            content: 'Good morning team!',
            messageType: MessageType.TEXT,
            sender: { id: 'user-3', name: 'Sarah Johnson', emailAddress: 'sarah@example.com' },
            createdAt: new Date(Date.now() - 28800000).toISOString(),
            isEdited: false,
            status: MessageStatus.READ
        },
        {
            id: 'msg-2-2',
            content: 'We need to discuss the upcoming maintenance schedule',
            messageType: MessageType.TEXT,
            sender: { id: 'user-3', name: 'Sarah Johnson', emailAddress: 'sarah@example.com' },
            createdAt: new Date(Date.now() - 28700000).toISOString(),
            isEdited: false,
            status: MessageStatus.READ
        },
        {
            id: 'msg-2-3',
            content: 'Meeting scheduled for tomorrow at 10 AM',
            messageType: MessageType.TEXT,
            sender: { id: 'user-3', name: 'Sarah Johnson', emailAddress: 'sarah@example.com' },
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            isEdited: false,
            status: MessageStatus.READ
        }
    ],
    '3': [
        {
            id: 'msg-3-1',
            content: 'Hi, I noticed something unusual in the security system',
            messageType: MessageType.TEXT,
            sender: { id: 'user-2', name: 'Emily Davis', emailAddress: 'emily.davis@example.com' },
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            isEdited: false,
            status: MessageStatus.READ
        },
        {
            id: 'msg-3-2',
            content: 'Can you check the security logs?',
            messageType: MessageType.TEXT,
            sender: { id: 'user-2', name: 'Emily Davis', emailAddress: 'emily.davis@example.com' },
            createdAt: new Date(Date.now() - 1800000).toISOString(),
            isEdited: false,
            status: MessageStatus.DELIVERED
        }
    ],
    '4': [
        {
            id: 'msg-4-1',
            content: 'I need help with my account access',
            messageType: MessageType.TEXT,
            sender: { id: 'user-4', name: 'Michael Brown', emailAddress: 'michael@example.com' },
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            isEdited: false,
            status: MessageStatus.READ
        },
        {
            id: 'msg-4-2',
            content: 'Let me look into that for you',
            messageType: MessageType.TEXT,
            sender: { id: 'support-1', name: 'Support Team', emailAddress: 'support@example.com' },
            createdAt: new Date(Date.now() - 72000000).toISOString(),
            isEdited: false,
            status: MessageStatus.READ
        },
        {
            id: 'msg-4-3',
            content: 'Issue has been resolved',
            messageType: MessageType.TEXT,
            sender: { id: 'support-1', name: 'Support Team', emailAddress: 'support@example.com' },
            createdAt: new Date(Date.now() - 14400000).toISOString(),
            isEdited: false,
            status: MessageStatus.READ
        }
    ]
})

export const useChat = () => {
    const queryClient = useQueryClient()
    const toast = useToast()

    const useConversations = (filters: Ref<any> = ref({})) => {
        return useQuery({
            queryKey: computed(() => queryKeys.chat.conversations.list(filters.value)),
            queryFn: async () => {
                if (USE_MOCK_DATA.value) {
                    await new Promise(resolve => setTimeout(resolve, 300))
                    return {
                        results: mockConversations.value,
                        count: mockConversations.value.length,
                        next: null,
                        previous: null
                    }
                }
                return managementChatApi.conversations.getAll(filters.value)
            },
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
            queryFn: async () => {
                if (USE_MOCK_DATA.value) {
                    await new Promise(resolve => setTimeout(resolve, 200))
                    return mockConversations.value.find(c => c.id === id.value)
                }
                return managementChatApi.conversations.getById(id.value!)
            },
            enabled: computed(() => !!id.value)
        })
    }

    const useMessages = (conversationId: Ref<string | undefined>, params: Ref<any> = ref({})) => {
        return useQuery({
            queryKey: computed(() =>
                queryKeys.chat.messages.byConversation(conversationId.value!)
            ),
            queryFn: async () => {
                if (USE_MOCK_DATA.value) {
                    await new Promise(resolve => setTimeout(resolve, 300))
                    return {
                        results: mockMessages.value[conversationId.value!] || [],
                        count: mockMessages.value[conversationId.value!]?.length || 0,
                        next: null,
                        previous: null
                    }
                }
                return managementChatApi.messages.getByConversation(conversationId.value!, params.value)
            },
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
        mutationFn: async (data: CreateChatDto) => {
            if (USE_MOCK_DATA.value) {
                await new Promise(resolve => setTimeout(resolve, 500))
                const newConversation: Chat = {
                    id: `conv-${Date.now()}`,
                    chatType: ChatType.DIRECT,
                    status: ChatStatus.ACTIVE,
                    isPublic: false,
                    isModerated: false,
                    maxParticipants: 2,
                    messageCount: 0,
                    createdAt: new Date().toISOString(),
                    participants: [],
                    unreadCount: 0,
                    otherParticipant: {
                        id: data.participantId,
                        name: 'New User',
                        emailAddress: 'newuser@example.com'
                    }
                }
                mockConversations.value.unshift(newConversation)
                mockMessages.value[newConversation.id] = []
                return newConversation
            }
            return managementChatApi.conversations.create(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations.all() })
            toast.success('Conversation created successfully')
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create conversation')
        }
    })

    const sendMessageMutation = useMutation({
        mutationFn: async ({ conversationId, data }: { conversationId: string, data: CreateMessageDto }) => {
            if (USE_MOCK_DATA.value) {
                await new Promise(resolve => setTimeout(resolve, 400))
                const newMessage: Message = {
                    id: `msg-${Date.now()}`,
                    content: data.content,
                    messageType: data.messageType || MessageType.TEXT,
                    sender: { id: 'current-user', name: 'You', emailAddress: 'you@example.com' },
                    createdAt: new Date().toISOString(),
                    isEdited: false,
                    status: MessageStatus.SENT
                }

                if (!mockMessages.value[conversationId]) {
                    mockMessages.value[conversationId] = []
                }
                mockMessages.value[conversationId].push(newMessage)

                const conversation = mockConversations.value.find(c => c.id === conversationId)
                if (conversation) {
                    conversation.lastMessage = {
                        id: newMessage.id,
                        content: newMessage.content,
                        senderName: 'You',
                        createdAt: newMessage.createdAt,
                        messageType: newMessage.messageType
                    }
                    conversation.lastMessageAt = newMessage.createdAt
                    conversation.messageCount++
                }

                return newMessage
            }
            return managementChatApi.messages.send(conversationId, data)
        },
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
        mutationFn: async ({ conversationId, file }: { conversationId: string, file: File }) => {
            if (USE_MOCK_DATA.value) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { url: URL.createObjectURL(file), filename: file.name }
            }
            return managementChatApi.attachments.upload(conversationId, file)
        },
        onSuccess: () => {
            toast.success('Attachment uploaded successfully')
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to upload attachment')
        }
    })

    const markAsReadMutation = useMutation({
        mutationFn: async (conversationId: string) => {
            if (USE_MOCK_DATA.value) {
                await new Promise(resolve => setTimeout(resolve, 100))
                const conversation = mockConversations.value.find(c => c.id === conversationId)
                if (conversation) {
                    conversation.unreadCount = 0
                }
                return { success: true }
            }
            return managementChatApi.conversations.markAsRead(conversationId)
        },
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
        mutationFn: async (conversationId: string) => {
            if (USE_MOCK_DATA.value) {
                await new Promise(resolve => setTimeout(resolve, 300))
                const conversation = mockConversations.value.find(c => c.id === conversationId)
                if (conversation) {
                    conversation.status = ChatStatus.ARCHIVED
                }
                return { success: true }
            }
            return managementChatApi.conversations.archive(conversationId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations.all() })
            toast.success('Conversation archived')
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to archive conversation')
        }
    })

    const deleteConversationMutation = useMutation({
        mutationFn: async (conversationId: string) => {
            if (USE_MOCK_DATA.value) {
                await new Promise(resolve => setTimeout(resolve, 300))
                const index = mockConversations.value.findIndex(c => c.id === conversationId)
                if (index !== -1) {
                    mockConversations.value.splice(index, 1)
                }
                delete mockMessages.value[conversationId]
                return { success: true }
            }
            return managementChatApi.conversations.delete(conversationId)
        },
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
        deleteConversationMutation,
        setMockMode: (enabled: boolean) => { USE_MOCK_DATA.value = enabled },
        isMockMode: computed(() => USE_MOCK_DATA.value)
    }
}
