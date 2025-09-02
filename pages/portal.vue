<template>
    <div class="h-full flex flex-col">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Portal</h1>
                <p class="text-gray-600 mt-1">Communication and collaboration hub</p>
            </div>
            <Button @click="showNewChat = true" class="bg-blue-600 hover:bg-blue-700">
                <Icon name="plus" class="w-4 h-4 mr-2" />
                New Chat
            </Button>
        </div>

        <!-- Chat Interface -->
        <div class="flex-1 bg-white rounded-lg shadow overflow-hidden flex">
            <!-- Conversation List -->
            <div class="w-80 border-r">
                <ConversationList v-model="activeConversationId" :conversations="conversations" />
            </div>

            <!-- Chat Area -->
            <div class="flex-1 flex flex-col">
                <div v-if="activeConversation" class="flex-1 flex flex-col">
                    <!-- Chat Header -->
                    <div class="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Icon name="user" class="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">{{ activeConversation.name }}</h3>
                                <p class="text-sm text-gray-500">{{ getParticipantCount(activeConversation) }}
                                    participants</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                                <Icon name="phone" class="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Icon name="video" class="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Icon name="more-horizontal" class="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <!-- Messages -->
                    <MessageThread :messages="activeMessages" class="flex-1" />

                    <!-- Message Composer -->
                    <div class="border-t p-4">
                        <MessageComposer @send="sendMessage" />
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="flex-1 flex items-center justify-center">
                    <div class="text-center">
                        <Icon name="message-circle" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                        <p class="text-gray-500 mb-4">Choose a conversation from the list to start chatting</p>
                        <Button @click="showNewChat = true" variant="outline">
                            Start New Chat
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <!-- New Chat Dialog -->
        <Dialog :open="showNewChat" @update:open="showNewChat = $event">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Start New Chat</DialogTitle>
                </DialogHeader>
                <div class="space-y-4">
                    <div>
                        <Label for="chatName">Chat Name</Label>
                        <Input id="chatName" v-model="newChatName" placeholder="Enter chat name" />
                    </div>
                    <div>
                        <Label for="participants">Add Participants</Label>
                        <Input id="participants" v-model="newChatParticipants" placeholder="Enter email addresses" />
                        <p class="text-xs text-gray-500 mt-1">Separate multiple emails with commas</p>
                    </div>
                    <div class="flex justify-end gap-2">
                        <Button variant="outline" @click="showNewChat = false">Cancel</Button>
                        <Button @click="createNewChat" :disabled="!newChatName.trim()">Create Chat</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import Icon from '~/components/Icon.vue'
import ConversationList from '~/components/portal/chat/ConversationList.vue'
import MessageThread from '~/components/portal/chat/MessageThread.vue'
import MessageComposer from '~/components/portal/chat/MessageComposer.vue'

definePageMeta({
    title: 'Portal',
    description: 'Communication portal and chat interface'
})

const activeConversationId = ref(null)
const showNewChat = ref(false)
const newChatName = ref('')
const newChatParticipants = ref('')

// Mock data
const conversations = ref([
    {
        id: '1',
        name: 'General Discussion',
        lastMessage: 'Thanks for the update on the maintenance schedule',
        unread: 2,
        participants: ['john@example.com', 'jane@example.com', 'mike@example.com']
    },
    {
        id: '2',
        name: 'Maintenance Team',
        lastMessage: 'HVAC system check completed successfully',
        unread: 0,
        participants: ['maintenance@example.com', 'supervisor@example.com']
    },
    {
        id: '3',
        name: 'Property Managers',
        lastMessage: 'Monthly report is ready for review',
        unread: 5,
        participants: ['manager1@example.com', 'manager2@example.com']
    }
])

const messages = ref({
    '1': [
        {
            id: '1',
            body: 'Good morning everyone! Hope you all had a great weekend.',
            mine: false,
            createdAt: '2024-12-02T09:00:00Z',
            sender: 'John Doe'
        },
        {
            id: '2',
            body: 'Morning John! Yes, it was great. Ready for the week ahead.',
            mine: true,
            createdAt: '2024-12-02T09:05:00Z',
            sender: 'You'
        },
        {
            id: '3',
            body: 'Thanks for the update on the maintenance schedule. Everything looks good for this week.',
            mine: false,
            createdAt: '2024-12-02T09:10:00Z',
            sender: 'Jane Smith'
        }
    ],
    '2': [
        {
            id: '4',
            body: 'HVAC system check completed successfully. All units are running efficiently.',
            mine: false,
            createdAt: '2024-12-02T08:30:00Z',
            sender: 'Maintenance Team'
        },
        {
            id: '5',
            body: 'Great work! Any issues found that need attention?',
            mine: true,
            createdAt: '2024-12-02T08:35:00Z',
            sender: 'You'
        }
    ],
    '3': [
        {
            id: '6',
            body: 'Monthly report is ready for review. Please check your email for the detailed breakdown.',
            mine: false,
            createdAt: '2024-12-02T07:45:00Z',
            sender: 'Property Manager'
        }
    ]
})

const activeConversation = computed(() => {
    return conversations.value.find(c => c.id === activeConversationId.value)
})

const activeMessages = computed(() => {
    return messages.value[activeConversationId.value] || []
})

const getParticipantCount = (conversation) => {
    return conversation.participants?.length || 0
}

const sendMessage = (messageData) => {
    if (!activeConversationId.value) return

    const newMessage = {
        id: Date.now().toString(),
        body: messageData.message,
        mine: true,
        createdAt: new Date().toISOString(),
        sender: 'You',
        attachments: messageData.attachments || []
    }

    if (!messages.value[activeConversationId.value]) {
        messages.value[activeConversationId.value] = []
    }

    messages.value[activeConversationId.value].push(newMessage)

    // Update last message in conversation
    const conversation = conversations.value.find(c => c.id === activeConversationId.value)
    if (conversation) {
        conversation.lastMessage = messageData.message
    }
}

const createNewChat = () => {
    const newConversation = {
        id: Date.now().toString(),
        name: newChatName.value,
        lastMessage: 'Chat created',
        unread: 0,
        participants: newChatParticipants.value.split(',').map(email => email.trim()).filter(Boolean)
    }

    conversations.value.unshift(newConversation)
    messages.value[newConversation.id] = []

    // Reset form and close dialog
    newChatName.value = ''
    newChatParticipants.value = ''
    showNewChat.value = false

    // Select the new chat
    activeConversationId.value = newConversation.id
}
</script>