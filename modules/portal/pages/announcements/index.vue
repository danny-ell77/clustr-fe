<template>
  <div class="flex h-full">
    <div class="flex-1 bg-background">
      <div class="border-b">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <DynamicTabs 
                v-model="activeTab" 
                :tabs="announcementTabs"
                class="w-full"
              >
                <template #all>
                  <div class="space-y-4">
                    <AnnouncementCard 
                      v-for="announcement in announcements" 
                      :key="announcement.id"
                      :announcement="announcement"
                      @delete="confirmDelete(announcement)"
                      @edit="editAnnouncement(announcement)"
                    />
                  </div>
                </template>

                <template #news>
                  <div class="space-y-4">
                    <AnnouncementCard 
                      v-for="announcement in filteredAnnouncements" 
                      :key="announcement.id"
                      :announcement="announcement"
                      @delete="confirmDelete(announcement)"
                      @edit="editAnnouncement(announcement)"
                    />
                  </div>
                </template>

                <template #information>
                  <div class="space-y-4">
                    <AnnouncementCard 
                      v-for="announcement in filteredAnnouncements" 
                      :key="announcement.id"
                      :announcement="announcement"
                      @delete="confirmDelete(announcement)"
                      @edit="editAnnouncement(announcement)"
                    />
                  </div>
                </template>

                <template #estate>
                  <div class="space-y-4">
                    <AnnouncementCard 
                      v-for="announcement in filteredAnnouncements" 
                      :key="announcement.id"
                      :announcement="announcement"
                      @delete="confirmDelete(announcement)"
                      @edit="editAnnouncement(announcement)"
                    />
                  </div>
                </template>

                <template #yours>
                  <div class="mb-6">
                    <div class="flex gap-4">
                      <Button 
                        v-for="status in ['sent', 'scheduled', 'recurring']" 
                        :key="status"
                        :variant="activeStatus === status ? 'default' : 'ghost'"
                        @click="activeStatus = status"
                      >
                        {{ capitalize(status) }}
                      </Button>
                    </div>
                  </div>

                  <div class="space-y-4">
                    <AnnouncementCard 
                      v-for="announcement in filteredAnnouncements" 
                      :key="announcement.id"
                      :announcement="announcement"
                      @delete="confirmDelete(announcement)"
                      @edit="editAnnouncement(announcement)"
                    />
                  </div>
                </template>
              </DynamicTabs>
            </div>
            <Button @click="router.push('/announcements/new')" class="bg-blue-600 hover:bg-blue-700">
              <Icon name="plus" class="w-4 h-4 mr-2" />
              New announcement
            </Button>
          </div>
        </div>
      </div>

    <NotificationsSidebar />
  </div>

    <Dialog :open="!!deleteTarget" @update:open="deleteTarget = null">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Announcement</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this announcement?
          </DialogDescription>
        </DialogHeader>
        <div class="flex justify-end gap-4 mt-6">
          <Button variant="outline" @click="deleteTarget = null">
            No, Cancel
          </Button>
          <Button 
            variant="destructive" 
            @click="deleteAnnouncement"
            :disabled="isDeleting"
          >
            {{ isDeleting ? 'Deleting...' : 'Yes, Delete' }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '~/components/ui/button'
import DynamicTabs from '~/components/shared/DynamicTabs.vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '~/components/ui/dialog'
import { useToast } from '~/composables/useToast'
import { useFormatters } from '~/composables/useFormatters'
import Icon from '~/components/Icon.vue'
import NotificationsSidebar from '~/components/portal/NotificationsSidebar.vue'
import AnnouncementCard from '~/components/portal/announcements/AnnouncementCard.vue'

const router = useRouter()
const { success, error } = useToast()
const { capitalize } = useFormatters()

// Tabs configuration for DynamicTabs component
const announcementTabs = [
  { name: 'All', value: 'all' },
  { name: 'News', value: 'news' },
  { name: 'Information', value: 'information' },
  { name: 'Estate Issues', value: 'estate' },
  { name: 'Your announcements', value: 'yours' }
]

const activeTab = ref('all')
const activeStatus = ref('sent')
const deleteTarget = ref(null)
const isDeleting = ref(false)

// Mock data - replace with actual API calls
const announcements = ref([
  {
    id: 1,
    type: 'news',
    content: 'Important maintenance work scheduled for tomorrow',
    author: {
      name: 'John Doe',
      avatar: '',
    },
    createdAt: new Date(),
    likes: 24,
    comments: 5,
    image: null,
    status: 'sent'
  },
  {
    id: 2,
    type: 'information',
    content: 'Monthly community meeting this weekend',
    author: {
      name: 'Jane Smith',
      avatar: '',
    },
    createdAt: new Date(),
    likes: 15,
    comments: 3,
    image: '/images/meeting.jpg',
    status: 'scheduled'
  }
])

const filteredAnnouncements = computed(() => {
  if (activeTab.value === 'yours') {
    return announcements.value.filter(a => a.status === activeStatus.value)
  }
  if (activeTab.value === 'all') {
    return announcements.value
  }
  return announcements.value.filter(a => a.type === activeTab.value)
})

const confirmDelete = (announcement) => {
  deleteTarget.value = announcement
}

const editAnnouncement = (announcement) => {
  router.push(`/announcements/${announcement.id}`)
}

const deleteAnnouncement = async () => {
  if (!deleteTarget.value) return
  
  isDeleting.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Remove from local state
    const index = announcements.value.findIndex(a => a.id === deleteTarget.value.id)
    if (index !== -1) {
      announcements.value.splice(index, 1)
    }
    
    success('Success', 'Announcement deleted successfully')
    deleteTarget.value = null
  } catch (err) {
    error('Error', 'Failed to delete announcement')
  } finally {
    isDeleting.value = false
  }
}
</script>
