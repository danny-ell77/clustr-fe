<template>
    <Card class="hover:shadow-md transition-shadow cursor-pointer" @click="$emit('click', ticket)">
        <CardContent class="pt-6">
            <div class="space-y-4">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 flex-wrap">
                            <h3 class="font-semibold text-lg">{{ ticket.title }}</h3>
                            <StatusBadge :status="ticket.status" />
                            <PriorityBadge :priority="ticket.priority" />
                        </div>
                        <p v-if="ticket.description" class="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {{ ticket.description }}
                        </p>
                        <div class="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>{{ ticket.issueNo }}</span>
                            <span>•</span>
                            <span>{{ formatIssueType(ticket.issueType) }}</span>
                        </div>
                    </div>
                    <div v-if="showSlaIndicator" class="ml-4">
                        <div class="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                            :class="slaIndicatorClass">
                            <Icon :name="slaIcon" class="w-3 h-3" />
                            <span>{{ slaLabel }}</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 pt-4 border-t">
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
                    <div v-if="ticket.dueDate">
                        <p class="text-xs text-muted-foreground">Due Date</p>
                        <p class="text-sm font-medium" :class="{ 'text-red-600': isOverdue }">
                            {{ formatDate(ticket.dueDate) }}
                        </p>
                    </div>
                    <div v-if="ticket.commentsCount > 0">
                        <p class="text-xs text-muted-foreground">Comments</p>
                        <p class="text-sm font-medium">{{ ticket.commentsCount }}</p>
                    </div>
                    <div v-if="ticket.resolvedAt">
                        <p class="text-xs text-muted-foreground">Resolved</p>
                        <p class="text-sm font-medium">{{ formatDate(ticket.resolvedAt) }}</p>
                    </div>
                </div>

                <div v-if="showActions" class="flex gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" class="flex-1" @click.stop="$emit('view', ticket)">
                        View Details
                    </Button>
                    <Button v-if="canAssign && !ticket.assignedTo" variant="outline" size="sm"
                        @click.stop="$emit('assign', ticket)">
                        Assign
                    </Button>
                    <Button v-if="canEscalate && ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED'"
                        variant="outline" size="sm" @click.stop="$emit('escalate', ticket)">
                        Escalate
                    </Button>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import StatusBadge from '~/components/common/StatusBadge.vue'
import PriorityBadge from '~/components/common/PriorityBadge.vue'
import Icon from '~/components/Icon.vue'
import type { IssueTicket } from '~/types/helpdesk'

interface Props {
    ticket: IssueTicket
    showActions?: boolean
    showSlaIndicator?: boolean
    canAssign?: boolean
    canEscalate?: boolean
    slaThresholdHours?: number
}

const props = withDefaults(defineProps<Props>(), {
    showActions: true,
    showSlaIndicator: true,
    canAssign: true,
    canEscalate: true,
    slaThresholdHours: 24
})

defineEmits<{
    click: [ticket: IssueTicket]
    view: [ticket: IssueTicket]
    assign: [ticket: IssueTicket]
    escalate: [ticket: IssueTicket]
}>()

const isOverdue = computed(() => {
    if (!props.ticket.dueDate) return false
    return new Date(props.ticket.dueDate) < new Date()
})

const hoursOpen = computed(() => {
    const created = new Date(props.ticket.createdAt)
    const now = new Date()
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60))
})

const slaStatus = computed(() => {
    if (props.ticket.status === 'RESOLVED' || props.ticket.status === 'CLOSED') {
        return 'resolved'
    }

    const hours = hoursOpen.value
    const threshold = props.slaThresholdHours

    if (hours < threshold * 0.5) return 'good'
    if (hours < threshold) return 'warning'
    return 'critical'
})

const slaIndicatorClass = computed(() => {
    const classMap = {
        good: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        critical: 'bg-red-100 text-red-800',
        resolved: 'bg-gray-100 text-gray-800'
    }
    return classMap[slaStatus.value]
})

const slaIcon = computed(() => {
    const iconMap = {
        good: 'check-circle',
        warning: 'clock',
        critical: 'alert-triangle',
        resolved: 'check'
    }
    return iconMap[slaStatus.value]
})

const slaLabel = computed(() => {
    if (slaStatus.value === 'resolved') return 'Resolved'
    return `${hoursOpen.value}h open`
})

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

const formatIssueType = (type: string) => {
    return type.split('_').map(word =>
        word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')
}
</script>
