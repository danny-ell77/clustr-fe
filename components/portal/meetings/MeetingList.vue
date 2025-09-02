<template>
  <div class="bg-white rounded-lg border p-3">
    <h3 class="font-semibold mb-2">Upcoming</h3>
    <ul class="space-y-1 text-sm">
      <li v-for="e in upcoming" :key="e.id" class="flex justify-between">
        <span>{{ e.title }}</span>
        <span class="text-gray-500">{{ e.date }} {{ e.start }}</span>
      </li>
      <li v-if="!upcoming.length" class="text-gray-500">No events</li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { Meeting } from '~/types/portal'
const props = defineProps<{ events: Meeting[] }>()
const upcoming = computed(()=> [...props.events].sort((a,b)=> (a.date+a.start).localeCompare(b.date+b.start)))
</script>
