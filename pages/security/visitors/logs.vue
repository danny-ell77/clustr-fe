<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl">Visitor Logs</h1>
                <p class="text-muted-foreground">View entry and exit history for all visitors</p>
            </div>

            <Button variant="outline" @click="navigateTo('/security/visitors')">
                <Icon name="arrow-left" class="w-4 h-4 mr-2" />
                Back to Visitors
            </Button>
        </div>

        <StatPane :stats="statsData" />

        <Card>
            <CardHeader>
                <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <Label>Log Type</Label>
                        <Select @update:model-value="(value) => setFilter('logType', value)">
                            <SelectTrigger>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                                <SelectItem value="CHECKED_IN">Checked In</SelectItem>
                                <SelectItem value="CHECKED_OUT">Checked Out</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Start Date</Label>
                        <Input type="date"
                            @change="(e: Event) => setFilter('startDate', (e.target as HTMLInputElement).value)" />
                    </div>

                    <div>
                        <Label>End Date</Label>
                        <Input type="date"
                            @change="(e: Event) => setFilter('endDate', (e.target as HTMLInputElement).value)" />
                    </div>

                    <div>
                        <Label>Search</Label>
                        <Input type="text" placeholder="Search by visitor name..."
                            @input="(e: Event) => setSearch((e.target as HTMLInputElement).value)" />
                    </div>
                </div>

                <div class="flex items-center justify-between mt-4">
                    <div class="text-sm text-muted-foreground">
                        Showing {{ logs.length }} of {{ logsQuery.data.value?.count || 0 }} logs
                    </div>
                    <Button variant="outline" @click="clearFilters">Clear Filters</Button>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardContent class="p-0">
                <div v-if="isLoading" class="p-6 space-y-4">
                    <Skeleton v-for="i in 5" :key="i" class="h-16 w-full" />
                </div>

                <div v-else-if="logs.length === 0" class="text-center py-12">
                    <EmptyState title="No logs found" description="No visitor activity recorded yet" />
                </div>

                <div v-else class="divide-y">
                    <div v-for="log in logs" :key="log.id"
                        class="p-4 hover:bg-muted/50 transition-colors cursor-pointer" @click="viewLog(log)">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <div class="flex items-center gap-2">
                                    <Icon :name="getLogIcon(log.logType)" class="w-5 h-5"
                                        :class="getLogIconColor(log.logType)" />
                                    <h3 class="font-semibold">{{ log.visitorName }}</h3>
                                    <StatusBadge :status="log.logType" :label="formatLogType(log.logType)" />
                                </div>
                                <div class="mt-2 text-sm text-muted-foreground space-y-1">
                                    <div class="flex items-center gap-4">
                                        <span v-if="log.arrivalTime">
                                            <Icon name="log-in" class="w-4 h-4 inline mr-1" />
                                            Check In: {{ formatDateTime(log.arrivalTime) }}
                                        </span>
                                        <span v-if="log.departureTime">
                                            <Icon name="log-out" class="w-4 h-4 inline mr-1" />
                                            Check Out: {{ formatDateTime(log.departureTime) }}
                                        </span>
                                    </div>
                                    <div v-if="log.checkedInBy || log.checkedOutBy" class="flex items-center gap-4">
                                        <span v-if="log.checkedInBy">Checked in by: {{ log.checkedInBy }}</span>
                                        <span v-if="log.checkedOutBy">Checked out by: {{ log.checkedOutBy }}</span>
                                    </div>
                                    <div v-if="log.notes" class="text-xs">
                                        <Icon name="file-text" class="w-3 h-3 inline mr-1" />
                                        {{ log.notes }}
                                    </div>
                                </div>
                            </div>
                            <div class="text-right text-sm text-muted-foreground">
                                <div>{{ formatDate(log.date) }}</div>
                                <div class="text-xs mt-1">{{ formatTime(log.createdAt) }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="logs.length > 0 && logsQuery.data.value"
                    class="flex items-center justify-between px-4 py-4 border-t">
                    <div class="text-sm text-muted-foreground">
                        Page {{ currentPage }} of {{ totalPages }}
                    </div>
                    <div class="flex gap-2">
                        <Button variant="outline" size="sm" :disabled="currentPage <= 1" @click="previousPage">
                            Previous
                        </Button>
                        <Button variant="outline" size="sm" :disabled="currentPage >= totalPages" @click="nextPage">
                            Next
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
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
import StatusBadge from '~/components/common/StatusBadge.vue'
import EmptyState from '~/components/common/EmptyState.vue'
import { useVisitors } from '~/composables/security/useVisitors'
import { useDataFilters } from '~/composables/useDataFilters'
import type { VisitorLog, VisitorLogType } from '~/types/visitors'
import type { VisitorLogFilters } from '~/services/api/visitors.api'

definePageMeta({
    title: 'Visitor Logs'
})

const { useVisitorLogs } = useVisitors()

const filterDefinitions = [
    { field: 'logType', type: 'select' as const, label: 'Log Type' },
    { field: 'startDate', type: 'date' as const, label: 'Start Date' },
    { field: 'endDate', type: 'date' as const, label: 'End Date' },
    { field: 'search', type: 'text' as const, label: 'Search' },
    { field: 'page', type: 'text' as const, label: 'Page' }
]

const { currentQuery, setFilter, clearFilters, setSearch } = useDataFilters(filterDefinitions, {
    persistKey: 'visitor-logs-filters'
})

const logsQuery = useVisitorLogs(currentQuery as Ref<VisitorLogFilters>)

const logs = computed(() => logsQuery.data.value?.results || [])
const isLoading = computed(() => logsQuery.isLoading.value)

const currentPage = computed(() => {
    const page = currentQuery.value.get('page')
    return page ? parseInt(page) : 1
})

const pageSize = 20

const totalPages = computed(() => {
    const count = logsQuery.data.value?.count || 0
    return Math.ceil(count / pageSize)
})

const todayEntries = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return logs.value.filter(log =>
        log.logType === 'CHECKED_IN' && log.date === today
    ).length
})

const todayExits = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return logs.value.filter(log =>
        log.logType === 'CHECKED_OUT' && log.date === today
    ).length
})

const currentlyInside = computed(() => {
    const checkedIn = new Set<string>()
    const checkedOut = new Set<string>()

    logs.value.forEach(log => {
        if (log.logType === 'CHECKED_IN') {
            checkedIn.add(log.visitor)
        } else if (log.logType === 'CHECKED_OUT') {
            checkedOut.add(log.visitor)
        }
    })

    return checkedIn.size - checkedOut.size
})

const statsData = computed(() => [
    { title: 'Total Entries Today', value: todayEntries.value, color: '#10b981' },
    { title: 'Total Exits Today', value: todayExits.value, color: '#0ea5e9' },
    { title: 'Currently Inside', value: currentlyInside.value, color: '#a855f7' },
    { title: 'Total Logs', value: logsQuery.data.value?.count || 0, color: '#6b7280' }
])

const getLogIcon = (logType: VisitorLogType): string => {
    switch (logType) {
        case 'CHECKED_IN':
            return 'log-in'
        case 'CHECKED_OUT':
            return 'log-out'
        case 'SCHEDULED':
            return 'calendar'
        case 'CANCELLED':
            return 'x-circle'
        default:
            return 'file-text'
    }
}

const getLogIconColor = (logType: VisitorLogType): string => {
    switch (logType) {
        case 'CHECKED_IN':
            return 'text-green-600'
        case 'CHECKED_OUT':
            return 'text-primary'
        case 'SCHEDULED':
            return 'text-yellow-600'
        case 'CANCELLED':
            return 'text-red-600'
        default:
            return 'text-gray-600'
    }
}

const formatLogType = (logType: VisitorLogType): string => {
    return logType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const formatDateTime = (dateTime: string): string => {
    return new Date(dateTime).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

const formatTime = (dateTime: string): string => {
    return new Date(dateTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

const viewLog = (log: VisitorLog) => {
    navigateTo(`/security/visitors/${log.visitor}`)
}

const previousPage = () => {
    const page = currentPage.value - 1
    if (page >= 1) {
        setFilter('page', page.toString())
    }
}

const nextPage = () => {
    const page = currentPage.value + 1
    if (page <= totalPages.value) {
        setFilter('page', page.toString())
    }
}
</script>
