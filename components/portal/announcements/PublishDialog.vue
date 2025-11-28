<template>
    <Dialog v-model:open="isOpen">
        <DialogContent class="max-w-2xl">
            <DialogHeader>
                <DialogTitle>Publish Announcement</DialogTitle>
                <DialogDescription>
                    Review and confirm publication settings for this announcement
                </DialogDescription>
            </DialogHeader>

            <div class="space-y-6">
                <div class="p-4 bg-muted rounded-lg space-y-2">
                    <h4 class="font-semibold">{{ announcement?.title }}</h4>
                    <p class="text-sm text-muted-foreground line-clamp-3">
                        {{ announcement?.content }}
                    </p>
                    <div class="flex items-center gap-2 pt-2">
                        <Badge variant="outline">{{ categoryLabel }}</Badge>
                        <PriorityBadge :priority="announcement?.priority || 'MEDIUM'" />
                    </div>
                </div>

                <div class="space-y-4">
                    <div>
                        <Label for="publishDate">Publish Date & Time</Label>
                        <Input id="publishDate" v-model="publishSettings.publishedAt" type="datetime-local"
                            :min="minDateTime" />
                        <p class="text-xs text-muted-foreground mt-1">
                            Leave empty to publish immediately
                        </p>
                    </div>

                    <div>
                        <Label for="expiryDate">Expiry Date & Time (Optional)</Label>
                        <Input id="expiryDate" v-model="publishSettings.expiresAt" type="datetime-local"
                            :min="publishSettings.publishedAt || minDateTime" />
                        <p class="text-xs text-muted-foreground mt-1">
                            Announcement will be automatically archived after this date
                        </p>
                    </div>

                    <div class="space-y-3">
                        <Label>Notification Settings</Label>
                        <div class="space-y-2">
                            <div class="flex items-center space-x-2">
                                <Checkbox id="notifyAll" v-model:checked="publishSettings.notifyAll" />
                                <Label for="notifyAll" class="font-normal cursor-pointer">
                                    Send notification to all residents
                                </Label>
                            </div>
                            <div class="flex items-center space-x-2">
                                <Checkbox id="sendEmail" v-model:checked="publishSettings.sendEmail"
                                    :disabled="!publishSettings.notifyAll" />
                                <Label for="sendEmail" class="font-normal cursor-pointer">
                                    Send email notification
                                </Label>
                            </div>
                            <div class="flex items-center space-x-2">
                                <Checkbox id="sendPush" v-model:checked="publishSettings.sendPush"
                                    :disabled="!publishSettings.notifyAll" />
                                <Label for="sendPush" class="font-normal cursor-pointer">
                                    Send push notification
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div v-if="announcement?.priority === 'URGENT' || announcement?.priority === 'HIGH'"
                        class="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div class="flex items-start gap-3">
                            <Icon name="alert-triangle" class="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p class="text-sm font-medium text-orange-900">High Priority Announcement</p>
                                <p class="text-xs text-orange-700 mt-1">
                                    This announcement will be prominently displayed to all residents
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-2 p-4 bg-primary/10 border  border-primary/30 rounded-lg">
                    <Icon name="info" class="w-5 h-5 text-primary flex-shrink-0" />
                    <p class="text-sm text-primary">
                        Once published, this announcement will be visible to all residents in the estate
                    </p>
                </div>
            </div>

            <DialogFooter>
                <Button variant="outline" @click="isOpen = false" :disabled="isPublishing">
                    Cancel
                </Button>
                <Button @click="handlePublish" :disabled="isPublishing">
                    <Icon v-if="isPublishing" name="loader" class="w-4 h-4 mr-2 animate-spin" />
                    {{ isPublishing ? 'Publishing...' : 'Publish Now' }}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Checkbox } from '~/components/ui/checkbox'
import Icon from '~/components/Icon.vue'
import PriorityBadge from '~/components/common/PriorityBadge.vue'
import type { Announcement, AnnouncementCategory } from '~/types/announcements'

interface Props {
    open: boolean
    announcement?: Announcement
    isPublishing?: boolean
}

interface PublishSettings {
    publishedAt: string
    expiresAt: string
    notifyAll: boolean
    sendEmail: boolean
    sendPush: boolean
}

const props = withDefaults(defineProps<Props>(), {
    isPublishing: false
})

const emit = defineEmits<{
    'update:open': [value: boolean]
    'publish': [settings: PublishSettings]
}>()

const isOpen = computed({
    get: () => props.open,
    set: (value) => emit('update:open', value)
})

const publishSettings = reactive<PublishSettings>({
    publishedAt: '',
    expiresAt: '',
    notifyAll: true,
    sendEmail: true,
    sendPush: true
})

const minDateTime = computed(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
})

const categoryLabels: Record<AnnouncementCategory, string> = {
    GENERAL: 'General',
    MAINTENANCE: 'Maintenance',
    SECURITY: 'Security',
    EVENT: 'Event',
    EMERGENCY: 'Emergency',
    BILLING: 'Billing',
    OTHER: 'Other'
}

const categoryLabel = computed(() => {
    if (!props.announcement?.category) return ''
    return categoryLabels[props.announcement.category] || props.announcement.category
})

const handlePublish = () => {
    emit('publish', { ...publishSettings })
}

watch(() => props.open, (newValue) => {
    if (newValue) {
        publishSettings.publishedAt = ''
        publishSettings.expiresAt = ''
        publishSettings.notifyAll = true
        publishSettings.sendEmail = true
        publishSettings.sendPush = true
    }
})
</script>
