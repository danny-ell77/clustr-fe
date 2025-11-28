<template>
    <div class="shift-detail">
        <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4">
                <Button variant="ghost" @click="$router.back()">
                    <Icon name="arrow-left" class="w-4 h-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h1 class="text-2xl text-foreground">{{ shift?.title }}</h1>
                    <p class="text-muted-foreground">Shift Details</p>
                </div>
            </div>

            <div class="flex items-center space-x-3">
                <Button v-if="shift?.status === 'SCHEDULED'" @click="handleClockIn" variant="outline"
                    :disabled="clockInMutation.isPending.value">
                    <Icon name="clock" class="w-4 h-4 mr-2" />
                    {{ clockInMutation.isPending.value ? 'Clocking In...' : 'Clock In' }}
                </Button>

                <Button v-if="shift?.status === 'IN_PROGRESS'" @click="handleClockOut" variant="outline"
                    :disabled="clockOutMutation.isPending.value">
                    <Icon name="clock" class="w-4 h-4 mr-2" />
                    {{ clockOutMutation.isPending.value ? 'Clocking Out...' : 'Clock Out' }}
                </Button>

                <Button v-if="shift?.status === 'SCHEDULED'" @click="handleCancel" variant="destructive"
                    :disabled="cancelMutation.isPending.value">
                    <Icon name="x-circle" class="w-4 h-4 mr-2" />
                    {{ cancelMutation.isPending.value ? 'Cancelling...' : 'Cancel Shift' }}
                </Button>
            </div>
        </div>

        <div v-if="isLoading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <div v-else-if="isError" class="text-center py-12">
            <p class="text-red-600">Failed to load shift details</p>
            <Button @click="() => refetch()" class="mt-4">Retry</Button>
        </div>

        <div v-else-if="shift" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Shift Information</CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <Label class="text-muted-foreground">Shift Type</Label>
                                <p class="font-medium">{{ shift.shiftTypeDisplay }}</p>
                            </div>

                            <div>
                                <Label class="text-muted-foreground">Status</Label>
                                <span :class="getStatusClass(shift.status)"
                                    class="px-2 py-1 rounded text-xs font-medium">
                                    {{ shift.statusDisplay }}
                                </span>
                            </div>

                            <div>
                                <Label class="text-muted-foreground">Start Time</Label>
                                <p class="font-medium">{{ formatDateTime(shift.startTime) }}</p>
                            </div>

                            <div>
                                <Label class="text-muted-foreground">End Time</Label>
                                <p class="font-medium">{{ formatDateTime(shift.endTime) }}</p>
                            </div>

                            <div>
                                <Label class="text-muted-foreground">Duration</Label>
                                <p class="font-medium">{{ shift.durationHours }} hours</p>
                            </div>

                            <div v-if="shift.location">
                                <Label class="text-muted-foreground">Location</Label>
                                <p class="font-medium">{{ shift.location }}</p>
                            </div>
                        </div>

                        <div v-if="shift.responsibilities">
                            <Label class="text-muted-foreground">Responsibilities</Label>
                            <p class="mt-1">{{ shift.responsibilities }}</p>
                        </div>

                        <div v-if="shift.notes">
                            <Label class="text-muted-foreground">Notes</Label>
                            <p class="mt-1">{{ shift.notes }}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div class="space-y-6">
                <Card v-if="shift.assignedStaffDetails">
                    <CardHeader>
                        <CardTitle>Assigned Staff</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-2">
                            <p class="font-medium">{{ shift.assignedStaffDetails.name }}</p>
                            <p class="text-sm text-muted-foreground">{{ shift.assignedStaffDetails.emailAddress }}</p>
                            <p class="text-sm text-muted-foreground">{{ shift.assignedStaffDetails.phoneNumber }}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { shiftApi } from '~/services/api/shift.api'

const route = useRoute()
const router = useRouter()
const queryClient = useQueryClient()
const toast = useToast()

definePageMeta({
    requiresPermission: 'shift.overview.view'
})

const shiftId = computed(() => route.params.id as string)

const { data: shift, isLoading, isError, refetch } = useQuery({
    queryKey: computed(() => queryKeys.shifts.detail(shiftId.value)),
    queryFn: () => shiftApi.getById(shiftId.value)
})

const clockInMutation = useMutation({
    mutationFn: () => shiftApi.clockIn(shiftId.value),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.shifts.detail(shiftId.value) })
        queryClient.invalidateQueries({ queryKey: queryKeys.shifts.all })
        toast.success('Clocked in successfully')
    },
    onError: (error: any) => {
        toast.error(error.message || 'Failed to clock in')
    }
})

const clockOutMutation = useMutation({
    mutationFn: () => shiftApi.clockOut(shiftId.value),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.shifts.detail(shiftId.value) })
        queryClient.invalidateQueries({ queryKey: queryKeys.shifts.all })
        toast.success('Clocked out successfully')
    },
    onError: (error: any) => {
        toast.error(error.message || 'Failed to clock out')
    }
})

const cancelMutation = useMutation({
    mutationFn: () => shiftApi.cancel(shiftId.value),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.shifts.detail(shiftId.value) })
        queryClient.invalidateQueries({ queryKey: queryKeys.shifts.all })
        toast.success('Shift cancelled successfully')
        router.push('/shift')
    },
    onError: (error: any) => {
        toast.error(error.message || 'Failed to cancel shift')
    }
})

const handleClockIn = () => {
    if (confirm('Clock in for this shift?')) {
        clockInMutation.mutate()
    }
}

const handleClockOut = () => {
    if (confirm('Clock out from this shift?')) {
        clockOutMutation.mutate()
    }
}

const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this shift?')) {
        cancelMutation.mutate()
    }
}

const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
}

const getStatusClass = (status: string) => {
    const classes = {
        SCHEDULED: 'bg-primary/15 text-primary',
        IN_PROGRESS: 'bg-purple-100 text-purple-800',
        COMPLETED: 'bg-green-100 text-green-800',
        CANCELLED: 'bg-gray-100 text-gray-800',
        NO_SHOW: 'bg-red-100 text-red-800'
    }
    return classes[status as keyof typeof classes] || classes.SCHEDULED
}
</script>
