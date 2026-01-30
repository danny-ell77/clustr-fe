<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent class="max-w-2xl">
            <DialogHeader>
                <DialogTitle>{{ shift ? 'Edit Shift' : 'Create Shift' }}</DialogTitle>
                <DialogDescription>
                    {{ shift ? 'Update shift details' : 'Create a new shift assignment' }}
                </DialogDescription>
            </DialogHeader>

            <DialogBody>
                <form @submit.prevent="handleSubmit" class="space-y-6">
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

                    <div class="space-y-4 pt-2 border-t mt-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <Label for="startDate">Date *</Label>
                                <Input id="startDate" v-model="temporalData.date" type="date" required />
                                <p class="text-[10px] text-muted-foreground mt-1">
                                    Baseline date for this shift assignment.
                                </p>
                            </div>
                            <div>
                                <Label for="startTime">Start Time *</Label>
                                <Input id="startTime" v-model="temporalData.startTime" type="time" required />
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <Label for="duration">Duration (Hours) *</Label>
                                <Input id="duration" v-model.number="temporalData.durationHours" type="number" step="0.5" min="0.5" required />
                            </div>
                            <div class="flex items-end">
                                <div v-if="temporalData.date && temporalData.startTime && temporalData.durationHours" 
                                     class="p-3 bg-primary/5 rounded-md border border-primary/20 w-full">
                                    <div class="text-[10px] uppercase font-bold text-primary/60 mb-1">Shift Preview</div>
                                    <div class="text-xs font-medium">
                                        {{ previewText }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-4 pt-4 border-t">
                        <div>
                            <Label for="location">Location</Label>
                            <Input id="location" v-model="formData.location" placeholder="e.g., Main Gate, Building A" />
                        </div>

                        <div>
                            <Label for="responsibilities">Responsibilities</Label>
                            <Textarea id="responsibilities" v-model="formData.responsibilities"
                                placeholder="List key responsibilities for this shift" rows="3" />
                        </div>
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

                </form>
            </DialogBody>

            <DialogFooter>
                <Button type="button" variant="outline" @click="$emit('update:open', false)">
                    Cancel
                </Button>
                <LoadingButton type="button" :loading="isSubmitting" @click="handleSubmit">
                    {{ shift ? 'Update Shift' : 'Create Shift' }}
                </LoadingButton>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from '~/components/ui/dialog'
import { Button, LoadingButton } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import type { Shift, CreateShiftDto, ShiftType, Staff } from '~/types/shifts'

interface Props {
    open: boolean
    shift?: Shift
    staffMembers?: Staff[]
}

const props = withDefaults(defineProps<Props>(), {
    staffMembers: () => []
})

const emit = defineEmits<{
    'update:open': [value: boolean]
    'submit': [data: CreateShiftDto]
}>()

const isSubmitting = ref(false)

const formData = ref<Partial<CreateShiftDto>>({
    title: '',
    shiftType: 'SECURITY' as ShiftType,
    assignedStaff: '',
    location: '',
    responsibilities: '',
    notes: '',
    isRecurring: false,
    recurrencePattern: ''
})

const temporalData = ref({
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    durationHours: 8
})

const previewText = computed(() => {
    if (!temporalData.value.date || !temporalData.value.startTime || !temporalData.value.durationHours) return ''
    
    const start = new Date(`${temporalData.value.date}T${temporalData.value.startTime}`)
    const end = new Date(start.getTime() + temporalData.value.durationHours * 60 * 60 * 1000)
    
    const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    const formatDate = (d: Date) => d.toLocaleDateString([], { month: 'short', day: 'numeric' })
    
    const isNextDay = end.getDate() !== start.getDate() || end.getMonth() !== start.getMonth()
    
    return `${formatTime(start)} to ${formatTime(end)}${isNextDay ? ' (' + formatDate(end) + ')' : ''}`
})

watch(() => props.shift, (shift) => {
    if (shift) {
        formData.value = {
            title: shift.title,
            shiftType: shift.shiftType,
            assignedStaff: shift.assignedStaff,
            location: shift.location || '',
            responsibilities: shift.responsibilities || '',
            notes: shift.notes || '',
            isRecurring: shift.isRecurring,
            recurrencePattern: shift.recurrencePattern || ''
        }
        
        // Parse start and end times
        const start = new Date(shift.startTime)
        const end = new Date(shift.endTime)
        
        temporalData.value = {
            date: start.toISOString().split('T')[0],
            startTime: start.toTimeString().slice(0, 5),
            durationHours: Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60) * 2) / 2
        }
    } else {
        formData.value = {
            title: '',
            shiftType: 'SECURITY' as ShiftType,
            assignedStaff: '',
            location: '',
            responsibilities: '',
            notes: '',
            isRecurring: false,
            recurrencePattern: ''
        }
        temporalData.value = {
            date: new Date().toISOString().split('T')[0],
            startTime: '08:00',
            durationHours: 8
        }
    }
}, { immediate: true })

const handleSubmit = async () => {
    isSubmitting.value = true
    try {
        const start = new Date(`${temporalData.value.date}T${temporalData.value.startTime}`)
        const end = new Date(start.getTime() + temporalData.value.durationHours * 60 * 60 * 1000)
        
        const finalData: CreateShiftDto = {
            ...formData.value as CreateShiftDto,
            startTime: start.toISOString(),
            endTime: end.toISOString()
        }
        
        emit('submit', finalData)
    } finally {
        isSubmitting.value = false
    }
}
</script>
