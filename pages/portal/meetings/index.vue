<template>
  <div class="p-6 space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">Virtual meeting</h2>
      <Button class="bg-primary text-white" @click="openForm = true">New virtual meeting</Button>
    </div>
    <div class="grid grid-cols-3 gap-4">
      <div class="col-span-2">
        <MeetingCalendar :year="view.year" :month="view.month" :events="events" />
      </div>
      <MeetingList :events="events" />
    </div>
    <Dialog :open="openForm" @update:open="openForm = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule a meeting</DialogTitle>
          <DialogDescription>Pick a date and time.</DialogDescription>
        </DialogHeader>
        <MeetingForm @submit="(m: any) => { createEvent(m); openForm = false }" />
      </DialogContent>
    </Dialog>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '~/components/ui/dialog'
import MeetingCalendar from '~/components/portal/meetings/MeetingCalendar.vue'
import MeetingForm from '~/components/portal/meetings/MeetingForm.vue'
import MeetingList from '~/components/portal/meetings/MeetingList.vue'
import { definePageMeta } from '#imports'
import type { Meeting } from '~/types/portal'
import { useMeetings } from '~/composables/portal/useMeetings'

const view = reactive({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 })
const { list, create: createEvent } = useMeetings()
const events = await list()
const openForm = ref(false)
const form = reactive<Meeting>({ id: '', title: '', date: new Date().toISOString().slice(0, 10), start: '09:00', end: '10:00', attendees: [] })
function create() { createEvent({ ...form, id: `${Date.now()}` }); openForm.value = false }

definePageMeta({ title: 'Tenant Meetings', description: 'Schedule and manage meetings with tenants', requiresPermission: 'portal.meetings.view' })
</script>
