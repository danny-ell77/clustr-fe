<template>
    <Card>
        <CardContent class="p-0">
            <div v-if="isLoading" class="p-6 space-y-4">
                <Skeleton v-for="i in 5" :key="i" class="h-16 w-full" />
            </div>

            <div v-else-if="data.length === 0" class="text-center py-12">
                <EmptyState 
                    title="No bills found" 
                    description="Create your first bill to get started"
                    action-label="Create Bill" 
                    @action="$emit('create')" 
                />
            </div>

            <Table v-else>
                <TableHeader>
                    <TableRow>
                        <TableHead>Bill Number</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead class="text-right"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow 
                        v-for="bill in data" 
                        :key="bill.id" 
                        class="cursor-pointer hover:bg-muted/50"
                        @click="$emit('view', bill)"
                    >
                        <TableCell class="font-medium">{{ bill.billNumber }}</TableCell>
                        <TableCell>
                            <div>
                                <p class="font-medium">{{ bill.title }}</p>
                                <p v-if="bill.isClusterWide" class="text-xs text-primary">Cluster-wide</p>
                            </div>
                        </TableCell>
                        <TableCell>{{ formatBillType(bill.type) }}</TableCell>
                        <TableCell>{{ formatCurrency(bill.amount) }}</TableCell>
                        <TableCell :class="{ 'text-red-600': bill.isOverdue }">
                            {{ formatDate(bill.dueDate) }}
                        </TableCell>
                        <TableCell>
                            <StatusBadge :status="getBillStatus(bill)" />
                        </TableCell>
                        <TableCell class="text-right">
                            <div class="flex items-center justify-end" @click.stop>
                                <DropdownMenu v-if="!bill.isFullyPaid && canManage">
                                    <DropdownMenuTrigger as-child>
                                        <Button variant="ghost" size="icon" class="h-8 w-8 p-0">
                                            <span class="sr-only">Open menu</span>
                                            <Icon name="more-vertical" class="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem @click="$emit('edit', bill)">
                                            <Icon name="edit" class="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="$emit('cancel', bill)">
                                            <Icon name="x-circle" class="mr-2 h-4 w-4" />
                                            Cancel
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
import { Card, CardContent } from '~/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import Icon from '~/components/Icon.vue'
import StatusBadge from '~/components/common/StatusBadge.vue'
import EmptyState from '~/components/common/EmptyState.vue'
import type { Bill } from '~/types/payments'

interface Props {
    data: Bill[]
    isLoading: boolean
    canManage?: boolean
}

withDefaults(defineProps<Props>(), {
    canManage: false
})

defineEmits<{
    view: [bill: Bill]
    edit: [bill: Bill]
    cancel: [bill: Bill]
    create: []
}>()

const getBillStatus = (bill: Bill) => {
    if (bill.isFullyPaid) return 'PAID'
    if (bill.isOverdue) return 'OVERDUE'
    if (bill.isDisputed) return 'DISPUTED'
    return 'PENDING'
}

const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
    }).format(num)
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

const formatBillType = (type: string) => {
    return type.split('_').map(word =>
        word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')
}
</script>
