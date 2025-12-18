<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <Button variant="ghost" @click="$router.back()">
                    <Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h1 class="text-3xl font-semibold">{{ shift?.title }}</h1>
                    <p class="text-muted-foreground">Shift Details</p>
                </div>
            </div>

            <div class="flex items-center gap-2">
                <Button v-if="shift?.status === 'SCHEDULED'" @click="showClockInDialog = true" variant="outline">
                    <Icon name="lucide:clock" class="w-4 h-4 mr-2" />
                    Clock In
                </Button>

                <Button v-if="shift?.status === 'IN_PROGRESS'" @click="showClockOutDialog = true" variant="outline">
                    <Icon name="lucide:clock" class="w-4 h-4 mr-2" />
                    Clock Out
                </Button>

                <Button v-if="shift?.status === 'SCHEDULED'" @click="handleCancel" variant="destructive"
                    :disabled="cancelShiftMutation.isPending.value">
                    <Icon name="lucide:x-circle" class="w-4 h-4 mr-2" />
                    {{ cancelShiftMutation.isPending.value ? 'Cancelling...' : 'Cancel Shift' }}
                </Button>
            </div>
        </div>

        <div v-if="shiftQuery.isLoading.value" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <div v-else-if="shiftQuery.isError.value" class="text-center py-12">
            <p class="text-destructive">Failed to load shift details</p>
            <Button @click="() => shiftQuery.refetch()" class="mt-4">Retry</Button>
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
                                <Label class="text-muted-foreground text-sm">Shift Type</Label>
                                <p class="font-medium">{{ shift.shiftTypeDisplay }}</p>
                            </div>

                            <div>
                                <Label class="text-muted-foreground text-sm">Status</Label>
                                <div class="mt-1">
                                    <StatusBadge :status="shift.status" :label="shift.statusDisplay" />
                                </div>
                            </div>

                            <div>
                                <Label class="text-muted-foreground text-sm">Start Time</Label>
                                <p class="font-medium">{{ formatDateTime(shift.startTime) }}</p>
                            </div>

                            <div>
                                <Label class="text-muted-foreground text-sm">End Time</Label>
                                <p class="font-medium">{{ formatDateTime(shift.endTime) }}</p>
                            </div>

                            <div>
                                <Label class="text-muted-foreground text-sm">Duration</Label>
                                <p class="font-medium">{{ shift.durationHours }} hours</p>
                            </div>

                            <div v-if="shift.location">
                                <Label class="text-muted-foreground text-sm">Location</Label>
                                <p class="font-medium">{{ shift.location }}</p>
                            </div>
                        </div>

                        <div v-if="shift.responsibilities">
                            <Label class="text-muted-foreground text-sm">Responsibilities</Label>
                            <p class="mt-1 text-sm">{{ shift.responsibilities }}</p>
                        </div>

                        <div v-if="shift.notes">
                            <Label class="text-muted-foreground text-sm">Notes</Label>
                            <p class="mt-1 text-sm">{{ shift.notes }}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card v-if="shift.attendance">
                    <CardHeader>
                        <CardTitle>Attendance Details</CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div v-if="shift.attendance.clockInTime">
                                <Label class="text-muted-foreground text-sm">Clock In Time</Label>
                                <p class="font-medium">{{ formatDateTime(shift.attendance.clockInTime) }}</p>
                            </div>

                            <div v-if="shift.attendance.clockOutTime">
                                <Label class="text-muted-foreground text-sm">Clock Out Time</Label>
                                <p class="font-medium">{{ formatDateTime(shift.attendance.clockOutTime) }}</p>
                            </div>

                            <div v-if="shift.attendance.actualWorkDurationHours">
                                <Label class="text-muted-foreground text-sm">Actual Work Duration</Label>
                                <p class="font-medium">{{ shift.attendance.actualWorkDurationHours }} hours</p>
                            </div>

                            <div v-if="shift.attendance.overtimeHours">
                                <Label class="text-muted-foreground text-sm">Overtime</Label>
                                <p class="font-medium">{{ shift.attendance.overtimeHours }}</p>
                            </div>

                            <div v-if="shift.attendance.lateArrivalMinutes > 0">
                                <Label class="text-muted-foreground text-sm">Late Arrival</Label>
                                <p class="font-medium text-orange-600">{{ shift.attendance.lateArrivalMinutes }} minutes
                                </p>
                            </div>

                            <div v-if="shift.attendance.earlyDepartureMinutes > 0">
                                <Label class="text-muted-foreground text-sm">Early Departure</Label>
                                <p class="font-medium text-orange-600">{{ shift.attendance.earlyDepartureMinutes }}
                                    minutes</p>
                            </div>
                        </div>

                        <div v-if="shift.attendance.attendanceNotes">
                            <Label class="text-muted-foreground text-sm">Attendance Notes</Label>
                            <p class="mt-1 text-sm">{{ shift.attendance.attendanceNotes }}</p>
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

                <Card v-if="shift.isRecurring">
                    <CardHeader>
                        <CardTitle>Recurrence</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-2">
                            <div class="flex items-center gap-2">
                                <Icon name="lucide:repeat" class="w-4 h-4 text-muted-foreground" />
                                <span class="text-sm">{{ shift.recurrencePattern }}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

        <ClockInOutDialog v-model:open="showClockInDialog" :shift="shift" action="in" @submit="handleClockIn" />
        <ClockInOutDialog v-model:open="showClockOutDialog" :shift="shift" action="out" @submit="handleClockOut" />
    </div>
</template>

<script setup lang="ts">
import { useShifts } from '~/composables/shift/useShifts'
import type { ClockInOutDto } from '~/types/shifts'
import ClockInOutDialog from '~/components/shift/ClockInOutDialog.vue'
import StatusBadge from '~/components/common/StatusBadge.vue'

const route = useRoute()
const router = useRouter()

definePageMeta({
    requiresPermission: 'shift.overview.view'
})

const shiftId = computed(() => route.params.id as string)
const showClockInDialog = ref(false)
const showClockOutDialog = ref(false)

const { useShift, clockInMutation, clockOutMutation, cancelShiftMutation } = useShifts()

const shiftQuery = useShift(shiftId)
const shift = computed(() => shiftQuery.data.value)

const handleClockIn = async (data: ClockInOutDto) => {
    await clockInMutation.mutateAsync({ id: shiftId.value, data })
    showClockInDialog.value = false
}

const handleClockOut = async (data: ClockInOutDto) => {
    await clockOutMutation.mutateAsync({ id: shiftId.value, data })
    showClockOutDialog.value = false
}

const handleCancel = async () => {
    if (confirm('Are you sure you want to cancel this shift?')) {
        await cancelShiftMutation.mutateAsync(shiftId.value)
        router.push('/shift')
    }
}

const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    })
}
</script>
