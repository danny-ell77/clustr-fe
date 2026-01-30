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

        <AnnouncementsGridContent :announcements="announcements" :is-loading="isLoading" :filters="currentQuery"
            @search="setSearch" @view="viewAnnouncement" @create="navigateTo('/portal/announcements/create')"
            @clear-filters="clearFilters">
            <template #filters>
                <AnnouncementsFilterPanel v-model="filtersModel" :result-count="announcements.length" />
            </template>
        </AnnouncementsGridContent>

        <PublishDialog v-if="selectedAnnouncement" v-model:open="showPublishDialog" :announcement="selectedAnnouncement"
            :is-publishing="publishMutation.isPending.value" @publish="handlePublish" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '~/components/Icon.vue'
import AnnouncementsGridContent from '~/components/portal/announcements/AnnouncementsGridContent.vue'
import AnnouncementsFilterPanel from '~/components/portal/announcements/AnnouncementsFilterPanel.vue'
import PublishDialog from '~/components/portal/announcements/PublishDialog.vue'
import { Button } from '~/components/ui/button'
import { usePermissions } from '~/composables/auth/usePermissions'
import { useAnnouncements } from '~/composables/portal/useAnnouncements'
import { useDataFilters } from '~/composables/useDataFilters'
import type { AnnouncementFilters } from '~/services/api/announcements.api'
import type { Announcement } from '~/types/announcements'

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

const filtersModel = computed({
    get: () => currentQuery.value,
    set: (newFilters: any) => {
        Object.entries(newFilters).forEach(([key, value]) => {
            setFilter(key, value as string)
        })
    }
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
