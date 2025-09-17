<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
            <Label for="announcementTitle">Announcement Title</Label>
            <Input 
                id="announcementTitle" 
                v-model="title.value" 
                placeholder="Enter announcement title"
                :error="title.errors[0]"
                :touched="title.isTouched"
                @blur="title.setTouched()"
            />
        </div>

        <div>
            <Label for="announcementMessage">Message</Label>
            <Textarea 
                id="announcementMessage" 
                v-model="message.value" 
                placeholder="Enter your announcement message"
                rows="4"
                :class="{ 'border-red-500': message.errors.length > 0 && message.isTouched }"
                @blur="message.setTouched()"
            />
            <FormError v-if="message.isTouched" :error="message.errors[0]" />
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <Label for="scheduleDate">Schedule Date</Label>
                <Input 
                    id="scheduleDate" 
                    type="date" 
                    v-model="scheduleDate.value"
                    :error="scheduleDate.errors[0]"
                    :touched="scheduleDate.isTouched"
                    @blur="scheduleDate.setTouched()"
                />
            </div>
            <div>
                <Label for="scheduleTime">Schedule Time</Label>
                <Input 
                    id="scheduleTime" 
                    type="time" 
                    v-model="scheduleTime.value"
                    :error="scheduleTime.errors[0]"
                    :touched="scheduleTime.isTouched"
                    @blur="scheduleTime.setTouched()"
                />
            </div>
        </div>

        <div>
            <Label for="recipients">Recipients</Label>
            <Select 
                v-model="recipients.value"
                @blur="recipients.setTouched()"
            >
                <SelectTrigger :class="{ 'border-red-500': recipients.errors.length > 0 && recipients.isTouched }">
                    <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="tenants">Tenants Only</SelectItem>
                    <SelectItem value="staff">Staff Only</SelectItem>
                    <SelectItem value="managers">Managers Only</SelectItem>
                </SelectContent>
            </Select>
            <FormError v-if="recipients.isTouched" :error="recipients.errors[0]" />
        </div>

        <div class="flex items-center space-x-2">
            <input 
                type="checkbox" 
                id="urgent" 
                v-model="urgent.value" 
                class="rounded border-gray-300"
            />
            <Label for="urgent">Mark as urgent</Label>
        </div>

        <div class="flex justify-end gap-2">
            <Button type="button" variant="outline" @click="$emit('cancel')">
                Cancel
            </Button>
            <Button 
                type="submit" 
                :variant="isFormValid ? 'default' : 'secondary'"
                :disabled="!isFormValid"
            >
                Schedule Announcement
            </Button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { FormError } from '~/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { useFieldValidation } from '~/composables/useFieldValidation'
import { rules } from '~/utils/validators'

const emit = defineEmits(['submit', 'cancel'])

// Custom validator for future date
const isFutureDate = (value: string) => {
    const selectedDate = new Date(value)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return selectedDate >= today
}

// Field validations
const title = useFieldValidation('', [
    rules.required('Title is required'),
    rules.minLength(5, 'Title must be at least 5 characters'),
    rules.maxLength(100, 'Title cannot exceed 100 characters')
])

const message = useFieldValidation('', [
    rules.required('Message is required'),
    rules.minLength(10, 'Message must be at least 10 characters'),
    rules.maxLength(1000, 'Message cannot exceed 1000 characters')
])

const scheduleDate = useFieldValidation('', [
    rules.required('Schedule date is required'),
    rules.custom(isFutureDate, 'Date must be today or in the future')
])

const scheduleTime = useFieldValidation('', [
    rules.required('Schedule time is required')
])

const recipients = useFieldValidation('all', [
    rules.required('Please select recipients')
])

const urgent = useFieldValidation(false)

// Form-level validation
const isFormValid = computed(() =>
    title.isValid &&
    message.isValid &&
    scheduleDate.isValid &&
    scheduleTime.isValid &&
    recipients.isValid
)

const handleSubmit = () => {
    // Mark all fields as touched to show any validation errors
    const fields = [title,
    message,
    scheduleDate,
    scheduleTime,
        recipients,]

    fields.forEach(field => field.setTouched())

    if (!isFormValid.value) {
        return
    }

    const announcement = {
        id: Date.now().toString(),
        title: title.value,
        message: message.value,
        scheduleDate: scheduleDate.value,
        scheduleTime: scheduleTime.value,
        recipients: recipients.value,
        urgent: urgent.value,
        createdAt: new Date().toISOString(),
        status: 'scheduled'
    }

    emit('submit', announcement)

    // Reset all fields
    title.reset()
    message.reset()
    scheduleDate.reset()
    scheduleTime.reset()
    recipients.reset()
    urgent.reset()
}
</script>