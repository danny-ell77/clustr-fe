<template>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
            <div class="bg-white border rounded-lg p-6">
                <h2 class="text-lg font-semibold mb-4">Basic Information</h2>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-sm text-muted-foreground">Title</label>
                        <p class="font-medium">{{ log.title }}</p>
                    </div>
                    <div>
                        <label class="text-sm text-muted-foreground">Maintenance Number</label>
                        <p class="font-medium">{{ log.maintenanceNumber }}</p>
                    </div>
                    <div>
                        <label class="text-sm text-muted-foreground">Type</label>
                        <p class="font-medium">{{ log.maintenanceType }}</p>
                    </div>
                    <div>
                        <label class="text-sm text-muted-foreground">Property Type</label>
                        <p class="font-medium">{{ log.propertyType }}</p>
                    </div>
                    <div>
                        <label class="text-sm text-muted-foreground">Location</label>
                        <p class="font-medium">{{ log.propertyLocation }}</p>
                    </div>
                    <div>
                        <label class="text-sm text-muted-foreground">Priority</label>
                        <Badge :variant="getPriorityVariant(log.priority)">
                            {{ log.priority }}
                        </Badge>
                    </div>
                </div>
            </div>

            <div class="bg-white border rounded-lg p-6">
                <h2 class="text-lg font-semibold mb-4">Description</h2>
                <p class="text-foreground">{{ log.description }}</p>
            </div>

            <div class="bg-white border rounded-lg p-6">
                <h2 class="text-lg font-semibold mb-4">Timeline</h2>
                <div class="space-y-3">
                    <div v-if="log.scheduledDate">
                        <label class="text-sm text-muted-foreground">Scheduled Date</label>
                        <p class="font-medium">{{ formatDate(log.scheduledDate) }}</p>
                    </div>
                    <div v-if="log.estimatedDuration">
                        <label class="text-sm text-muted-foreground">Estimated Duration</label>
                        <p class="font-medium">{{ log.estimatedDuration }}</p>
                    </div>
                    <div v-if="log.actualDuration">
                        <label class="text-sm text-muted-foreground">Actual Duration</label>
                        <p class="font-medium">{{ log.actualDuration }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="space-y-6">
            <slot name="status-section" />

            <div class="bg-white border rounded-lg p-6">
                <h2 class="text-lg font-semibold mb-4">Cost</h2>
                <div v-if="log.cost">
                    <p class="text-2xl text-green-600">
                        {{ formatCurrency(log.cost) }}
                    </p>
                </div>
                <p v-else class="text-muted-foreground">No cost recorded</p>
            </div>

            <div class="bg-white border rounded-lg p-6">
                <h2 class="text-lg font-semibold mb-4">Metadata</h2>
                <div class="space-y-2 text-sm">
                    <div>
                        <span class="text-muted-foreground">Created:</span>
                        <span class="ml-2">{{ formatDate(log.createdAt) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Badge } from '~/components/ui/badge'
import type { MaintenanceLog } from '~/types/maintenance'

/**
 * Maintenance log detail content component for displaying log information.
 */

defineProps<{
    log: MaintenanceLog
}>()

const getPriorityVariant = (priority?: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
        LOW: 'secondary',
        MEDIUM: 'default',
        HIGH: 'outline',
        URGENT: 'destructive'
    }
    return variants[priority || ''] || 'default'
}

const formatDate = (date?: string) => {
    return date ? new Date(date).toLocaleDateString() : 'N/A'
}

const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(numAmount)
}
</script>
