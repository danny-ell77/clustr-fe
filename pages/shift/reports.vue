<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-bold">Shift Reports</h1>
                <p class="text-muted-foreground">View attendance reports and shift analytics</p>
            </div>

            <Button @click="handleExport" variant="outline">
                <Icon name="lucide:download" class="w-4 h-4 mr-2" />
                Export Report
            </Button>
        </div>

        <StatPane v-if="!statsQuery.isLoading.value && statistics" :stats="reportStats" />

        <Card>
            <CardHeader>
                <CardTitle>Filter Reports</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <Label>Start Date</Label>
                        <Input v-model="filters.startDate" type="date" />
                    </div>

                    <div>
                        <Label>End Date</Label>
                        <Input v-model="filters.endDate" type="date" />
                    </div>

                    <div>
                        <Label>Shift Type</Label>
                        <Select v-model="filters.shiftType">
                            <SelectTrigger>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Types</SelectItem>
                                <SelectItem value="SECURITY">Security</SelectItem>
                                <SelectItem value="CLEANING">Cleaning</SelectItem>
                                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                <SelectItem value="RECEPTION">Reception</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Status</Label>
                        <Select v-model="filters.status">
                            <SelectTrigger>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Statuses</SelectItem>
                                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="NO_SHOW">No Show</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div class="flex gap-2 mt-4">
                    <Button @click="applyFilters">
                        <Icon name="lucide:filter" class="w-4 h-4 mr-2" />
                        Apply Filters
                    </Button>
                    <Button variant="outline" @click="clearReportFilters">
                        Clear Filters
                    </Button>
                </div>
            </CardContent>
        </Card>

        <div v-if="shiftsQuery.isLoading.value" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <div v-else-if="shiftsQuery.isError.value" class="text-center py-12">
            <p class="text-destructive">Failed to load shift reports</p>
            <Button @click="() => shiftsQuery.refetch()" class="mt-4">Retry</Button>
        </div>

        <Card v-else>
            <CardHeader>
                <CardTitle>Shift Attendance Report</CardTitle>
                <p class="text-sm text-muted-foreground">
                    Showing {{ shifts.length }} shifts
                </p>
            </CardHeader>
            <CardContent>
                <div v-if="shifts.length === 0" class="text-center py-8">
                    <EmptyState title="No shifts found" description="No shifts match the selected filters" />
                </div>

                <div v-else class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="border-b">
                                <th class="text-left p-3 text-sm font-medium">Date</th>
                                <th class="text-left p-3 text-sm font-medium">Shift</th>
                                <th class="text-left p-3 text-sm font-medium">Type</th>
                                <th class="text-left p-3 text-sm font-medium">Staff</th>
                                <th class="text-left p-3 text-sm font-medium">Status</th>
                                <th class="text-left p-3 text-sm font-medium">Duration</th>
                                <th class="text-left p-3 text-sm font-medium">Overtime</th>
                                <th class="text-left p-3 text-sm font-medium">Late/Early</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="shift in shifts" :key="shift.id" class="border-b hover:bg-muted/50 cursor-pointer"
                                @click="viewShift(shift)">
                                <td class="p-3 text-sm">{{ formatDate(shift.startTime) }}</td>
                                <td class="p-3 text-sm font-medium">{{ shift.title }}</td>
                                <td class="p-3 text-sm">{{ shift.shiftTypeDisplay }}</td>
                                <td class="p-3 text-sm">{{ shift.assignedStaffDetails?.name || '-' }}</td>
                                <td class="p-3 text-sm">
                                    <StatusBadge :status="shift.status" :label="shift.statusDisplay" />
                                </td>
                                <td class="p-3 text-sm">
                                    {{ shift.attendance?.actualWorkDurationHours || shift.durationHours }}h
                                </td>
                                <td class="p-3 text-sm">
                                    <span v-if="shift.attendance?.overtimeHoursDecimal"
                                        :class="shift.attendance.overtimeHoursDecimal > 0 ? 'text-orange-600 font-medium' : ''">
                                        {{ shift.attendance.overtimeHoursDecimal }}h
                                    </span>
                                    <span v-else>-</span>
                                </td>
                                <td class="p-3 text-sm">
                                    <div v-if="shift.attendance" class="space-y-1">
                                        <div v-if="shift.attendance.lateArrivalMinutes > 0"
                                            class="text-xs text-orange-600">
                                            Late: {{ shift.attendance.lateArrivalMinutes }}m
                                        </div>
                                        <div v-if="shift.attendance.earlyDepartureMinutes > 0"
                                            class="text-xs text-orange-600">
                                            Early: {{ shift.attendance.earlyDepartureMinutes }}m
                                        </div>
                                        <span v-if="shift.attendance.lateArrivalMinutes === 0 && shift.attendance.earlyDepartureMinutes === 0">
                                            -
                                        </span>
                                    </div>
                                    <span v-else>-</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { useShifts } from '~/composables/shift/useShifts'
import type { Shift } from '~/types/shifts'
import StatPane from '~/components/common/StatPane.vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import EmptyState from '~/components/common/EmptyState.vue'

definePageMeta({
    requiresPermission: 'shift.overview.view'
})

const filters = reactive({
    startDate: '',
    endDate: '',
    shiftType: 'All',
    status: 'All'
})

const appliedFilters = ref({})

const { useShifts: useShiftsList, useShiftStats } = useShifts()

const shiftsQuery = useShiftsList(appliedFilters)
const statsQuery = useShiftStats()

const shifts = computed(() => shiftsQuery.data.value?.results || [])
const statistics = computed(() => statsQuery.data.value)

const reportStats = computed(() => [
    { title: 'Total Shifts', value: statistics.value?.totalShifts || 0, color: '#0ea5e9' },
    { title: 'Completed', value: statistics.value?.completedShifts || 0, color: '#10b981' },
    { title: 'No Shows', value: statistics.value?.noShowShifts || 0, color: '#ef4444' },
    { title: 'Attendance Rate', value: `${statistics.value?.attendanceRate || 0}%`, color: '#a855f7' }
])

const applyFilters = () => {
    const filterObj: any = {}

    if (filters.startDate) {
        filterObj.startDate = filters.startDate
    }

    if (filters.endDate) {
        filterObj.endDate = filters.endDate
    }

    if (filters.shiftType && filters.shiftType !== 'All') {
        filterObj.shiftType = filters.shiftType
    }

    if (filters.status && filters.status !== 'All') {
        filterObj.status = filters.status
    }

    appliedFilters.value = filterObj
}

const clearReportFilters = () => {
    filters.startDate = ''
    filters.endDate = ''
    filters.shiftType = 'All'
    filters.status = 'All'
    appliedFilters.value = {}
}

const viewShift = (shift: Shift) => {
    navigateTo(`/shift/${shift.id}`)
}

const handleExport = () => {
    const toast = useToast()
    toast.info('Export functionality coming soon')
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

onMounted(() => {
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    filters.startDate = firstDayOfMonth.toISOString().split('T')[0]
    filters.endDate = lastDayOfMonth.toISOString().split('T')[0]

    applyFilters()
})
</script>
