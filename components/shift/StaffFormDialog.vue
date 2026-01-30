<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent class="max-w-md">
            <DialogHeader>
                <DialogTitle>{{ staff ? 'Edit Staff Member' : 'Add Staff Member' }}</DialogTitle>
                <DialogDescription>
                    {{ staff ? 'Update staff member information' : 'Add a new on-site staff member' }}
                </DialogDescription>
            </DialogHeader>

            <DialogBody>
                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div>
                        <Label for="name">Name *</Label>
                        <Input id="name" v-model="formData.name" placeholder="John Doe" required />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <Label for="phoneNumber">Phone Number *</Label>
                            <Input id="phoneNumber" v-model="formData.phoneNumber" type="tel"
                                placeholder="+1234567890" required />
                        </div>

                        <div>
                            <Label for="email">Email</Label>
                            <Input id="email" v-model="formData.email" type="email" placeholder="john@example.com" />
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <Label for="staffType">Staff Type *</Label>
                            <Select v-model="formData.staffType" required>
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
                            <Label for="employeeId">Employee ID</Label>
                            <Input id="employeeId" v-model="formData.employeeId" placeholder="EMP001" />
                        </div>
                    </div>

                    <div>
                        <Label for="notes">Notes</Label>
                        <Textarea id="notes" v-model="formData.notes" placeholder="Additional notes about the staff member" rows="3" />
                    </div>

                    <div v-if="staff" class="flex items-center space-x-2">
                        <input id="isActive" v-model="formData.isActive" type="checkbox"
                            class="rounded border-gray-300" />
                        <Label for="isActive" class="cursor-pointer">Active</Label>
                    </div>
                </form>
            </DialogBody>

            <DialogFooter>
                <Button type="button" variant="outline" @click="$emit('update:open', false)">
                    Cancel
                </Button>
                <LoadingButton type="button" :loading="isSubmitting" @click="handleSubmit">
                    {{ staff ? 'Update' : 'Create' }}
                </LoadingButton>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from '~/components/ui/dialog'
import { Button, LoadingButton } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import type { Staff, CreateStaffDto, ShiftType } from '~/types/shifts'

interface Props {
    open: boolean
    staff?: Staff | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:open': [value: boolean]
    'submit': [data: CreateStaffDto]
}>()

const isSubmitting = ref(false)

const formData = ref<CreateStaffDto>({
    name: '',
    phoneNumber: '',
    email: '',
    staffType: 'SECURITY' as ShiftType,
    employeeId: '',
    notes: '',
    isActive: true
})

watch(() => props.staff, (newStaff) => {
    if (newStaff) {
        formData.value = {
            name: newStaff.name,
            phoneNumber: newStaff.phoneNumber,
            email: newStaff.email || '',
            staffType: newStaff.staffType,
            employeeId: newStaff.employeeId || '',
            notes: newStaff.notes || '',
            isActive: newStaff.isActive
        }
    } else {
        formData.value = {
            name: '',
            phoneNumber: '',
            email: '',
            staffType: 'SECURITY' as ShiftType,
            employeeId: '',
            notes: '',
            isActive: true
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
