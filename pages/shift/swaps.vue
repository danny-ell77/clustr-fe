<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-semibold">Shift Swap Requests</h1>
                <p class="text-muted-foreground">Manage shift swap requests from staff</p>
            </div>
        </div>

        <div class="flex items-center gap-4">
            <Select @update:model-value="(value: string) => setFilter('status', value)">
                <SelectTrigger class="w-[180px]">
                    <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
            </Select>

            <Button variant="outline" @click="clearFilters" size="sm">
                Clear Filters
            </Button>
        </div>

        <div v-if="swapRequestsQuery.isLoading.value" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <div v-else-if="swapRequestsQuery.isError.value" class="text-center py-12">
            <p class="text-destructive">Failed to load swap requests</p>
            <Button @click="() => swapRequestsQuery.refetch()" class="mt-4">Retry</Button>
        </div>

        <div v-else-if="swapRequests.length === 0" class="text-center py-12">
            <EmptyState title="No swap requests" description="There are no shift swap requests at the moment" />
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SwapRequestCard v-for="request in swapRequests" :key="request.id" :swap-request="request"
                :show-actions="request.status === 'PENDING'" @approve="handleApprove" @reject="handleReject" />
        </div>

        <Dialog v-model:open="showResponseDialog">
            <DialogContent class="max-w-md">
                <DialogHeader>
                    <DialogTitle>{{ responseAction === 'approve' ? 'Approve' : 'Reject' }} Swap Request</DialogTitle>
                    <DialogDescription>
                        {{ getDialogDescripton() }}
                    </DialogDescription>
                </DialogHeader>

                <form @submit.prevent="handleSubmitResponse" class="space-y-4">
                    <div>
                        <Label for="responseMessage">{{ responseAction === 'approve' ? 'Message (Optional)' : 'Reason *'
                        }}</Label>
                        <Textarea id="responseMessage" v-model="responseMessage"
                            :placeholder="responseAction === 'approve' ? 'Add a message...' : 'Explain why this request is being rejected'"
                            :required="responseAction === 'reject'" rows="4" />
                    </div>

                    <div class="flex gap-2 pt-4">
                        <Button type="button" variant="outline" class="flex-1" @click="showResponseDialog = false">
                            Cancel
                        </Button>
                        <Button type="submit" class="flex-1" :disabled="approveSwapMutation.isPending.value"
                            :variant="responseAction === 'reject' ? 'destructive' : 'default'">
                            {{ approveSwapMutation.isPending.value ? 'Processing...' : responseAction === 'approve' ?
                                'Approve' : 'Reject' }}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { useShifts } from '~/composables/shift/useShifts'
import type { ShiftSwapRequest, ShiftSwapResponseDto } from '~/types/shifts'
import SwapRequestCard from '~/components/shift/SwapRequestCard.vue'
import EmptyState from '~/components/common/EmptyState.vue'

definePageMeta({
    requiresPermission: 'shift.overview.view'
})

const filterDefinitions = [
    {
        field: 'status',
        type: 'select' as const,
        label: 'Status',
        options: [
            { value: 'PENDING', label: 'Pending' },
            { value: 'APPROVED', label: 'Approved' },
            { value: 'REJECTED', label: 'Rejected' },
            { value: 'CANCELLED', label: 'Cancelled' }
        ]
    }
]

const { state, clearFilters, setFilter } = useDataFilters(filterDefinitions, {
    persistKey: 'shift-swaps-filters'
})

const { useSwapRequests, approveSwapMutation } = useShifts()

const swapFilters = computed(() => {
    const filters: any = {}
    const statusFilter = state.value.filters.status
    if (statusFilter && statusFilter !== 'All') {
        filters.status = statusFilter
    }
    return filters
})

const swapRequestsQuery = useSwapRequests(swapFilters)
const swapRequests = computed(() => swapRequestsQuery.data.value?.results || [])

const showResponseDialog = ref(false)
const selectedRequest = ref<ShiftSwapRequest | null>(null)
const responseAction = ref<'approve' | 'reject'>('approve')
const responseMessage = ref('')

const getDialogDescripton = () => {
    if (responseAction.value === 'approve') {
        return 'Approve this shift swap request?'
    } else {
        return 'Reject this shift swap request?'
    }
}

const handleApprove = (request: ShiftSwapRequest) => {
    selectedRequest.value = request
    responseAction.value = 'approve'
    responseMessage.value = ''
    showResponseDialog.value = true
}

const handleReject = (request: ShiftSwapRequest) => {
    selectedRequest.value = request
    responseAction.value = 'reject'
    responseMessage.value = ''
    showResponseDialog.value = true
}

const handleSubmitResponse = async () => {
    if (!selectedRequest.value) return

    const data: ShiftSwapResponseDto = {
        action: responseAction.value,
        responseMessage: responseMessage.value || undefined
    }

    await approveSwapMutation.mutateAsync({
        id: selectedRequest.value.id,
        data
    })

    showResponseDialog.value = false
    selectedRequest.value = null
    responseMessage.value = ''
}
</script>
