<template>
    <Dialog v-model:open="isOpen">
        <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{{ visitor ? 'Edit Visitor' : 'Register Visitor' }}</DialogTitle>
                <DialogDescription>
                    {{ visitor ? 'Update visitor details' : 'Register a new visitor to the estate' }}
                </DialogDescription>
            </DialogHeader>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <Label for="name">Full Name *</Label>
                    <Input id="name" v-model="formData.name" placeholder="Enter visitor's full name" required />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <Label for="phone">Phone Number *</Label>
                        <Input id="phone" v-model="formData.phone" type="tel" placeholder="+234 XXX XXX XXXX"
                            required />
                    </div>

                    <div>
                        <Label for="email">Email</Label>
                        <Input id="email" v-model="formData.email" type="email" placeholder="visitor@example.com" />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <Label for="visitType">Visit Type *</Label>
                        <Select v-model="formData.visitType" required>
                            <SelectTrigger id="visitType">
                                <SelectValue placeholder="Select visit type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ONE_TIME">One Time</SelectItem>
                                <SelectItem value="SHORT_STAY">Short Stay</SelectItem>
                                <SelectItem value="EXTENDED_STAY">Extended Stay</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label for="validFor">Valid For *</Label>
                        <Select v-model="formData.validFor" required>
                            <SelectTrigger id="validFor">
                                <SelectValue placeholder="Select validity" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ONE_TIME">One Time Visit</SelectItem>
                                <SelectItem value="MULTIPLE">Multiple Visits</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <Label for="estimatedArrival">Expected Arrival *</Label>
                        <Input id="estimatedArrival" v-model="formData.estimatedArrival" type="datetime-local"
                            required />
                    </div>

                    <div>
                        <Label for="validDate">Valid Until *</Label>
                        <Input id="validDate" v-model="formData.validDate" type="date" required />
                    </div>
                </div>

                <div>
                    <Label for="purpose">Purpose of Visit</Label>
                    <Textarea id="purpose" v-model="formData.purpose" placeholder="Reason for visiting" rows="2" />
                </div>

                <div>
                    <Label for="notes">Additional Notes</Label>
                    <Textarea id="notes" v-model="formData.notes" placeholder="Any special instructions or notes"
                        rows="2" />
                </div>

                <div v-if="visitor" class="grid grid-cols-2 gap-4">
                    <div>
                        <Label for="status">Status</Label>
                        <Select v-model="formData.status">
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="APPROVED">Approved</SelectItem>
                                <SelectItem value="REJECTED">Rejected</SelectItem>
                                <SelectItem value="EXPIRED">Expired</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div class="flex justify-end gap-2 mt-6">
                    <Button type="button" variant="outline" @click="isOpen = false" :disabled="isSubmitting">
                        Cancel
                    </Button>
                    <Button type="submit" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Saving...' : visitor ? 'Update' : 'Register' }}
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { useVisitors } from '~/composables/security/useVisitors'
import type { Visitor, CreateVisitorDto, UpdateVisitorDto, VisitType, ValidFor, VisitorStatus } from '~/types/visitors'

interface Props {
    open: boolean
    visitor?: Visitor
}

const props = defineProps<Props>()
const emit = defineEmits<{
    'update:open': [value: boolean]
    'success': []
}>()

const { registerVisitorMutation, updateVisitorMutation } = useVisitors()

const isOpen = computed({
    get: () => props.open,
    set: (value) => emit('update:open', value)
})

const formData = reactive<CreateVisitorDto & Partial<UpdateVisitorDto>>({
    name: '',
    phone: '',
    email: '',
    estimatedArrival: '',
    visitType: 'ONE_TIME' as VisitType,
    validFor: 'ONE_TIME' as ValidFor,
    validDate: '',
    purpose: '',
    notes: '',
    status: undefined
})

const isSubmitting = computed(() =>
    registerVisitorMutation.isPending.value || updateVisitorMutation.isPending.value
)

watch(() => props.visitor, (visitor) => {
    if (visitor) {
        formData.name = visitor.name
        formData.phone = visitor.phone
        formData.email = visitor.email || ''
        formData.estimatedArrival = visitor.estimatedArrival
        formData.visitType = visitor.visitType
        formData.validFor = visitor.validFor
        formData.validDate = visitor.validDate
        formData.purpose = visitor.purpose || ''
        formData.notes = visitor.notes || ''
        formData.status = visitor.status
    } else {
        formData.name = ''
        formData.phone = ''
        formData.email = ''
        formData.estimatedArrival = ''
        formData.visitType = 'ONE_TIME' as VisitType
        formData.validFor = 'ONE_TIME' as ValidFor
        formData.validDate = ''
        formData.purpose = ''
        formData.notes = ''
        formData.status = undefined
    }
}, { immediate: true })

const handleSubmit = async () => {
    try {
        if (props.visitor) {
            const updateData: UpdateVisitorDto = {
                name: formData.name,
                phone: formData.phone,
                email: formData.email || undefined,
                estimatedArrival: formData.estimatedArrival,
                visitType: formData.visitType,
                validFor: formData.validFor,
                validDate: formData.validDate,
                purpose: formData.purpose || undefined,
                notes: formData.notes || undefined,
                status: formData.status as VisitorStatus | undefined
            }
            await updateVisitorMutation.mutateAsync({
                id: props.visitor.id,
                data: updateData
            })
        } else {
            const createData: CreateVisitorDto = {
                name: formData.name,
                phone: formData.phone,
                email: formData.email || undefined,
                estimatedArrival: formData.estimatedArrival,
                visitType: formData.visitType,
                validFor: formData.validFor,
                validDate: formData.validDate,
                purpose: formData.purpose || undefined,
                notes: formData.notes || undefined
            }
            await registerVisitorMutation.mutateAsync(createData)
        }
        emit('success')
        isOpen.value = false
    } catch (error) {
        console.error('Failed to save visitor:', error)
    }
}
</script>
