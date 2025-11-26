<template>
  <div class="announcements">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">Announcements</h1>
        <p class="text-muted-foreground">Manage and publish announcements</p>
      </div>

      <div class="flex items-center space-x-2">
        <Button v-if="hasPermission(PERMISSIONS.COMMUNICATIONS.MANAGE_ANNOUNCEMENT)" @click="showCreateModal = true"
          class="bg-blue-600 hover:bg-blue-700">
          <Icon name="plus" class="w-4 h-4 mr-2" />
          Create Announcement
        </Button>
      </div>
    </div>

    <Card class="mb-6">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Priority</Label>
            <Select @update:model-value="(value) => setFilter('priority', value)">
              <SelectTrigger>
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Priorities</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Status</Label>
            <Select @update:model-value="(value) => setFilter('status', value)">
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Search</Label>
            <Input type="text" placeholder="Search announcements..."
              @input="(e: Event) => setSearch((e.target as HTMLInputElement).value)" />
          </div>
        </div>

        <div class="flex items-center justify-between mt-4">
          <div class="text-sm text-muted-foreground">
            Showing {{ announcementsData?.results?.length || 0 }} of {{ announcementsData?.count || 0 }} announcements
          </div>

          <Button variant="outline" @click="clearFilters">
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card>
      <GenericTable :data="announcementsData?.results || []" :columns="tableColumns" :row-actions="tableActions"
        :loading="loading" :enable-search="false" empty-message="No announcements found" @view="viewAnnouncement"
        @edit="editAnnouncement" @delete="deleteAnnouncement" @publish="publishAnnouncement">
        <template #priority="{ row }">
          <span :class="getPriorityClass(row.priority)" class="px-2 py-1 rounded text-xs font-medium">
            {{ row.priority }}
          </span>
        </template>

        <template #status="{ row }">
          <span :class="getStatusClass(row.status)" class="px-2 py-1 rounded text-xs font-medium">
            {{ row.status }}
          </span>
        </template>
      </GenericTable>
    </Card>

    <Dialog v-model:open="showCreateModal">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Announcement</DialogTitle>
          <DialogDescription>
            Create a new announcement for residents
          </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="handleCreate" class="space-y-4">
          <div>
            <Label>Title</Label>
            <Input v-model="formData.title" required />
          </div>

          <div>
            <Label>Content</Label>
            <textarea v-model="formData.content" class="w-full min-h-[150px] p-2 border rounded" required />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label>Priority</Label>
              <Select v-model="formData.priority">
                <SelectTrigger>
                  <SelectValue />
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
              <Label>Status</Label>
              <Select v-model="formData.status">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div class="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" @click="showCreateModal = false">
              Cancel
            </Button>
            <Button type="submit" :disabled="createMutation.isPending.value">
              {{ createMutation.isPending.value ? 'Creating...' : 'Create' }}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="showEditModal">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Announcement</DialogTitle>
          <DialogDescription>
            Update announcement details
          </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="handleUpdate" class="space-y-4">
          <div>
            <Label>Title</Label>
            <Input v-model="editFormData.title" required />
          </div>

          <div>
            <Label>Content</Label>
            <textarea v-model="editFormData.content" class="w-full min-h-[150px] p-2 border rounded" required />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label>Priority</Label>
              <Select v-model="editFormData.priority">
                <SelectTrigger>
                  <SelectValue />
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
              <Label>Status</Label>
              <Select v-model="editFormData.status">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div class="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" @click="showEditModal = false">
              Cancel
            </Button>
            <Button type="submit" :disabled="updateMutation.isPending.value">
              {{ updateMutation.isPending.value ? 'Updating...' : 'Update' }}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { queryKeys } from '~/constants/query-keys'
import { announcementsApi } from '~/services/api/announcements.api'
import type { Announcement } from '~/types/announcements'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '~/components/ui/dialog'
import GenericTable from '~/components/shared/GenericTable.vue'
import Icon from '~/components/Icon.vue'
import { useDataFilters } from '~/composables/useDataFilters'

const { hasPermission, PERMISSIONS } = usePermissions()
const queryClient = useQueryClient()
const toast = useToast()

definePageMeta({
  title: 'Announcements',
  middleware: ['auth', 'permissions'],
  layout: 'default'
})

const filterDefinitions = [
  {
    field: 'priority',
    type: 'select' as const,
    label: 'Priority',
    options: [
      { value: 'LOW', label: 'Low' },
      { value: 'MEDIUM', label: 'Medium' },
      { value: 'HIGH', label: 'High' },
      { value: 'URGENT', label: 'Urgent' }
    ]
  },
  {
    field: 'status',
    type: 'select' as const,
    label: 'Status',
    options: [
      { value: 'DRAFT', label: 'Draft' },
      { value: 'PUBLISHED', label: 'Published' },
      { value: 'ARCHIVED', label: 'Archived' }
    ]
  }
]

const { currentQuery, clearFilters, setFilter, setSearch } = useDataFilters(filterDefinitions, {
  persistKey: 'announcements-filters'
})

const announcementsQuery = useQuery({
  queryKey: computed(() => queryKeys.announcements.list(currentQuery.value)),
  queryFn: () => announcementsApi.getAnnouncements(currentQuery.value)
})

const announcementsData = computed(() => announcementsQuery.data.value)
const loading = computed(() => announcementsQuery.isLoading.value)

const createMutation = useMutation({
  mutationFn: announcementsApi.createAnnouncement,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.announcements.lists() })
    toast.success('Announcement created successfully')
    showCreateModal.value = false
    Object.assign(formData, {
      title: '',
      content: '',
      priority: 'MEDIUM',
      status: 'DRAFT'
    })
  },
  onError: (error: any) => {
    toast.error(error.message || 'Failed to create announcement')
  }
})

const updateMutation = useMutation({
  mutationFn: ({ id, data }: { id: string; data: Partial<Announcement> }) =>
    announcementsApi.updateAnnouncement(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.announcements.lists() })
    if (selectedAnnouncementId.value) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.announcements.detail(selectedAnnouncementId.value)
      })
    }
    showEditModal.value = false
    toast.success('Announcement updated successfully')
  },
  onError: (error: any) => {
    toast.error(error.message || 'Failed to update announcement')
  }
})

const deleteMutation = useMutation({
  mutationFn: announcementsApi.deleteAnnouncement,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.announcements.lists() })
    toast.success('Announcement deleted successfully')
  },
  onError: (error: any) => {
    toast.error(error.message || 'Failed to delete announcement')
  }
})

const publishMutation = useMutation({
  mutationFn: announcementsApi.publishAnnouncement,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.announcements.lists() })
    toast.success('Announcement published successfully')
  },
  onError: (error: any) => {
    toast.error(error.message || 'Failed to publish announcement')
  }
})

const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedAnnouncementId = ref<string | null>(null)

const formData = reactive({
  title: '',
  content: '',
  priority: 'MEDIUM' as Announcement['priority'],
  status: 'DRAFT' as Announcement['status']
})

const editFormData = reactive({
  title: '',
  content: '',
  priority: 'MEDIUM' as Announcement['priority'],
  status: 'DRAFT' as Announcement['status']
})

const handleCreate = () => {
  createMutation.mutate(formData)
}

const handleUpdate = () => {
  if (!selectedAnnouncementId.value) return
  updateMutation.mutate({
    id: selectedAnnouncementId.value,
    data: editFormData
  })
}

const viewAnnouncement = (announcement: Announcement) => {
  navigateTo(`/portal/announcements/${announcement.id}`)
}

const editAnnouncement = (announcement: Announcement) => {
  selectedAnnouncementId.value = announcement.id
  Object.assign(editFormData, {
    title: announcement.title,
    content: announcement.content,
    priority: announcement.priority,
    status: announcement.status
  })
  showEditModal.value = true
}

const deleteAnnouncement = async (announcement: Announcement) => {
  if (!confirm(`Delete announcement "${announcement.title}"?`)) return
  deleteMutation.mutate(announcement.id)
}

const publishAnnouncement = async (announcement: Announcement) => {
  if (announcement.status === 'PUBLISHED') {
    toast.info('Announcement is already published')
    return
  }
  if (!confirm(`Publish announcement "${announcement.title}"?`)) return
  publishMutation.mutate(announcement.id)
}

const tableColumns = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'priority', label: 'Priority', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'createdAt', label: 'Created', sortable: true },
  { key: 'publishedAt', label: 'Published', sortable: true }
]

const tableActions = computed(() => [
  ...(hasPermission(PERMISSIONS.COMMUNICATIONS.VIEW_ANNOUNCEMENT)
    ? [{ key: 'view', label: 'View', icon: 'eye' }]
    : []),
  ...(hasPermission(PERMISSIONS.COMMUNICATIONS.MANAGE_ANNOUNCEMENT)
    ? [{ key: 'edit', label: 'Edit', icon: 'edit-2' }]
    : []),
  ...(hasPermission(PERMISSIONS.COMMUNICATIONS.MANAGE_ANNOUNCEMENT)
    ? [{ key: 'publish', label: 'Publish', icon: 'send' }]
    : []),
  ...(hasPermission(PERMISSIONS.COMMUNICATIONS.MANAGE_ANNOUNCEMENT)
    ? [{ key: 'delete', label: 'Delete', icon: 'trash-2', destructive: true }]
    : [])
])

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
</script>
