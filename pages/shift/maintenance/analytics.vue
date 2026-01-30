<template>
    <div class="p-6 space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl">Maintenance Analytics</h1>
                <p class="text-muted-foreground">View maintenance statistics and insights</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white border rounded-lg p-4">
                <div class="text-sm text-muted-foreground">Total Logs</div>
                <div class="text-2xl mt-2">
                    {{ analyticsQuery.data.value?.totalLogs || 0 }}
                </div>
            </div>
            <div class="bg-white border rounded-lg p-4">
                <div class="text-sm text-muted-foreground">Pending</div>
                <div class="text-2xl mt-2 text-yellow-600">
                    {{ analyticsQuery.data.value?.pendingLogs || 0 }}
                </div>
            </div>
            <div class="bg-white border rounded-lg p-4">
                <div class="text-sm text-muted-foreground">In Progress</div>
                <div class="text-2xl mt-2 text-primary">
                    {{ analyticsQuery.data.value?.inProgressLogs || 0 }}
                </div>
            </div>
            <div class="bg-white border rounded-lg p-4">
                <div class="text-sm text-muted-foreground">Completed</div>
                <div class="text-2xl mt-2 text-green-600">
                    {{ analyticsQuery.data.value?.completedLogs || 0 }}
                </div>
            </div>
        </div>

        <div v-if="analyticsQuery.isLoading.value" class="bg-white border rounded-lg p-8 text-center">
            <p class="text-muted-foreground">Loading analytics...</p>
        </div>

        <div v-else-if="analyticsQuery.isError.value" class="bg-white border rounded-lg p-8 text-center">
            <p class="text-red-600">Error loading analytics</p>
            <Button @click="analyticsQuery.refetch()" variant="outline" class="mt-4">
                Retry
            </Button>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white border rounded-lg p-4">
                <h3 class="font-semibold mb-4">By Priority</h3>
                <div class="space-y-2">
                    <div v-for="(count, priority) in analyticsQuery.data.value?.byPriority" :key="priority"
                        class="flex justify-between items-center">
                        <span class="text-sm">{{ priority }}</span>
                        <Badge>{{ count }}</Badge>
                    </div>
                </div>
            </div>

            <div class="bg-white border rounded-lg p-4">
                <h3 class="font-semibold mb-4">By Type</h3>
                <div class="space-y-2">
                    <div v-for="(count, type) in analyticsQuery.data.value?.byType" :key="type"
                        class="flex justify-between items-center">
                        <span class="text-sm">{{ type }}</span>
                        <Badge>{{ count }}</Badge>
                    </div>
                </div>
            </div>

            <div class="bg-white border rounded-lg p-4">
                <h3 class="font-semibold mb-4">Average Resolution Time</h3>
                <div class="text-3xl text-primary">
                    {{ analyticsQuery.data.value?.avgResolutionTime || 'N/A' }}
                </div>
                <p class="text-sm text-muted-foreground mt-2">days</p>
            </div>

            <div class="bg-white border rounded-lg p-4">
                <h3 class="font-semibold mb-4">Total Cost</h3>
                <div class="text-3xl text-green-600">
                    {{ formatCurrency(analyticsQuery.data.value?.totalCost || 0) }}
                </div>
                <p class="text-sm text-muted-foreground mt-2">this period</p>
            </div>
        </div>

        <div class="bg-white border rounded-lg p-4">
            <h3 class="font-semibold mb-4">Recent Activity</h3>
            <div v-if="analyticsQuery.data.value?.recentLogs?.length" class="space-y-2">
                <div v-for="log in analyticsQuery.data.value.recentLogs" :key="log.id"
                    class="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                        <p class="font-medium">{{ log.title }}</p>
                        <p class="text-sm text-muted-foreground">{{ log.maintenanceNumber }}</p>
                    </div>
                    <Badge>{{ log.status }}</Badge>
                </div>
            </div>
            <p v-else class="text-muted-foreground text-center py-4">No recent activity</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { maintenanceApi } from '~/services/api/maintenance.api'
import { queryKeys } from '~/constants/query-keys'

definePageMeta({
    title: 'Maintenance Analytics',
    description: 'View maintenance statistics and insights',
    requiresPermission: 'property.maintenance.view'
})

interface MaintenanceAnalytics {
    totalLogs?: number
    pendingLogs?: number
    inProgressLogs?: number
    completedLogs?: number
    byPriority?: Record<string, number>
    byType?: Record<string, number>
    avgResolutionTime?: string | number
    totalCost?: number
    recentLogs?: Array<{
        id: string
        title: string
        maintenanceNumber: string
        status: string
    }>
}

const analyticsQuery = useQuery<MaintenanceAnalytics>({
    queryKey: queryKeys.maintenance.analytics(),
    queryFn: () => maintenanceApi.getAnalytics()
})

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount)
}
</script>
