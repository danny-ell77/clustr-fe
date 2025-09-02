<template>
  <div class="flex gap-2">
    <Input v-model="local.query" placeholder="Search reports" class="w-64" />
    <Select v-model="local.status">
      <SelectTrigger class="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="new">New</SelectItem>
        <SelectItem value="open">Open</SelectItem>
        <SelectItem value="in_review">In review</SelectItem>
        <SelectItem value="resolved">Resolved</SelectItem>
        <SelectItem value="closed">Closed</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import type { ReportStatus } from '~/types/accounting'

const props = defineProps<{ query: string; status: 'all' | ReportStatus }>()
const emit = defineEmits<{ (e:'update:query', v:string): void; (e:'update:status', v:'all'|ReportStatus): void }>()

const local = reactive({ query: props.query, status: props.status })
watch(() => local.query, v => emit('update:query', v))
watch(() => local.status, v => emit('update:status', v))
</script>
