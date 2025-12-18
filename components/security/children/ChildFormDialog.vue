<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{{ isEdit ? 'Edit Child Profile' : 'Add Child Profile' }}</DialogTitle>
                <DialogDescription>
                    {{ isEdit ? 'Update child information' : 'Create a new child profile' }}
                </DialogDescription>
            </DialogHeader>

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="space-y-4">
                    <div>
                        <Label for="name">Full Name *</Label>
                        <Input id="name" v-model="formData.name" placeholder="Enter child's full name" required />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <Label for="dateOfBirth">Date of Birth *</Label>
                            <Input id="dateOfBirth" v-model="formData.dateOfBirth" type="date" required />
                        </div>
                        <div>
                            <Label for="gender">Gender *</Label>
                            <Select v-model="formData.gender" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MALE">Male</SelectItem>
                                    <SelectItem value="FEMALE">Female</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label for="houseNumber">House Number *</Label>
                        <Input id="houseNumber" v-model="formData.houseNumber" placeholder="e.g., A12" required />
                    </div>

                    <div>
                        <Label>Emergency Contacts</Label>
                        <div class="space-y-3 mt-2">
                            <div v-for="(contact, index) in formData.emergencyContacts" :key="index"
                                class="flex gap-2 items-start p-3 border rounded-lg">
                                <div class="flex-1 space-y-2">
                                    <Input v-model="contact.name" placeholder="Contact name" required />
                                    <Input v-model="contact.phone" placeholder="Phone number" required />
                                    <Input v-model="contact.relationship" placeholder="Relationship" required />
                                </div>
                                <Button type="button" variant="ghost" size="icon" @click="removeContact(index)">
                                    <Icon name="x" class="w-4 h-4" />
                                </Button>
                            </div>
                            <Button type="button" variant="outline" size="sm" @click="addContact" class="w-full">
                                <Icon name="plus" class="w-4 h-4 mr-2" />
                                Add Emergency Contact
                            </Button>
                        </div>
                    </div>

                    <div>
                        <Label for="notes">Notes</Label>
                        <Textarea id="notes" v-model="formData.notes" placeholder="Additional notes (optional)"
                            rows="3" />
                    </div>

                    <div v-if="isEdit">
                        <Label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" v-model="formData.isActive" class="rounded" />
                            <span>Active Profile</span>
                        </Label>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" @click="$emit('update:open', false)"
                        :disabled="isSubmitting">
                        Cancel
                    </Button>
                    <Button type="submit" :disabled="isSubmitting">
                        <Icon v-if="isSubmitting" name="loader-2" class="w-4 h-4 mr-2 animate-spin" />
                        {{ isEdit ? 'Update' : 'Create' }}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import Icon from '~/components/Icon.vue'
import type { Child, CreateChildDto, UpdateChildDto, EmergencyContact } from '~/types/children'

interface Props {
    open: boolean
    child?: Child
    isSubmitting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    isSubmitting: false
})

const emit = defineEmits<{
    'update:open': [value: boolean]
    submit: [data: CreateChildDto | UpdateChildDto]
}>()

const isEdit = computed(() => !!props.child)

const formData = ref<CreateChildDto & { isActive?: boolean }>({
    name: '',
    dateOfBirth: '',
    gender: 'MALE' as any,
    houseNumber: '',
    emergencyContacts: [],
    notes: '',
    isActive: true
})

watch(() => props.open, (isOpen) => {
    if (isOpen && props.child) {
        formData.value = {
            name: props.child.name,
            dateOfBirth: props.child.dateOfBirth,
            gender: props.child.gender,
            houseNumber: props.child.houseNumber,
            emergencyContacts: [...props.child.emergencyContacts],
            notes: props.child.notes || '',
            isActive: props.child.isActive
        }
    } else if (isOpen && !props.child) {
        formData.value = {
            name: '',
            dateOfBirth: '',
            gender: 'MALE' as any,
            houseNumber: '',
            emergencyContacts: [],
            notes: '',
            isActive: true
        }
    }
})

const addContact = () => {
    formData.value.emergencyContacts.push({
        name: '',
        phone: '',
        relationship: ''
    })
}

const removeContact = (index: number) => {
    formData.value.emergencyContacts.splice(index, 1)
}

const handleSubmit = () => {
    emit('submit', formData.value)
}
</script>
