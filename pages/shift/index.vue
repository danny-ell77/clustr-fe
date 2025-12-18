<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-semibold">Shift Management</h1>
                <p class="text-muted-foreground">Manage staff shifts and schedules</p>
            </div>

            <Button v-if="hasPermission(PERMISSIONS.FACILITY_ADMIN.MANAGE_WORK_SHIFT)" @click="showCreateModal = true">
                <Icon name="lucide:plus" class="w-4 h-4 mr-2" />
                Create Shift
            </Button>
        </div>

        <StatPane v-if="!statsQuery.isLoading.value && statistics" :stats="shiftStats" />

        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <Button variant="outline" size="sm" @click="previousMonth">
                    <Icon name="lucide:chevron-left" class="w-4 h-4" />
                </Button>
                <h3 class="text-lg font-semibold px-4">
                    {{ currentMonthYear }}
                </h3>
                <Button variant="outline" size="sm" @click="nextMonth">
                    <Icon name="lucide:chevron-right" class="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" @click="goToToday">
                    Today
                </Button>
            </div>

            <div class="flex items-center gap-4">
                <Select @update:model-value="(value: string) => setFilter('shiftType', value)">
                    <SelectTrigger class="w-[180px]">
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

                <Select @update:model-value="(value: string) => setFilter('status', value)">
                    <SelectTrigger class="w-[180px]">
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Statuses</SelectItem>
                        <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                </Select>

                <Button variant="outline" @click="clearFilters" size="sm">
                    Clear Filters
                </Button>
            </div>
        </div>

        <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <Card v-else>
            <CardContent class="p-0">
                <div class="grid grid-cols-7 border-b bg-muted">
                    <div v-for="day in weekDays" :key="day"
                        class="p-4 text-center font-semibold text-sm border-r last:border-r-0">
                        {{ day }}
                    </div>
                </div>

                <div class="grid grid-cols-7">
                    <div v-for="(day, index) in calendarDays" :key="index" :class="[
                        'min-h-[120px] border-r border-b last:border-r-0',
                        day.isToday ? 'bg-primary/5' : ''
                    ]">
                        <div class="p-2">
                            <div :class="[
                                'text-sm font-medium mb-2',
                                !day.isCurrentMonth ? 'text-muted-foreground' : day.isToday ? 'text-primary font-semibold' : ''
                            ]">
                                {{ day.date }}
                            </div>

                            <div class="space-y-1">
                                <div v-for="shift in day.shifts" :key="shift.id" @click="viewShift(shift)" :class="[
                                    'text-xs p-2 rounded cursor-pointer hover:opacity-80 transition-opacity',
                                    getShiftPillClass(shift)
                                ]">
                                    <div class="font-medium truncate">{{ shift.title }}</div>
                                    <div class="text-xs opacity-90 truncate">
                                        {{ formatTime(shift.startTime) }} - {{ formatTime(shift.endTime) }}
                                    </div>
                                    <div v-if="shift.assignedStaffDetails" class="text-xs opacity-75 truncate">
                                        {{ shift.assignedStaffDetails.name }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <ShiftFormDialog v-model:open="showCreateModal" :staff-members="staffMembers" @submit="handleCreate" />
    </div>
</template>

<script setup lang="ts">
import { useShifts } from '~/composables/shift/useShifts'
import { usePermissions } from '~/composables/auth/usePermissions'
import { queryKeys } from '~/constants/query-keys'
import type { Shift, CreateShiftDto } from '~/types/shifts'
import ShiftFormDialog from '~/components/shift/ShiftFormDialog.vue'
import StatPane from '~/components/common/StatPane.vue'

const { hasPermission, PERMISSIONS } = usePermissions()
const { useShifts: useShiftsList, useShiftStats, createShiftMutation } = useShifts()

definePageMeta({
    requiresPermission: 'shift.overview.view'
})

const currentDate = ref(new Date())
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const showCreateModal = ref(false)
const staffMembers = ref([])

const filterDefinitions = [
    {
        field: 'shiftType',
        type: 'select' as const,
        label: 'Shift Type',
        options: [
            { value: 'SECURITY', label: 'Security' },
            { value: 'CLEANING', label: 'Cleaning' },
            { value: 'MAINTENANCE', label: 'Maintenance' },
            { value: 'RECEPTION', label: 'Reception' },
            { value: 'OTHER', label: 'Other' }
        ]
    },
    {
        field: 'status',
        type: 'select' as const,
        label: 'Status',
        options: [
            { value: 'SCHEDULED', label: 'Scheduled' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'COMPLETED', label: 'Completed' }
        ]
    }
]

const { currentQuery, clearFilters, setFilter } = useDataFilters(filterDefinitions, {
    persistKey: 'shifts-filters'
})

const currentMonthYear = computed(() => {
    return currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const queryParams = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth() + 1
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0]
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]

    return {
        ...currentQuery.value,
        startDate,
        endDate
    }
})

const shiftsQuery = useShiftsList(queryParams)
const statsQuery = useShiftStats()

const shiftsData = computed(() => shiftsQuery.data.value)
const loading = computed(() => shiftsQuery.isLoading.value)
const statistics = computed(() => statsQuery.data.value)

const shiftStats = computed(() => [
    { title: 'Total Shifts', value: statistics.value?.totalShifts || 0, color: '#0ea5e9' },
    { title: 'Completed', value: statistics.value?.completedShifts || 0, color: '#10b981' },
    { title: 'Attendance Rate', value: `${statistics.value?.attendanceRate || 0}%`, color: '#a855f7' },
    { title: 'Avg Overtime', value: `${statistics.value?.averageOvertimeHours || 0}h`, color: '#eab308' }
])

const calendarDays = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const prevLastDay = new Date(year, month, 0)

    const firstDayOfWeek = firstDay.getDay()
    const lastDateOfMonth = lastDay.getDate()
    const prevLastDate = prevLastDay.getDate()

    const days = []

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const date = prevLastDate - i
        const dateObj = new Date(year, month - 1, date)
        days.push({
            date,
            dateObj,
            isCurrentMonth: false,
            isToday: false,
            shifts: []
        })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let date = 1; date <= lastDateOfMonth; date++) {
        const dateObj = new Date(year, month, date)
        dateObj.setHours(0, 0, 0, 0)

        const dayShifts = shiftsData.value?.results?.filter((shift: Shift) => {
            const shiftDate = new Date(shift.startTime)
            shiftDate.setHours(0, 0, 0, 0)
            return shiftDate.getTime() === dateObj.getTime()
        }) || []

        days.push({
            date,
            dateObj,
            isCurrentMonth: true,
            isToday: dateObj.getTime() === today.getTime(),
            shifts: dayShifts
        })
    }

    const remainingDays = 42 - days.length
    for (let date = 1; date <= remainingDays; date++) {
        const dateObj = new Date(year, month + 1, date)
        days.push({
            date,
            dateObj,
            isCurrentMonth: false,
            isToday: false,
            shifts: []
        })
    }

    return days
})

const handleCreate = async (data: CreateShiftDto) => {
    await createShiftMutation.mutateAsync(data)
    showCreateModal.value = false
}

const viewShift = (shift: Shift) => {
    navigateTo(`/shift/${shift.id}`)
}

const previousMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const goToToday = () => {
    currentDate.value = new Date()
}

const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    })
}

const getShiftPillClass = (shift: Shift) => {
    const typeClasses: Record<string, string> = {
        SECURITY: 'bg-blue-100 text-blue-800 border border-blue-200',
        CLEANING: 'bg-green-100 text-green-800 border border-green-200',
        MAINTENANCE: 'bg-orange-100 text-orange-800 border border-orange-200',
        RECEPTION: 'bg-purple-100 text-purple-800 border border-purple-200',
        OTHER: 'bg-gray-100 text-gray-800 border border-gray-200'
    }

    const statusOverlay = {
        IN_PROGRESS: 'ring-2 ring-yellow-400',
        COMPLETED: 'opacity-60',
        CANCELLED: 'opacity-40 line-through',
        NO_SHOW: 'opacity-40 bg-red-50 border-red-200'
    }

    const baseClass = typeClasses[shift.shiftType || 'OTHER'] || typeClasses.OTHER
    const overlay = statusOverlay[shift.status as keyof typeof statusOverlay] || ''

    return `${baseClass} ${overlay}`
}
</script>
