<template>
    <div class="border-t border-slate-200 bg-white/80 backdrop-blur-sm">
        <div class="max-w-4xl mx-auto p-4">
            <div v-if="attachments.length > 0" class="mb-3 flex flex-wrap gap-2">
                <div v-for="(attachment, index) in attachments" :key="index" class="relative group">
                    <div class="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg border border-slate-200">
                        <Icon name="file" class="w-4 h-4 text-slate-600" />
                        <span class="text-sm text-slate-700 max-w-[150px] truncate">
                            {{ attachment.name }}
                        </span>
                        <button class="ml-1 hover:bg-slate-200 rounded-full p-0.5 transition-colors"
                            @click="removeAttachment(index)">
                            <Icon name="x" class="w-3 h-3 text-slate-600" />
                        </button>
                    </div>
                </div>
            </div>

            <div class="flex items-end gap-2">
                <div class="flex gap-1">
                    <Button variant="ghost" size="icon" class="h-10 w-10 rounded-full hover:bg-primary/10"
                        @click="triggerFileUpload">
                        <Icon name="paperclip" class="w-5 h-5" />
                    </Button>
                    <input ref="fileInput" type="file" class="hidden" multiple accept="image/*,.pdf,.doc,.docx,.txt"
                        @change="handleFileSelect" />
                </div>

                <div class="flex-1 relative">
                    <Textarea v-model="messageText" placeholder="Type a message..."
                        class="min-h-[44px] max-h-[200px] resize-none pr-12 rounded-2xl border-slate-300 focus-visible:ring-primary/20"
                        @keydown.enter.exact.prevent="sendMessage" @keydown.shift.enter="handleShiftEnter" />
                    <Button v-if="messageText.trim() || attachments.length > 0" size="icon"
                        class="absolute right-2 bottom-2 h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
                        :disabled="isSending" @click="sendMessage">
                        <Icon v-if="!isSending" name="send" class="w-4 h-4" />
                        <Icon v-else name="loader-2" class="w-4 h-4 animate-spin" />
                    </Button>
                </div>
            </div>

            <div class="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <span v-if="messageText.length > 0">{{ messageText.length }} / 5000</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import Icon from '~/components/Icon.vue'

interface Attachment {
    name: string
    file: File
}

const emit = defineEmits<{
    'send': [payload: { message: string; attachments: File[] }]
}>()

const messageText = ref('')
const attachments = ref<Attachment[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const isSending = ref(false)

function triggerFileUpload() {
    fileInput.value?.click()
}

function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement
    const files = Array.from(target.files || [])

    files.forEach(file => {
        if (file.size > 10 * 1024 * 1024) {
            alert(`File ${file.name} is too large. Maximum size is 10MB.`)
            return
        }
        attachments.value.push({ name: file.name, file })
    })

    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

function removeAttachment(index: number) {
    attachments.value.splice(index, 1)
}

function handleShiftEnter(event: KeyboardEvent) {
    const textarea = event.target as HTMLTextAreaElement
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    messageText.value = messageText.value.substring(0, start) + '\n' + messageText.value.substring(end)

    setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1
    }, 0)
}

async function sendMessage() {
    if (!messageText.value.trim() && attachments.value.length === 0) return
    if (messageText.value.length > 5000) {
        alert('Message is too long. Maximum length is 5000 characters.')
        return
    }

    isSending.value = true

    try {
        emit('send', {
            message: messageText.value.trim(),
            attachments: attachments.value.map(a => a.file)
        })

        messageText.value = ''
        attachments.value = []
    } finally {
        isSending.value = false
    }
}
</script>
