<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-semibold">Shift Management</h1>
                <p class="text-muted-foreground">Manage staff shifts and schedules</p>
            </div>

            <Button v-if="hasPermission(PERMISSIONS.FACILITY_ADMIN.MANAGE_WORK_SHIFT)" @click="showCreateModal = true">
                <Icon name="plus" class="w-4 h-4 mr-2" />
                Create Shift
            </Button>
        </div>

        <StatPane v-if="!statsQuery.isLoading.value && statistics" :stats="shiftStats" />

        <div class="flex items-center justify-between">
            <ShiftCalendarControls
                :current-month-year="currentMonthYear"
                @previous="previousMonth"
                @next="nextMonth"
                @today="goToToday"
            />
            <ShiftFilterBar
                v-model="filtersModel"
                @clear="clearFilters"
            />
        </div>
        <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <ShiftCalendarGrid v-else
            :week-days="weekDays"
            :calendar-days="calendarDays"
            @view="viewShift"
        />
        <ShiftFormDialog v-model:open="showCreateModal" :staff-members="staffMembers" @submit="handleCreate" />
    </div>
</template>

<script setup lang="ts">
import { useShifts } from '~/composables/shift/useShifts'
import { Button } from '~/components/ui/button'
import { usePermissions } from '~/composables/auth/usePermissions'
import { queryKeys } from '~/constants/query-keys'
import { managementShiftsApi } from '~/services/api/shifts.api'
import type { Shift, CreateShiftDto, Staff } from '~/types/shifts'
import ShiftFormDialog from '~/components/shift/ShiftFormDialog.vue'
import StatPane from '~/components/common/StatPane.vue'
import { Badge } from '~/components/ui/badge'
import ShiftCalendarControls from '~/components/shift/ShiftCalendarControls.vue'
import ShiftFilterBar from '~/components/shift/ShiftFilterBar.vue'
import ShiftCalendarGrid from '~/components/shift/ShiftCalendarGrid.vue'

const { hasPermission, PERMISSIONS } = usePermissions()
const { useShiftsCalendar, useShiftStats, createShiftMutation, useStaffList } = useShifts()

definePageMeta({
    requiresPermission: 'shift.overview.view'
})

const currentDate = ref(new Date())
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const showCreateModal = ref(false)

const staffQuery = useStaffList({ isActive: true })

const staffMembers = computed<Staff[]>(() => staffQuery.data.value?.results || [])

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

const filtersModel = computed({
    get: () => currentQuery.value,
    set: (newFilters: any) => {
        Object.entries(newFilters).forEach(([key, value]) => {
            setFilter(key, value as string)
        })
    }
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

const shiftsQuery = useShiftsCalendar(queryParams)
const statsQuery = useShiftStats()

const shiftsData = computed(() => shiftsQuery.data.value || [])
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

        const dayShifts = (shiftsData.value as Shift[]).filter((shift: Shift) => {
            const shiftDate = new Date(shift.startTime)
            shiftDate.setHours(0, 0, 0, 0)
            return shiftDate.getTime() === dateObj.getTime()
        })

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
