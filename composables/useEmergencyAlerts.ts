import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { queryKeys } from '~/constants/query-keys'

interface EmergencyAlert {
    id: string
    priority: 'critical' | 'high' | 'medium' | 'low'
    emergencyTypeDisplay: string
    location?: string
    userDetails?: {
        name: string
    }
}

export function useEmergencyAlerts() {
    const activeAlertsQuery = useQuery({
        queryKey: queryKeys.emergency.alerts.active(),
        queryFn: async () => {
            return [] as EmergencyAlert[]
        },
        refetchInterval: 15000
    })

    const activeAlerts = computed(() => activeAlertsQuery.data.value || [])

    const hasActiveAlerts = computed(() => activeAlerts.value.length > 0)

    const criticalAlerts = computed(() =>
        activeAlerts.value.filter((alert: EmergencyAlert) =>
            alert.priority === 'critical' || alert.priority === 'high'
        )
    )

    const hasCriticalAlerts = computed(() => criticalAlerts.value.length > 0)

    const mostUrgentAlert = computed(() => {
        if (activeAlerts.value.length === 0) return null

        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
        return activeAlerts.value.reduce((most: EmergencyAlert | null, current: EmergencyAlert) => {
            if (!most) return current
            const currentPriority = priorityOrder[current.priority as keyof typeof priorityOrder] || 0
            const mostPriority = priorityOrder[most.priority as keyof typeof priorityOrder] || 0
            return currentPriority > mostPriority ? current : most
        }, null)
    })

    return {
        activeAlerts,
        hasActiveAlerts,
        criticalAlerts,
        hasCriticalAlerts,
        mostUrgentAlert,
        isLoading: computed(() => activeAlertsQuery.isLoading.value)
    }
}
