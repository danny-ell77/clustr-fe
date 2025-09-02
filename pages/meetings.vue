<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Scheduled Virtual Meeting</h1>
                <p class="text-gray-600 mt-1">Manage virtual meetings and appointments</p>
            </div>
            <Button @click="showScheduleForm = true" class="bg-blue-600 hover:bg-blue-700">
                <Icon name="plus" class="w-4 h-4 mr-2" />
                Schedule Meeting
            </Button>
        </div>

        <!-- Calendar View -->
        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-center mb-6">
                <div class="flex items-center gap-4">
                    <Button variant="outline" size="sm" @click="previousMonth">
                        <Icon name="chevron-left" class="w-4 h-4" />
                    </Button>
                    <h2 class="text-xl font-semibold text-gray-900">{{ currentMonthYear }}</h2>
                    <Button variant="outline" size="sm" @click="nextMonth">
                        <Icon name="chevron-right" class="w-4 h-4" />
                    </Button>
                </div>
                <div class="flex gap-2">
                    <Button variant="outline" size="sm" :class="viewMode === 'month' ? 'bg-blue-50' : ''"
                        @click="viewMode = 'month'">
                        Month
                    </Button>
                    <Button variant="outline" size="sm" :class="viewMode === 'week' ? 'bg-blue-50' : ''"
                        @click="viewMode = 'week'">
                        Week
                    </Button>
                </div>
            </div>

            <!-- Calendar Grid -->
            <div class="grid grid-cols-7 gap-1">
                <!-- Day Headers -->
                <div v-for="day in dayHeaders" :key="day"
                    class="p-2 text-center text-sm font-medium text-gray-500 uppercase">
                    {{ day }}
                </div>

                <!-- Calendar Days -->
                <div v-for="date in calendarDays" :key="date.key"
                    class="min-h-[120px] p-2 border border-gray-100 hover:bg-gray-50 cursor-pointer" :class="{
                        'bg-gray-50': !date.isCurrentMonth,
                        'bg-blue-50': date.isToday,
                        'border-blue-300': date.isSelected
                    }" @click="selectDate(date)">
                    <div class="text-sm font-medium mb-1"
                        :class="{ 'text-gray-400': !date.isCurrentMonth, 'text-blue-600': date.isToday }">
                        {{ date.day }}
                    </div>

                    <!-- Meeting Events -->
                    <div class="space-y-1">
                        <div v-for="meeting in date.meetings" :key="meeting.id"
                            class="text-xs p-1 rounded truncate cursor-pointer" :class="getMeetingClass(meeting.type)"
                            :title="meeting.title" @click.stop="viewMeeting(meeting)">
                            {{ meeting.title }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Schedule Meeting Dialog -->
        <Dialog :open="showScheduleForm" @update:open="showScheduleForm = $event">
            <DialogContent class="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Schedule Virtual Meeting</DialogTitle>
                </DialogHeader>
                <form @submit.prevent="scheduleMeeting" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <Label for="meetingTitle">Meeting Title</Label>
                            <Input id="meetingTitle" v-model="meetingForm.title" placeholder="Enter meeting title"
                                required />
                        </div>
                        <div>
                            <Label for="meetingType">Meeting Type</Label>
                            <Select v-model="meetingForm.type">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                    <SelectItem value="inspection">Inspection</SelectItem>
                                    <SelectItem value="meeting">General Meeting</SelectItem>
                                    <SelectItem value="training">Training</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label for="description">Description</Label>
                        <Textarea id="description" v-model="meetingForm.description"
                            placeholder="Meeting description" />
                    </div>

                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <Label for="meetingDate">Date</Label>
                            <Input id="meetingDate" type="date" v-model="meetingForm.date" required />
                        </div>
                        <div>
                            <Label for="startTime">Start Time</Label>
                            <Input id="startTime" type="time" v-model="meetingForm.startTime" required />
                        </div>
                        <div>
                            <Label for="endTime">End Time</Label>
                            <Input id="endTime" type="time" v-model="meetingForm.endTime" required />
                        </div>
                    </div>

                    <div>
                        <Label for="attendees">Attendees</Label>
                        <Input id="attendees" v-model="meetingForm.attendees"
                            placeholder="Enter email addresses (comma separated)" />
                    </div>

                    <div class="flex justify-end gap-2">
                        <Button type="button" variant="outline" @click="showScheduleForm = false">Cancel</Button>
                        <Button type="submit">Schedule Meeting</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>

        <!-- Meeting Details Dialog -->
        <Dialog :open="showMeetingDetails" @update:open="showMeetingDetails = $event">
            <DialogContent v-if="selectedMeeting">
                <DialogHeader>
                    <DialogTitle>{{ selectedMeeting.title }}</DialogTitle>
                </DialogHeader>
                <div class="space-y-4">
                    <div>
                        <Label>Type</Label>
                        <Badge :variant="getMeetingTypeVariant(selectedMeeting.type)" class="capitalize">
                            {{ selectedMeeting.type }}
                        </Badge>
                    </div>
                    <div>
                        <Label>Description</Label>
                        <p class="text-sm text-gray-600">{{ selectedMeeting.description }}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Date</Label>
                            <p class="text-sm text-gray-900">{{ formatDate(selectedMeeting.date) }}</p>
                        </div>
                        <div>
                            <Label>Time</Label>
                            <p class="text-sm text-gray-900">{{ selectedMeeting.startTime }} - {{
                                selectedMeeting.endTime }}</p>
                        </div>
                    </div>
                    <div>
                        <Label>Attendees</Label>
                        <p class="text-sm text-gray-600">{{ selectedMeeting.attendees }}</p>
                    </div>
                    <div class="flex justify-end gap-2">
                        <Button variant="outline" @click="showMeetingDetails = false">Close</Button>
                        <Button @click="joinMeeting(selectedMeeting)" class="bg-green-600 hover:bg-green-700">
                            <Icon name="video" class="w-4 h-4 mr-2" />
                            Join Meeting
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Badge } from '~/components/ui/badge'
import Icon from '~/components/Icon.vue'

definePageMeta({
    title: 'Virtual Meetings',
    description: 'Schedule and manage virtual meetings'
})

const currentDate = ref(new Date())
const viewMode = ref('month')
const showScheduleForm = ref(false)
const showMeetingDetails = ref(false)
const selectedDate = ref(null)
const selectedMeeting = ref(null)

const meetingForm = ref({
    title: '',
    type: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    attendees: ''
})

// Mock meetings data
const meetings = ref([
    { id: '1', title: 'HVAC Maintenance Review', type: 'maintenance', date: '2023-11-15', startTime: '09:00', endTime: '10:00', description: 'Review HVAC system maintenance schedule', attendees: 'john@example.com, jane@example.com' },
    { id: '2', title: 'Property Inspection', type: 'inspection', date: '2023-11-16', startTime: '14:00', endTime: '15:30', description: 'Monthly property inspection walkthrough', attendees: 'inspector@example.com' },
    { id: '3', title: 'Team Meeting', type: 'meeting', date: '2023-11-17', startTime: '11:00', endTime: '12:00', description: 'Weekly team sync meeting', attendees: 'team@example.com' },
    { id: '4', title: 'Safety Training', type: 'training', date: '2023-11-20', startTime: '10:00', endTime: '11:30', description: 'Monthly safety training session', attendees: 'all@example.com' },
    { id: '5', title: 'Maintenance Planning', type: 'maintenance', date: '2023-11-22', startTime: '13:00', endTime: '14:00', description: 'Plan upcoming maintenance tasks', attendees: 'maintenance@example.com' },
    { id: '6', title: 'Budget Review', type: 'meeting', date: '2023-11-25', startTime: '15:00', endTime: '16:00', description: 'Quarterly budget review meeting', attendees: 'finance@example.com' }
])

const dayHeaders = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const currentMonthYear = computed(() => {
    return currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const calendarDays = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const today = new Date()

    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)

        const dayMeetings = meetings.value.filter(meeting => {
            const meetingDate = new Date(meeting.date)
            return meetingDate.toDateString() === date.toDateString()
        })

        days.push({
            key: date.toISOString(),
            day: date.getDate(),
            date: date,
            isCurrentMonth: date.getMonth() === month,
            isToday: date.toDateString() === today.toDateString(),
            isSelected: selectedDate.value && date.toDateString() === selectedDate.value.toDateString(),
            meetings: dayMeetings
        })
    }

    return days
})

const previousMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const selectDate = (date) => {
    selectedDate.value = date.date
    meetingForm.value.date = date.date.toISOString().split('T')[0]
}

const getMeetingClass = (type) => {
    switch (type) {
        case 'maintenance': return 'bg-blue-100 text-blue-800'
        case 'inspection': return 'bg-yellow-100 text-yellow-800'
        case 'meeting': return 'bg-green-100 text-green-800'
        case 'training': return 'bg-purple-100 text-purple-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}

const getMeetingTypeVariant = (type) => {
    switch (type) {
        case 'maintenance': return 'default'
        case 'inspection': return 'secondary'
        case 'meeting': return 'outline'
        case 'training': return 'destructive'
        default: return 'secondary'
    }
}

const viewMeeting = (meeting) => {
    selectedMeeting.value = meeting
    showMeetingDetails.value = true
}

const scheduleMeeting = () => {
    const newMeeting = {
        id: Date.now().toString(),
        ...meetingForm.value
    }

    meetings.value.push(newMeeting)

    // Reset form
    meetingForm.value = {
        title: '',
        type: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        attendees: ''
    }

    showScheduleForm.value = false
}

const joinMeeting = (meeting) => {
    console.log('Joining meeting:', meeting)
    // TODO: Implement video meeting integration
}

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}
</script>