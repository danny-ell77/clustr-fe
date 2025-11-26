<template>
  <div class="flex h-full">
    <div class="flex-1 bg-white">
      <div class="card-header">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-semibold text-foreground">
              {{ isNew ? 'Schedule Virtual Meeting' : 'Edit Meeting' }}
            </h1>
            <p class="mt-1 text-sm text-muted-foreground">
              {{ isNew ? 'Create a new virtual meeting' : 'Update meeting details' }}
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <Button variant="outline" @click="$router.back()">Cancel</Button>
            <Button @click="saveMeeting" :disabled="isSubmitting">
              {{ isSubmitting ? 'Saving...' : 'Schedule Meeting' }}
            </Button>
          </div>
        </div>
      </div>

      <div class="p-6">
        <form @submit.prevent="saveMeeting" class="max-w-3xl space-y-6">
          <div>
            <Label for="description">Description</Label>
            <Textarea
              id="description"
              v-model="form.description"
              placeholder="Meeting description or title"
              :rows="3"
              required
            />
          </div>

          <div>
            <Label for="agenda">Meeting Agenda</Label>
            <Textarea
              id="agenda"
              v-model="form.agenda"
              placeholder="List the meeting agenda items"
              :rows="4"
              required
            />
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <Label for="startDate">Start Date</Label>
              <div class="relative">
                <Input
                  id="startDate"
                  type="datetime-local"
                  v-model="form.startDate"
                  class="pl-10"
                  required
                />
                <Icon
                  name="calendar"
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                />
              </div>
            </div>

            <div>
              <Label for="duration">Duration</Label>
              <Select v-model="form.duration">
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="180">3 hours</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label for="link">Meeting Link</Label>
            <div class="relative">
              <Input
                id="link"
                type="url"
                v-model="form.meetingLink"
                placeholder="Enter meeting link"
                class="pl-10"
                required
              />
              <Icon
                name="link"
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
              />
            </div>
          </div>

          <div>
            <Label>Participants</Label>
            <div class="mt-2 border rounded-lg divide-y">
              <div
                v-for="participant in form.participants"
                :key="participant.email"
                class="p-3 flex items-center justify-between"
              >
                <div class="flex items-center space-x-3">
                  <Avatar class="h-8 w-8">
                    <AvatarImage :src="participant.avatar" />
                    <AvatarFallback>{{ getInitials(participant.name) }}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div class="font-medium">{{ participant.name }}</div>
                    <div class="text-sm text-muted-foreground">{{ participant.email }}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  @click="removeParticipant(participant)"
                  class="text-gray-400 hover:text-red-500"
                >
                  <Icon name="x" class="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div class="mt-2">
              <Button
                type="button"
                variant="outline"
                @click="showAddParticipants = true"
                class="w-full"
              >
                <Icon name="plus" class="h-4 w-4 mr-2" />
                Add Participants
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Notifications Sidebar -->
    <div class="w-80 border-l border-border  p-6 space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-medium">Notifications</h2>
        <Button variant="ghost" size="sm">See all</Button>
      </div>

      <div class="space-y-4">
        <div v-for="notification in notifications" :key="notification.id" class="bg-white p-4 rounded-lg shadow-sm">
          <div class="flex items-start space-x-3">
            <Avatar class="h-8 w-8">
              <AvatarImage :src="notification.avatar" />
              <AvatarFallback>{{ getInitials(notification.name) }}</AvatarFallback>
            </Avatar>
            <div>
              <p class="text-sm font-medium">{{ notification.title }}</p>
              <p class="text-sm text-muted-foreground">{{ notification.message }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ formatTimeAgo(notification.timestamp) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Participants Dialog -->
  <Dialog :open="showAddParticipants" @update:open="showAddParticipants = false">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Participants</DialogTitle>
      </DialogHeader>
      <div class="space-y-4">
        <Input
          type="text"
          placeholder="Search users..."
          v-model="searchQuery"
          class="w-full"
        />
        <div class="max-h-[300px] overflow-y-auto space-y-2">
          <div
            v-for="user in filteredUsers"
            :key="user.email"
            class="flex items-center justify-between p-2  rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <Avatar class="h-8 w-8">
                <AvatarImage :src="user.avatar" />
                <AvatarFallback>{{ getInitials(user.name) }}</AvatarFallback>
              </Avatar>
              <div>
                <div class="font-medium">{{ user.name }}</div>
                <div class="text-sm text-muted-foreground">{{ user.email }}</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              @click="addParticipant(user)"
              :disabled="isParticipant(user)"
            >
              {{ isParticipant(user) ? 'Added' : 'Add' }}
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'
import Icon from '~/components/Icon.vue'
import { useToast } from '~/composables/useToast'
import { useFormatters } from '~/composables/useFormatters'

const route = useRoute()
const router = useRouter()
const { success, error } = useToast()
const { formatTimeAgo } = useFormatters()

const isNew = computed(() => route.params.id === 'new')
const isSubmitting = ref(false)
const showAddParticipants = ref(false)
const searchQuery = ref('')

// Form data
const form = ref({
  description: '',
  agenda: '',
  startDate: '',
  duration: '60',
  meetingLink: '',
  participants: []
})

// Mock users data for demo
const users = [
  { name: 'John Doe', email: 'john@example.com', avatar: '' },
  { name: 'Jane Smith', email: 'jane@example.com', avatar: '' },
  { name: 'Mike Johnson', email: 'mike@example.com', avatar: '' },
  // Add more users as needed
]

// Mock notifications
const notifications = ref([
  {
    id: 1,
    title: 'Meeting Reminder',
    message: 'Team standup in 15 minutes',
    timestamp: new Date(Date.now() - 15 * 60000),
    avatar: ''
  },
  {
    id: 2,
    title: 'Meeting Updated',
    message: 'Project review meeting time changed',
    timestamp: new Date(Date.now() - 60 * 60000),
    avatar: ''
  }
])

// Computed
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users
  const query = searchQuery.value.toLowerCase()
  return users.filter(user => 
    user.name.toLowerCase().includes(query) || 
    user.email.toLowerCase().includes(query)
  )
})

// Methods
const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

const isParticipant = (user) => {
  return form.value.participants.some(p => p.email === user.email)
}

const addParticipant = (user) => {
  if (!isParticipant(user)) {
    form.value.participants.push(user)
  }
}

const removeParticipant = (participant) => {
  const index = form.value.participants.findIndex(p => p.email === participant.email)
  if (index !== -1) {
    form.value.participants.splice(index, 1)
  }
}

const saveMeeting = async () => {
  isSubmitting.value = true

  try {
    // TODO: Implement API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    success('Success', 'Meeting scheduled successfully')
    router.push('/meetings')
  } catch (err) {
    error('Error', 'Failed to schedule meeting')
  } finally {
    isSubmitting.value = false
  }
}

// Load meeting data if editing
const loadMeeting = async () => {
  if (!isNew.value) {
    try {
      // TODO: Implement API call to fetch meeting data
      // const meeting = await api.getMeeting(route.params.id)
      // form.value = { ...meeting }
    } catch (err) {
      error('Error', 'Failed to load meeting details')
      router.push('/meetings')
    }
  }
}

loadMeeting()
</script>
