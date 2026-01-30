<template>
    <Dialog v-model:open="isOpen">
        <DialogContent class="max-w-2xl">
            <DialogHeader>
                <DialogTitle>{{ ticket ? 'Edit Ticket' : 'Create Ticket' }}</DialogTitle>
                <DialogDescription>
                    {{ ticket ? 'Update ticket details' : 'Create a new support ticket' }}
                </DialogDescription>
            </DialogHeader>

            <DialogBody>
                <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <Label for="title">Title *</Label>
                    <Input id="title" v-model="formData.title" placeholder="Brief description of the issue" required />
                </div>

                <div>
                    <Label for="description">Description *</Label>
                    <Textarea id="description" v-model="formData.description"
                        placeholder="Detailed description of the issue" rows="4" required />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <Label for="issueType">Type *</Label>
                        <Select v-model="formData.issueType" required>
                            <SelectTrigger id="issueType">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                <SelectItem value="COMPLAINT">Complaint</SelectItem>
                                <SelectItem value="INQUIRY">Inquiry</SelectItem>
                                <SelectItem value="REQUEST">Request</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label for="priority">Priority *</Label>
                        <Select v-model="formData.priority" required>
                            <SelectTrigger id="priority">
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="LOW">Low</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="HIGH">High</SelectItem>
                                <SelectItem value="URGENT">Urgent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div v-if="ticket" class="grid grid-cols-2 gap-4">
                    <div>
                        <Label for="status">Status</Label>
                        <Select v-model="formData.status">
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="OPEN">Open</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="RESOLVED">Resolved</SelectItem>
                                <SelectItem value="CLOSED">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label for="dueDate">Due Date</Label>
                        <Input id="dueDate" v-model="formData.dueDate" type="date" />
                    </div>
                </div>

                <div v-if="ticket && (formData.status === 'RESOLVED' || formData.status === 'CLOSED')">
                    <Label for="resolutionNotes">Resolution Notes</Label>
                    <Textarea id="resolutionNotes" v-model="formData.resolutionNotes"
                        placeholder="Describe how the issue was resolved" rows="3" />
                </div>

                </form>
            </DialogBody>

            <DialogFooter>
                <Button type="button" variant="outline" @click="isOpen = false" :disabled="isSubmitting">
                    Cancel
                </Button>
                <LoadingButton type="button" :loading="isSubmitting" @click="handleSubmit">
                    {{ ticket ? 'Update' : 'Create' }}
                </LoadingButton>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '~/components/ui/dialog'
import { Button, LoadingButton } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { useHelpdesk } from '~/composables/portal/useHelpdesk'
import type { IssueTicket, CreateIssueTicketDto, UpdateIssueTicketDto, IssueType, IssuePriority, IssueStatus } from '~/types/helpdesk'

interface Props {
    open: boolean
    ticket?: IssueTicket
}

const props = defineProps<Props>()
const emit = defineEmits<{
    'update:open': [value: boolean]
    'success': []
}>()

const { createTicketMutation, updateTicketMutation } = useHelpdesk()

const isOpen = computed({
    get: () => props.open,
    set: (value) => emit('update:open', value)
})

const formData = reactive<CreateIssueTicketDto & Partial<UpdateIssueTicketDto>>({
    title: '',
    description: '',
    issueType: 'MAINTENANCE' as IssueType,
    priority: 'MEDIUM' as IssuePriority,
    status: undefined,
    dueDate: undefined,
    resolutionNotes: undefined
})

const isSubmitting = computed(() =>
    createTicketMutation.isPending.value || updateTicketMutation.isPending.value
)

watch(() => props.ticket, (ticket) => {
    if (ticket) {
        formData.title = ticket.title
        formData.description = ticket.description
        formData.issueType = ticket.issueType
        formData.priority = ticket.priority
        formData.status = ticket.status
        formData.dueDate = ticket.dueDate
        formData.resolutionNotes = ticket.resolutionNotes
    } else {
        formData.title = ''
        formData.description = ''
        formData.issueType = 'MAINTENANCE' as IssueType
        formData.priority = 'MEDIUM' as IssuePriority
        formData.status = undefined
        formData.dueDate = undefined
        formData.resolutionNotes = undefined
    }
}, { immediate: true })

const handleSubmit = async () => {
    try {
        if (props.ticket) {
            const updateData: UpdateIssueTicketDto = {
                title: formData.title,
                description: formData.description,
                issueType: formData.issueType,
                priority: formData.priority,
                status: formData.status as IssueStatus | undefined,
                dueDate: formData.dueDate,
                resolutionNotes: formData.resolutionNotes
            }
            await updateTicketMutation.mutateAsync({
                id: props.ticket.id,
                data: updateData
            })
        } else {
            const createData: CreateIssueTicketDto = {
                title: formData.title,
                description: formData.description,
                issueType: formData.issueType,
                priority: formData.priority
            }
            await createTicketMutation.mutateAsync(createData)
        }
        emit('success')
        isOpen.value = false
    } catch (error) {
        console.error('Failed to save ticket:', error)
    }
}
</script>
