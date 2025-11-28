<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl">Helpdesk</h1>
                <p class="text-muted-foreground">Manage support tickets and customer issues</p>
            </div>

            <Button v-if="hasPermission(PERMISSIONS.COMMUNICATIONS.MANAGE_COMPLAINT)" @click="showCreateDialog = true">
                <Icon name="plus" class="w-4 h-4 mr-2" />
                Create Ticket
            </Button>
        </div>

        <StatPane v-if="!statsQuery.isLoading.value" :stats="helpdeskStats" />

        <Card>
            <CardHeader>
                <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <Label>Status</Label>
                        <Select @update:model-value="(value) => setFilter('status', value as string)">
                            <SelectTrigger>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="OPEN">Open</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="RESOLVED">Resolved</SelectItem>
                                <SelectItem value="CLOSED">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Priority</Label>
                        <Select @update:model-value="(value) => setFilter('priority', value as string)">
                            <SelectTrigger>
                                <SelectValue placeholder="All Priorities" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="LOW">Low</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="HIGH">High</SelectItem>
                                <SelectItem value="URGENT">Urgent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Type</Label>
                        <Select @update:model-value="(value) => setFilter('type', value as string)">
                            <SelectTrigger>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                <SelectItem value="COMPLAINT">Complaint</SelectItem>
                                <SelectItem value="INQUIRY">Inquiry</SelectItem>
                                <SelectItem value="REQUEST">Request</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Search</Label>
                        <Input type="text" placeholder="Search tickets..."
                            @input="(e: Event) => setSearch((e.target as HTMLInputElement).value)" />
                    </div>
                </div>

                <div class="flex items-center justify-between mt-4">
                    <div class="text-sm text-muted-foreground">
                        Showing {{ tickets.length }} of {{ ticketsQuery.data.value?.count || 0 }} tickets
                    </div>
                    <Button variant="outline" @click="clearFilters">Clear Filters</Button>
                </div>
            </CardContent>
        </Card>

        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card v-for="i in 6" :key="i">
                <CardContent class="pt-6">
                    <Skeleton class="h-48 w-full" />
                </CardContent>
            </Card>
        </div>

        <div v-else-if="tickets.length === 0" class="text-center py-12">
            <EmptyState title="No tickets found" description="Create your first ticket to get started"
                action-label="Create Ticket" @action="showCreateDialog = true" />
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TicketCard v-for="ticket in tickets" :key="ticket.id" :ticket="ticket"
                :can-assign="hasPermission(PERMISSIONS.COMMUNICATIONS.MANAGE_COMPLAINT)"
                :can-escalate="hasPermission(PERMISSIONS.COMMUNICATIONS.MANAGE_COMPLAINT)" @click="viewTicket"
                @view="viewTicket" @assign="openAssignDialog" @escalate="handleEscalate" />
        </div>

        <TicketFormDialog v-model:open="showCreateDialog" @success="onTicketCreated" />

        <HelpdeskAssignDialog v-if="selectedTicket" v-model:open="showAssignDialog" :ticket="selectedTicket"
            @success="onTicketAssigned" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import Icon from '~/components/Icon.vue'
import StatPane from '~/components/common/StatPane.vue'
import EmptyState from '~/components/common/EmptyState.vue'
import TicketCard from '~/components/portal/helpdesk/TicketCard.vue'
import TicketFormDialog from '~/components/portal/helpdesk/TicketFormDialog.vue'
import HelpdeskAssignDialog from '~/components/portal/helpdesk/HelpdeskAssignDialog.vue'
import { useHelpdesk } from '~/composables/portal/useHelpdesk'
import { usePermissions } from '~/composables/auth/usePermissions'
import type { IssueTicket } from '~/types/helpdesk'
import type { IssueTicketFilters } from '~/services/api/helpdesk.api'

definePageMeta({
    title: 'Helpdesk'
})

const { hasPermission, PERMISSIONS } = usePermissions()
const { useTickets, useTicketStats, escalateTicketMutation } = useHelpdesk()

const filters = ref<IssueTicketFilters>({})

const setFilter = (field: string, value: string) => {
    if (value === '') {
        delete filters.value[field as keyof IssueTicketFilters]
    } else {
        (filters.value as any)[field] = value
    }
}

const setSearch = (value: string) => {
    if (value === '') {
        delete filters.value.search
    } else {
        filters.value.search = value
    }
}

const clearFilters = () => {
    filters.value = {}
}

const ticketsQuery = useTickets(filters)
const statsQuery = useTicketStats()

const tickets = computed(() => ticketsQuery.data.value?.results || [])
const stats = computed(() => statsQuery.data.value)
const isLoading = computed(() => ticketsQuery.isLoading.value)

const helpdeskStats = computed(() => [
    { title: 'Open Tickets', value: stats.value?.openIssues, color: '#0ea5e9' },
    { title: 'In Progress', value: stats.value?.inProgressIssues, color: '#eab308' },
    { title: 'Resolved Today', value: stats.value?.resolvedIssues, color: '#10b981' },
    { title: 'Avg Resolution Time', value: stats.value?.averageResolutionTime, color: '#a855f7' }
])

const showCreateDialog = ref(false)
const showAssignDialog = ref(false)
const selectedTicket = ref<IssueTicket | null>(null)

const viewTicket = (ticket: IssueTicket) => {
    navigateTo(`/portal/helpdesk/${ticket.id}`)
}

const openAssignDialog = (ticket: IssueTicket) => {
    selectedTicket.value = ticket
    showAssignDialog.value = true
}

const handleEscalate = async (ticket: IssueTicket) => {
    await escalateTicketMutation.mutateAsync(ticket.id)
}

const onTicketCreated = () => {
    showCreateDialog.value = false
}

const onTicketAssigned = () => {
    showAssignDialog.value = false
    selectedTicket.value = null
}
</script>
