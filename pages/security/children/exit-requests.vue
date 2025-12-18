<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-semibold">Exit Requests</h1>
                <p class="text-muted-foreground">Manage child exit requests and approvals</p>
            </div>

            <Button @click="showCreateModal = true">
                <Icon name="plus" class="w-4 h-4 mr-2" />
                New Exit Request
            </Button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
                <CardContent class="pt-6">
                    <div class="space-y-2">
                        <p class="text-sm text-muted-foreground">Pending</p>
                        <p class="text-2xl font-semibold">{{ stats.pending }}</p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent class="pt-6">
                    <div class="space-y-2">
                        <p class="text-sm text-muted-foreground">Approved</p>
                        <p class="text-2xl font-semibold">{{ stats.approved }}</p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent class="pt-6">
                    <div class="space-y-2">
                        <p class="text-sm text-muted-foreground">Denied</p>
                        <p class="text-2xl font-semibold">{{ stats.denied }}</p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent class="pt-6">
                    <div class="space-y-2">
                        <p class="text-sm text-muted-foreground">Expired</p>
                        <p class="text-2xl font-semibold">{{ stats.expired }}</p>
                    </div>
                </CardContent>
            </Card>
        </div>

        <UnifiedView page-key="exit-requests" :data="exitRequests" :is-loading="exitRequestsQuery.isLoading.value"
            :available-views="['table']" default-view-mode="table">
            <template #filters="{ filters, applyFilters }">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label>Status</Label>
                        <Select :model-value="filters.status"
                            @update:model-value="(value: string) => applyFilters({ status: value })">
                            <SelectTrigger>
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="APPROVED">Approved</SelectItem>
                                <SelectItem value="DENIED">Denied</SelectItem>
                                <SelectItem value="EXPIRED">Expired</SelectItem>
                                <SelectItem value="USED">Used</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Child</Label>
                        <Input :model-value="filters.child_name"
                            @update:model-value="(value: string) => applyFilters({ child_name: value })"
                            placeholder="Search by child name..." />
                    </div>

                    <div>
                        <Label>Date Range</Label>
                        <DateRangePicker :model-value="{ from: filters.date_from, to: filters.date_to }"
                            @update:model-value="(value: any) => applyFilters({ date_from: value.from, date_to: value.to })" />
                    </div>
                </div>
            </template>

            <template #modal-filters="{ filters, setFilter }">
                <div class="space-y-4">
                    <div>
                        <Label>Status</Label>
                        <Select :model-value="filters.status"
                            @update:model-value="(value: string) => setFilter('status', value)">
                            <SelectTrigger>
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="APPROVED">Approved</SelectItem>
                                <SelectItem value="DENIED">Denied</SelectItem>
                                <SelectItem value="EXPIRED">Expired</SelectItem>
                                <SelectItem value="USED">Used</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Child</Label>
                        <Input :model-value="filters.child_name"
                            @update:model-value="(value: string) => setFilter('child_name', value)"
                            placeholder="Search by child name..." />
                    </div>
                </div>
            </template>

            <template #table="{ data, isLoading }">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Request ID</TableHead>
                            <TableHead>Child</TableHead>
                            <TableHead>Requested By</TableHead>
                            <TableHead>Destination</TableHead>
                            <TableHead>Expected Return</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-if="isLoading" v-for="i in 5" :key="i">
                            <TableCell v-for="j in 7" :key="j">
                                <Skeleton class="h-4 w-full" />
                            </TableCell>
                        </TableRow>
                        <TableRow v-else-if="!data.length">
                            <TableCell :colspan="7" class="text-center py-8">
                                <div class="text-muted-foreground">No exit requests found</div>
                            </TableCell>
                        </TableRow>
                        <TableRow v-else v-for="request in data" :key="request.id"
                            class="cursor-pointer hover:bg-muted/50">
                            <TableCell>
                                <span class="font-mono text-sm">{{ request.requestId }}</span>
                            </TableCell>
                            <TableCell>
                                <span class="font-medium">{{ request.childName }}</span>
                            </TableCell>
                            <TableCell>{{ request.requestedByName }}</TableCell>
                            <TableCell>{{ request.destination }}</TableCell>
                            <TableCell>{{ formatDateTime(request.expectedReturnTime) }}</TableCell>
                            <TableCell>
                                <Badge :variant="getStatusVariant(request.status)">
                                    {{ request.status }}
                                </Badge>
                                <Badge v-if="request.isExpired" variant="destructive" class="ml-2">
                                    Expired
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div class="flex gap-2">
                                    <Button v-if="request.isPending" variant="default" size="sm"
                                        @click="approveRequest(request)">
                                        Approve
                                    </Button>
                                    <Button v-if="request.isPending" variant="destructive" size="sm"
                                        @click="denyRequest(request)">
                                        Deny
                                    </Button>
                                    <Button variant="ghost" size="sm" @click="viewRequest(request)">
                                        View
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </template>
        </UnifiedView>

        <Dialog v-model:open="showApproveDialog">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Approve Exit Request</DialogTitle>
                    <DialogDescription>
                        Approve exit request for {{ selectedRequest?.childName }}
                    </DialogDescription>
                </DialogHeader>
                <div class="space-y-4">
                    <div>
                        <Label>Approval Notes (Optional)</Label>
                        <Textarea v-model="approvalNotes" placeholder="Add any notes..." rows="3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="showApproveDialog = false">
                        Cancel
                    </Button>
                    <Button @click="confirmApprove" :disabled="approveExitMutation.isPending.value">
                        {{ approveExitMutation.isPending.value ? 'Approving...' : 'Approve' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="showDenyDialog">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Deny Exit Request</DialogTitle>
                    <DialogDescription>
                        Deny exit request for {{ selectedRequest?.childName }}
                    </DialogDescription>
                </DialogHeader>
                <div class="space-y-4">
                    <div>
                        <Label>Denial Reason *</Label>
                        <Textarea v-model="denialReason" placeholder="Provide a reason for denial..." rows="3"
                            required />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="showDenyDialog = false">
                        Cancel
                    </Button>
                    <Button variant="destructive" @click="confirmDeny"
                        :disabled="!denialReason || rejectExitMutation.isPending.value">
                        {{ rejectExitMutation.isPending.value ? 'Denying...' : 'Deny' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChildren } from '~/composables/security/useChildren'
import UnifiedView from '~/components/common/UnifiedView.vue'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Card, CardContent } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import Icon from '~/components/Icon.vue'
import type { ExitRequest } from '~/types/children'

definePageMeta({
    layout: 'default'
})

const { useExitRequests, approveExitMutation, rejectExitMutation } = useChildren()

const filters = ref({})
const exitRequestsQuery = useExitRequests(filters)

const exitRequests = computed(() => exitRequestsQuery.data.value?.results || [])

const stats = computed(() => {
    const requests = exitRequests.value
    return {
        pending: requests.filter(r => r.status === 'PENDING').length,
        approved: requests.filter(r => r.status === 'APPROVED').length,
        denied: requests.filter(r => r.status === 'DENIED').length,
        expired: requests.filter(r => r.isExpired).length
    }
})

const showCreateModal = ref(false)
const showApproveDialog = ref(false)
const showDenyDialog = ref(false)
const selectedRequest = ref<ExitRequest | undefined>()
const approvalNotes = ref('')
const denialReason = ref('')

const approveRequest = (request: ExitRequest) => {
    selectedRequest.value = request
    approvalNotes.value = ''
    showApproveDialog.value = true
}

const denyRequest = (request: ExitRequest) => {
    selectedRequest.value = request
    denialReason.value = ''
    showDenyDialog.value = true
}

const viewRequest = (request: ExitRequest) => {
    // TODO: Implement view request details
}

const confirmApprove = async () => {
    if (!selectedRequest.value) return

    await approveExitMutation.mutateAsync({
        id: selectedRequest.value.id,
        reason: approvalNotes.value
    })

    showApproveDialog.value = false
    selectedRequest.value = undefined
    approvalNotes.value = ''
}

const confirmDeny = async () => {
    if (!selectedRequest.value || !denialReason.value) return

    await rejectExitMutation.mutateAsync({
        id: selectedRequest.value.id,
        reason: denialReason.value
    })

    showDenyDialog.value = false
    selectedRequest.value = undefined
    denialReason.value = ''
}

const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    })
}

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'PENDING':
            return 'secondary'
        case 'APPROVED':
            return 'default'
        case 'DENIED':
            return 'destructive'
        case 'EXPIRED':
            return 'outline'
        case 'USED':
            return 'outline'
        default:
            return 'secondary'
    }
}
</script>
