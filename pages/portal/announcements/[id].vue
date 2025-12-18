<template>
  <div class="space-y-6">
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <Skeleton class="h-96 w-full" />
    </div>

    <div v-else-if="error" class="flex flex-col items-center justify-center py-12">
      <EmptyState title="Failed to load announcement" :description="error.message || 'An error occurred'"
        action-label="Retry" @action="refetch" />
    </div>

    <div v-else-if="announcement">
      <div class="flex items-center justify-between">
        <div>
          <Button variant="ghost" @click="router.back()" class="mb-2">
            <Icon name="arrow-left" class="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 class="text-3xl">{{ announcement.title }}</h1>
          <p class="text-muted-foreground mt-1">
            By {{ announcement.authorName }} • {{ formattedDate }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <Button v-if="!announcement.isPublished && hasPermission(PERMISSIONS.COMMUNICATIONS.MANAGE_ANNOUNCEMENT)"
            @click="showPublishDialog = true">
            <Icon name="send" class="w-4 h-4 mr-2" />
            Publish
          </Button>

          <Button v-if="announcement.isPublished && hasPermission(PERMISSIONS.COMMUNICATIONS.MANAGE_ANNOUNCEMENT)"
            variant="outline" @click="handleUnpublish" :disabled="unpublishMutation.isPending.value">
            <Icon name="x-circle" class="w-4 h-4 mr-2" />
            {{ unpublishMutation.isPending.value ? 'Unpublishing...' : 'Unpublish' }}
          </Button>

          <Button v-if="hasPermission(PERMISSIONS.COMMUNICATIONS.MANAGE_ANNOUNCEMENT)" variant="outline"
            @click="router.push(`/portal/announcements/create?id=${announcement.id}`)">
            <Icon name="edit-2" class="w-4 h-4 mr-2" />
            Edit
          </Button>

          <Button v-if="hasPermission(PERMISSIONS.COMMUNICATIONS.MANAGE_ANNOUNCEMENT)" variant="outline"
            @click="handleDelete" class="text-red-600 hover:bg-red-50">
            <Icon name="trash-2" class="w-4 h-4 mr-2" />
            <!-- {{ deleteMutation.isPending.value ? 'Deleting...' : 'Delete' }} -->
          </Button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div class="flex items-center gap-2">
                <StatusBadge :status="announcement.status" :show-icon="true" />
                <Badge variant="outline" class="text-xs">
                  <Icon name="tag" class="w-3 h-3 mr-1" />
                  {{ categoryLabel }}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div class="prose max-w-none">
                <p class="whitespace-pre-wrap text-foreground">{{ announcement.content }}</p>
              </div>

              <div v-if="announcement.attachments && announcement.attachments.length > 0" class="mt-6 pt-6 border-t">
                <h3 class="text-sm font-semibold mb-3">Attachments</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <a v-for="attachment in announcement.attachments" :key="attachment.id" :href="attachment.fileUrl"
                    target="_blank"
                    class="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted transition-colors">
                    <Icon :name="attachment.isImage ? 'image' : 'file'"
                      class="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium truncate">{{ attachment.fileName }}</p>
                      <p class="text-xs text-muted-foreground">{{ attachment.fileSizeFormatted }}
                      </p>
                    </div>
                    <Icon name="download" class="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </a>
                </div>
              </div>

              <div class="mt-6 pt-6 border-t">
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p class="text-muted-foreground">Created</p>
                    <p class="font-medium">{{ formatDate(announcement.createdAt) }}</p>
                  </div>
                  <div v-if="announcement.publishedAt">
                    <p class="text-muted-foreground">Published</p>
                    <p class="font-medium">{{ formatDate(announcement.publishedAt) }}</p>
                  </div>
                  <div v-if="announcement.expiresAt">
                    <p class="text-muted-foreground">Expires</p>
                    <p class="font-medium">{{ formatDate(announcement.expiresAt) }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Last Updated</p>
                    <p class="font-medium">{{ formatDate(announcement.lastModifiedAt) }}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card v-if="announcement.comments && announcement.comments.length > 0">
            <CardHeader>
              <CardTitle>Comments ({{ announcement.comments.length }})</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div v-for="comment in announcement.comments" :key="comment.id"
                  class="flex items-start gap-3 p-3 border rounded-lg">
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-1">
                      <p class="text-sm font-medium">{{ comment.authorName }}</p>
                      <p class="text-xs text-muted-foreground">
                        {{ formatDate(comment.createdAt) }}
                      </p>
                    </div>
                    <p class="text-sm text-muted-foreground">{{ comment.content }}</p>
                  </div>
                  <Button v-if="hasPermission(PERMISSIONS.COMMUNICATIONS.MANAGE_ANNOUNCEMENT)" variant="ghost" size="sm"
                    @click="handleDeleteComment(comment.id)">
                    <Icon name="trash-2" class="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div class="space-y-6">
          <EngagementMetrics :metrics="metrics" :loading="metricsQuery.isLoading.value" :show-details="true"
            :published-at="announcement.publishedAt" :updated-at="announcement.lastModifiedAt" />

          <Card v-if="announcement.priority === 'URGENT' || announcement.priority === 'HIGH'">
            <CardContent class="pt-6">
              <div class="flex items-start gap-3">
                <Icon name="alert-triangle" class="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p class="text-sm font-medium text-orange-900">High Priority Announcement</p>
                  <p class="text-xs text-orange-700 mt-1">
                    This announcement is marked as {{ announcement.priority.toLowerCase() }} priority
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <PublishDialog v-model:open="showPublishDialog" :announcement="announcement"
        :is-publishing="publishMutation.isPending.value" @publish="handlePublish" />

      <ConfirmDialog v-model:open="showDeleteDialog" title="Delete Announcement"
        description="Are you sure you want to delete this announcement? This action cannot be undone."
        confirm-text="Delete" cancel-text="Cancel" @confirm="confirmDelete" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import Icon from '~/components/Icon.vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import PriorityBadge from '~/components/common/PriorityBadge.vue'
import EmptyState from '~/components/common/EmptyState.vue'
import ConfirmDialog from '~/components/common/ConfirmDialog.vue'
import EngagementMetrics from '~/components/portal/announcements/EngagementMetrics.vue'
import PublishDialog from '~/components/portal/announcements/PublishDialog.vue'
import { useAnnouncements } from '~/composables/portal/useAnnouncements'
import { usePermissions } from '~/composables/auth/usePermissions'
import type { AnnouncementCategory } from '~/types/announcements'

definePageMeta({
  title: 'Announcement Details'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

const { hasPermission, PERMISSIONS } = usePermissions()
const {
  useAnnouncement,
  useAnnouncementMetrics,
  publishMutation,
  unpublishMutation,
  deleteCommentMutation
} = useAnnouncements()

const announcementId = computed(() => route.params.id as string)

const announcementQuery = useAnnouncement(announcementId)
const metricsQuery = useAnnouncementMetrics(announcementId)

const announcement = computed(() => announcementQuery.data.value)
const metrics = computed(() => metricsQuery.data.value)
const isLoading = computed(() => announcementQuery.isLoading.value)
const error = computed(() => announcementQuery.error.value)

const showPublishDialog = ref(false)
const showDeleteDialog = ref(false)

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
  if (!announcement.value?.category) return ''
  return categoryLabels[announcement.value.category] || announcement.value.category
})

const formattedDate = computed(() => {
  if (!announcement.value?.createdAt) return ''
  return formatDate(announcement.value.createdAt)
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const refetch = () => {
  announcementQuery.refetch()
}

const handlePublish = async () => {
  if (!announcement.value) return
  await publishMutation.mutateAsync(announcement.value.id)
  showPublishDialog.value = false
}

const handleUnpublish = async () => {
  if (!announcement.value) return
  if (!confirm(`Unpublish announcement "${announcement.value.title}"?`)) return
  await unpublishMutation.mutateAsync(announcement.value.id)
}

const handleDelete = () => {
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  if (!announcement.value) return

  const { useMutation, useQueryClient } = await import('@tanstack/vue-query')
  const { announcementsApi } = await import('~/services/api/announcements.api')
  const { queryKeys } = await import('~/constants/query-keys')

  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: announcementsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all })
      toast.success('Announcement deleted successfully')
      router.push('/portal/announcements')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete announcement')
    }
  })

  await deleteMutation.mutateAsync(announcement.value.id)
}

const handleDeleteComment = async (commentId: string) => {
  if (!announcement.value) return
  if (!confirm('Delete this comment?')) return

  await deleteCommentMutation.mutateAsync({
    announcementId: announcement.value.id,
    commentId
  })
}
</script>
