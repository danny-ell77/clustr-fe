<template>
  <form class="space-y-3" @submit.prevent="onSubmit">
    <div>
      <Label for="t">Title</Label>
      <Input id="t" v-model="form.title" />
      <p v-if="errors.title" class="text-xs text-red-600 mt-1">{{ errors.title }}</p>
    </div>
    <div>
      <Label for="d">Description</Label>
      <Textarea id="d" v-model="form.description" />
      <p v-if="errors.description" class="text-xs text-red-600 mt-1">{{ errors.description }}</p>
    </div>
    <div class="grid grid-cols-3 gap-3">
      <div>
        <Label for="p">Priority</Label>
        <Select v-model="form.priority">
          <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <p v-if="errors.priority" class="text-xs text-red-600 mt-1">{{ errors.priority }}</p>
      </div>
      <div>
        <Label for="a">Assignee</Label>
        <Input id="a" v-model="form.assignee" />
        <p v-if="errors.assignee" class="text-xs text-red-600 mt-1">{{ errors.assignee }}</p>
      </div>
      <div>
        <Label for="due">Due date</Label>
        <Input id="due" type="date" v-model="form.dueDate" />
        <p v-if="errors.dueDate" class="text-xs text-red-600 mt-1">{{ errors.dueDate }}</p>
      </div>
    </div>
    <div>
      <Label for="r">Recurrence</Label>
      <Select v-model="form.recurrence">
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="one_time">One time</SelectItem>
          <SelectItem value="recurring">Recurring</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" variant="outline" @click="$emit('cancel')">Cancel</Button>
      <Button type="submit" class="bg-primary text-white" :disabled="!isValid">Save</Button>
    </div>
  </form>
</template>
<script setup lang="ts">
import { computed, reactive } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import type { MaintenanceItem } from '~/types/property'

const emit = defineEmits<{ (e:'submit', item: MaintenanceItem): void; (e:'cancel'): void }>()

const form = reactive<MaintenanceItem>({ id:'', title:'', description:'', assignee:'', dueDate: new Date().toISOString().slice(0,10), priority: 'medium', status: 'scheduled', recurrence: 'one_time' })
const errors = reactive<Record<string, string | null>>({ title:null, description:null, assignee:null, dueDate:null, priority:null })

function validate(){
  errors.title = form.title.trim() ? null : 'Title is required'
  errors.description = form.description.trim() ? null : 'Description is required'
  errors.assignee = form.assignee.trim() ? null : 'Assignee is required'
  errors.priority = form.priority ? null : 'Priority is required'
  errors.dueDate = !form.dueDate ? 'Due date is required' : (new Date(form.dueDate) < new Date(new Date().toISOString().slice(0,10)) ? 'Due date cannot be in the past' : null)
  return Object.values(errors).every(v => !v)
}
const isValid = computed(() => validate())

function onSubmit(){
  if (!validate()) return
  emit('submit', { ...form, id: `${Date.now()}` })
}
</script>
