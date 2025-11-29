<template>
  <div class="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white border-r border-slate-200">
    <div class="p-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold text-slate-900">Messages</h2>
        <Button size="icon" variant="ghost" class="h-8 w-8 rounded-full hover:bg-primary/10"
          @click="$emit('new-conversation')">
          <Icon name="plus" class="w-4 h-4" />
        </Button>
      </div>

      <div class="relative">
        <Icon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input v-model="searchQuery" placeholder="Search conversations..."
          class="pl-9 bg-slate-100 border-0 focus-visible:ring-1 focus-visible:ring-primary/20" />
      </div>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div class="p-2">
        <TransitionGroup name="conversation-list" tag="div" class="space-y-1">
          <button v-for="conversation in filteredConversations" :key="conversation.id"
            class="w-full text-left p-3 rounded-xl transition-all duration-200 group relative overflow-hidden" :class="[
              conversation.id === modelValue
                ? 'bg-primary/10 shadow-sm ring-1 ring-primary/20'
                : 'hover:bg-slate-100/80'
            ]" @click="selectConversation(conversation.id)">
            <div class="flex items-start gap-3">
              <div class="relative flex-shrink-0">
                <div class="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                  :style="{ backgroundColor: getAvatarColor(conversation.id) }">
                  {{ getInitials(conversation) }}
                </div>
                <div v-if="conversation.unreadCount > 0"
                  class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-white">
                  {{ conversation.unreadCount > 9 ? '9+' : conversation.unreadCount }}
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <h3 class="font-semibold text-sm text-slate-900 truncate">
                    {{ getConversationName(conversation) }}
                  </h3>
                  <span v-if="conversation.lastMessageAt" class="text-xs text-slate-500 flex-shrink-0 ml-2">
                    {{ formatTime(conversation.lastMessageAt) }}
                  </span>
                </div>

                <div class="flex items-center gap-2">
                  <p class="text-xs text-slate-600 truncate flex-1"
                    :class="{ 'font-medium text-slate-900': conversation.unreadCount > 0 }">
                    {{ conversation.lastMessage?.content || 'No messages yet' }}
                  </p>

                  <Icon v-if="conversation.chatType === 'group'" name="users"
                    class="w-3 h-3 text-slate-400 flex-shrink-0" />
                </div>
              </div>
            </div>

            <div v-if="conversation.id === modelValue"
              class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
          </button>
        </TransitionGroup>

        <div v-if="filteredConversations.length === 0" class="text-center py-12 px-4">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <Icon name="message-circle" class="w-8 h-8 text-slate-400" />
          </div>
          <p class="text-sm text-slate-600 mb-1">No conversations found</p>
          <p class="text-xs text-slate-500">
            {{ searchQuery ? 'Try a different search term' : 'Start a new conversation' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import Icon from '~/components/Icon.vue'
import type { Chat } from '~/types/chat'

interface Props {
  conversations: Chat[]
  modelValue: string | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'new-conversation': []
}>()

const searchQuery = ref('')

const filteredConversations = computed(() => {
  if (!searchQuery.value.trim()) return props.conversations

  const query = searchQuery.value.toLowerCase()
  return props.conversations.filter(conv => {
    const name = getConversationName(conv).toLowerCase()
    const lastMessage = conv.lastMessage?.content?.toLowerCase() || ''
    return name.includes(query) || lastMessage.includes(query)
  })
})

function getConversationName(conversation: Chat): string {
  if (conversation.name) return conversation.name
  if (conversation.otherParticipant) return conversation.otherParticipant.name
  return 'Unnamed Conversation'
}

function getInitials(conversation: Chat): string {
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

function formatTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function selectConversation(id: string) {
  emit('update:modelValue', id)
}
</script>

<style scoped>
.conversation-list-move,
.conversation-list-enter-active,
.conversation-list-leave-active {
  transition: all 0.3s ease;
}

.conversation-list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.conversation-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.conversation-list-leave-active {
  position: absolute;
}
</style>
