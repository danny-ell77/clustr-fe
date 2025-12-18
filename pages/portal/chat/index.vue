<template>
    <div class="h-[calc(100vh-4rem)] flex flex-col">
        <!-- <div class="flex items-center justify-between p-1 border-b">
            <div>
                <h1 class="text-3xl font-semibold">Chat</h1>
                <p class="text-muted-foreground">Communicate with residents and staff</p>
            </div>
            <div class="flex items-center gap-2">
                <Button variant="outline" size="sm" @click="toggleMockMode">
                    {{ isMockMode ? 'Mock Mode' : 'Backend Mode' }}
                </Button>
            </div>
        </div> -->

        <div class="flex-1 flex overflow-hidden">
            <div class="w-80 flex-shrink-0 border-r">
                <ConversationList v-model="selectedConversationId" :conversations="conversations"
                    @new-conversation="showNewConversationDialog = true" />
            </div>

            <div class="flex-1 flex flex-col">
                <div v-if="selectedConversationId" class="flex-1 flex flex-col">
                    <div class="border-b px-6 py-4 bg-white">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                                    :style="{ backgroundColor: getAvatarColor(selectedConversationId) }">
                                    {{ getConversationInitials(selectedConversation) }}
                                </div>
                                <div>
                                    <h2 class="font-semibold text-lg">
                                        {{ getConversationName(selectedConversation) }}
                                    </h2>
                                    <p class="text-sm text-muted-foreground">
                                        {{ getConversationSubtitle(selectedConversation) }}
                                    </p>
                                </div>
                            </div>

                            <div class="flex items-center gap-2">
                                <Button variant="ghost" size="icon" @click="handleArchive">
                                    <Icon name="archive" class="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" @click="handleDelete">
                                    <Icon name="trash-2" class="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <MessageThread :messages="messages" :current-user-id="currentUserId" />

                    <MessageComposer @send="handleSendMessage" />
                </div>

                <div v-else class="flex-1 flex items-center justify-center bg-slate-50">
                    <div class="text-center">
                        <div
                            class="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <Icon name="message-circle" class="w-12 h-12 text-primary/60" />
                        </div>
                        <h3 class="text-xl font-semibold text-slate-900 mb-2">Select a conversation</h3>
                        <p class="text-slate-600 mb-6">Choose a conversation from the list to start messaging</p>
                        <Button @click="showNewConversationDialog = true">
                            <Icon name="plus" class="w-4 h-4 mr-2" />
                            New Conversation
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <Dialog v-model:open="showNewConversationDialog">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Conversation</DialogTitle>
                    <DialogDescription>
                        Start a new conversation with a resident or staff member
                    </DialogDescription>
                </DialogHeader>

                <div class="space-y-4">
                    <div>
                        <Label for="participant">Select Participant</Label>
                        <Input id="participant" v-model="newConversationParticipantId" placeholder="Enter user ID" />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" @click="showNewConversationDialog = false">
                        Cancel
                    </Button>
                    <Button :disabled="!newConversationParticipantId || createConversationMutation.isPending.value"
                        @click="handleCreateConversation">
                        {{ createConversationMutation.isPending.value ? 'Creating...' : 'Create' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <ConfirmDialog v-model:open="showArchiveConfirm" title="Archive Conversation"
            description="Are you sure you want to archive this conversation? You can restore it later."
            confirm-text="Archive" @confirm="confirmArchive" />

        <ConfirmDialog v-model:open="showDeleteConfirm" title="Delete Conversation"
            description="Are you sure you want to delete this conversation? This action cannot be undone."
            confirm-text="Delete" variant="destructive" @confirm="confirmDelete" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useChat } from '~/composables/portal/useChat'
import ConversationList from '~/components/portal/chat/ConversationList.vue'
import MessageThread from '~/components/portal/chat/MessageThread.vue'
import MessageComposer from '~/components/portal/chat/MessageComposer.vue'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import ConfirmDialog from '~/components/common/ConfirmDialog.vue'
import Icon from '~/components/Icon.vue'
import type { Chat } from '~/types/chat'

definePageMeta({
    layout: 'default'
})

const {
    useConversations,
    useMessages,
    createConversationMutation,
    sendMessageMutation,
    markAsReadMutation,
    archiveConversationMutation,
    deleteConversationMutation,
    setMockMode,
    isMockMode
} = useChat()

const conversationsQuery = useConversations()
const conversations = computed(() => conversationsQuery.data.value?.conversations || [])

const selectedConversationId = ref<string | null>(null)
const selectedConversation = computed(() =>
    conversations.value.find(c => c.id === selectedConversationId.value)
)

const messagesQuery = useMessages(computed(() => selectedConversationId.value || undefined))
const messages = computed(() => messagesQuery.data.value?.messages || [])

const currentUserId = ref('current-user')

const showNewConversationDialog = ref(false)
const newConversationParticipantId = ref('')

const showArchiveConfirm = ref(false)
const showDeleteConfirm = ref(false)

watch(selectedConversationId, (newId) => {
    if (newId) {
        markAsReadMutation.mutate(newId)
    }
})

function toggleMockMode() {
    setMockMode(!isMockMode.value)
}

function getConversationName(conversation?: Chat): string {
    if (!conversation) return ''
    if (conversation.name) return conversation.name
    if (conversation.otherParticipant) return conversation.otherParticipant.name
    return 'Unnamed Conversation'
}

function getConversationSubtitle(conversation?: Chat): string {
    if (!conversation) return ''
    if (conversation.chatType === 'group') {
        return `${conversation.participantCount || conversation.participants.length} participants`
    }
    return conversation.otherParticipant?.emailAddress || ''
}

function getConversationInitials(conversation?: Chat): string {
    if (!conversation) return ''
    const name = getConversationName(conversation)
    const words = name.split(' ')
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
}

function getAvatarColor(id: string): string {
    const colors = [
        '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
        '#10b981', '#06b6d4', '#6366f1', '#f97316'
    ]
    const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[index % colors.length]
}

async function handleCreateConversation() {
    if (!newConversationParticipantId.value) return

    await createConversationMutation.mutateAsync({
        participantId: newConversationParticipantId.value
    })

    showNewConversationDialog.value = false
    newConversationParticipantId.value = ''
}

async function handleSendMessage(payload: { message: string; attachments: File[] }) {
    if (!selectedConversationId.value) return

    await sendMessageMutation.mutateAsync({
        conversationId: selectedConversationId.value,
        data: {
            content: payload.message,
            attachment: payload.attachments[0]
        }
    })
}

function handleArchive() {
    showArchiveConfirm.value = true
}

function handleDelete() {
    showDeleteConfirm.value = true
}

async function confirmArchive() {
    if (!selectedConversationId.value) return
    await archiveConversationMutation.mutateAsync(selectedConversationId.value)
    selectedConversationId.value = null
}

async function confirmDelete() {
    if (!selectedConversationId.value) return
    await deleteConversationMutation.mutateAsync(selectedConversationId.value)
    selectedConversationId.value = null
}
</script>
