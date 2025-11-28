<template>
    <Card class="hover:shadow-md transition-shadow cursor-pointer" @click="$emit('click', visitor)">
        <CardContent class="pt-6">
            <div class="space-y-4">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 flex-wrap">
                            <h3 class="font-semibold text-lg">{{ visitor.name }}</h3>
                            <StatusBadge :status="visitor.status" />
                        </div>
                        <p v-if="visitor.purpose" class="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {{ visitor.purpose }}
                        </p>
                        <div class="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>{{ formatVisitType(visitor.visitType) }}</span>
                            <span>•</span>
                            <span>{{ formatValidFor(visitor.validFor) }}</span>
                        </div>
                    </div>
                    <div v-if="showStatusIndicator" class="ml-4">
                        <div class="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                            :class="statusIndicatorClass">
                            <Icon :name="statusIcon" class="w-3 h-3" />
                            <span>{{ statusLabel }}</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                        <p class="text-xs text-muted-foreground">Phone</p>
                        <p class="text-sm font-medium">{{ visitor.phone }}</p>
                    </div>
                    <div v-if="visitor.email">
                        <p class="text-xs text-muted-foreground">Email</p>
                        <p class="text-sm font-medium">{{ visitor.email }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-muted-foreground">Expected Arrival</p>
                        <p class="text-sm font-medium">{{ formatDateTime(visitor.estimatedArrival) }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-muted-foreground">Valid Until</p>
                        <p class="text-sm font-medium" :class="{ 'text-red-600': isExpired }">
                            {{ formatDate(visitor.validDate) }}
                        </p>
                    </div>
                    <div>
                        <p class="text-xs text-muted-foreground">Access Code</p>
                        <p class="text-sm font-medium font-mono">{{ visitor.accessCode }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-muted-foreground">Invited By</p>
                        <p class="text-sm font-medium">{{ visitor.invitedBy }}</p>
                    </div>
                </div>

                <div v-if="showActions" class="flex gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" class="flex-1" @click.stop="$emit('view', visitor)">
                        View Details
                    </Button>
                    <Button v-if="canCheckIn && visitor.status === 'APPROVED'" variant="default" size="sm"
                        @click.stop="$emit('check-in', visitor)">
                        Check In
                    </Button>
                    <Button v-if="canCheckOut && visitor.status === 'CHECKED_IN'" variant="default" size="sm"
                        @click.stop="$emit('check-out', visitor)">
                        Check Out
                    </Button>
                    <Button v-if="canGeneratePass && visitor.status === 'APPROVED'" variant="outline" size="sm"
                        @click.stop="$emit('generate-pass', visitor)">
                        Generate Pass
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
import Icon from '~/components/Icon.vue'
import type { Visitor } from '~/types/visitors'

interface Props {
    visitor: Visitor
    showActions?: boolean
    showStatusIndicator?: boolean
    canCheckIn?: boolean
    canCheckOut?: boolean
    canGeneratePass?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    showActions: true,
    showStatusIndicator: true,
    canCheckIn: true,
    canCheckOut: true,
    canGeneratePass: true
})

defineEmits<{
    click: [visitor: Visitor]
    view: [visitor: Visitor]
    'check-in': [visitor: Visitor]
    'check-out': [visitor: Visitor]
    'generate-pass': [visitor: Visitor]
}>()

const isExpired = computed(() => {
    return new Date(props.visitor.validDate) < new Date()
})

const statusIndicatorClass = computed(() => {
    const classMap: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        APPROVED: 'bg-primary/15 text-primary',
        REJECTED: 'bg-red-100 text-red-800',
        CHECKED_IN: 'bg-green-100 text-green-800',
        CHECKED_OUT: 'bg-gray-100 text-gray-800',
        EXPIRED: 'bg-red-100 text-red-800'
    }
    return classMap[props.visitor.status] || 'bg-gray-100 text-gray-800'
})

const statusIcon = computed(() => {
    const iconMap: Record<string, string> = {
        PENDING: 'clock',
        APPROVED: 'check-circle',
        REJECTED: 'x-circle',
        CHECKED_IN: 'user-check',
        CHECKED_OUT: 'user-x',
        EXPIRED: 'alert-triangle'
    }
    return iconMap[props.visitor.status] || 'help-circle'
})

const statusLabel = computed(() => {
    return props.visitor.status.replace('_', ' ')
})

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    })
}

const formatVisitType = (type: string) => {
    return type.split('_').map(word =>
        word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')
}

const formatValidFor = (validFor: string) => {
    return validFor === 'ONE_TIME' ? 'One Time' : 'Multiple Visits'
}
</script>
