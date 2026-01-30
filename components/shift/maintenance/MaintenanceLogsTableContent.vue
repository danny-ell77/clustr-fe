<template>
    <Card>
        <CardContent class="p-0">
            <div v-if="isLoading" class="p-6">
                <Skeleton class="h-64 w-full" />
            </div>

            <div v-else-if="data.length === 0" class="text-center py-12">
                <EmptyState title="No maintenance logs found" description="Create your first log to get started"
                    action-label="Create Log" @action="$emit('add')" />
            </div>

            <div v-else class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-muted/50 border-b">
                        <tr>
                            <th class="px-4 py-3 text-left text-sm font-medium">Log #</th>
                            <th class="px-4 py-3 text-left text-sm font-medium">Title</th>
                            <th class="px-4 py-3 text-left text-sm font-medium">Type</th>
                            <th class="px-4 py-3 text-left text-sm font-medium">Property</th>
                            <th class="px-4 py-3 text-left text-sm font-medium">Priority</th>
                            <th class="px-4 py-3 text-left text-sm font-medium">Status</th>
                            <th class="px-4 py-3 text-left text-sm font-medium">Assigned To</th>
                            <th class="px-4 py-3 text-left text-sm font-medium">Date</th>
                            <th class="px-4 py-3 text-left text-sm font-medium"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="log in data" :key="log.id"
                            class="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                            @click="$emit('view', log)">
                            <td class="px-4 py-3 text-sm">{{ log.maintenanceNumber }}</td>
                            <td class="px-4 py-3 text-sm font-medium">{{ log.title }}</td>
                            <td class="px-4 py-3 text-sm">
                                <span class="text-xs px-2 py-1 rounded-full bg-primary/15 text-primary">
                                    {{ log.maintenanceTypeDisplay }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-sm">{{ log.propertyLocation }}</td>
                            <td class="px-4 py-3 text-sm">
                                <PriorityBadge :priority="log.priority" />
                            </td>
                            <td class="px-4 py-3 text-sm">
                                <StatusBadge :status="log.status" />
                            </td>
                            <td class="px-4 py-3 text-sm">{{ log.performedBy?.name || 'Unassigned' }}</td>
                            <td class="px-4 py-3 text-sm">{{ formatDate(log.createdAt) }}</td>
                            <td class="px-4 py-3 text-sm">
                                <div class="flex items-center justify-end" @click.stop>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger as-child>
                                            <Button variant="ghost" size="icon" class="h-8 w-8 p-0">
                                                <span class="sr-only">Open menu</span>
                                                <Icon name="more-vertical" class="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem @click="$emit('assign', log)">
                                                <Icon name="user-plus" class="mr-2 h-4 w-4" />
                                                Assign
                                            </DropdownMenuItem>
                                            <DropdownMenuItem @click="$emit('edit', log)">
                                                <Icon name="edit" class="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import Icon from '~/components/Icon.vue'
import EmptyState from '~/components/common/EmptyState.vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import PriorityBadge from '~/components/common/PriorityBadge.vue'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import type { MaintenanceLog } from '~/types/maintenance'

/**
 * Maintenance logs table content component for displaying logs in a table view.
 */

defineProps<{
    data: MaintenanceLog[]
    isLoading: boolean
}>()

defineEmits<{
    view: [log: MaintenanceLog]
    edit: [log: MaintenanceLog]
    assign: [log: MaintenanceLog]
    add: []
}>()

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}
</script>
