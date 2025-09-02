<template>
  <div class="p-6 space-y-4">
    <h2 class="text-xl font-semibold">Report detail</h2>
    <Card>
      <CardContent class="space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <Label for="name">Name</Label>
            <Input id="name" v-model="form.name" />
          </div>
          <div>
            <Label for="assignee">Assignee</Label>
            <Input id="assignee" v-model="form.assignee" />
          </div>
        </div>
        <div>
          <Label>Attachments</Label>
          <FileUpload id="report-upload" label="Upload files" @uploaded="(files)=>attachments=files" />
        </div>
        <div>
          <Label>Notes</Label>
          <Textarea v-model="form.notes" />
        </div>
        <div class="flex justify-end">
          <Button class="bg-blue-600 text-white" @click="save">Save</Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from '#imports'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent } from '~/components/ui/card'
import { Textarea } from '~/components/ui/textarea'
import FileUpload from '~/components/shared/FileUpload.vue'
import { useReports } from '~/modules/accounting/runtime/composables/useReports'

const route = useRoute()
const attachments = ref<{ name: string; url: string }[]>([])
const { list, getById, update } = useReports()
await list()
const current = getById(route.params.id as string)
const form = ref<{ name: string; assignee: string; notes: string }>({ name: current?.name || '', assignee: current?.assignee || '', notes: '' })
function save() { update(route.params.id as string, form.value as any); console.log('saved', form.value, attachments.value) }
</script>
