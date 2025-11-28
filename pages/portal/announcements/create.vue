<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <Button variant="ghost" @click="handleBack" class="mb-2">
                    <Icon name="arrow-left" class="w-4 h-4 mr-2" />
                    Back
                </Button>
                <h1 class="text-3xl">{{ isEditMode ? 'Edit Announcement' : 'Create Announcement' }}</h1>
                <p class="text-muted-foreground">
                    {{ isEditMode ? 'Update announcement details' : 'Create a new announcement for residents' }}
                </p>
            </div>

            <div class="flex items-center gap-2">
                <Button variant="outline" @click="handleSaveDraft" :disabled="isSaving">
                    <Icon name="save" class="w-4 h-4 mr-2" />
                    {{ isSaving ? 'Saving...' : 'Save Draft' }}
                </Button>
                <Button @click="showPublishDialog = true" :disabled="!isFormValid || isSaving">
                    <Icon name="send" class="w-4 h-4 mr-2" />
                    Publish
                </Button>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Announcement Details</CardTitle>
                        <CardDescription>
                            Fill in the details for your announcement
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AnnouncementEditor v-model="formData" :attachments="attachments" :show-attachments="true"
                            @add-attachment="handleAddAttachment" @remove-attachment="handleRemoveAttachment" />
                    </CardContent>
                </Card>
            </div>

            <div class="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Preview</CardTitle>
                        <CardDescription>
                            How your announcement will appear
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div v-if="previewAnnouncement" class="space-y-4">
                            <div class="flex items-center gap-2">
                                <StatusBadge :status="formData.status || 'DRAFT'" show-icon />
                                <PriorityBadge :priority="formData.priority || 'MEDIUM'" />
                                <Badge variant="outline" class="text-xs">
                                    {{ categoryLabel }}
                                </Badge>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold mb-2">
                                    {{ formData.title || 'Untitled Announcement' }}
                                </h3>
                                <p class="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {{ formData.content || 'No content yet...' }}
                                </p>
                            </div>

                            <div v-if="attachments.length > 0" class="pt-4 border-t">
                                <p class="text-sm font-medium mb-2">Attachments ({{ attachments.length }})</p>
                                <div class="space-y-2">
                                    <div v-for="attachment in attachments" :key="attachment.id"
                                        class="flex items-center gap-2 text-sm">
                                        <Icon :name="attachment.isImage ? 'image' : 'file'"
                                            class="w-4 h-4 text-muted-foreground" />
                                        <span class="truncate">{{ attachment.fileName }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="pt-4 border-t text-xs text-muted-foreground">
                                <div class="flex items-center gap-4">
                                    <div class="flex items-center gap-1">
                                        <Icon name="eye" class="w-3 h-3" />
                                        <span>0</span>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <Icon name="heart" class="w-3 h-3" />
                                        <span>0</span>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <Icon name="message-circle" class="w-3 h-3" />
                                        <span>0</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card v-if="formData.priority === 'URGENT' || formData.priority === 'HIGH'">
                    <CardContent class="pt-6">
                        <div class="flex items-start gap-3">
                            <Icon name="alert-triangle" class="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p class="text-sm font-medium text-orange-900">High Priority</p>
                                <p class="text-xs text-orange-700 mt-1">
                                    This announcement will be prominently displayed to all residents
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

        <PublishDialog v-if="previewAnnouncement" v-model:open="showPublishDialog" :announcement="previewAnnouncement"
            :is-publishing="publishMutation.isPending.value" @publish="handlePublish" />

        <ConfirmDialog v-model:open="showConfirmDialog" title="Unsaved Changes"
            description="You have unsaved changes. Are you sure you want to leave?" confirm-text="Leave"
            cancel-text="Stay" @confirm="confirmLeave" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import Icon from '~/components/Icon.vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import PriorityBadge from '~/components/common/PriorityBadge.vue'
import ConfirmDialog from '~/components/common/ConfirmDialog.vue'
import AnnouncementEditor from '~/components/portal/announcements/AnnouncementEditor.vue'
import PublishDialog from '~/components/portal/announcements/PublishDialog.vue'
import { useAnnouncements } from '~/composables/portal/useAnnouncements'
import type { CreateAnnouncementDto, AnnouncementCategory, AnnouncementAttachment } from '~/types/announcements'

definePageMeta({
    title: 'Create Announcement'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

const { useAnnouncement, createAnnouncementMutation, updateAnnouncementMutation, publishMutation } = useAnnouncements()

const announcementId = computed(() => route.query.id as string | undefined)
const isEditMode = computed(() => !!announcementId.value)

const existingAnnouncement = useAnnouncement(announcementId)

const formData = ref<CreateAnnouncementDto>({
    title: '',
    content: '',
    category: 'GENERAL' as AnnouncementCategory,
    priority: 'MEDIUM',
    status: 'DRAFT'
})

const attachments = ref<AnnouncementAttachment[]>([])
const showPublishDialog = ref(false)
const showConfirmDialog = ref(false)
const hasUnsavedChanges = ref(false)
const pendingNavigation = ref<string | null>(null)

watch(() => existingAnnouncement.data.value, (announcement) => {
    if (announcement && isEditMode.value) {
        formData.value = {
            title: announcement.title,
            content: announcement.content,
            category: announcement.category,
            priority: announcement.priority,
            status: announcement.status,
            publishedAt: announcement.publishedAt,
            expiresAt: announcement.expiresAt
        }
        attachments.value = announcement.attachments || []
    }
}, { immediate: true })

watch(formData, () => {
    hasUnsavedChanges.value = true
}, { deep: true })

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
    return categoryLabels[formData.value.category] || formData.value.category
})

const isFormValid = computed(() => {
    return formData.value.title.trim().length > 0 && formData.value.content.trim().length > 0
})

const isSaving = computed(() => {
    return createAnnouncementMutation.isPending.value || updateAnnouncementMutation.isPending.value
})

const previewAnnouncement = computed(() => {
    if (!isFormValid.value) return undefined

    return {
        id: announcementId.value || 'preview',
        title: formData.value.title,
        content: formData.value.content,
        category: formData.value.category,
        priority: formData.value.priority || 'MEDIUM',
        status: formData.value.status || 'DRAFT',
        authorId: '',
        authorName: 'You',
        viewsCount: 0,
        likesCount: 0,
        commentsCount: 0,
        isPublished: false,
        attachments: attachments.value,
        comments: [],
        isLikedByUser: false,
        isReadByUser: false,
        createdAt: new Date().toISOString(),
        lastModifiedAt: new Date().toISOString()
    }
})

const handleSaveDraft = async () => {
    if (!isFormValid.value) {
        toast.error('Please fill in all required fields')
        return
    }

    try {
        const draftData = {
            ...formData.value,
            status: 'DRAFT' as const
        }

        if (isEditMode.value && announcementId.value) {
            await updateAnnouncementMutation.mutateAsync({
                id: announcementId.value,
                data: draftData
            })
        } else {
            const result = await createAnnouncementMutation.mutateAsync(draftData)
            router.push(`/portal/announcements/create?id=${result.id}`)
        }

        hasUnsavedChanges.value = false
        toast.success('Draft saved successfully')
    } catch (error: any) {
        toast.error(error.message || 'Failed to save draft')
    }
}

const handlePublish = async (settings: any) => {
    if (!isFormValid.value) {
        toast.error('Please fill in all required fields')
        return
    }

    try {
        let announcementIdToPublish = announcementId.value

        if (!announcementIdToPublish) {
            const result = await createAnnouncementMutation.mutateAsync({
                ...formData.value,
                status: 'DRAFT'
            })
            announcementIdToPublish = result.id
        }

        await publishMutation.mutateAsync(announcementIdToPublish)

        hasUnsavedChanges.value = false
        showPublishDialog.value = false
        toast.success('Announcement published successfully')
        router.push('/portal/announcements')
    } catch (error: any) {
        toast.error(error.message || 'Failed to publish announcement')
    }
}

const handleAddAttachment = () => {
    toast.info('File upload functionality coming soon')
}

const handleRemoveAttachment = (attachmentId: string) => {
    attachments.value = attachments.value.filter(a => a.id !== attachmentId)
    hasUnsavedChanges.value = true
}

const handleBack = () => {
    if (hasUnsavedChanges.value) {
        pendingNavigation.value = '/portal/announcements'
        showConfirmDialog.value = true
    } else {
        router.push('/portal/announcements')
    }
}

const confirmLeave = () => {
    if (pendingNavigation.value) {
        router.push(pendingNavigation.value)
    }
}

onBeforeRouteLeave((to, from, next) => {
    if (hasUnsavedChanges.value) {
        pendingNavigation.value = to.fullPath
        showConfirmDialog.value = true
        next(false)
    } else {
        next()
    }
})
</script>
