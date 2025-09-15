<template>
  <div class="flex h-full">
    <div class="flex-1 bg-background">
      <div class="border-b">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-xl font-semibold">
                {{ isEditing ? 'Edit Announcement' : 'New Announcement' }}
              </h1>
              <p class="text-sm text-muted-foreground mt-1">
                {{ isEditing ? 'Update your announcement' : 'Create a new announcement' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6">
        <form @submit.prevent="submitForm" class="max-w-3xl space-y-6">
          <div>
            <Label for="type">Select type</Label>
            <Select v-model="form.type" required>
              <SelectTrigger>
                <SelectValue placeholder="Select announcement type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="information">Information</SelectItem>
                <SelectItem value="estate">Estate Issues</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label for="content">Post an announcement</Label>
            <Textarea
              id="content"
              v-model="form.content"
              :rows="6"
              placeholder="What would you like to announce?"
              required
            />
          </div>

          <div>
            <Label for="image">Add Image (optional)</Label>
            <div 
              class="mt-2 flex justify-center px-6 py-10 border-2 border-dashed rounded-lg"
              :class="isDragging ? 'border-primary bg-primary/5' : 'border-border'"
              @dragenter.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @dragover.prevent
              @drop.prevent="handleDrop"
            >
              <div v-if="!form.image" class="text-center">
                <Icon 
                  name="image-plus" 
                  class="mx-auto h-12 w-12 text-muted-foreground"
                />
                <div class="mt-4 flex text-sm leading-6 text-muted-foreground">
                  <label
                    for="file-upload"
                    class="relative cursor-pointer rounded-md font-semibold text-primary hover:text-primary/80"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      type="file"
                      class="sr-only"
                      accept="image/*"
                      @change="handleFileSelect"
                    >
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs text-muted-foreground">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
              <div v-else class="relative">
                <img
                  :src="previewUrl"
                  class="max-h-48 rounded-lg"
                  alt="Preview"
                >
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  class="absolute -top-2 -right-2"
                  @click="removeImage"
                >
                  <Icon name="x" class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-4">
            <Button type="button" variant="outline" @click="router.push('/announcements')">
              Cancel
            </Button>
            <Button 
              type="button" 
              :disabled="!isValid"
              @click="showScheduleDialog = true"
            >
              Schedule
            </Button>
            <Button 
              type="submit" 
              :disabled="!isValid || isSubmitting"
            >
              {{ isSubmitting ? 'Posting...' : 'Post Now' }}
            </Button>
          </div>
        </form>
      </div>
    </div>

    <NotificationsSidebar />

    <Dialog :open="showScheduleDialog" @update:open="showScheduleDialog = false">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Announcement</DialogTitle>
          <DialogDescription>
            Choose when you want this announcement to be posted
          </DialogDescription>
        </DialogHeader>

        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label>Date</Label>
              <div class="relative">
                <Input
                  type="date"
                  v-model="schedule.date"
                  :min="today"
                  required
                  class="pl-10"
                />
                <Icon
                  name="calendar"
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"
                />
              </div>
            </div>
            <div>
              <Label>Time</Label>
              <div class="relative">
                <Input
                  type="time"
                  v-model="schedule.time"
                  required
                  class="pl-10"
                />
                <Icon
                  name="clock"
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Frequency</Label>
            <Select v-model="schedule.frequency">
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once">One time</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showScheduleDialog = false">
            Cancel
          </Button>
          <Button 
            @click="scheduleAnnouncement"
            :disabled="!isScheduleValid || isSubmitting"
          >
            {{ isSubmitting ? 'Scheduling...' : 'Schedule' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog :open="showSuccessDialog" @update:open="handleSuccessClose">
      <DialogContent>
        <div class="flex flex-col items-center py-6">
          <div class="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Icon name="check" class="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle class="text-center mb-2">
            {{ successMessage }}
          </DialogTitle>
          <Button @click="handleSuccessClose">
            Back
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import Icon from '~/components/Icon.vue'
import NotificationsSidebar from '~/components/portal/NotificationsSidebar.vue'

const route = useRoute()
const router = useRouter()

const isEditing = computed(() => route.params.id !== 'new')
const showScheduleDialog = ref(false)
const showSuccessDialog = ref(false)
const successMessage = ref('')
const isDragging = ref(false)
const previewUrl = ref(null)
const isSubmitting = ref(false)

const form = ref({
  type: '',
  content: '',
  image: null
})

const schedule = ref({
  date: '',
  time: '',
  frequency: 'once'
})

const today = computed(() => {
  const date = new Date()
  return date.toISOString().split('T')[0]
})

const isValid = computed(() => {
  return form.value.type && form.value.content.trim()
})

const isScheduleValid = computed(() => {
  return schedule.value.date && schedule.value.time
})

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFile(file)
  }
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFile(file)
  }
}

const handleFile = (file) => {
  if (file.type.startsWith('image/')) {
    form.value.image = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const removeImage = () => {
  form.value.image = null
  previewUrl.value = null
}

const submitForm = async () => {
  isSubmitting.value = true
  try {
    // TODO: Implement API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    successMessage.value = 'Announcement posted successfully'
    showSuccessDialog.value = true
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

const scheduleAnnouncement = async () => {
  isSubmitting.value = true
  try {
    // TODO: Implement API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    showScheduleDialog.value = false
    successMessage.value = 'Announcement scheduled successfully'
    showSuccessDialog.value = true
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

const handleSuccessClose = () => {
  showSuccessDialog.value = false
  router.push('/announcements')
}

// Load announcement data if editing
if (isEditing.value) {
  // TODO: Implement API call to load announcement
}
</script>
