<template>
  <div ref="scroller" class="flex-1 overflow-auto p-6 bg-white">
    <div class="space-y-4 max-w-3xl mx-auto">
      <div v-for="m in messages" :key="m.id" class="flex" :class="m.mine ? 'justify-end' : 'justify-start'">
        <div :class="m.mine ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'"
          class="rounded-2xl px-4 py-2 max-w-[70%]">
          <p class="text-sm whitespace-pre-wrap">{{ m.body }}</p>
          <div v-if="m.attachments?.length" class="mt-2 space-y-2">
            <AttachmentPreview v-for="a in m.attachments" :key="a.id" :attachment="a" @preview="previewAttachment"
              @download="downloadAttachment" />
          </div>
          <p class="text-[10px] mt-1 opacity-70">{{ formatTime(m.createdAt) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onUpdated, ref } from 'vue'
import AttachmentPreview from './AttachmentPreview.vue'
import type { ChatMessage } from '~/types/portal'

const props = defineProps<{ messages: ChatMessage[] }>()
const scroller = ref<HTMLElement | null>(null)

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function previewAttachment(attachment: any) {
  console.log('Preview attachment:', attachment)
  // TODO: Implement attachment preview modal
}

function downloadAttachment(attachment: any) {
  console.log('Download attachment:', attachment)
}

onUpdated(() => {
  scroller.value?.scrollTo({ top: scroller.value.scrollHeight })
})
</script>
