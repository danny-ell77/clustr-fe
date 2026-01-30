<template>
    <Card>
        <CardContent class="p-0">
            <div class="grid grid-cols-7 border-b bg-muted/30">
                <div v-for="day in weekDays" :key="day"
                    class="p-4 text-center font-semibold text-sm border-r last:border-r-0">
                    {{ day }}
                </div>
            </div>

            <div class="grid grid-cols-7">
                <div v-for="(day, index) in calendarDays" :key="index" :class="[
                    'min-h-[140px] border-r border-b last:border-r-0 flex flex-col',
                    day.isToday ? 'bg-primary/5' : '',
                    !day.isCurrentMonth ? 'bg-muted/10' : ''
                ]">
                    <div class="p-2 flex-1">
                        <div :class="[
                            'text-sm font-medium mb-2',
                            !day.isCurrentMonth ? 'text-muted-foreground' : day.isToday ? 'text-primary font-bold' : 'text-foreground/70'
                        ]">
                            {{ day.date }}
                        </div>

                        <div class="space-y-1">
                            <!-- Show first 3 shifts -->
                            <div v-for="shift in day.shifts.slice(0, 3)" :key="shift.id + shift.startTime"
                                @click="$emit('view', shift)" :class="[
                                    'text-[10px] p-1.5 rounded-sm cursor-pointer hover:shadow-sm transition-all border leading-tight',
                                    getShiftPillClass(shift)
                                ]">
                                <div class="font-bold truncate">{{ shift.assignedStaffDetails?.name || 'Unassigned' }}</div>
                                <div class="opacity-80 truncate">{{ formatTime(shift.startTime) }}</div>
                            </div>

                            <!-- Handle more than 3 shifts -->
                            <div v-if="day.shifts.length > 3">
                                <Popover>
                                    <PopoverTrigger as-child>
                                        <button
                                            class="w-full text-[10px] py-1 font-medium text-primary hover:bg-primary/10 rounded-sm transition-colors">
                                            +{{ day.shifts.length - 3 }} more
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent class="w-64 p-2 shadow-xl" align="start">
                                        <div class="text-xs font-bold mb-3 px-2 border-b pb-2 flex justify-between">
                                            <span>Shifts on {{ day.dateObj.toLocaleDateString() }}</span>
                                            <Badge variant="outline" class="text-[10px]">{{ day.shifts.length }}</Badge>
                                        </div>
                                        <div class="space-y-1 max-h-60 overflow-y-auto pr-1">
                                            <div v-for="shift in day.shifts" :key="'popover-' + shift.id + shift.startTime"
                                                @click="$emit('view', shift)" :class="[
                                                    'text-[10px] p-2 rounded-sm cursor-pointer hover:opacity-80 transition-opacity border',
                                                    getShiftPillClass(shift)
                                                ]">
                                                <div class="flex justify-between items-start mb-0.5">
                                                    <span class="font-bold">{{ shift.title }}</span>
                                                    <span class="opacity-80 font-mono">{{ formatTime(shift.startTime) }}</span>
                                                </div>
                                                <div class="flex justify-between items-center text-[9px] opacity-75">
                                                    <span>{{ shift.assignedStaffDetails?.name || 'Unassigned' }}</span>
                                                    <span>{{ shift.shiftTypeDisplay }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <!-- Empty state for the day -->
                            <div v-if="day.shifts.length === 0 && day.isCurrentMonth"
                                class="h-12 flex items-center justify-center opacity-10 grayscale">
                                <Icon name="calendar" class="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent } from '~/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Badge } from '~/components/ui/badge'
import Icon from '~/components/Icon.vue'
import type { Shift } from '~/types/shifts'

interface CalendarDay {
    date: number
    dateObj: Date
    isCurrentMonth: boolean
    isToday: boolean
    shifts: Shift[]
}

defineProps<{
    weekDays: string[]
    calendarDays: CalendarDay[]
}>()

defineEmits<{
    view: [shift: Shift]
}>()

const formatTime = (time: string) => {
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const getShiftPillClass = (shift: Shift) => {
    const statusColors: Record<string, string> = {
        SCHEDULED: 'bg-blue-50 text-blue-700 border-blue-200',
        IN_PROGRESS: 'bg-amber-50 text-amber-700 border-amber-200',
        COMPLETED: 'bg-green-50 text-green-700 border-green-200',
        CANCELLED: 'bg-red-50 text-red-700 border-red-200'
    }
    return statusColors[shift.status] || 'bg-gray-50 text-gray-700 border-gray-200'
}
</script>
