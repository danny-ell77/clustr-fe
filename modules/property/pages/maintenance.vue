<template>
  <div class="p-6 space-y-6">
    <div class="grid grid-cols-4 gap-4">
      <Kpi title="Open" :value="kpis.open" color="bg-blue-600" />
      <Kpi title="In progress" :value="kpis.inProgress" color="bg-amber-500" />
      <Kpi title="Resolved" :value="kpis.resolved" color="bg-emerald-600" />
      <Kpi title="Overdue" :value="kpis.overdue" color="bg-red-600" />
    </div>

    <div class="bg-white border rounded-lg p-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold">Maintenance</h3>
        <div class="flex gap-2">
          <Input v-model="query" placeholder="Search" class="w-64" />
          <Button variant="outline" @click="exportCsv">Export</Button>
          <Button v-if="hasCreate" class="bg-blue-600 text-white" @click="openForm = true">Add maintenance</Button>
        </div>
      </div>
      <SimpleBarChart :data="chartData" />
    </div>

    <div class="bg-white border rounded-lg p-4">
      <DynamicTabs v-model="tabValue" :tabs="maintenanceTabs">
        <div class="flex items-center justify-between">
          <!-- This content will be above all tabs -->
        </div>
        
        <template #scheduled>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Due date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="i in paginated" :key="i.id">
                <TableCell class="font-medium">{{ i.title }}</TableCell>
                <TableCell><Badge :variant="priorityVariant(i.priority)">{{ i.priority }}</Badge></TableCell>
                <TableCell>{{ i.assignee }}</TableCell>
                <TableCell>{{ i.dueDate }}</TableCell>
                <TableCell><Badge :variant="statusVariant(i.status)">{{ label(i.status) }}</Badge></TableCell>
              </TableRow>
              <TableEmpty v-if="!paginated.length">No maintenance items</TableEmpty>
            </TableBody>
          </Table>
          <div class="flex items-center justify-end gap-2 mt-3">
            <Button variant="outline" @click="page = Math.max(1, page-1)" :disabled="page===1">Prev</Button>
            <span class="text-sm">Page {{ page }} / {{ totalPages }}</span>
            <Button variant="outline" @click="page = Math.min(totalPages, page+1)" :disabled="page===totalPages">Next</Button>
          </div>
        </template>
        
        <template #in_progress>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Due date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="i in paginated" :key="i.id">
                <TableCell class="font-medium">{{ i.title }}</TableCell>
                <TableCell><Badge :variant="priorityVariant(i.priority)">{{ i.priority }}</Badge></TableCell>
                <TableCell>{{ i.assignee }}</TableCell>
                <TableCell>{{ i.dueDate }}</TableCell>
                <TableCell><Badge :variant="statusVariant(i.status)">{{ label(i.status) }}</Badge></TableCell>
              </TableRow>
              <TableEmpty v-if="!paginated.length">No maintenance items</TableEmpty>
            </TableBody>
          </Table>
          <div class="flex items-center justify-end gap-2 mt-3">
            <Button variant="outline" @click="page = Math.max(1, page-1)" :disabled="page===1">Prev</Button>
            <span class="text-sm">Page {{ page }} / {{ totalPages }}</span>
            <Button variant="outline" @click="page = Math.min(totalPages, page+1)" :disabled="page===totalPages">Next</Button>
          </div>
        </template>
        
        <template #recurring>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Due date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="i in paginated" :key="i.id">
                <TableCell class="font-medium">{{ i.title }}</TableCell>
                <TableCell><Badge :variant="priorityVariant(i.priority)">{{ i.priority }}</Badge></TableCell>
                <TableCell>{{ i.assignee }}</TableCell>
                <TableCell>{{ i.dueDate }}</TableCell>
                <TableCell><Badge :variant="statusVariant(i.status)">{{ label(i.status) }}</Badge></TableCell>
              </TableRow>
              <TableEmpty v-if="!paginated.length">No maintenance items</TableEmpty>
            </TableBody>
          </Table>
          <div class="flex items-center justify-end gap-2 mt-3">
            <Button variant="outline" @click="page = Math.max(1, page-1)" :disabled="page===1">Prev</Button>
            <span class="text-sm">Page {{ page }} / {{ totalPages }}</span>
            <Button variant="outline" @click="page = Math.min(totalPages, page+1)" :disabled="page===totalPages">Next</Button>
          </div>
        </template>
      </DynamicTabs>
    </div>

    <Dialog :open="openForm" @update:open="openForm = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add maintenance</DialogTitle>
        </DialogHeader>
        <AddMaintenanceForm @submit="handleSubmit" @cancel="openForm=false" />
      </DialogContent>
    </Dialog>
    <SuccessDialog v-model:open="showSuccess" message="Maintenance added successfully" />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { definePageMeta } from '#imports'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableEmpty } from '~/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import Kpi from '~/components/property/Kpi.vue'
import SimpleBarChart from '~/components/property/SimpleBarChart.vue'
import AddMaintenanceForm from '~/components/property/AddMaintenanceForm.vue'
import SuccessDialog from '~/components/SuccessDialog.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import DynamicTabs from '~/components/shared/DynamicTabs.vue'
import type { MaintenanceItem, MaintenancePriority, MaintenanceStatus } from '~/types/property'
import { useAuth } from '~/modules/core/runtime/composables/useAuth'

definePageMeta({ title: 'Maintenance', description: 'Track maintenance requests and schedules', requiresPermission: 'property.maintenance.view' })

import { useMaintenance } from '~/modules/property/runtime/composables/useMaintenance'
const { list, add: addItem, exportCsv: exportCsvFn } = useMaintenance()
const items = await list()

// Tabs configuration for DynamicTabs component
const maintenanceTabs = [
  { name: 'Scheduled', value: 'scheduled' },
  { name: 'In progress', value: 'in_progress' },
  { name: 'Recurring', value: 'recurring' }
]

const query = ref('')
const tabValue = ref<'scheduled'|'in_progress'|'recurring'>('scheduled')
const scheduled = computed(()=> items.value.filter(i=> i.status==='scheduled' && `${i.title} ${i.assignee}`.toLowerCase().includes(query.value.toLowerCase())))
const inProgressList = computed(()=> items.value.filter(i=> i.status==='in_progress' && `${i.title} ${i.assignee}`.toLowerCase().includes(query.value.toLowerCase())))
const recurring = computed(()=> items.value.filter(i=> i.recurrence==='recurring' && `${i.title} ${i.assignee}`.toLowerCase().includes(query.value.toLowerCase())))
const page = ref(1)
const pageSize = 10
const currentList = computed(()=> tabValue.value==='scheduled'? scheduled.value : tabValue.value==='in_progress'? inProgressList.value : recurring.value)
const totalPages = computed(()=> Math.max(1, Math.ceil(currentList.value.length / pageSize)))
const paginated = computed(()=> currentList.value.slice((page.value-1)*pageSize, (page.value-1)*pageSize + pageSize))

const kpis = computed(()=> ({
  open: items.value.filter(i=> i.status==='scheduled').length,
  inProgress: items.value.filter(i=> i.status==='in_progress').length,
  resolved: items.value.filter(i=> i.status==='completed').length,
  overdue: items.value.filter(i=> i.status==='overdue').length,
}))

const chartData = computed(()=>{
  // dummy per month counts
  return [5,9,7,10,8,6,12,9,11,7,6,8]
})

const { hasPermission } = useAuth()
const hasCreate = computed(()=> hasPermission('property.maintenance.create'))

const openForm = ref(false)
const showSuccess = ref(false)
function handleSubmit(item: MaintenanceItem){ addItem(item); openForm.value=false; showSuccess.value=true }
function exportCsv(){ exportCsvFn() }

function priorityVariant(p: MaintenancePriority){ return p==='high'?'destructive': p==='medium'?'secondary':'outline' }
function statusVariant(s: MaintenanceStatus) {
  return s === 'completed' ? 'secondary' : s === 'in_progress' ? 'default' : s === 'scheduled' ? 'secondary' : 'destructive'
}
function label(s: MaintenanceStatus) {
  return ({ scheduled: 'Scheduled', in_progress: 'In progress', completed: 'Completed', overdue: 'Overdue' } as const)[s]
}
</script>
