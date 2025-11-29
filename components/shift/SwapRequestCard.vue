<template>
    <div class="border rounded-lg p-4 space-y-4 hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between">
            <div class="space-y-1">
                <div class="flex items-center gap-2">
                    <h3 class="font-semibold">Shift Swap Request</h3>
                    <Badge :variant="getStatusVariant(swapRequest.status)">
                        {{ swapRequest.statusDisplay }}
                    </Badge>
                </div>
                <p class="text-sm text-muted-foreground">
                    Requested {{ formatDate(swapRequest.createdAt) }}
                </p>
            </div>
        </div>

        <div class="space-y-3">
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                    <div class="text-xs font-medium text-muted-foreground uppercase">From</div>
                    <div class="p-3 bg-muted rounded-lg space-y-1">
                        <div class="font-medium">{{ swapRequest.requestedByDetails.name }}</div>
                        <div class="text-sm text-muted-foreground">
                            {{ swapRequest.originalShiftDetails.title }}
                        </div>
                        <div class="text-xs text-muted-foreground">
                            {{ formatShiftTime(swapRequest.originalShiftDetails) }}
                        </div>
                    </div>
                </div>

                <div class="space-y-2">
                    <div class="text-xs font-medium text-muted-foreground uppercase">To</div>
                    <div class="p-3 bg-muted rounded-lg space-y-1">
                        <div class="font-medium">{{ swapRequest.requestedWithDetails.name }}</div>
                        <div v-if="swapRequest.targetShiftDetails" class="text-sm text-muted-foreground">
                            {{ swapRequest.targetShiftDetails.title }}
                        </div>
                        <div v-if="swapRequest.targetShiftDetails" class="text-xs text-muted-foreground">
                            {{ formatShiftTime(swapRequest.targetShiftDetails) }}
                        </div>
                        <div v-else class="text-sm text-muted-foreground italic">
                            No specific shift
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="swapRequest.reason" class="space-y-1">
                <div class="text-xs font-medium text-muted-foreground uppercase">Reason</div>
                <p class="text-sm">{{ swapRequest.reason }}</p>
            </div>

            <div v-if="swapRequest.status === 'APPROVED' && swapRequest.approvedByDetails" class="space-y-1">
                <div class="text-xs font-medium text-muted-foreground uppercase">Approved By</div>
                <p class="text-sm">
                    {{ swapRequest.approvedByDetails.name }} on {{ formatDate(swapRequest.approvedAt!) }}
                </p>
                <p v-if="swapRequest.responseMessage" class="text-sm text-muted-foreground">
                    {{ swapRequest.responseMessage }}
                </p>
            </div>

            <div v-if="swapRequest.status === 'REJECTED' && swapRequest.responseMessage" class="space-y-1">
                <div class="text-xs font-medium text-muted-foreground uppercase">Rejection Reason</div>
                <p class="text-sm text-red-600">{{ swapRequest.responseMessage }}</p>
            </div>
        </div>

        <div v-if="swapRequest.status === 'PENDING' && showActions" class="flex gap-2 pt-2">
            <Button variant="outline" size="sm" class="flex-1" @click="$emit('reject', swapRequest)">
                <Icon name="lucide:x" class="w-4 h-4 mr-1" />
                Reject
            </Button>
            <Button size="sm" class="flex-1" @click="$emit('approve', swapRequest)">
                <Icon name="lucide:check" class="w-4 h-4 mr-1" />
                Approve
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import type { ShiftSwapRequest, Shift, ShiftSwapStatus } from '~/types/shifts'

interface Props {
    swapRequest: ShiftSwapRequest
    showActions?: boolean
}

withDefaults(defineProps<Props>(), {
    showActions: true
})

const emit = defineEmits<{
    'approve': [swapRequest: ShiftSwapRequest]
    'reject': [swapRequest: ShiftSwapRequest]
}>()

function getStatusVariant(status: ShiftSwapStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
        case 'PENDING':
            return 'secondary'
        case 'APPROVED':
            return 'default'
        case 'REJECTED':
            return 'destructive'
        case 'CANCELLED':
            return 'outline'
        default:
            return 'outline'
    }
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    })
}

function formatShiftTime(shift: Shift): string {
    const start = new Date(shift.startTime)
    const end = new Date(shift.endTime)

    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const startTime = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    const endTime = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

    return `${startStr}, ${startTime} - ${endTime}`
}
</script>
