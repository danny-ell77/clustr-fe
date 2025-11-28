<template>
    <div class="shifts-calendar">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-2xl">Shifts Calendar</h1>
                <p class="text-muted-foreground">View and manage staff shifts</p>
            </div>

            <div class="flex items-center space-x-2">
                <Button variant="outline" @click="previousMonth">
                    <Icon name="chevron-left" class="w-4 h-4" />
                </Button>
                <div class="px-4 py-2 font-medium">
                    {{ currentMonthYear }}
                </div>
                <Button variant="outline" @click="nextMonth">
                    <Icon name="chevron-right" class="w-4 h-4" />
                </Button>
                <Button v-if="hasPermission(PERMISSIONS.FACILITY_ADMIN.MANAGE_WORK_SHIFT)"
                    @click="showCreateModal = true" class="bg-primary hover:bg-primary/90 ml-4">
                    <Icon name="plus" class="w-4 h-4 mr-2" />
                    Create Shift
                </Button>
            </div>
        </div>

        <Card class="mb-4">
            <CardContent class="pt-6">
                <div class="flex items-center space-x-4">
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
            </CardContent>
        </Card>

        <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <Card v-else>
            <CardContent class="p-0">
                <div class="grid grid-cols-7 border-b">
                    <div v-for="day in weekDays" :key="day"
                        class="p-4 text-center font-semibold text-foreground border-r last:border-r-0">
                        {{ day }}
                    </div>
                </div>

                <div class="grid grid-cols-7">
                    <div v-for="(day, index) in calendarDays" :key="index" :class="[
                        'min-h-[120px] border-r border-b last:border-r-0',
                        !day.isCurrentMonth ? '' : '',
                        day.isToday ? 'bg-primary/10' : ''
                    ]">
                        <div class="p-2">
                            <div :class="[
                                'text-sm font-medium mb-2',
                                !day.isCurrentMonth ? 'text-gray-400' : day.isToday ? 'text-primary' : 'text-foreground'
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

        <Dialog v-model:open="showCreateModal">
            <DialogContent class="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create Shift</DialogTitle>
                    <DialogDescription>
                        Create a new shift for staff
                    </DialogDescription>
                </DialogHeader>

                <form @submit.prevent="handleCreate" class="space-y-4">
                    <div>
                        <Label>Title</Label>
                        <Input v-model="formData.title" required />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Shift Type</Label>
                            <Select v-model="formData.shiftType">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SECURITY">Security</SelectItem>
                                    <SelectItem value="CLEANING">Cleaning</SelectItem>
                                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                    <SelectItem value="RECEPTION">Reception</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Assigned Staff</Label>
                            <Input v-model="formData.assignedStaff" placeholder="Staff ID" />
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Start Time</Label>
                            <Input v-model="formData.startTime" type="datetime-local" required />
                        </div>

                        <div>
                            <Label>End Time</Label>
                            <Input v-model="formData.endTime" type="datetime-local" required />
                        </div>
                    </div>

                    <div>
                        <Label>Location</Label>
                        <Input v-model="formData.location" />
                    </div>

                    <div>
                        <Label>Responsibilities</Label>
                        <textarea v-model="formData.responsibilities" class="w-full min-h-[100px] p-2 border rounded" />
                    </div>

                    <div>
                        <Label>Notes</Label>
                        <textarea v-model="formData.notes" class="w-full min-h-[80px] p-2 border rounded" />
                    </div>

                    <div class="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" @click="showCreateModal = false">
                            Cancel
                        </Button>
                        <Button type="submit" :disabled="createMutation.isPending.value">
                            {{ createMutation.isPending.value ? 'Creating...' : 'Create' }}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { queryKeys } from '~/constants/query-keys'
import { shiftApi } from '~/services/api/shift.api'
import type { Shift } from '~/types/shift'
import { ShiftTypeEnum } from '~/types/shift'

const { hasPermission, PERMISSIONS } = usePermissions()
const queryClient = useQueryClient()
const toast = useToast()

definePageMeta({
    requiresPermission: 'shift.overview.view'
})

const currentDate = ref(new Date())
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

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

const shiftsQuery = useQuery({
    queryKey: computed(() => queryKeys.shifts.list(queryParams.value)),
    queryFn: () => shiftApi.getAll(queryParams.value)
})

const shiftsData = computed(() => shiftsQuery.data.value)
const loading = computed(() => shiftsQuery.isLoading.value)

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

const createMutation = useMutation({
    mutationFn: shiftApi.create,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.shifts.all })
        toast.success('Shift created successfully')
        showCreateModal.value = false
        Object.assign(formData, {
            title: '',
            shiftType: 'SECURITY',
            assignedStaff: '',
            startTime: '',
            endTime: '',
            location: '',
            responsibilities: '',
            notes: ''
        })
    },
    onError: (error: any) => {
        toast.error(error.message || 'Failed to create shift')
    }
})

const showCreateModal = ref(false)

const formData = reactive({
    title: '',
    shiftType: ShiftTypeEnum.SECURITY,
    assignedStaff: '',
    startTime: '',
    endTime: '',
    location: '',
    responsibilities: '',
    notes: ''
})

const handleCreate = () => {
    createMutation.mutate(formData)
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

const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    })
}

const getShiftPillClass = (shift: Shift) => {
    const typeClasses: Record<string, string> = {
        SECURITY: 'bg-primary/15 text-primary border  border-primary/30',
        CLEANING: 'bg-green-100 text-green-800 border border-green-200',
        MAINTENANCE: 'bg-orange-100 text-orange-800 border border-orange-200',
        RECEPTION: 'bg-purple-100 text-purple-800 border border-purple-200',
        GARDENING: 'bg-teal-100 text-teal-800 border border-teal-200',
        OTHER: 'bg-gray-100 text-gray-800 border border-border'
    }

    const statusOverlay = {
        IN_PROGRESS: 'ring-2 ring-purple-400',
        COMPLETED: 'opacity-60',
        CANCELLED: 'opacity-40 line-through',
        NO_SHOW: 'opacity-40 bg-red-50 border-red-200'
    }

    const baseClass = typeClasses[shift.shiftType || 'OTHER'] || typeClasses.OTHER
    const overlay = statusOverlay[shift.status as keyof typeof statusOverlay] || ''

    return `${baseClass} ${overlay}`
}
</script>
