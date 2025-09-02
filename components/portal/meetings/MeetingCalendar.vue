<template>
  <div class="bg-white rounded-lg border">
    <div class="grid grid-cols-7 text-xs font-medium text-gray-500 border-b">
      <div v-for="d in days" :key="d" class="px-3 py-2">{{ d }}</div>
    </div>
    <div class="grid grid-cols-7 gap-px bg-gray-200">
      <div v-for="cell in cells" :key="cell.key" class="bg-white min-h-[90px] p-2">
        <div class="text-xs text-gray-500">{{ cell.day }}</div>
        <div class="mt-1 space-y-1">
          <div v-for="e in cell.events" :key="e.id" class="text-[10px] rounded px-1 py-0.5 bg-blue-100 text-blue-700 truncate">{{ e.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { Meeting } from '~/types/portal'

const props = defineProps<{ year: number; month: number; events: Meeting[] }>()
const days = ['SUN','MON','TUE','WED','THU','FRI','SAT']

const cells = computed(() => {
  const first = new Date(props.year, props.month - 1, 1)
  const startOffset = first.getDay()
  const lastDay = new Date(props.year, props.month, 0).getDate()
  const total = Math.ceil((startOffset + lastDay) / 7) * 7
  const arr: { key: string; day: string; events: Meeting[] }[] = []
  for (let i = 0; i < total; i++) {
    const dayNum = i - startOffset + 1
    const inMonth = dayNum > 0 && dayNum <= lastDay
    const date = inMonth ? `${props.year}-${String(props.month).padStart(2,'0')}-${String(dayNum).padStart(2,'0')}` : ''
    arr.push({ key: `${i}`, day: inMonth ? String(dayNum) : '', events: inMonth ? props.events.filter(e => e.date === date) : [] })
  }
  return arr
})
</script>
