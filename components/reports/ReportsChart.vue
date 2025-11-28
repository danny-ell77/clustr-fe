<template>
    <div class="space-y-6">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-2 bg-primary/15 rounded-lg">
                        <Icon name="file-text" class="w-6 h-6 text-primary" />
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Total Reports</p>
                        <p class="text-2xl text-gray-900">{{ totalReports }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-2 bg-green-100 rounded-lg">
                        <Icon name="check-circle" class="w-6 h-6 text-green-600" />
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Completed</p>
                        <p class="text-2xl text-gray-900">{{ completedReports }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-2 bg-yellow-100 rounded-lg">
                        <Icon name="clock" class="w-6 h-6 text-yellow-600" />
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">In Progress</p>
                        <p class="text-2xl text-gray-900">{{ inProgressReports }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-2 bg-red-100 rounded-lg">
                        <Icon name="alert-circle" class="w-6 h-6 text-red-600" />
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Pending</p>
                        <p class="text-2xl text-gray-900">{{ pendingReports }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Reports by Type Chart -->
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Reports by Type</h3>
                <div class="h-64 flex items-end justify-between px-4 border-b border-l border-gray-200">
                    <div v-for="(item, index) in reportsByType" :key="index"
                        class="flex flex-col items-center gap-2 flex-1">
                        <div class="relative flex flex-col items-center w-full max-w-16">
                            <div class="w-12 rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer"
                                :class="getTypeColor(item.type)"
                                :style="{ height: `${(item.count / maxTypeCount) * 200}px` }"
                                :title="`${item.type}: ${item.count} reports`"></div>
                        </div>
                        <span class="text-xs text-gray-600 mt-2 capitalize">{{ item.type }}</span>
                    </div>
                </div>
            </div>

            <!-- Monthly Trends Chart -->
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Monthly Report Trends</h3>
                <div class="h-64 flex items-end justify-between px-4 border-b border-l border-gray-200">
                    <div v-for="(item, index) in monthlyTrends" :key="index"
                        class="flex flex-col items-center gap-2 flex-1">
                        <div class="relative flex flex-col items-center w-full max-w-12">
                            <div class="w-8 bg-primary/100 rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer"
                                :style="{ height: `${(item.count / maxMonthlyCount) * 200}px` }"
                                :title="`${item.month}: ${item.count} reports`"></div>
                        </div>
                        <span class="text-xs text-gray-600 mt-2">{{ item.month }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import Icon from '~/components/Icon.vue'

const props = defineProps({
    reports: {
        type: Array,
        required: true
    }
})

const totalReports = computed(() => props.reports.length)
const completedReports = computed(() => props.reports.filter(r => r.status === 'completed').length)
const inProgressReports = computed(() => props.reports.filter(r => r.status === 'in_progress').length)
const pendingReports = computed(() => props.reports.filter(r => r.status === 'pending').length)

const reportsByType = computed(() => {
    const types = {}
    props.reports.forEach(report => {
        types[report.type] = (types[report.type] || 0) + 1
    })
    return Object.entries(types).map(([type, count]) => ({ type, count }))
})

const maxTypeCount = computed(() => {
    return Math.max(...reportsByType.value.map(item => item.count))
})

const monthlyTrends = computed(() => {
    const months = {}
    props.reports.forEach(report => {
        const month = new Date(report.dateCreated).toLocaleDateString('en-US', { month: 'short' })
        months[month] = (months[month] || 0) + 1
    })
    return Object.entries(months).map(([month, count]) => ({ month, count }))
})

const maxMonthlyCount = computed(() => {
    return Math.max(...monthlyTrends.value.map(item => item.count))
})

const getTypeColor = (type) => {
    switch (type) {
        case 'maintenance': return 'bg-primary/100'
        case 'financial': return 'bg-green-500'
        case 'occupancy': return 'bg-yellow-500'
        case 'energy': return 'bg-red-500'
        default: return 'bg-gray-500'
    }
}
</script>