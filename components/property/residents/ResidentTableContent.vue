<template>
    <Card>
        <CardContent class="p-0">
            <div v-if="isLoading" class="p-6 space-y-4">
                <Skeleton v-for="i in 5" :key="i" class="h-16 w-full" />
            </div>

            <div v-else-if="data.length === 0" class="text-center py-12">
                <EmptyState title="No residents found" description="Add your first resident to get started"
                    action-label="Add Resident" @action="$emit('add')" />
            </div>

            <Table v-else>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Approval Status</TableHead>
                        <TableHead>Apartment</TableHead>
                        <TableHead>Bills</TableHead>
                        <TableHead class="text-right"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="resident in data" :key="resident.id" class="cursor-pointer hover:bg-muted/50"
                        @click="$emit('view', resident)">
                        <TableCell class="font-medium">
                            <div class="flex items-center gap-2">
                                <div v-if="resident.profileImageUrl" class="w-8 h-8 rounded-full overflow-hidden">
                                    <img :src="resident.profileImageUrl" :alt="resident.name"
                                        class="w-full h-full object-cover" />
                                </div>
                                <div v-else class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span class="text-xs font-medium text-primary">{{ getInitials(resident.name)
                                        }}</span>
                                </div>
                                <span>{{ resident.name }}</span>
                            </div>
                        </TableCell>
                        <TableCell>{{ resident.phoneNumber }}</TableCell>
                        <TableCell>{{ resident.emailAddress }}</TableCell>
                        <TableCell>{{ resident.unitAddress || '-' }}</TableCell>
                        <TableCell>
                            <Badge :variant="resident.approvedByAdmin ? 'default' : 'secondary'">
                                {{ resident.approvedByAdmin ? 'Approved' : 'Pending' }}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge :variant="resident.apartmentStatus === 'OCCUPIED' ? 'default' : 'outline'">
                                {{ resident.apartmentStatus }}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <BillsSummaryBadge :paid-count="resident.billsSummary.paid"
                                :total-count="resident.billsSummary.total" />
                        </TableCell>
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
                                        <DropdownMenuItem v-if="!resident.approvedByAdmin"
                                            @click="$emit('approve', resident.id)">
                                            <Icon name="check-circle" class="mr-2 h-4 w-4" />
                                            Approve
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="$emit('edit', resident)">
                                            <Icon name="edit" class="mr-2 h-4 w-4" />
                                            Edit
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
import BillsSummaryBadge from './BillsSummaryBadge.vue'
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
import type { Resident } from '~/types/residents'

/**
 * Resident table content component for displaying residents in a table view.
 */

defineProps<{
    data: Resident[]
    isLoading: boolean
}>()

defineEmits<{
    view: [resident: Resident]
    edit: [resident: Resident]
    approve: [id: string]
    add: []
}>()

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}
</script>
