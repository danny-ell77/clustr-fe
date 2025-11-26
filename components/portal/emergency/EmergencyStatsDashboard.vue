<template>
    <div class="space-y-6">
        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card v-for="i in 4" :key="i">
                <CardContent class="pt-6">
                    <Skeleton class="h-20 w-full" />
                </CardContent>
            </Card>
        </div>

        <div v-else-if="statistics" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Alerts" :value="statistics.totalAlerts" icon="alert-triangle" color="blue" />

                <StatCard title="Active Alerts" :value="statistics.activeAlerts" icon="alert-circle" color="red"
                    :class="statistics.activeAlerts > 0 ? 'ring-2 ring-red-500' : ''" />

                <StatCard title="Resolved Today" :value="statistics.resolvedAlerts" icon="check-circle" color="green" />

                <StatCard title="Avg Response Time" :value="formatResponseTime(statistics.averageResponseTime)"
                    suffix="mins" icon="clock" color="purple" />
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Alerts by Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-3">
                            <div v-for="(count, type) in statistics.alertsByType" :key="type"
                                class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <Icon :name="getEmergencyTypeIcon(type)" class="w-4 h-4 text-muted-foreground" />
                                    <span class="text-sm font-medium">{{ formatEmergencyType(type) }}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <div class="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                        <div class="h-full bg-primary transition-all"
                                            :style="{ width: getPercentage(count, statistics.totalAlerts) + '%' }" />
                                    </div>
                                    <span class="text-sm font-semibold w-8 text-right">{{ count }}</span>
                                </div>
                            </div>

                            <div v-if="Object.keys(statistics.alertsByType).length === 0" class="text-center py-4">
                                <p class="text-sm text-muted-foreground">No alerts recorded</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Alerts by Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-3">
                            <div v-for="(count, status) in statistics.alertsByStatus" :key="status"
                                class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <StatusBadge :status="status" show-icon />
                                </div>
                                <div class="flex items-center gap-2">
                                    <div class="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                        <div :class="['h-full transition-all', getStatusBarColor(status)]"
                                            :style="{ width: getPercentage(count, statistics.totalAlerts) + '%' }" />
                                    </div>
                                    <span class="text-sm font-semibold w-8 text-right">{{ count }}</span>
                                </div>
                            </div>

                            <div v-if="Object.keys(statistics.alertsByStatus).length === 0" class="text-center py-4">
                                <p class="text-sm text-muted-foreground">No alerts recorded</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card v-if="showActiveAlerts && activeAlerts.length > 0">
                <CardHeader>
                    <div class="flex items-center justify-between">
                        <CardTitle class="flex items-center gap-2">
                            <Icon name="alert-circle" class="w-5 h-5 text-red-600 animate-pulse" />
                            Active Emergency Alerts
                        </CardTitle>
                        <Badge variant="destructive">{{ activeAlerts.length }}</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div class="space-y-3">
                        <div v-for="alert in activeAlerts.slice(0, 5)" :key="alert.id"
                            class="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                            @click="$emit('view-alert', alert.id)">
                            <div class="flex-1 space-y-1">
                                <div class="flex items-center gap-2">
                                    <Badge :class="getEmergencyTypeBadgeClass(alert.emergencyType)">
                                        {{ alert.emergencyTypeDisplay }}
                                    </Badge>
                                    <PriorityBadge :priority="alert.priority" />
                                </div>
                                <p class="text-sm font-medium">{{ alert.alertId }}</p>
                                <p class="text-xs text-muted-foreground">
                                    {{ alert.userName }} • {{ alert.location }}
                                </p>
                            </div>
                            <Icon name="chevron-right" class="w-5 h-5 text-muted-foreground" />
                        </div>

                        <Button v-if="activeAlerts.length > 5" variant="outline" class="w-full"
                            @click="$emit('view-all-alerts')">
                            View All {{ activeAlerts.length }} Active Alerts
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>

        <EmptyState v-else title="No Statistics Available"
            description="Emergency statistics will appear here once alerts are created." icon="bar-chart" />
    </div>
</template>


<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import Icon from '~/components/Icon.vue'
import StatCard from '~/components/common/StatCard.vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import PriorityBadge from '~/components/common/PriorityBadge.vue'
import EmptyState from '~/components/common/EmptyState.vue'
import type { EmergencyStatistics, SOSAlert } from '~/types/emergency'

interface Props {
    statistics: EmergencyStatistics | null
    activeAlerts?: SOSAlert[]
    isLoading?: boolean
    showActiveAlerts?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    activeAlerts: () => [],
    isLoading: false,
    showActiveAlerts: true
})

defineEmits<{
    'view-alert': [id: string]
    'view-all-alerts': []
}>()

const formatResponseTime = (minutes: number | undefined) => {
    if (minutes === undefined || minutes === null) return '-'
    return Math.round(minutes)
}

const getPercentage = (value: number, total: number) => {
    if (total === 0) return 0
    return Math.round((value / total) * 100)
}

const formatEmergencyType = (type: string) => {
    return type.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ')
}

const getEmergencyTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
        FIRE: 'flame',
        MEDICAL: 'heart-pulse',
        SECURITY: 'shield-alert',
        ACCIDENT: 'car-crash',
        NATURAL_DISASTER: 'cloud-lightning',
        UTILITY_FAILURE: 'zap-off',
        OTHER: 'alert-triangle'
    }
    return icons[type] || 'alert-triangle'
}

const getEmergencyTypeBadgeClass = (type: string) => {
    const colors: Record<string, string> = {
        FIRE: 'bg-red-100 text-red-800',
        MEDICAL: 'bg-pink-100 text-pink-800',
        SECURITY: 'bg-purple-100 text-purple-800',
        ACCIDENT: 'bg-orange-100 text-orange-800',
        NATURAL_DISASTER: 'bg-yellow-100 text-yellow-800',
        UTILITY_FAILURE: 'bg-blue-100 text-blue-800',
        OTHER: 'bg-gray-100 text-gray-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
}

const getStatusBarColor = (status: string) => {
    const colors: Record<string, string> = {
        PENDING: 'bg-blue-500',
        ACKNOWLEDGED: 'bg-yellow-500',
        RESPONDING: 'bg-orange-500',
        RESOLVED: 'bg-green-500',
        CANCELLED: 'bg-gray-500'
    }
    return colors[status] || 'bg-gray-500'
}
</script>
