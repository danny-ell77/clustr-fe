<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent class="max-w-2xl">
            <div class="space-y-4">
                <div>
                    <h2 class="text-2xl">{{ shift ? 'Edit Shift' : 'Create Shift' }}</h2>
                    <p class="text-sm text-muted-foreground">
                        {{ shift ? 'Update shift details' : 'Create a new shift assignment' }}
                    </p>
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div>
                        <Label for="title">Title *</Label>
                        <Input id="title" v-model="formData.title" placeholder="e.g., Night Security Patrol" required />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <Label for="shiftType">Shift Type *</Label>
                            <Select v-model="formData.shiftType" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SECURITY">Security</SelectItem>
                                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                    <SelectItem value="CLEANING">Cleaning</SelectItem>
                                    <SelectItem value="RECEPTION">Reception</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label for="assignedStaff">Assigned Staff *</Label>
                            <Select v-model="formData.assignedStaff" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select staff" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="staff in staffMembers" :key="staff.id" :value="staff.id">
                                        {{ staff.name }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <Label for="startTime">Start Time *</Label>
                            <Input id="startTime" v-model="formData.startTime" type="datetime-local" required />
                        </div>

                        <div>
                            <Label for="endTime">End Time *</Label>
                            <Input id="endTime" v-model="formData.endTime" type="datetime-local" required />
                        </div>
                    </div>

                    <div>
                        <Label for="location">Location</Label>
                        <Input id="location" v-model="formData.location" placeholder="e.g., Main Gate, Building A" />
                    </div>

                    <div>
                        <Label for="responsibilities">Responsibilities</Label>
                        <Textarea id="responsibilities" v-model="formData.responsibilities"
                            placeholder="List key responsibilities for this shift" rows="3" />
                    </div>

                    <div>
                        <Label for="notes">Notes</Label>
                        <Textarea id="notes" v-model="formData.notes" placeholder="Additional notes or instructions"
                            rows="2" />
                    </div>

                    <div class="flex items-center space-x-2">
                        <input id="isRecurring" v-model="formData.isRecurring" type="checkbox"
                            class="rounded border-gray-300" />
                        <Label for="isRecurring" class="cursor-pointer">
                            Recurring shift
                        </Label>
                    </div>

                    <div v-if="formData.isRecurring">
                        <Label for="recurrencePattern">Recurrence Pattern</Label>
                        <Select v-model="formData.recurrencePattern">
                            <SelectTrigger>
                                <SelectValue placeholder="Select pattern" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DAILY">Daily</SelectItem>
                                <SelectItem value="WEEKLY">Weekly</SelectItem>
                                <SelectItem value="BIWEEKLY">Bi-weekly</SelectItem>
                                <SelectItem value="MONTHLY">Monthly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="flex gap-2 pt-4">
                        <Button type="button" variant="outline" class="flex-1" @click="$emit('update:open', false)">
                            Cancel
                        </Button>
                        <Button type="submit" class="flex-1" :disabled="isSubmitting">
                            {{ isSubmitting ? 'Saving...' : shift ? 'Update Shift' : 'Create Shift' }}
                        </Button>
                    </div>
                </form>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Dialog, DialogContent } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import type { Shift, CreateShiftDto, ShiftType } from '~/types/shifts'

interface StaffMember {
    id: string
    name: string
    email: string
}

interface Props {
    open: boolean
    shift?: Shift
    staffMembers?: StaffMember[]
}

const props = withDefaults(defineProps<Props>(), {
    staffMembers: () => []
})

const emit = defineEmits<{
    'update:open': [value: boolean]
    'submit': [data: CreateShiftDto]
}>()

const isSubmitting = ref(false)

const formData = ref<CreateShiftDto>({
    title: '',
    shiftType: 'SECURITY' as ShiftType,
    assignedStaff: '',
    startTime: '',
    endTime: '',
    location: '',
    responsibilities: '',
    notes: '',
    isRecurring: false,
    recurrencePattern: ''
})

watch(() => props.shift, (shift) => {
    if (shift) {
        formData.value = {
            title: shift.title,
            shiftType: shift.shiftType,
            assignedStaff: shift.assignedStaff,
            startTime: shift.startTime.slice(0, 16),
            endTime: shift.endTime.slice(0, 16),
            location: shift.location || '',
            responsibilities: shift.responsibilities || '',
            notes: shift.notes || '',
            isRecurring: shift.isRecurring,
            recurrencePattern: shift.recurrencePattern || ''
        }
    } else {
        formData.value = {
            title: '',
            shiftType: 'SECURITY' as ShiftType,
            assignedStaff: '',
            startTime: '',
            endTime: '',
            location: '',
            responsibilities: '',
            notes: '',
            isRecurring: false,
            recurrencePattern: ''
        }
    }
}, { immediate: true })

const handleSubmit = async () => {
    isSubmitting.value = true
    try {
        emit('submit', formData.value)
    } finally {
        isSubmitting.value = false
    }
}
</script>
