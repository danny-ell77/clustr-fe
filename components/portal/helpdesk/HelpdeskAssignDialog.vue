<template>
    <Dialog v-model:open="isOpen">
        <DialogContent class="max-w-md">
            <DialogHeader>
                <DialogTitle>Assign Ticket</DialogTitle>
                <DialogDescription>
                    Assign this ticket to a staff member
                </DialogDescription>
            </DialogHeader>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div v-if="ticket" class="p-4 bg-muted rounded-lg">
                    <p class="text-sm font-medium">{{ ticket.title }}</p>
                    <p class="text-xs text-muted-foreground mt-1">{{ ticket.issueNo }}</p>
                </div>

                <div>
                    <Label for="assignedTo">Assign To *</Label>
                    <Select v-model="selectedStaffId" required>
                        <SelectTrigger id="assignedTo">
                            <SelectValue placeholder="Select staff member" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="staff in staffMembers" :key="staff.id" :value="staff.id">
                                {{ staff.name }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <p v-if="isLoadingStaff" class="text-xs text-muted-foreground mt-1">
                        Loading staff members...
                    </p>
                    <p v-else-if="staffMembers.length === 0" class="text-xs text-muted-foreground mt-1">
                        No staff members available
                    </p>
                </div>

                <div class="flex justify-end gap-2 mt-6">
                    <Button type="button" variant="outline" @click="isOpen = false" :disabled="isSubmitting">
                        Cancel
                    </Button>
                    <Button type="submit" :disabled="isSubmitting || !selectedStaffId">
                        {{ isSubmitting ? 'Assigning...' : 'Assign' }}
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { useHelpdesk } from '~/composables/portal/useHelpdesk'
import { usersApi } from '~/services/api/users.api'
import { queryKeys } from '~/constants/query-keys'
import type { IssueTicket } from '~/types/helpdesk'

interface Props {
    open: boolean
    ticket?: IssueTicket
}

const props = defineProps<Props>()
const emit = defineEmits<{
    'update:open': [value: boolean]
    'success': []
}>()

const { assignTicketMutation } = useHelpdesk()

const isOpen = computed({
    get: () => props.open,
    set: (value) => emit('update:open', value)
})

const selectedStaffId = ref<string>('')

const { data: staffData, isLoading: isLoadingStaff } = useQuery({
    queryKey: queryKeys.users.list({ isClusterStaff: true }),
    queryFn: () => usersApi.getAll({ isClusterStaff: true, pageSize: 100 })
})

const staffMembers = computed(() => staffData.value?.results || [])

const isSubmitting = computed(() => assignTicketMutation.isPending.value)

watch(() => props.open, (open) => {
    if (open && props.ticket?.assignedTo) {
        selectedStaffId.value = props.ticket.assignedTo.id
    } else if (!open) {
        selectedStaffId.value = ''
    }
})

const handleSubmit = async () => {
    if (!props.ticket || !selectedStaffId.value) return

    try {
        await assignTicketMutation.mutateAsync({
            id: props.ticket.id,
            assignedTo: selectedStaffId.value
        })
        emit('success')
        isOpen.value = false
    } catch (error) {
        console.error('Failed to assign ticket:', error)
    }
}
</script>
