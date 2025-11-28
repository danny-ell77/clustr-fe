<template>
    <div class="space-y-6">
        <div class="flex items-center gap-4">
            <Button variant="ghost" size="icon" @click="goBack">
                <Icon name="arrow-left" class="w-4 h-4" />
            </Button>
            <div class="flex-1">
                <h1 class="text-3xl">Ticket Details</h1>
                <p class="text-muted-foreground">View and manage ticket information</p>
            </div>
        </div>

        <div v-if="isLoading" class="space-y-6">
            <Card>
                <CardContent class="pt-6">
                    <Skeleton class="h-64 w-full" />
                </CardContent>
            </Card>
        </div>

        <div v-else-if="!ticket" class="text-center py-12">
            <EmptyState title="Ticket not found" description="The ticket you're looking for doesn't exist"
                action-label="Back to Tickets" @action="goBack" />
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <div class="flex items-center gap-2 flex-wrap mb-2">
                                    <CardTitle>{{ ticket.title }}</CardTitle>
                                    <StatusBadge :status="ticket.status" />
                                    <PriorityBadge :priority="ticket.priority" />
                                </div>
                                <p class="text-sm text-muted-foreground">{{ ticket.issueNo }}</p>
                            </div>
                            <div class="flex gap-2">
                                <Button
                                    v-if="hasPermission(PERMISSIONS.COMMUNICATIONS.MANAGE_COMPLAINT) && ticket.status !== 'CLOSED'"
                                    variant="outline" size="sm" @click="showEditDialog = true">
                                    <Icon name="edit-2" class="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                                <Button
                                    v-if="hasPermission(PERMISSIONS.COMMUNICATIONS.MANAGE_COMPLAINT) && !ticket.assignedTo"
                                    variant="outline" size="sm" @click="showAssignDialog = true">
                                    <Icon name="user-plus" class="w-4 h-4 mr-2" />
                                    Assign
                                </Button>
                                <Button
                                    v-if="hasPermission(PERMISSIONS.COMMUNICATIONS.MANAGE_COMPLAINT) && ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED'"
                                    variant="outline" size="sm" @click="handleEscalate">
                                    <Icon name="alert-triangle" class="w-4 h-4 mr-2" />
                                    Escalate
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div>
                            <h3 class="font-semibold mb-2">Description</h3>
                            <p class="text-sm text-muted-foreground whitespace-pre-wrap">{{ ticket.description }}</p>
                        </div>

                        <div v-if="ticket.resolutionNotes" class="p-4 bg-green-50 rounded-lg border border-green-200">
                            <h3 class="font-semibold text-green-900 mb-2">Resolution Notes</h3>
                            <p class="text-sm text-green-800 whitespace-pre-wrap">{{ ticket.resolutionNotes }}</p>
                        </div>

                        <div v-if="ticket.attachments && ticket.attachments.length > 0">
                            <h3 class="font-semibold mb-2">Attachments</h3>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                                <a v-for="attachment in ticket.attachments" :key="attachment.id"
                                    :href="attachment.fileUrl" target="_blank"
                                    class="flex items-center gap-2 p-2 border rounded hover:bg-muted transition-colors">
                                    <Icon name="paperclip" class="w-4 h-4" />
                                    <span class="text-sm truncate">{{ attachment.fileName }}</span>
                                </a>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Status History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div v-if="ticket.statusHistory && ticket.statusHistory.length > 0" class="space-y-4">
                            <div v-for="(history, index) in ticket.statusHistory" :key="history.id" class="flex gap-4">
                                <div class="flex flex-col items-center">
                                    <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Icon name="arrow-right" class="w-4 h-4 text-primary" />
                                    </div>
                                    <div v-if="index < ticket.statusHistory.length - 1"
                                        class="w-0.5 h-full bg-border mt-2" />
                                </div>
                                <div class="flex-1 pb-4">
                                    <div class="flex items-center gap-2 mb-1">
                                        <StatusBadge :status="history.fromStatus" />
                                        <Icon name="arrow-right" class="w-3 h-3 text-muted-foreground" />
                                        <StatusBadge :status="history.toStatus" />
                                    </div>
                                    <p class="text-sm text-muted-foreground">
                                        by {{ history.changedBy.name }} • {{ formatDate(history.createdAt) }}
                                    </p>
                                    <p v-if="history.notes" class="text-sm mt-1">{{ history.notes }}</p>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center py-8 text-muted-foreground">
                            No status changes yet
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Comments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CommentSection :ticket-id="ticket.id" :comments="ticket.comments || []"
                            :can-comment="hasPermission(PERMISSIONS.COMMUNICATIONS.MANAGE_COMPLAINT)" />
                    </CardContent>
                </Card>
            </div>

            <div class="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Ticket Information</CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div>
                            <p class="text-xs text-muted-foreground">Type</p>
                            <p class="text-sm font-medium">{{ formatIssueType(ticket.issueType) }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-muted-foreground">Reported By</p>
                            <p class="text-sm font-medium">{{ ticket.reportedBy.name }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-muted-foreground">Assigned To</p>
                            <p class="text-sm font-medium">
                                {{ ticket.assignedTo?.name || 'Unassigned' }}
                            </p>
                        </div>
                        <div>
                            <p class="text-xs text-muted-foreground">Created</p>
                            <p class="text-sm font-medium">{{ formatDate(ticket.createdAt) }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-muted-foreground">Last Modified</p>
                            <p class="text-sm font-medium">{{ formatDate(ticket.lastModifiedAt) }}</p>
                        </div>
                        <div v-if="ticket.dueDate">
                            <p class="text-xs text-muted-foreground">Due Date</p>
                            <p class="text-sm font-medium" :class="{ 'text-red-600': isOverdue }">
                                {{ formatDate(ticket.dueDate) }}
                            </p>
                        </div>
                        <div v-if="ticket.resolvedAt">
                            <p class="text-xs text-muted-foreground">Resolved</p>
                            <p class="text-sm font-medium">{{ formatDate(ticket.resolvedAt) }}</p>
                        </div>
                        <div v-if="ticket.closedAt">
                            <p class="text-xs text-muted-foreground">Closed</p>
                            <p class="text-sm font-medium">{{ formatDate(ticket.closedAt) }}</p>
                        </div>
                        <div v-if="ticket.escalatedAt">
                            <p class="text-xs text-muted-foreground">Escalated</p>
                            <p class="text-sm font-medium text-red-600">{{ formatDate(ticket.escalatedAt) }}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card v-if="hasPermission(PERMISSIONS.COMMUNICATIONS.MANAGE_COMPLAINT)">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-2">
                        <Button v-if="ticket.status === 'OPEN'" variant="outline" class="w-full justify-start"
                            @click="updateStatus('IN_PROGRESS')">
                            <Icon name="play" class="w-4 h-4 mr-2" />
                            Start Progress
                        </Button>
                        <Button v-if="ticket.status === 'IN_PROGRESS'" variant="outline" class="w-full justify-start"
                            @click="showResolveDialog = true">
                            <Icon name="check-circle" class="w-4 h-4 mr-2" />
                            Mark as Resolved
                        </Button>
                        <Button v-if="ticket.status === 'RESOLVED'" variant="outline" class="w-full justify-start"
                            @click="updateStatus('CLOSED')">
                            <Icon name="x-circle" class="w-4 h-4 mr-2" />
                            Close Ticket
                        </Button>
                        <Button v-if="ticket.status !== 'CLOSED'" variant="outline"
                            class="w-full justify-start text-red-600 hover:text-red-700"
                            @click="updateStatus('CLOSED')">
                            <Icon name="x" class="w-4 h-4 mr-2" />
                            Close Without Resolution
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>

        <TicketFormDialog v-model:open="showEditDialog" :ticket="ticket" @success="onTicketUpdated" />

        <AssignDialog v-model:open="showAssignDialog" :ticket="ticket" @success="onTicketAssigned" />

        <Dialog v-model:open="showResolveDialog">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Resolve Ticket</DialogTitle>
                    <DialogDescription>
                        Add resolution notes to mark this ticket as resolved
                    </DialogDescription>
                </DialogHeader>
                <div class="space-y-4">
                    <div>
                        <Label>Resolution Notes</Label>
                        <Textarea v-model="resolutionNotes" placeholder="Describe how the issue was resolved..."
                            rows="4" />
                    </div>
                </div>
                <div class="flex justify-end gap-2 mt-4">
                    <Button variant="outline" @click="showResolveDialog = false">Cancel</Button>
                    <Button @click="handleResolve" :disabled="!resolutionNotes">
                        Mark as Resolved
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Skeleton } from '~/components/ui/skeleton'
import Icon from '~/components/Icon.vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import PriorityBadge from '~/components/common/PriorityBadge.vue'
import EmptyState from '~/components/common/EmptyState.vue'
import CommentSection from '~/components/portal/helpdesk/CommentSection.vue'
import TicketFormDialog from '~/components/portal/helpdesk/TicketFormDialog.vue'
import HelpdeskAssignDialog from '~/components/portal/helpdesk/HelpdeskAssignDialog.vue'
import { useHelpdesk } from '~/composables/portal/useHelpdesk'
import { usePermissions } from '~/composables/auth/usePermissions'
import type { IssueStatus } from '~/types/helpdesk'

definePageMeta({
    title: 'Ticket Details'
})

const route = useRoute()
const router = useRouter()
const { hasPermission, PERMISSIONS } = usePermissions()
const { useTicket, updateTicketMutation, escalateTicketMutation } = useHelpdesk()

const ticketId = computed(() => route.params.id as string)
const ticketQuery = useTicket(ticketId)

const ticket = computed(() => ticketQuery.data.value)
const isLoading = computed(() => ticketQuery.isLoading.value)

const showEditDialog = ref(false)
const showAssignDialog = ref(false)
const showResolveDialog = ref(false)
const resolutionNotes = ref('')

const isOverdue = computed(() => {
    if (!ticket.value?.dueDate) return false
    return new Date(ticket.value.dueDate) < new Date()
})

const goBack = () => {
    router.push('/portal/helpdesk')
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const formatIssueType = (type: string) => {
    return type.split('_').map(word =>
        word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')
}

const updateStatus = async (status: string) => {
    if (!ticket.value) return
    await updateTicketMutation.mutateAsync({
        id: ticket.value.id,
        data: { status: status as IssueStatus }
    })
}

const handleResolve = async () => {
    if (!ticket.value || !resolutionNotes.value) return
    await updateTicketMutation.mutateAsync({
        id: ticket.value.id,
        data: {
            status: 'RESOLVED' as IssueStatus,
            resolutionNotes: resolutionNotes.value
        }
    })
    showResolveDialog.value = false
    resolutionNotes.value = ''
}

const handleEscalate = async () => {
    if (!ticket.value) return
    await escalateTicketMutation.mutateAsync(ticket.value.id)
}

const onTicketUpdated = () => {
    showEditDialog.value = false
}

const onTicketAssigned = () => {
    showAssignDialog.value = false
}
</script>
