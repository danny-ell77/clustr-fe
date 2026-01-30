<template>
    <Card>
        <CardHeader>
            <CardTitle>Shift Attendance Report</CardTitle>
            <p class="text-sm text-muted-foreground">
                Showing {{ shifts.length }} shifts
            </p>
        </CardHeader>
        <CardContent>
            <div v-if="shifts.length === 0" class="text-center py-8">
                <EmptyState title="No shifts found" description="No shifts match the selected filters" />
            </div>

            <div v-else class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="border-b">
                            <th class="text-left p-3 text-sm font-medium">Date</th>
                            <th class="text-left p-3 text-sm font-medium">Shift</th>
                            <th class="text-left p-3 text-sm font-medium">Type</th>
                            <th class="text-left p-3 text-sm font-medium">Staff</th>
                            <th class="text-left p-3 text-sm font-medium">Status</th>
                            <th class="text-left p-3 text-sm font-medium">Duration</th>
                            <th class="text-left p-3 text-sm font-medium">Overtime</th>
                            <th class="text-left p-3 text-sm font-medium">Late/Early</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="shift in shifts" :key="shift.id" class="border-b hover:bg-muted/50 cursor-pointer"
                            @click="$emit('view', shift)">
                            <td class="p-3 text-sm">{{ formatDate(shift.startTime) }}</td>
                            <td class="p-3 text-sm font-medium">{{ shift.title }}</td>
                            <td class="p-3 text-sm">{{ shift.shiftTypeDisplay }}</td>
                            <td class="p-3 text-sm">{{ shift.assignedStaffDetails?.name || '-' }}</td>
                            <td class="p-3 text-sm">
                                <StatusBadge :status="shift.status" :label="shift.statusDisplay" />
                            </td>
                            <td class="p-3 text-sm">
                                {{ shift.attendance?.actualWorkDurationHours || shift.durationHours }}h
                            </td>
                            <td class="p-3 text-sm">
                                <span v-if="shift.attendance?.overtimeHoursDecimal"
                                    :class="shift.attendance.overtimeHoursDecimal > 0 ? 'text-orange-600 font-medium' : ''">
                                    {{ shift.attendance.overtimeHoursDecimal }}h
                                </span>
                                <span v-else>-</span>
                            </td>
                            <td class="p-3 text-sm">
                                <div v-if="shift.attendance" class="space-y-1">
                                    <div v-if="shift.attendance.lateArrivalMinutes > 0"
                                        class="text-xs text-orange-600">
                                        Late: {{ shift.attendance.lateArrivalMinutes }}m
                                    </div>
                                    <div v-if="shift.attendance.earlyDepartureMinutes > 0"
                                        class="text-xs text-orange-600">
                                        Early: {{ shift.attendance.earlyDepartureMinutes }}m
                                    </div>
                                    <span v-if="shift.attendance.lateArrivalMinutes === 0 && shift.attendance.earlyDepartureMinutes === 0">
                                        -
                                    </span>
                                </div>
                                <span v-else>-</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import EmptyState from '~/components/common/EmptyState.vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import type { Shift } from '~/types/shifts'

interface Props {
    shifts: Shift[]
}

defineProps<Props>()

defineEmits<{
    view: [shift: Shift]
}>()

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}
</script>
