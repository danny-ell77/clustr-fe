<template>
  <div class="announcement-detail">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-muted-foreground">Loading announcement...</div>
    </div>

    <div v-else-if="error" class="flex flex-col items-center justify-center py-12">
      <div class="text-red-600 mb-4">{{ error.message || 'Failed to load announcement' }}</div>
      <Button @click="handleRetry">Retry</Button>
    </div>

    <div v-else-if="announcement">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <Button variant="ghost" @click="router.back()" class="mb-2">
            <Icon name="arrow-left" class="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 class="text-2xl font-bold">{{ announcement.title }}</h1>
        </div>
        <div class="flex gap-2">
          <Button v-if="announcement.status === 'DRAFT' && hasPermission(PERMISSIONS.COMMUNICATIONS.MANAGE_ANNOUNCEMENT)"
            variant="outline" @click="handlePublish"
            :disabled="publishMutation.isPending.value">
            <Icon name="send" class="w-4 h-4 mr-2" />
            {{ publishMutation.isPending.value ? 'Publishing...' : 'Publish' }}
          </Button>
          
          <Button v-if="hasPermission(PERMISSIONS.COMMUNICATIONS.MANAGE_ANNOUNCEMENT)"
            variant="outline" @click="router.push(`/portal/announcements`)">
            <Icon name="edit-2" class="w-4 h-4 mr-2" />
            Edit
          </Button>

          <Button v-if="hasPermission(PERMISSIONS.COMMUNICATIONS.MANAGE_ANNOUNCEMENT)"
            variant="outline" @click="handleDelete"
            :disabled="deleteMutation.isPending.value"
            class="text-red-600 hover:bg-red-50">
            <Icon name="trash-2" class="w-4 h-4 mr-2" />
            {{ deleteMutation.isPending.value ? 'Deleting...' : 'Delete' }}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <span :class="getPriorityClass(announcement.priority)"
                class="px-2 py-1 rounded text-xs font-medium">
                {{ announcement.priority }}
              </span>
              <span :class="getStatusClass(announcement.status)"
                class="px-2 py-1 rounded text-xs font-medium">
                {{ announcement.status }}
              </span>
            </div>
            <div class="text-sm text-muted-foreground">
              Created: {{ formatDate(announcement.createdAt) }}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="prose max-w-none">
            <p class="whitespace-pre-wrap text-foreground">{{ announcement.content }}</p>
          </div>

          <div v-if="announcement.publishedAt" class="mt-6 pt-6 border-t">
            <div class="text-sm text-muted-foreground">
              Published: {{ formatDate(announcement.publishedAt) }}
            </div>
          </div>

          <div v-if="announcement.createdBy" class="mt-4">
            <div class="text-sm text-muted-foreground">
              Created by: {{ announcement.createdBy.name || announcement.createdBy.email }}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { queryKeys } from '~/constants/query-keys'
import { announcementsApi } from '~/services/api/announcements.api'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import Icon from '~/components/Icon.vue'

const route = useRoute()
const router = useRouter()
const { hasPermission, PERMISSIONS } = usePermissions()
const queryClient = useQueryClient()
const toast = useToast()

definePageMeta({
  title: 'Announcement Details',
  middleware: ['auth', 'permissions'],
  layout: 'default'
})

const announcementId = computed(() => route.params.id as string)

const { data: announcement, isLoading: loading, error, refetch } = useQuery({
  queryKey: computed(() => queryKeys.announcements.detail(announcementId.value)),
  queryFn: () => announcementsApi.getAnnouncementById(announcementId.value),
  enabled: computed(() => !!announcementId.value)
})

const handleRetry = () => {
  refetch()
}

const publishMutation = useMutation({
  mutationFn: announcementsApi.publishAnnouncement,
  onSuccess: () => {
    queryClient.invalidateQueries({ 
      queryKey: queryKeys.announcements.detail(announcementId.value) 
    })
    queryClient.invalidateQueries({ queryKey: queryKeys.announcements.lists() })
    toast.success('Announcement published successfully')
  },
  onError: (error: any) => {
    toast.error(error.message || 'Failed to publish announcement')
  }
})

const deleteMutation = useMutation({
  mutationFn: announcementsApi.deleteAnnouncement,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.announcements.lists() })
    toast.success('Announcement deleted successfully')
    router.push('/portal/announcements')
  },
  onError: (error: any) => {
    toast.error(error.message || 'Failed to delete announcement')
  }
})

const handlePublish = () => {
  if (!announcement.value) return
  if (!confirm(`Publish announcement "${announcement.value.title}"?`)) return
  publishMutation.mutate(announcementId.value)
}

const handleDelete = () => {
  if (!announcement.value) return
  if (!confirm(`Delete announcement "${announcement.value.title}"? This action cannot be undone.`)) return
  deleteMutation.mutate(announcementId.value)
}

const getPriorityClass = (priority: string) => {
  const classes = {
    LOW: 'bg-gray-100 text-gray-800',
    MEDIUM: 'bg-blue-100 text-blue-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800'
  }
  return classes[priority as keyof typeof classes] || classes.MEDIUM
}

const getStatusClass = (status: string) => {
  const classes = {
    DRAFT: 'bg-gray-100 text-gray-800',
    PUBLISHED: 'bg-green-100 text-green-800',
    ARCHIVED: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status as keyof typeof classes] || classes.DRAFT
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
