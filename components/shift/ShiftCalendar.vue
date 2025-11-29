<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <Button variant="outline" size="sm" @click="previousWeek">
                    <Icon name="lucide:chevron-left" class="w-4 h-4" />
                </Button>
                <h3 class="text-lg font-semibold">
                    {{ formatDateRange(currentWeekStart, currentWeekEnd) }}
                </h3>
                <Button variant="outline" size="sm" @click="nextWeek">
                    <Icon name="lucide:chevron-right" class="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" @click="goToToday">
                    Today
                </Button>
            </div>

            <div class="flex items-center gap-2">
                <div class="flex items-center gap-2 text-sm">
                    <div class="flex items-center gap-1">
                        <div class="w-3 h-3 rounded bg-blue-500"></div>
                        <span>Scheduled</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <div class="w-3 h-3 rounded bg-yellow-500"></div>
                        <span>In Progress</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <div class="w-3 h-3 rounded bg-green-500"></div>
                        <span>Completed</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="border rounded-lg overflow-hidden">
            <div class="grid grid-cols-8 bg-muted">
                <div class="p-2 text-sm font-medium border-r">Time</div>
                <div v-for="day in weekDays" :key="day.date"
                    class="p-2 text-sm font-medium text-center border-r last:border-r-0">
                    <div>{{ day.dayName }}</div>
                    <div class="text-xs text-muted-foreground">{{ day.dateStr }}</div>
                </div>
            </div>

            <div class="relative">
                <div v-for="hour in hours" :key="hour" class="grid grid-cols-8 border-t" style="min-height: 60px">
                    <div class="p-2 text-xs text-muted-foreground border-r">
                        {{ formatHour(hour) }}
                    </div>
                    <div v-for="day in weekDays" :key="`${day.date}-${hour}`" class="relative border-r last:border-r-0">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button } from '~/components/ui/button'
import type { Shift } from '~/types/shifts'

interface Props {
    shifts: Shift[]
    loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    loading: false
})

const emit = defineEmits<{
    'shift-click': [shift: Shift]
    'cell-click': [date: string, hour: number]
}>()

const currentWeekStart = ref(getStartOfWeek(new Date()))

const hours = Array.from({ length: 24 }, (_, i) => i)

const currentWeekEnd = computed(() => {
    const end = new Date(currentWeekStart.value)
    end.setDate(end.getDate() + 6)
    return end
})

const weekDays = computed(() => {
    const days = []
    for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart.value)
        date.setDate(date.getDate() + i)
        days.push({
            date: date.toISOString().split('T')[0],
            dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
            dateStr: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        })
    }
    return days
})

function getStartOfWeek(date: Date): Date {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    d.setDate(diff)
    d.setHours(0, 0, 0, 0)
    return d
}

function previousWeek() {
    const newDate = new Date(currentWeekStart.value)
    newDate.setDate(newDate.getDate() - 7)
    currentWeekStart.value = newDate
}

function nextWeek() {
    const newDate = new Date(currentWeekStart.value)
    newDate.setDate(newDate.getDate() + 7)
    currentWeekStart.value = newDate
}

function goToToday() {
    currentWeekStart.value = getStartOfWeek(new Date())
}

function formatDateRange(start: Date, end: Date): string {
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    return `${startStr} - ${endStr}`
}

function formatHour(hour: number): string {
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:00 ${period}`
}
</script>
