<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Reports</h1>
                <p class="text-gray-600 mt-1">View and analyze property data and metrics</p>
            </div>
            <Button @click="exportReports" class="bg-blue-600 hover:bg-blue-700">
                <Icon name="download" class="w-4 h-4 mr-2" />
                Export Reports
            </Button>
        </div>

        <!-- Analytics Dashboard -->
        <ReportsChart :reports="reports" />

        <!-- Filter Controls -->
        <div class="bg-white rounded-lg shadow p-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <Label for="reportType">Report Type</Label>
                    <Select v-model="filters.type">
                        <SelectTrigger>
                            <SelectValue placeholder="All Reports" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Reports</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="financial">Financial</SelectItem>
                            <SelectItem value="occupancy">Occupancy</SelectItem>
                            <SelectItem value="energy">Energy Usage</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label for="dateFrom">Date From</Label>
                    <Input id="dateFrom" type="date" v-model="filters.dateFrom" />
                </div>
                <div>
                    <Label for="dateTo">Date To</Label>
                    <Input id="dateTo" type="date" v-model="filters.dateTo" />
                </div>
                <div>
                    <Label for="status">Status</Label>
                    <Select v-model="filters.status">
                        <SelectTrigger>
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Status</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>

        <!-- Reports Table -->
        <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 class="text-lg font-semibold text-gray-900">Report Details</h2>
                <div class="flex gap-3">
                    <Input v-model="searchQuery" placeholder="Search reports..." class="w-64" />
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Report ID
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date Created
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="report in filteredReports" :key="report.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">{{ report.id }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <Badge :variant="getTypeVariant(report.type)" class="capitalize">
                                    {{ report.type }}
                                </Badge>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm text-gray-900 max-w-xs truncate" :title="report.description">
                                    {{ report.description }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">{{ formatDate(report.dateCreated) }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <Badge :variant="getStatusVariant(report.status)" class="capitalize">
                                    {{ report.status.replace('-', ' ') }}
                                </Badge>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex justify-end gap-2">
                                    <Button variant="ghost" size="sm" @click="viewReport(report)">
                                        <Icon name="eye" class="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" @click="downloadReport(report)">
                                        <Icon name="download" class="w-4 h-4" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Empty state -->
            <div v-if="filteredReports.length === 0" class="text-center py-12">
                <Icon name="file-text" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 class="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                <p class="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Badge } from '~/components/ui/badge'
import Icon from '~/components/Icon.vue'
import ReportsChart from '~/components/reports/ReportsChart.vue'

definePageMeta({
    title: 'Reports',
    description: 'Property reports and analytics'
})

const searchQuery = ref('')
const filters = ref({
    type: '',
    dateFrom: '',
    dateTo: '',
    status: ''
})

// Mock reports data
const reports = ref([
    { id: 'RPT-001', type: 'maintenance', description: 'Monthly maintenance summary report', dateCreated: '2024-12-01', status: 'completed' },
    { id: 'RPT-002', type: 'financial', description: 'Q4 financial performance analysis', dateCreated: '2024-11-28', status: 'completed' },
    { id: 'RPT-003', type: 'occupancy', description: 'Occupancy rates and trends report', dateCreated: '2024-11-25', status: 'pending' },
    { id: 'RPT-004', type: 'energy', description: 'Energy consumption analysis', dateCreated: '2024-11-20', status: 'in-progress' },
    { id: 'RPT-005', type: 'maintenance', description: 'Equipment lifecycle report', dateCreated: '2024-11-15', status: 'completed' },
    { id: 'RPT-006', type: 'financial', description: 'Budget vs actual spending report', dateCreated: '2024-11-10', status: 'completed' },
    { id: 'RPT-007', type: 'occupancy', description: 'Tenant satisfaction survey results', dateCreated: '2024-11-05', status: 'pending' },
    { id: 'RPT-008', type: 'energy', description: 'Utility cost breakdown analysis', dateCreated: '2024-10-30', status: 'completed' }
])

const filteredReports = computed(() => {
    let filtered = reports.value

    if (searchQuery.value) {
        filtered = filtered.filter(report =>
            report.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            report.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            report.type.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    }

    if (filters.value.type) {
        filtered = filtered.filter(report => report.type === filters.value.type)
    }

    if (filters.value.status) {
        filtered = filtered.filter(report => report.status === filters.value.status)
    }

    if (filters.value.dateFrom) {
        filtered = filtered.filter(report => report.dateCreated >= filters.value.dateFrom)
    }

    if (filters.value.dateTo) {
        filtered = filtered.filter(report => report.dateCreated <= filters.value.dateTo)
    }

    return filtered
})

const getTypeVariant = (type) => {
    switch (type) {
        case 'maintenance': return 'default'
        case 'financial': return 'secondary'
        case 'occupancy': return 'outline'
        case 'energy': return 'destructive'
        default: return 'secondary'
    }
}

const getStatusVariant = (status) => {
    switch (status) {
        case 'completed': return 'default'
        case 'in-progress': return 'secondary'
        case 'pending': return 'outline'
        default: return 'secondary'
    }
}

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const viewReport = (report) => {
    console.log('View report:', report)
    // TODO: Implement report viewing
}

const downloadReport = (report) => {
    console.log('Download report:', report)
    // TODO: Implement report download
}

const exportReports = () => {
    console.log('Export all reports')
    // TODO: Implement bulk export
}
</script>