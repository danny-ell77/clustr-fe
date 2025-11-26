<template>
  <div class="p-0 h-full flex flex-col">
    <ChatToolbar :title="activeTitle" />
    <div class="flex flex-1 min-h-0">
      <div class="w-72 min-w-72 max-w-72">
        <ConversationList :conversations="conversations" v-model="currentConversationId" />
      </div>
      <MessageThread :messages="currentMessages" />
    </div>
    <MessageComposer @send="(p) => sendMessage(p.message, p.attachments)" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { definePageMeta } from '#imports'
import ConversationList from '~/components/portal/chat/ConversationList.vue'
import MessageThread from '~/components/portal/chat/MessageThread.vue'
import MessageComposer from '~/components/portal/chat/MessageComposer.vue'
import ChatToolbar from '~/components/portal/chat/ChatToolbar.vue'
import { useChat } from '~/composables/portal/useChat'

const { conversations, currentConversationId, currentMessages, sendMessage, load } = useChat()
const activeTitle = computed(() => conversations.value.find(c => c.id === currentConversationId.value)?.name || 'Chat')
await load()

definePageMeta({ title: 'Tenant Chat', description: 'Communicate directly with tenants', requiresPermission: 'portal.chat.view' })
</script>
