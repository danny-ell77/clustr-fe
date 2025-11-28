<template>
    <div class="space-y-4">
        <div>
            <Label for="title">Title *</Label>
            <Input id="title" v-model="localData.title" placeholder="Enter announcement title" required
                @input="emitUpdate" />
        </div>

        <div>
            <Label for="content">Content *</Label>
            <Textarea id="content" v-model="localData.content" placeholder="Write your announcement content here..."
                rows="8" required @input="emitUpdate" />
            <p class="text-xs text-muted-foreground mt-1">
                {{ contentLength }} characters
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <Label for="category">Category *</Label>
                <Select v-model="localData.category" @update:model-value="emitUpdate">
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="GENERAL">General</SelectItem>
                        <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                        <SelectItem value="SECURITY">Security</SelectItem>
                        <SelectItem value="EVENT">Event</SelectItem>
                        <SelectItem value="EMERGENCY">Emergency</SelectItem>
                        <SelectItem value="BILLING">Billing</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label for="priority">Priority *</Label>
                <Select v-model="localData.priority" @update:model-value="emitUpdate">
                    <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label for="status">Status</Label>
                <Select v-model="localData.status" @update:model-value="emitUpdate">
                    <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label for="publishedAt">Publish Date (Optional)</Label>
                <Input id="publishedAt" v-model="localData.publishedAt" type="datetime-local" @input="emitUpdate" />
                <p class="text-xs text-muted-foreground mt-1">
                    Leave empty to publish immediately
                </p>
            </div>

            <div>
                <Label for="expiresAt">Expiry Date (Optional)</Label>
                <Input id="expiresAt" v-model="localData.expiresAt" type="datetime-local" @input="emitUpdate" />
                <p class="text-xs text-muted-foreground mt-1">
                    Leave empty for no expiration
                </p>
            </div>
        </div>

        <div v-if="showAttachments">
            <Label>Attachments</Label>
            <div class="mt-2 space-y-2">
                <div v-for="attachment in attachments" :key="attachment.id"
                    class="flex items-center justify-between p-3 border rounded-lg">
                    <div class="flex items-center gap-3">
                        <Icon :name="attachment.isImage ? 'image' : 'file'" class="w-5 h-5 text-muted-foreground" />
                        <div>
                            <p class="text-sm font-medium">{{ attachment.fileName }}</p>
                            <p class="text-xs text-muted-foreground">
                                {{ attachment.fileSizeFormatted }}
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" @click="$emit('remove-attachment', attachment.id)">
                        <Icon name="x" class="w-4 h-4" />
                    </Button>
                </div>

                <Button variant="outline" size="sm" class="w-full" @click="$emit('add-attachment')">
                    <Icon name="plus" class="w-4 h-4 mr-2" />
                    Add Attachment
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Button } from '~/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import Icon from '~/components/Icon.vue'
import type { CreateAnnouncementDto, AnnouncementAttachment } from '~/types/announcements'

interface Props {
    modelValue: CreateAnnouncementDto
    attachments?: AnnouncementAttachment[]
    showAttachments?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    attachments: () => [],
    showAttachments: true
})

const emit = defineEmits<{
    'update:modelValue': [value: CreateAnnouncementDto]
    'add-attachment': []
    'remove-attachment': [id: string]
}>()

const localData = ref<CreateAnnouncementDto>({ ...props.modelValue })

watch(() => props.modelValue, (newValue) => {
    localData.value = { ...newValue }
}, { deep: true })

const contentLength = computed(() => {
    return localData.value.content?.length || 0
})

const emitUpdate = () => {
    emit('update:modelValue', { ...localData.value })
}
</script>
