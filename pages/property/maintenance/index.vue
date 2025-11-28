<template>
    <div class="p-6 space-y-6">
        <div>
            <h1 class="text-2xl">Maintenance Management</h1>
            <p class="text-muted-foreground">Manage maintenance logs, schedules, and view analytics</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NuxtLink to="/property/maintenance/logs"
                class="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold text-lg">Maintenance Logs</h3>
                        <p class="text-sm text-muted-foreground">Track maintenance requests</p>
                    </div>
                </div>
            </NuxtLink>

            <NuxtLink to="/property/maintenance/schedules"
                class="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold text-lg">Schedules</h3>
                        <p class="text-sm text-muted-foreground">Manage recurring maintenance</p>
                    </div>
                </div>
            </NuxtLink>

            <NuxtLink to="/property/maintenance/analytics"
                class="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold text-lg">Analytics</h3>
                        <p class="text-sm text-muted-foreground">View statistics and insights</p>
                    </div>
                </div>
            </NuxtLink>
        </div>

        <div class="bg-white border rounded-lg p-6">
            <h2 class="text-lg font-semibold mb-4">Quick Stats</h2>
            <div v-if="analyticsQuery.isLoading.value" class="text-center py-4">
                <p class="text-muted-foreground">Loading stats...</p>
            </div>
            <div v-else-if="analyticsQuery.isError.value" class="text-center py-4">
                <p class="text-red-600">Error loading stats</p>
            </div>
            <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="text-center">
                    <div class="text-2xl">{{ analyticsQuery.data.value?.totalLogs || 0 }}</div>
                    <div class="text-sm text-muted-foreground">Total Logs</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl text-yellow-600">{{ analyticsQuery.data.value?.pendingLogs || 0 }}
                    </div>
                    <div class="text-sm text-muted-foreground">Pending</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl text-primary">{{ analyticsQuery.data.value?.inProgressLogs || 0 }}
                    </div>
                    <div class="text-sm text-muted-foreground">In Progress</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl text-green-600">{{ analyticsQuery.data.value?.completedLogs || 0 }}
                    </div>
                    <div class="text-sm text-muted-foreground">Completed</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { maintenanceApi } from '~/services/api/maintenance.api'
import { queryKeys } from '~/constants/query-keys'

definePageMeta({
    title: 'Maintenance Management',
    description: 'Manage maintenance logs, schedules, and view analytics',
    requiresPermission: 'property.maintenance.view'
})

const analyticsQuery = useQuery({
    queryKey: queryKeys.maintenance.analytics(),
    queryFn: () => maintenanceApi.getAnalytics(),
    staleTime: 1000 * 60 * 5
})
</script>
