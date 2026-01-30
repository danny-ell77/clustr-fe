<template>
    <Card>
        <CardContent class="p-0">
            <div v-if="isLoading" class="p-6 space-y-4">
                <Skeleton v-for="i in 5" :key="i" class="h-16 w-full" />
            </div>

            <div v-else-if="data.length === 0" class="text-center py-12">
                <EmptyState title="No staff found" description="Add your first staff member to get started"
                    action-label="Add Staff" @action="$emit('add')" />
            </div>

            <Table v-else>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Employee ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Shifts</TableHead>
                        <TableHead class="text-right"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="staff in data" :key="staff.id" class="cursor-pointer hover:bg-muted/50"
                        @click="$emit('view', staff)">
                        <TableCell class="font-medium">{{ staff.name }}</TableCell>
                        <TableCell>{{ staff.phoneNumber }}</TableCell>
                        <TableCell>{{ staff.email || '-' }}</TableCell>
                        <TableCell>
                            <Badge>{{ staff.staffTypeDisplay }}</Badge>
                        </TableCell>
                        <TableCell>{{ staff.employeeId || '-' }}</TableCell>
                        <TableCell>
                            <Badge :variant="staff.isActive ? 'default' : 'secondary'">
                                {{ staff.isActive ? 'Active' : 'Inactive' }}
                            </Badge>
                        </TableCell>
                        <TableCell>{{ staff.assignedShiftsCount }}</TableCell>
                        <TableCell class="text-right">
                            <div class="flex items-center justify-end" @click.stop>
                                <DropdownMenu>
                                    <DropdownMenuTrigger as-child>
                                        <Button variant="ghost" size="icon" class="h-8 w-8 p-0">
                                            <span class="sr-only">Open menu</span>
                                            <Icon name="more-vertical" class="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem @click="$emit('edit', staff)">
                                            <Icon name="edit" class="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="$emit('toggle-active', staff)">
                                            <Icon :name="staff.isActive ? 'user-x' : 'user-check'"
                                                class="mr-2 h-4 w-4" />
                                            {{ staff.isActive ? 'Deactivate' : 'Activate' }}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import Icon from '~/components/Icon.vue'
import EmptyState from '~/components/common/EmptyState.vue'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import type { Staff } from '~/types/shifts'

/**
 * Staff table content component for displaying staff members in a table view.
 */

defineProps<{
    data: Staff[]
    isLoading: boolean
}>()

defineEmits<{
    view: [staff: Staff]
    edit: [staff: Staff]
    'toggle-active': [staff: Staff]
    add: []
}>()
</script>
