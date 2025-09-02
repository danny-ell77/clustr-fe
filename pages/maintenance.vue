<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Maintenance</h1>
                <p class="text-gray-600 mt-1">Manage property maintenance requests and schedules</p>
            </div>
            <Button @click="showAddForm = true" class="bg-blue-600 hover:bg-blue-700">
                <Icon name="plus" class="w-4 h-4 mr-2" />
                Add Maintenance
            </Button>
        </div>

        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-2 bg-blue-100 rounded-lg">
                        <Icon name="calendar" class="w-6 h-6 text-blue-600" />
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Scheduled</p>
                        <p class="text-2xl font-bold text-gray-900">{{ kpis.scheduled }}</p>
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
                        <p class="text-2xl font-bold text-gray-900">{{ kpis.inProgress }}</p>
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
                        <p class="text-2xl font-bold text-gray-900">{{ kpis.completed }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-2 bg-red-100 rounded-lg">
                        <Icon name="alert-triangle" class="w-6 h-6 text-red-600" />
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Overdue</p>
                        <p class="text-2xl font-bold text-gray-900">{{ kpis.overdue }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Chart Section -->
        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-lg font-semibold text-gray-900">Maintenance Requests</h2>
                <div class="flex gap-2">
                    <Button variant="outline" size="sm" :class="chartFilter === 'completed' ? 'bg-blue-50' : ''"
                        @click="chartFilter = 'completed'">
                        Completed
                    </Button>
                    <Button variant="outline" size="sm" :class="chartFilter === 'inProgress' ? 'bg-blue-50' : ''"
                        @click="chartFilter = 'inProgress'">
                        In Progress
                    </Button>
                    <Button variant="outline" size="sm" :class="chartFilter === 'pending' ? 'bg-blue-50' : ''"
                        @click="chartFilter = 'pending'">
                        Pending
                    </Button>
                </div>
            </div>
            <MaintenanceChart :data="chartData" :filter="chartFilter" />
        </div>

        <!-- Data Table -->
        <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 class="text-lg font-semibold text-gray-900">Recent Maintenance</h2>
                <div class="flex gap-3">
                    <Input v-model="searchQuery" placeholder="Search..." class="w-64" />
                    <Select v-model="statusFilter">
                        <SelectTrigger class="w-40">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Status</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <MaintenanceTable :items="filteredItems" @edit="editItem" @delete="deleteItem" />
        </div>

        <!-- Add Maintenance Dialog -->
        <Dialog :open="showAddForm" @update:open="showAddForm = $event">
            <DialogContent class="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add Maintenance Request</DialogTitle>
                </DialogHeader>
                <AddMaintenanceForm @submit="handleSubmit" @cancel="showAddForm = false" />
            </DialogContent>
        </Dialog>

        <!-- Success Dialog -->
        <SuccessDialog :show="showSuccess" title="Maintenance Added Successfully"
            message="The maintenance request has been created and assigned." @close="showSuccess = false" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import Icon from '~/components/Icon.vue'
import AddMaintenanceForm from '~/components/property/AddMaintenanceForm.vue'
import MaintenanceChart from '~/components/property/MaintenanceChart.vue'
import MaintenanceTable from '~/components/property/MaintenanceTable.vue'
import SuccessDialog from '~/components/SuccessDialog.vue'

definePageMeta({
    title: 'Maintenance',
    description: 'Property maintenance management'
})

const showAddForm = ref(false)
const showSuccess = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const chartFilter = ref('completed')

// Mock data
const maintenanceItems = ref([
    { id: '1', title: 'HVAC System Check', description: 'Annual HVAC maintenance and filter replacement', priority: 'high', assignee: 'John Doe', dueDate: '2024-12-15', status: 'scheduled', recurrence: 'recurring', createdAt: '2024-11-01' },
    { id: '2', title: 'Plumbing Repair', description: 'Fix leaky faucet in unit 204', priority: 'medium', assignee: 'Jane Smith', dueDate: '2024-12-10', status: 'in-progress', recurrence: 'one_time', createdAt: '2024-11-05' },
    { id: '3', title: 'Elevator Inspection', description: 'Monthly elevator safety inspection', priority: 'high', assignee: 'Mike Johnson', dueDate: '2024-11-30', status: 'completed', recurrence: 'recurring', createdAt: '2024-10-15' },
    { id: '4', title: 'Roof Cleaning', description: 'Clean gutters and check for damage', priority: 'low', assignee: 'Sarah Wilson', dueDate: '2024-11-25', status: 'overdue', recurrence: 'one_time', createdAt: '2024-10-20' },
    { id: '5', title: 'Fire Safety Check', description: 'Test fire alarms and extinguishers', priority: 'high', assignee: 'Tom Brown', dueDate: '2024-12-20', status: 'scheduled', recurrence: 'recurring', createdAt: '2024-11-10' }
])

const kpis = computed(() => ({
    scheduled: maintenanceItems.value.filter(item => item.status === 'scheduled').length,
    inProgress: maintenanceItems.value.filter(item => item.status === 'in-progress').length,
    completed: maintenanceItems.value.filter(item => item.status === 'completed').length,
    overdue: maintenanceItems.value.filter(item => item.status === 'overdue').length
}))

const chartData = computed(() => {
    // Mock chart data for 12 months
    return [
        { month: 'Jan', completed: 23, inProgress: 15, pending: 8 },
        { month: 'Feb', completed: 19, inProgress: 12, pending: 6 },
        { month: 'Mar', completed: 25, inProgress: 18, pending: 10 },
        { month: 'Apr', completed: 21, inProgress: 14, pending: 7 },
        { month: 'May', completed: 28, inProgress: 20, pending: 12 },
        { month: 'Jun', completed: 24, inProgress: 16, pending: 9 },
        { month: 'Jul', completed: 30, inProgress: 22, pending: 14 },
        { month: 'Aug', completed: 26, inProgress: 18, pending: 11 },
        { month: 'Sep', completed: 32, inProgress: 24, pending: 16 },
        { month: 'Oct', completed: 29, inProgress: 21, pending: 13 },
        { month: 'Nov', completed: 27, inProgress: 19, pending: 15 },
        { month: 'Dec', completed: 31, inProgress: 23, pending: 17 }
    ]
})

const filteredItems = computed(() => {
    let items = maintenanceItems.value

    if (searchQuery.value) {
        items = items.filter(item =>
            item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            item.assignee.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    }

    if (statusFilter.value) {
        items = items.filter(item => item.status === statusFilter.value)
    }

    return items
})

const handleSubmit = (item) => {
    maintenanceItems.value.push(item)
    showAddForm.value = false
    showSuccess.value = true
}

const editItem = (item) => {
    console.log('Edit item:', item)
    // TODO: Implement edit functionality
}

const deleteItem = (item) => {
    const index = maintenanceItems.value.findIndex(i => i.id === item.id)
    if (index > -1) {
        maintenanceItems.value.splice(index, 1)
    }
}
</script>