<template>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
</template>

<script setup lang="ts">
import Icon from '~/components/Icon.vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import type { Shift } from '~/types/shifts'

/**
 * Shift detail content component for displaying shift information.
 */

defineProps<{
    shift: Shift
}>()

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
