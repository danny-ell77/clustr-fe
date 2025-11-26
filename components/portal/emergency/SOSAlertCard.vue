<template>
    <Card :class="['cursor-pointer transition-all hover:shadow-md', alertBorderClass]">
        <CardContent class="p-6">
            <div class="space-y-4">
                <div class="flex items-start justify-between">
                    <div class="flex-1 space-y-2">
                        <div class="flex items-center gap-2">
                            <Badge :class="emergencyTypeBadgeClass">
                                <Icon :name="emergencyTypeIcon" class="w-3 h-3 mr-1" />
                                {{ alert.emergencyTypeDisplay }}
                            </Badge>
                            <PriorityBadge :priority="alert.priority" />
                            <StatusBadge :status="alert.status" show-icon />
                        </div>

                        <div>
                            <h3 class="text-lg font-semibold">{{ alert.alertId }}</h3>
                            <p class="text-sm text-muted-foreground">
                                Reported by {{ alert.userName }} • {{ formatDate(alert.createdAt) }}
                            </p>
                        </div>
                    </div>

                    <div v-if="alert.isActive" class="flex items-center gap-1 text-red-600 animate-pulse">
                        <Icon name="alert-circle" class="w-5 h-5" />
                        <span class="text-sm font-medium">Active</span>
                    </div>
                </div>

                <div class="space-y-2">
                    <div class="flex items-start gap-2">
                        <Icon name="map-pin" class="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <span class="text-sm">{{ alert.location }}</span>
                    </div>

                    <div class="flex items-start gap-2">
                        <Icon name="file-text" class="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <p class="text-sm line-clamp-2">{{ alert.description }}</p>
                    </div>
                </div>

                <div v-if="showTimeline" class="space-y-2 pt-2 border-t">
                    <div v-if="alert.acknowledgedAt" class="flex items-center gap-2 text-sm">
                        <Icon name="check" class="w-4 h-4 text-green-600" />
                        <span class="text-muted-foreground">
                            Acknowledged by {{ alert.acknowledgedByName }} • {{ formatDate(alert.acknowledgedAt) }}
                        </span>
                    </div>

                    <div v-if="alert.respondedAt" class="flex items-center gap-2 text-sm">
                        <Icon name="user-check" class="w-4 h-4 text-blue-600" />
                        <span class="text-muted-foreground">
                            Response started by {{ alert.respondedByName }} • {{ formatDate(alert.respondedAt) }}
                        </span>
                    </div>

                    <div v-if="alert.resolvedAt" class="flex items-center gap-2 text-sm">
                        <Icon name="check-circle" class="w-4 h-4 text-green-600" />
                        <span class="text-muted-foreground">
                            Resolved by {{ alert.resolvedByName }} • {{ formatDate(alert.resolvedAt) }}
                        </span>
                    </div>
                </div>

                <div v-if="showActions" class="flex items-center gap-2 pt-2 border-t">
                    <Button v-if="canAcknowledge" size="sm" variant="outline"
                        @click.stop="$emit('acknowledge', alert.id)" :disabled="isLoading">
                        <Icon name="check" class="w-4 h-4 mr-1" />
                        Acknowledge
                    </Button>

                    <Button v-if="canRespond" size="sm" variant="default" @click.stop="$emit('respond', alert.id)"
                        :disabled="isLoading">
                        <Icon name="user-check" class="w-4 h-4 mr-1" />
                        Start Response
                    </Button>

                    <Button v-if="canResolve" size="sm" variant="default" @click.stop="$emit('resolve', alert.id)"
                        :disabled="isLoading">
                        <Icon name="check-circle" class="w-4 h-4 mr-1" />
                        Resolve
                    </Button>

                    <Button v-if="canCancel" size="sm" variant="destructive" @click.stop="$emit('cancel', alert.id)"
                        :disabled="isLoading">
                        <Icon name="x-circle" class="w-4 h-4 mr-1" />
                        Cancel
                    </Button>

                    <Button size="sm" variant="ghost" @click.stop="$emit('view-details', alert.id)">
                        <Icon name="eye" class="w-4 h-4 mr-1" />
                        View Details
                    </Button>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import Icon from '~/components/Icon.vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import PriorityBadge from '~/components/common/PriorityBadge.vue'
import type { SOSAlert } from '~/types/emergency'
import { EmergencyStatus } from '~/types/emergency'

interface Props {
    alert: SOSAlert
    showActions?: boolean
    showTimeline?: boolean
    isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    showActions: true,
    showTimeline: true,
    isLoading: false
})

defineEmits<{
    'acknowledge': [id: string]
    'respond': [id: string]
    'resolve': [id: string]
    'cancel': [id: string]
    'view-details': [id: string]
}>()

const alertBorderClass = computed(() => {
    if (!props.alert.isActive) return 'border-l-4 border-l-gray-300'

    const priorityColors: Record<string, string> = {
        LOW: 'border-l-4 border-l-gray-400',
        MEDIUM: 'border-l-4 border-l-blue-500',
        HIGH: 'border-l-4 border-l-orange-500',
        CRITICAL: 'border-l-4 border-l-red-600'
    }

    return priorityColors[props.alert.priority] || 'border-l-4 border-l-gray-300'
})

const emergencyTypeBadgeClass = computed(() => {
    const typeColors: Record<string, string> = {
        FIRE: 'bg-red-100 text-red-800',
        MEDICAL: 'bg-pink-100 text-pink-800',
        SECURITY: 'bg-purple-100 text-purple-800',
        ACCIDENT: 'bg-orange-100 text-orange-800',
        NATURAL_DISASTER: 'bg-yellow-100 text-yellow-800',
        UTILITY_FAILURE: 'bg-blue-100 text-blue-800',
        OTHER: 'bg-gray-100 text-gray-800'
    }

    return typeColors[props.alert.emergencyType] || 'bg-gray-100 text-gray-800'
})

const emergencyTypeIcon = computed(() => {
    const typeIcons: Record<string, string> = {
        FIRE: 'flame',
        MEDICAL: 'heart-pulse',
        SECURITY: 'shield-alert',
        ACCIDENT: 'car-crash',
        NATURAL_DISASTER: 'cloud-lightning',
        UTILITY_FAILURE: 'zap-off',
        OTHER: 'alert-triangle'
    }

    return typeIcons[props.alert.emergencyType] || 'alert-triangle'
})

const canAcknowledge = computed(() => {
    return props.alert.status === EmergencyStatus.PENDING && props.alert.isActive
})

const canRespond = computed(() => {
    return props.alert.status === EmergencyStatus.ACKNOWLEDGED && props.alert.isActive
})

const canResolve = computed(() => {
    return (props.alert.status === EmergencyStatus.RESPONDING ||
        props.alert.status === EmergencyStatus.ACKNOWLEDGED) &&
        props.alert.isActive
})

const canCancel = computed(() => {
    return props.alert.isActive &&
        props.alert.status !== EmergencyStatus.RESOLVED &&
        props.alert.status !== EmergencyStatus.CANCELLED
})

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString()
}
</script>
