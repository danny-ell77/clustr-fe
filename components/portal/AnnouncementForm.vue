<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
            <Label for="announcementTitle">Announcement Title</Label>
            <Input id="announcementTitle" v-model="form.title" placeholder="Enter announcement title" required />
        </div>

        <div>
            <Label for="announcementMessage">Message</Label>
            <Textarea id="announcementMessage" v-model="form.message" placeholder="Enter your announcement message"
                rows="4" required />
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <Label for="scheduleDate">Schedule Date</Label>
                <Input id="scheduleDate" type="date" v-model="form.scheduleDate" required />
            </div>
            <div>
                <Label for="scheduleTime">Schedule Time</Label>
                <Input id="scheduleTime" type="time" v-model="form.scheduleTime" required />
            </div>
        </div>

        <div>
            <Label for="recipients">Recipients</Label>
            <Select v-model="form.recipients">
                <SelectTrigger>
                    <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="tenants">Tenants Only</SelectItem>
                    <SelectItem value="staff">Staff Only</SelectItem>
                    <SelectItem value="managers">Managers Only</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div class="flex items-center space-x-2">
            <input type="checkbox" id="urgent" v-model="form.urgent" class="rounded border-gray-300" />
            <Label for="urgent">Mark as urgent</Label>
        </div>

        <div class="flex justify-end gap-2">
            <Button type="button" variant="outline" @click="$emit('cancel')">
                Cancel
            </Button>
            <Button type="submit" :disabled="!isFormValid">
                Schedule Announcement
            </Button>
        </div>
    </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

const emit = defineEmits(['submit', 'cancel'])

const form = ref({
    title: '',
    message: '',
    scheduleDate: '',
    scheduleTime: '',
    recipients: 'all',
    urgent: false
})

const isFormValid = computed(() => {
    return form.value.title.trim() &&
        form.value.message.trim() &&
        form.value.scheduleDate &&
        form.value.scheduleTime
})

const handleSubmit = () => {
    if (isFormValid.value) {
        const announcement = {
            id: Date.now().toString(),
            ...form.value,
            createdAt: new Date().toISOString(),
            status: 'scheduled'
        }

        emit('submit', announcement)

        // Reset form
        form.value = {
            title: '',
            message: '',
            scheduleDate: '',
            scheduleTime: '',
            recipients: 'all',
            urgent: false
        }
    }
}
</script>