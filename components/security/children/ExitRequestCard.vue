<template>
    <Card class="hover:shadow-md transition-shadow">
        <CardContent class="pt-6">
            <div class="space-y-4">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 flex-wrap">
                            <h3 class="font-semibold text-lg">{{ exitRequest.childName }}</h3>
                            <StatusBadge :status="exitRequest.status" />
                            <Badge v-if="exitRequest.isExpired" variant="destructive">Expired</Badge>
                        </div>
                        <p class="text-sm text-muted-foreground mt-1">
                            Request ID: {{ exitRequest.requestId }}
                        </p>
                        <p class="text-sm mt-2">{{ exitRequest.reason }}</p>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                        <p class="text-xs text-muted-foreground">Requested By</p>
                        <p class="text-sm font-medium">{{ exitRequest.requestedByName }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-muted-foreground">Destination</p>
                        <p class="text-sm font-medium">{{ exitRequest.destination }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-muted-foreground">Expected Return</p>
                        <p class="text-sm font-medium">{{ formatDateTime(exitRequest.expectedReturnTime) }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-muted-foreground">Expires At</p>
                        <p class="text-sm font-medium" :class="{ 'text-red-600': exitRequest.isExpired }">
                            {{ formatDateTime(exitRequest.expiresAt) }}
                        </p>
                    </div>
                    <div class="col-span-2">
                        <p class="text-xs text-muted-foreground">Accompanying Adult</p>
                        <p class="text-sm font-medium">
                            {{ exitRequest.accompanyingAdult }} ({{ exitRequest.accompanyingAdultPhone }})
                        </p>
                    </div>
                </div>

                <div v-if="exitRequest.status === 'APPROVED' && exitRequest.approvedByName" class="pt-4 border-t">
                    <div class="flex items-center gap-2 text-sm text-green-600">
                        <Icon name="check-circle" class="w-4 h-4" />
                        <span>Approved by {{ exitRequest.approvedByName }}</span>
                        <span class="text-muted-foreground">{{ formatDateTime(exitRequest.approvedAt!) }}</span>
                    </div>
                </div>

                <div v-if="exitRequest.status === 'DENIED' && exitRequest.deniedByName" class="pt-4 border-t">
                    <div class="space-y-2">
                        <div class="flex items-center gap-2 text-sm text-red-600">
                            <Icon name="x-circle" class="w-4 h-4" />
                            <span>Denied by {{ exitRequest.deniedByName }}</span>
                            <span class="text-muted-foreground">{{ formatDateTime(exitRequest.deniedAt!) }}</span>
                        </div>
                        <p v-if="exitRequest.denialReason" class="text-sm text-muted-foreground">
                            Reason: {{ exitRequest.denialReason }}
                        </p>
                    </div>
                </div>

                <div v-if="showActions && exitRequest.isPending" class="flex gap-2 pt-4 border-t">
                    <Button v-if="canApprove" variant="default" size="sm" class="flex-1"
                        @click="$emit('approve', exitRequest)">
                        <Icon name="check" class="w-4 h-4 mr-2" />
                        Approve
                    </Button>
                    <Button v-if="canReject" variant="destructive" size="sm" class="flex-1"
                        @click="$emit('reject', exitRequest)">
                        <Icon name="x" class="w-4 h-4 mr-2" />
                        Reject
                    </Button>
                </div>

                <div v-else-if="showActions" class="flex gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" class="flex-1" @click="$emit('view', exitRequest)">
                        View Details
                    </Button>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import StatusBadge from '~/components/common/StatusBadge.vue'
import Icon from '~/components/Icon.vue'
import type { ExitRequest } from '~/types/children'

interface Props {
    exitRequest: ExitRequest
    showActions?: boolean
    canApprove?: boolean
    canReject?: boolean
}

withDefaults(defineProps<Props>(), {
    showActions: true,
    canApprove: true,
    canReject: true
})

defineEmits<{
    approve: [exitRequest: ExitRequest]
    reject: [exitRequest: ExitRequest]
    view: [exitRequest: ExitRequest]
}>()

const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    })
}
</script>
