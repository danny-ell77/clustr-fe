<template>
    <Card>
        <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Complete bill payment history for this resident</CardDescription>
        </CardHeader>
        <CardContent>
            <BaseTable :loading="false" :is-empty="bills.length === 0" :column-count="8"
                empty-message="No bills found for this resident">
                <template #column-headers>
                    <TableHead>Bill Number</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Paid Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Paid Date</TableHead>
                    <TableHead>Status</TableHead>
                </template>

                <template #table-body>
                    <TableRow v-for="bill in bills" :key="bill.id">
                        <TableCell class="font-medium">{{ bill.billNumber }}</TableCell>
                        <TableCell>
                            <div>
                                <p class="font-medium">{{ bill.title }}</p>
                                <p v-if="bill.description" class="text-sm text-muted-foreground">{{ bill.description
                                    }}</p>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline">{{ bill.type }}</Badge>
                        </TableCell>
                        <TableCell class="font-medium">
                            {{ formatCurrency(bill.amount, bill.currency) }}
                        </TableCell>
                        <TableCell :class="bill.isFullyPaid ? 'text-green-600' : 'text-orange-600'">
                            {{ formatCurrency(bill.paidAmount, bill.currency) }}
                        </TableCell>
                        <TableCell>
                            <span v-if="bill.dueDate" :class="bill.isOverdue ? 'text-red-600' : ''">
                                {{ formatDate(bill.dueDate) }}
                            </span>
                            <span v-else class="text-muted-foreground">-</span>
                        </TableCell>
                        <TableCell>
                            <span v-if="bill.paidAt">{{ formatDate(bill.paidAt) }}</span>
                            <span v-else class="text-muted-foreground">-</span>
                        </TableCell>
                        <TableCell>
                            <Badge v-if="bill.isFullyPaid" variant="default">
                                <Icon name="check-circle" class="w-3 h-3 mr-1" />
                                Paid
                            </Badge>
                            <Badge v-else-if="bill.isOverdue" variant="destructive">
                                <Icon name="alert-circle" class="w-3 h-3 mr-1" />
                                Overdue
                            </Badge>
                            <Badge v-else variant="secondary">
                                Unpaid
                            </Badge>
                        </TableCell>
                    </TableRow>
                </template>
            </BaseTable>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import Icon from '~/components/Icon.vue'
import BaseTable from '~/components/shared/BaseTable.vue'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { TableHead, TableCell, TableRow } from '~/components/ui/table'
import type { Bill } from '~/types/payments'

/**
 * Resident bills table component for displaying payment history.
 */

defineProps<{
    bills: Bill[]
}>()

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const formatCurrency = (amount: string, currency: string = 'NGN') => {
    const numAmount = parseFloat(amount)
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: currency
    }).format(numAmount)
}
</script>
