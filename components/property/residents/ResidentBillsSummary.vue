<template>
    <Card>
        <CardHeader>
            <CardTitle>Bills Summary</CardTitle>
        </CardHeader>
        <CardContent>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div class="text-center p-4 bg-muted/50 rounded-lg">
                    <p class="text-2xl font-semibold">{{ summary.total }}</p>
                    <p class="text-sm text-muted-foreground">Total Bills</p>
                </div>
                <div class="text-center p-4 bg-green-50 rounded-lg">
                    <p class="text-2xl font-semibold text-green-600">{{ summary.paid }}</p>
                    <p class="text-sm text-muted-foreground">Paid</p>
                </div>
                <div class="text-center p-4 bg-red-50 rounded-lg">
                    <p class="text-2xl font-semibold text-red-600">{{ summary.unpaid }}</p>
                    <p class="text-sm text-muted-foreground">Unpaid</p>
                </div>
                <div class="text-center p-4 bg-yellow-50 rounded-lg">
                    <p class="text-2xl font-semibold text-yellow-600">{{ summary.pending }}</p>
                    <p class="text-sm text-muted-foreground">Pending</p>
                </div>
                <div class="text-center p-4 bg-orange-50 rounded-lg">
                    <p class="text-2xl font-semibold text-orange-600">{{ summary.overdue }}</p>
                    <p class="text-sm text-muted-foreground">Overdue</p>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

/**
 * Resident bills summary component for displaying bill statistics.
 */

defineProps<{
    summary: {
        total: number
        paid: number
        unpaid: number
        pending: number
        overdue: number
    }
}>()
</script>
