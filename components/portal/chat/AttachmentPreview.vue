<template>
    <div class="inline-block max-w-xs">
        <!-- Image Preview -->
        <div v-if="isImage" class="relative">
            <img :src="attachment.url" :alt="attachment.name"
                class="rounded-lg max-w-full h-auto max-h-48 cursor-pointer" @click="$emit('preview', attachment)" />
            <div class="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {{ attachment.name }}
            </div>
        </div>

        <!-- File Preview -->
        <div v-else class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
            <div class="flex-shrink-0">
                <Icon :name="getFileIcon()" class="w-8 h-8 text-gray-500" />
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ attachment.name }}</p>
                <p class="text-xs text-gray-500">{{ getFileSize() }}</p>
            </div>
            <Button variant="ghost" size="sm" @click="downloadFile" class="flex-shrink-0">
                <Icon name="download" class="w-4 h-4" />
            </Button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Button } from '~/components/ui/button'
import Icon from '~/components/Icon.vue'

const props = defineProps({
    attachment: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['preview', 'download'])

const isImage = computed(() => {
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    return imageTypes.some(type => props.attachment.name.toLowerCase().includes(type.split('/')[1]))
})

const getFileIcon = () => {
    const name = props.attachment.name.toLowerCase()
    if (name.includes('.pdf')) return 'file-text'
    if (name.includes('.doc') || name.includes('.docx')) return 'file-text'
    if (name.includes('.xls') || name.includes('.xlsx')) return 'file-text'
    if (name.includes('.zip') || name.includes('.rar')) return 'archive'
    return 'file'
}

const getFileSize = () => {
    // Mock file size - in real implementation, this would come from the attachment object
    return '2.4 MB'
}

const downloadFile = () => {
    // Create a temporary link to download the file
    const link = document.createElement('a')
    link.href = props.attachment.url
    link.download = props.attachment.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    emit('download', props.attachment)
}
</script>