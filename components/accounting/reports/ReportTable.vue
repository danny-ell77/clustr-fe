<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>DATE</TableHead>
        <TableHead>NAME</TableHead>
        <TableHead>ASSIGNEE</TableHead>
        <TableHead>STATUS</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="r in reports" :key="r.id" class="cursor-pointer" @click="$emit('open', r.id)">
        <TableCell>{{ r.date }}</TableCell>
        <TableCell>{{ r.name }}</TableCell>
        <TableCell>{{ r.assignee }}</TableCell>
        <TableCell>
          <Badge :variant="badgeVariant(r.status)">{{ label(r.status) }}</Badge>
        </TableCell>
      </TableRow>
      <TableEmpty v-if="!reports.length">No reports</TableEmpty>
    </TableBody>
  </Table>
</template>
<script setup lang="ts">
import { Badge } from '~/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableEmpty } from '~/components/ui/table'
import type { Report, ReportStatus } from '~/types/accounting'

defineProps<{ reports: Report[] }>()

def function badgeVariant(s: ReportStatus) {
  switch (s) {
    case 'new': return 'secondary'
    case 'open': return 'default'
    case 'in_review': return 'secondary'
    case 'resolved': return 'outline'
    case 'closed': return 'outline'
  }
}

def function label(s: ReportStatus) {
  return ({ new:'New', open:'Open', in_review:'In review', resolved:'Resolved', closed:'Closed' } as const)[s]
}
</script>
