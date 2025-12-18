<template>
  <div ref="scrollContainer" class="flex-1 overflow-y-auto max-h-[65%] bg-gradient-to-b from-slate-50/50 to-white">
    <div class="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <div v-for="(message, index) in messages" :key="message.id" class="flex" :class="[
        isOwnMessage(message) ? 'justify-end' : 'justify-start',
        shouldShowAvatar(index) ? 'mt-4' : 'mt-1'
      ]">
        <div class="flex gap-2 max-w-[75%] group" :class="isOwnMessage(message) ? 'flex-row-reverse' : 'flex-row'">
          <div v-if="shouldShowAvatar(index)" class="flex-shrink-0">
            <div v-if="!isOwnMessage(message)"
              class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
              :style="{ backgroundColor: getAvatarColor(message.sender.id) }">
              {{ getInitials(message.sender.name) }}
            </div>
            <div v-else class="w-8 h-8" />
          </div>
          <div v-else class="w-8 flex-shrink-0" />

          <div class="flex flex-col" :class="isOwnMessage(message) ? 'items-end' : 'items-start'">
            <div v-if="shouldShowAvatar(index) && !isOwnMessage(message)"
              class="text-xs font-medium text-slate-700 mb-1 px-1">
              {{ message.sender.name }}
            </div>

            <div class="relative px-4 py-2.5 rounded-2xl shadow-sm transition-all duration-200" :class="[
              isOwnMessage(message)
                ? 'bg-primary text-white rounded-tr-sm'
                : 'bg-white text-slate-900 border border-slate-200 rounded-tl-sm',
              'group-hover:shadow-md'
            ]">
              <p class="text-sm whitespace-pre-wrap break-words leading-relaxed">
                {{ message.content }}
              </p>

              <div class="flex items-center gap-1.5 mt-1.5 text-[10px]"
                :class="isOwnMessage(message) ? 'text-white/70' : 'text-slate-500'">
                <span>{{ formatTime(message.createdAt) }}</span>
                <span v-if="message.isEdited" class="italic">(edited)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="messages.length === 0" class="text-center py-16">
        <div
          class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <Icon name="message-circle" class="w-10 h-10 text-primary/60" />
        </div>
        <p class="text-slate-600 font-medium mb-1">No messages yet</p>
        <p class="text-sm text-slate-500">Start the conversation!</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import Icon from '~/components/Icon.vue'
import type { Message } from '~/types/chat'

interface Props {
  messages: Message[]
  currentUserId?: string
}

const props = defineProps<Props>()

const scrollContainer = ref<HTMLElement | null>(null)

function isOwnMessage(message: Message): boolean {
  if (!props.currentUserId) return false
  return message.sender.id === props.currentUserId
}

function shouldShowAvatar(index: number): boolean {
  if (index === 0) return true
  const currentMessage = props.messages[index]
  const previousMessage = props.messages[index - 1]
  return currentMessage.sender.id !== previousMessage.sender.id
}

function getInitials(name: string): string {
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

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`

  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  const displayMinutes = minutes.toString().padStart(2, '0')

  return `${displayHours}:${displayMinutes} ${ampm}`
}

function scrollToBottom(smooth = true) {
  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTo({
        top: scrollContainer.value.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      })
    }
  })
}

watch(() => props.messages.length, () => {
  scrollToBottom()
})

onMounted(() => {
  scrollToBottom(false)
})
</script>
