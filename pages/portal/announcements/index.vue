<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <Typography variant="h1" as="h1">Announcements</Typography>
        <p class="text-muted-foreground">Manage and publish announcements for residents</p>
      </div>

      <Button v-if="hasPermission(PERMISSIONS.COMMUNICATIONS.MANAGE_ANNOUNCEMENT)"
        @click="navigateTo('/portal/announcements/create')">
        <Icon name="plus" class="w-4 h-4 mr-2" />
        Create Announcement
      </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>Category</Label>
            <Select @update:model-value="(value) => setFilter('category', value as string)">
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
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
            <Label>Status</Label>
            <Select @update:model-value="(value) => setFilter('isPublished', value as string)">
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="true">Published</SelectItem>
                <SelectItem value="false">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Sort By</Label>
            <Select @update:model-value="(value) => setFilter('ordering', value as string)">
              <SelectTrigger>
                <SelectValue placeholder="Most Recent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-createdAt">Most Recent</SelectItem>
                <SelectItem value="createdAt">Oldest First</SelectItem>
                <SelectItem value="-publishedAt">Recently Published</SelectItem>
                <SelectItem value="-viewsCount">Most Viewed</SelectItem>
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
            Showing {{ announcements.length }} of {{ announcementsQuery.data.value?.count || 0 }}
            announcements
          </div>
          <Button variant="outline" @click="clearFilters">Clear Filters</Button>
        </div>
      </CardContent>
    </Card>

    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card v-for="i in 6" :key="i">
        <CardContent class="pt-6">
          <Skeleton class="h-48 w-full" />
        </CardContent>
      </Card>
    </div>

    <div v-else-if="announcements.length === 0" class="text-center py-12">
      <EmptyState title="No announcements found" description="Create your first announcement to get started"
        action-label="Create Announcement" @action="navigateTo('/portal/announcements/create')" />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnnouncementCard v-for="announcement in announcements" :key="announcement.id" :announcement="announcement"
        @click="viewAnnouncement" />
    </div>

    <PublishDialog v-if="selectedAnnouncement" v-model:open="showPublishDialog" :announcement="selectedAnnouncement"
      :is-publishing="publishMutation.isPending.value" @publish="handlePublish" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import Icon from '~/components/Icon.vue'
import EmptyState from '~/components/common/EmptyState.vue'
import AnnouncementCard from '~/components/portal/announcements/AnnouncementCard.vue'
import PublishDialog from '~/components/portal/announcements/PublishDialog.vue'
import { useAnnouncements } from '~/composables/portal/useAnnouncements'
import { usePermissions } from '~/composables/auth/usePermissions'
import { useDataFilters } from '~/composables/useDataFilters'
import type { Announcement } from '~/types/announcements'
import type { AnnouncementFilters } from '~/services/api/announcements.api'

definePageMeta({
  title: 'Announcements'
})

const { hasPermission, PERMISSIONS } = usePermissions()
const { useAnnouncements: useAnnouncementsList, publishMutation } = useAnnouncements()

const filterDefinitions = [
  { field: 'category', type: 'select' as const },
  { field: 'isPublished', type: 'select' as const },
  { field: 'ordering', type: 'select' as const },
  { field: 'search', type: 'text' as const }
]

const { currentQuery, clearFilters, setFilter, setSearch } = useDataFilters(filterDefinitions, {
  persistKey: 'announcements-filters'
})

const filters = computed<AnnouncementFilters>(() => ({
  ...currentQuery.value,
  isPublished: currentQuery.value.isPublished === 'true' ? true : currentQuery.value.isPublished === 'false' ? false : undefined
}))

const announcementsQuery = useAnnouncementsList(filters)

const announcements = computed(() => announcementsQuery.data.value?.results || [])
const isLoading = computed(() => announcementsQuery.isLoading.value)

const showPublishDialog = ref(false)
const selectedAnnouncement = ref<Announcement | null>(null)

const viewAnnouncement = (announcement: Announcement) => {
  navigateTo(`/portal/announcements/${announcement.id}`)
}

const handlePublish = async (settings: any) => {
  if (!selectedAnnouncement.value) return
  await publishMutation.mutateAsync(selectedAnnouncement.value.id)
  showPublishDialog.value = false
  selectedAnnouncement.value = null
}
</script>
