<template>
    <div v-if="isLoading" class="text-center py-8">
        <p class="text-muted-foreground">Loading schedules...</p>
    </div>

    <div v-else-if="isError" class="text-center py-8">
        <p class="text-red-600">Error loading schedules</p>
        <Button @click="$emit('retry')" variant="outline" class="mt-4">
            Retry
        </Button>
    </div>

    <div v-else>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Next Due</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow v-for="schedule in schedules" :key="schedule.id">
                    <TableCell class="font-medium">{{ schedule.name }}</TableCell>
                    <TableCell>{{ schedule.frequencyTypeDisplay }}</TableCell>
                    <TableCell>{{ formatDate(schedule.nextDueDate) }}</TableCell>
                    <TableCell>{{ schedule.propertyLocation }}</TableCell>
                    <TableCell>
                        <StatusBadge :status="schedule.status" />
                    </TableCell>
                    <TableCell>
                        <div class="flex items-center gap-2">
                            <Button variant="ghost" size="icon" @click="$emit('edit', schedule)">
                                <Icon name="edit" class="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" class="text-destructive" @click="$emit('delete', schedule.id)">
                                <Icon name="trash" class="w-4 h-4" />
                            </Button>
                        </div>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </div>
</template>

<script setup lang="ts">
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Button } from '~/components/ui/button'
import StatusBadge from '~/components/common/StatusBadge.vue'
import Icon from '~/components/Icon.vue'

interface Props {
    schedules: any[]
    isLoading: boolean
    isError: boolean
}

defineProps<Props>()

defineEmits<{
    retry: []
    edit: [schedule: any]
    delete: [id: string]
}>()

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}
</script>
