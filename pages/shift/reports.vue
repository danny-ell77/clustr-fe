<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-semibold">Shift Reports</h1>
                <p class="text-muted-foreground">View attendance reports and shift analytics</p>
            </div>

            <Button @click="handleExport" variant="outline">
                <Icon name="lucide:download" class="w-4 h-4 mr-2" />
                Export Report
            </Button>
        </div>

        <StatPane v-if="!statsQuery.isLoading.value && statistics" :stats="reportStats" />

        <ShiftReportsFilter
            v-model="filters"
            @apply="applyFilters"
            @clear="clearReportFilters"
        />

        <div v-if="shiftsQuery.isLoading.value" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <div v-else-if="shiftsQuery.isError.value" class="text-center py-12">
            <p class="text-destructive">Failed to load shift reports</p>
            <Button @click="() => shiftsQuery.refetch()" class="mt-4">Retry</Button>
        </div>

        <ShiftReportsTable
            v-else
            :shifts="shifts"
            @view="viewShift"
        />
    </div>
</template>

<script setup lang="ts">
import { useShifts } from '~/composables/shift/useShifts'
import type { Shift } from '~/types/shifts'
import StatPane from '~/components/common/StatPane.vue'
import ShiftReportsFilter from '~/components/shift/reports/ShiftReportsFilter.vue'
import ShiftReportsTable from '~/components/shift/reports/ShiftReportsTable.vue'

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
