<template>
  <form class="space-y-3" @submit.prevent="$emit('submit', form)">
    <Label for="title">Title</Label>
    <Input id="title" v-model="form.title" required />
    <div class="grid grid-cols-2 gap-3">
      <div>
        <Label for="date">Date</Label>
        <Input id="date" type="date" v-model="form.date" required />
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <Label for="start">Start</Label>
          <Input id="start" type="time" v-model="form.start" required />
        </div>
        <div>
          <Label for="end">End</Label>
          <Input id="end" type="time" v-model="form.end" required />
        </div>
      </div>
    </div>
    <Button type="submit" class="bg-blue-600 text-white">Save</Button>
  </form>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import type { Meeting } from '~/types/portal'

const form = reactive<Meeting>({ id:'', title:'', date: new Date().toISOString().slice(0,10), start:'09:00', end:'10:00', attendees: [] })
</script>
