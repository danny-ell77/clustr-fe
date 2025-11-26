import { ref, computed, watch, onMounted } from 'vue'
import type { Conversation, ChatMessage } from '~/types/portal'
import { portalApi } from '~/services/api/portal.api'

const conversations = ref<Conversation[]>([])
const messages = ref<ChatMessage[]>([])
let loaded = false

export function useChat() {
    const currentConversationId = ref<string | null>(null)

    async function load() {
        if (loaded) return
        const res = await portalApi.chat.getConversations()
        conversations.value = res.conversations
        currentConversationId.value = conversations.value[0]?.id ?? null
        await loadMessages()
        loaded = true
    }

    async function loadMessages() {
        if (!currentConversationId.value) return
        const res = await portalApi.chat.getMessages(currentConversationId.value)
        messages.value = res.messages
        typing.value = true
        setTimeout(() => typing.value = false, 1500)
    }

    const currentMessages = computed(() =>
        messages.value.filter(m => m.conversationId === currentConversationId.value)
    )
    const typing = ref(false)

    async function sendMessage(text: string, atts: { name: string; url: string }[]) {
        if (!currentConversationId.value) return
        const res = await portalApi.chat.sendMessage(currentConversationId.value, text, atts)
        messages.value.push({ ...res.message, mine: true })
        const conv = conversations.value.find(c => c.id === currentConversationId.value)
        if (conv) {
            conv.lastMessage = text || (atts[0]?.name ?? 'Attachment')
            conv.lastTimestamp = res.message.createdAt
        }
    }

    watch(currentConversationId, loadMessages)
    onMounted(load)

    return { conversations, currentConversationId, currentMessages, sendMessage, load }
}
