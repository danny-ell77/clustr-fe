<template>
  <div class="border-t bg-white p-3">
    <div class="max-w-3xl mx-auto flex items-end gap-2">
      <Button variant="outline" size="icon" @click="showUpload = !showUpload">
        <Icon name="paperclip" class="w-4 h-4" />
      </Button>
      <Textarea v-model="text" placeholder="Type a message" class="flex-1 min-h-[44px]" />
      <Button class="bg-blue-600 text-white" :disabled="!text.trim() && !attachments.length" @click="send">Send</Button>
    </div>
    <div v-if="showUpload" class="max-w-3xl mx-auto mt-2">
      <FileUpload id="chat-upload" label="Attachments" accept="image/*,.pdf,.doc,.docx" @uploaded="onUploaded" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import Icon from '~/components/Icon.vue'
import FileUpload from '~/components/shared/FileUpload.vue'
import { Textarea } from '~/components/ui/textarea'

const emit = defineEmits<{ (e: 'send', payload: { message: string; attachments: { name: string; url: string }[] }): void }>()
const text = ref('')
const attachments = ref<{ name: string; url: string }[]>([])
const showUpload = ref(false)

function onUploaded(files: { name: string; url: string }[]) {
  attachments.value = files
}
function send() {
  if (!text.value.trim() && !attachments.value.length) return
  emit('send', { message: text.value, attachments: attachments.value })
  text.value = ''
  attachments.value = []
  showUpload.value = false
}
</script>
