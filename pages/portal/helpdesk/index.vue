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

        <HelpdeskTicketsGridContent :tickets="tickets" :is-loading="isLoading"
            :can-assign="hasPermission(PERMISSIONS.COMMUNICATIONS.MANAGE_COMPLAINT)"
            :can-escalate="hasPermission(PERMISSIONS.COMMUNICATIONS.MANAGE_COMPLAINT)" :filters="filters"
            @search="setSearch" @view="viewTicket" @assign="openAssignDialog" @escalate="handleEscalate"
            @create="showCreateDialog = true" @clear-filters="clearFilters">
            <template #filters>
                <HelpdeskFilterPanel v-model="filtersModel" :result-count="tickets.length" />
            </template>
        </HelpdeskTicketsGridContent>

        <TicketFormDialog v-model:open="showCreateDialog" @success="onTicketCreated" />

        <HelpdeskAssignDialog v-if="selectedTicket" v-model:open="showAssignDialog" :ticket="selectedTicket"
            @success="onTicketAssigned" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '~/components/Icon.vue'
import StatPane from '~/components/common/StatPane.vue'
import HelpdeskAssignDialog from '~/components/portal/helpdesk/HelpdeskAssignDialog.vue'
import HelpdeskFilterPanel from '~/components/portal/helpdesk/HelpdeskFilterPanel.vue'
import HelpdeskTicketsGridContent from '~/components/portal/helpdesk/HelpdeskTicketsGridContent.vue'
import TicketFormDialog from '~/components/portal/helpdesk/TicketFormDialog.vue'
import { Button } from '~/components/ui/button'
import { usePermissions } from '~/composables/auth/usePermissions'
import { useHelpdesk } from '~/composables/portal/useHelpdesk'
import type { IssueTicketFilters } from '~/services/api/helpdesk.api'
import type { IssueTicket } from '~/types/helpdesk'

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

const filtersModel = computed({
    get: () => filters.value,
    set: (newFilters: any) => {
        Object.entries(newFilters).forEach(([key, value]) => {
            setFilter(key, value as string)
        })
    }
})

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
