<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-semibold">Entry/Exit Logs</h1>
                <p class="text-muted-foreground">Track child entry and exit activities</p>
            </div>

            <Button @click="showCreateModal = true">
                <Icon name="plus" class="w-4 h-4 mr-2" />
                New Log Entry
            </Button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
                <CardContent class="pt-6">
                    <div class="space-y-2">
                        <p class="text-sm text-muted-foreground">Total Logs</p>
                        <p class="text-2xl font-semibold">{{ logs.length }}</p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent class="pt-6">
                    <div class="space-y-2">
                        <p class="text-sm text-muted-foreground">Pending</p>
                        <p class="text-2xl font-semibold">{{ stats.pending }}</p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent class="pt-6">
                    <div class="space-y-2">
                        <p class="text-sm text-muted-foreground">Completed</p>
                        <p class="text-2xl font-semibold">{{ stats.completed }}</p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent class="pt-6">
                    <div class="space-y-2">
                        <p class="text-sm text-muted-foreground">Overdue</p>
                        <p class="text-2xl font-semibold text-destructive">{{ stats.overdue }}</p>
                    </div>
                </CardContent>
            </Card>
        </div>

        <UnifiedView page-key="entry-exit-logs" :data="logs" :is-loading="logsQuery.isLoading.value"
            :available-views="['table']" default-view-mode="table">
            <template #filters="{ filters, applyFilters }">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <Label>Log Type</Label>
                        <Select :model-value="filters.log_type"
                            @update:model-value="(value: string) => applyFilters({ log_type: value })">
                            <SelectTrigger>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="EXIT">Exit</SelectItem>
                                <SelectItem value="ENTRY">Entry</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Status</Label>
                        <Select :model-value="filters.status"
                            @update:model-value="(value: string) => applyFilters({ status: value })">
                            <SelectTrigger>
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="OVERDUE">Overdue</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Child</Label>
                        <Input :model-value="filters.child_name"
                            @update:model-value="(value: string) => applyFilters({ child_name: value })"
                            placeholder="Search by child name..." />
                    </div>

                    <div>
                        <Label>Date Range</Label>
                        <DateRangePicker :model-value="{ from: filters.date_from, to: filters.date_to }"
                            @update:model-value="(value: any) => applyFilters({ date_from: value.from, date_to: value.to })" />
                    </div>
                </div>
            </template>

            <template #modal-filters="{ filters, setFilter }">
                <div class="space-y-4">
                    <div>
                        <Label>Log Type</Label>
                        <Select :model-value="filters.log_type"
                            @update:model-value="(value: string) => setFilter('log_type', value)">
                            <SelectTrigger>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="EXIT">Exit</SelectItem>
                                <SelectItem value="ENTRY">Entry</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Status</Label>
                        <Select :model-value="filters.status"
                            @update:model-value="(value: string) => setFilter('status', value)">
                            <SelectTrigger>
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="OVERDUE">Overdue</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Child</Label>
                        <Input :model-value="filters.child_name"
                            @update:model-value="(value: string) => setFilter('child_name', value)"
                            placeholder="Search by child name..." />
                    </div>
                </div>
            </template>

            <template #table="{ data, isLoading }">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Child</TableHead>
                            <TableHead>Destination</TableHead>
                            <TableHead>Accompanying Adult</TableHead>
                            <TableHead>Exit Time</TableHead>
                            <TableHead>Entry Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-if="isLoading" v-for="i in 5" :key="i">
                            <TableCell v-for="j in 9" :key="j">
                                <Skeleton class="h-4 w-full" />
                            </TableCell>
                        </TableRow>
                        <TableRow v-else-if="!data.length">
                            <TableCell :colspan="9" class="text-center py-8">
                                <div class="text-muted-foreground">No entry/exit logs found</div>
                            </TableCell>
                        </TableRow>
                        <TableRow v-else v-for="log in data" :key="log.id" class="cursor-pointer hover:bg-muted/50">
                            <TableCell>{{ formatDate(log.date) }}</TableCell>
                            <TableCell>
                                <Badge :variant="log.logType === 'EXIT' ? 'destructive' : 'default'">
                                    {{ log.logType }}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <span class="font-medium">{{ log.childName }}</span>
                            </TableCell>
                            <TableCell>{{ log.destination }}</TableCell>
                            <TableCell>{{ log.accompanyingAdult }}</TableCell>
                            <TableCell>
                                <span v-if="log.exitTime">{{ formatTime(log.exitTime) }}</span>
                                <span v-else class="text-muted-foreground">-</span>
                            </TableCell>
                            <TableCell>
                                <span v-if="log.entryTime">{{ formatTime(log.entryTime) }}</span>
                                <span v-else class="text-muted-foreground">-</span>
                            </TableCell>
                            <TableCell>
                                <div class="flex gap-2">
                                    <Badge :variant="getStatusVariant(log.status)">
                                        {{ log.status }}
                                    </Badge>
                                    <Badge v-if="log.isOverdue" variant="destructive">
                                        Overdue
                                    </Badge>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div class="flex gap-2">
                                    <Button v-if="!log.exitTime && log.logType === 'EXIT'" variant="default" size="sm"
                                        @click="markExit(log)">
                                        Mark Exit
                                    </Button>
                                    <Button v-if="log.exitTime && !log.entryTime" variant="default" size="sm"
                                        @click="markEntry(log)">
                                        Mark Entry
                                    </Button>
                                    <Button variant="ghost" size="sm" @click="viewLog(log)">
                                        View
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </template>
        </UnifiedView>

        <Dialog v-model:open="showMarkExitDialog">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Mark Exit</DialogTitle>
                    <DialogDescription>
                        Record exit time for {{ selectedLog?.childName }}
                    </DialogDescription>
                </DialogHeader>
                <div class="space-y-4">
                    <div>
                        <Label>Notes (Optional)</Label>
                        <Textarea v-model="exitNotes" placeholder="Add any notes..." rows="3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="showMarkExitDialog = false">
                        Cancel
                    </Button>
                    <Button @click="confirmMarkExit" :disabled="checkOutMutation.isPending.value">
                        {{ checkOutMutation.isPending.value ? 'Recording...' : 'Mark Exit' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="showMarkEntryDialog">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Mark Entry</DialogTitle>
                    <DialogDescription>
                        Record entry time for {{ selectedLog?.childName }}
                    </DialogDescription>
                </DialogHeader>
                <div class="space-y-4">
                    <div>
                        <Label>Notes (Optional)</Label>
                        <Textarea v-model="entryNotes" placeholder="Add any notes..." rows="3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="showMarkEntryDialog = false">
                        Cancel
                    </Button>
                    <Button @click="confirmMarkEntry" :disabled="checkInMutation.isPending.value">
                        {{ checkInMutation.isPending.value ? 'Recording...' : 'Mark Entry' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChildren } from '~/composables/security/useChildren'
import UnifiedView from '~/components/common/UnifiedView.vue'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Card, CardContent } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import Icon from '~/components/Icon.vue'
import type { EntryExitLog } from '~/types/children'

definePageMeta({
    layout: 'default'
})

const { useEntryExitLogs, checkInMutation, checkOutMutation } = useChildren()

const filters = ref({})
const logsQuery = useEntryExitLogs(filters)

const logs = computed(() => logsQuery.data.value?.results || [])

const stats = computed(() => {
    const allLogs = logs.value
    return {
        pending: allLogs.filter(l => l.status === 'PENDING').length,
        completed: allLogs.filter(l => l.status === 'COMPLETED').length,
        overdue: allLogs.filter(l => l.isOverdue).length
    }
})

const showCreateModal = ref(false)
const showMarkExitDialog = ref(false)
const showMarkEntryDialog = ref(false)
const selectedLog = ref<EntryExitLog | undefined>()
const exitNotes = ref('')
const entryNotes = ref('')

const markExit = (log: EntryExitLog) => {
    selectedLog.value = log
    exitNotes.value = ''
    showMarkExitDialog.value = true
}

const markEntry = (log: EntryExitLog) => {
    selectedLog.value = log
    entryNotes.value = ''
    showMarkEntryDialog.value = true
}

const viewLog = (log: EntryExitLog) => {
    // TODO: Implement view log details
}

const confirmMarkExit = async () => {
    if (!selectedLog.value) return

    await checkOutMutation.mutateAsync({
        id: selectedLog.value.id,
        notes: exitNotes.value
    })

    showMarkExitDialog.value = false
    selectedLog.value = undefined
    exitNotes.value = ''
}

const confirmMarkEntry = async () => {
    if (!selectedLog.value) return

    await checkInMutation.mutateAsync({
        id: selectedLog.value.id,
        notes: entryNotes.value
    })

    showMarkEntryDialog.value = false
    selectedLog.value = undefined
    entryNotes.value = ''
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    })
}

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'COMPLETED':
            return 'default'
        case 'PENDING':
            return 'secondary'
        case 'OVERDUE':
            return 'destructive'
        default:
            return 'secondary'
    }
}
</script>
