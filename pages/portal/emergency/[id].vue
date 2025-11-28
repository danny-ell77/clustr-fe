<template>
    <div class="emergency-detail">
        <div class="mb-6">
            <Button variant="ghost" @click="$router.back()" class="mb-4">
                <Icon name="arrow-left" class="w-4 h-4 mr-2" />
                Back to Alerts
            </Button>

            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl text-foreground">Emergency Alert Details</h1>
                    <p class="text-muted-foreground">Alert ID: {{ alertData?.alertId }}</p>
                </div>

                <div class="flex items-center space-x-2">
                    <Button v-if="alertData?.status === 'active'" @click="handleAcknowledge"
                        :disabled="acknowledgeMutation.isPending.value" class="bg-yellow-600 hover:bg-yellow-700">
                        {{ acknowledgeMutation.isPending.value ? 'Acknowledging...' : 'Acknowledge' }}
                    </Button>
                    <Button v-if="alertData?.status === 'acknowledged' || alertData?.status === 'responding'"
                        @click="handleStartResponse" :disabled="startResponseMutation.isPending.value"
                        class="bg-primary hover:bg-primary/90">
                        {{ startResponseMutation.isPending.value ? 'Starting...' : 'Start Response' }}
                    </Button>
                    <Button v-if="alertData?.status !== 'resolved' && alertData?.status !== 'cancelled'"
                        @click="showResolveModal = true" class="bg-green-600 hover:bg-green-700">
                        Resolve
                    </Button>
                    <Button v-if="alertData?.status !== 'resolved' && alertData?.status !== 'cancelled'"
                        @click="showCancelModal = true" variant="outline" class="text-red-600 border-red-600">
                        Cancel
                    </Button>
                </div>
            </div>
        </div>

        <div v-if="isLoading" class="flex justify-center items-center py-12">
            <div class="text-muted-foreground">Loading alert details...</div>
        </div>

        <div v-else-if="isError" class="text-center py-12">
            <p class="text-red-600">Failed to load alert details</p>
            <Button @click="refetch" class="mt-4">Retry</Button>
        </div>

        <div v-else-if="alertData" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Alert Information</CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <Label class="text-muted-foreground">Emergency Type</Label>
                                <p class="font-medium">{{ alertData.emergencyTypeDisplay }}</p>
                            </div>
                            <div>
                                <Label class="text-muted-foreground">Priority</Label>
                                <span :class="getPriorityClass(alertData.priority)"
                                    class="inline-block px-2 py-1 rounded text-xs font-medium">
                                    {{ alertData.priorityDisplay }}
                                </span>
                            </div>
                            <div>
                                <Label class="text-muted-foreground">Status</Label>
                                <span :class="getStatusClass(alertData.status)"
                                    class="inline-block px-2 py-1 rounded text-xs font-medium">
                                    {{ alertData.statusDisplay }}
                                </span>
                            </div>
                            <div>
                                <Label class="text-muted-foreground">Location</Label>
                                <p class="font-medium">{{ alertData.location || 'Not specified' }}</p>
                            </div>
                        </div>

                        <div v-if="alertData.description">
                            <Label class="text-muted-foreground">Description</Label>
                            <p class="mt-1">{{ alertData.description }}</p>
                        </div>

                        <div class="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <Label class="text-muted-foreground">Created At</Label>
                                <p class="font-medium">{{ formatDate(alertData.createdAt) }}</p>
                            </div>
                            <div v-if="alertData.responseTime">
                                <Label class="text-muted-foreground">Response Time</Label>
                                <p class="font-medium">{{ alertData.responseTime }} minutes</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <Label class="text-muted-foreground">Name</Label>
                                <p class="font-medium">{{ alertData.userDetails?.name || 'N/A' }}</p>
                            </div>
                            <div>
                                <Label class="text-muted-foreground">Phone</Label>
                                <p class="font-medium">{{ alertData.userDetails?.phoneNumber || 'N/A' }}</p>
                            </div>
                            <div>
                                <Label class="text-muted-foreground">Email</Label>
                                <p class="font-medium">{{ alertData.userDetails?.emailAddress || 'N/A' }}</p>
                            </div>
                            <div>
                                <Label class="text-muted-foreground">Unit</Label>
                                <p class="font-medium">{{ alertData.userDetails?.unit || 'N/A' }}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div class="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-4">
                            <div class="flex items-start space-x-3">
                                <div class="w-2 h-2 mt-2 rounded-full bg-red-500"></div>
                                <div class="flex-1">
                                    <p class="font-medium text-sm">Alert Created</p>
                                    <p class="text-xs text-muted-foreground">{{ formatDate(alertData.createdAt) }}</p>
                                </div>
                            </div>

                            <div v-if="alertData.acknowledgedAt" class="flex items-start space-x-3">
                                <div class="w-2 h-2 mt-2 rounded-full bg-yellow-500"></div>
                                <div class="flex-1">
                                    <p class="font-medium text-sm">Acknowledged</p>
                                    <p class="text-xs text-muted-foreground">{{ formatDate(alertData.acknowledgedAt) }}</p>
                                    <p class="text-xs text-muted-foreground">By: {{ alertData.acknowledgedByDetails?.name }}
                                    </p>
                                </div>
                            </div>

                            <div v-if="alertData.respondedAt" class="flex items-start space-x-3">
                                <div class="w-2 h-2 mt-2 rounded-full bg-primary/100"></div>
                                <div class="flex-1">
                                    <p class="font-medium text-sm">Response Started</p>
                                    <p class="text-xs text-muted-foreground">{{ formatDate(alertData.respondedAt) }}</p>
                                    <p class="text-xs text-muted-foreground">By: {{ alertData.respondedByDetails?.name }}</p>
                                </div>
                            </div>

                            <div v-if="alertData.resolvedAt" class="flex items-start space-x-3">
                                <div class="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                                <div class="flex-1">
                                    <p class="font-medium text-sm">Resolved</p>
                                    <p class="text-xs text-muted-foreground">{{ formatDate(alertData.resolvedAt) }}</p>
                                    <p class="text-xs text-muted-foreground">By: {{ alertData.resolvedByDetails?.name }}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

        <Dialog v-model:open="showResolveModal">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Resolve Alert</DialogTitle>
                    <DialogDescription>
                        Mark this alert as resolved
                    </DialogDescription>
                </DialogHeader>

                <form @submit.prevent="handleResolve" class="space-y-4">
                    <div>
                        <Label>Resolution Notes</Label>
                        <textarea v-model="resolveNotes" class="w-full min-h-[120px] px-3 py-2 border rounded-md"
                            placeholder="Enter resolution notes..." />
                    </div>

                    <div class="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" @click="showResolveModal = false">
                            Cancel
                        </Button>
                        <Button type="submit" :disabled="resolveMutation.isPending.value">
                            {{ resolveMutation.isPending.value ? 'Resolving...' : 'Resolve' }}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="showCancelModal">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cancel Alert</DialogTitle>
                    <DialogDescription>
                        Cancel this emergency alert
                    </DialogDescription>
                </DialogHeader>

                <form @submit.prevent="handleCancel" class="space-y-4">
                    <div>
                        <Label>Cancellation Reason</Label>
                        <textarea v-model="cancelReason" class="w-full min-h-[120px] px-3 py-2 border rounded-md"
                            placeholder="Enter cancellation reason..." />
                    </div>

                    <div class="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" @click="showCancelModal = false">
                            Cancel
                        </Button>
                        <Button type="submit" :disabled="cancelMutation.isPending.value" variant="destructive">
                            {{ cancelMutation.isPending.value ? 'Cancelling...' : 'Cancel Alert' }}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import { queryKeys } from '~/constants/query-keys'
import { emergencyApi } from '~/services/api/emergency.api'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import Icon from '~/components/Icon.vue'

const route = useRoute()
const queryClient = useQueryClient()
const toast = useToast()

definePageMeta({
    title: 'Emergency Alert Details',
    middleware: ['auth', 'permissions'],
    layout: 'default'
})

const alertId = computed(() => route.params.id as string)
const showResolveModal = ref(false)
const showCancelModal = ref(false)
const resolveNotes = ref('')
const cancelReason = ref('')

const alertQuery = useQuery({
    queryKey: computed(() => queryKeys.emergency.alerts.detail(alertId.value)),
    queryFn: () => emergencyApi.getAlertById(alertId.value)
})

const acknowledgeMutation = useMutation({
    mutationFn: () => emergencyApi.acknowledgeAlert(alertId.value),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.emergency.alerts.detail(alertId.value) })
        queryClient.invalidateQueries({ queryKey: queryKeys.emergency.alerts.all() })
        toast.success('Alert acknowledged successfully')
    },
    onError: (error: any) => {
        toast.error(error.message || 'Failed to acknowledge alert')
    }
})

const startResponseMutation = useMutation({
    mutationFn: () => emergencyApi.startResponse(alertId.value),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.emergency.alerts.detail(alertId.value) })
        queryClient.invalidateQueries({ queryKey: queryKeys.emergency.alerts.all() })
        toast.success('Response started successfully')
    },
    onError: (error: any) => {
        toast.error(error.message || 'Failed to start response')
    }
})

const resolveMutation = useMutation({
    mutationFn: () => emergencyApi.resolveAlert(alertId.value, resolveNotes.value),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.emergency.alerts.detail(alertId.value) })
        queryClient.invalidateQueries({ queryKey: queryKeys.emergency.alerts.all() })
        showResolveModal.value = false
        resolveNotes.value = ''
        toast.success('Alert resolved successfully')
    },
    onError: (error: any) => {
        toast.error(error.message || 'Failed to resolve alert')
    }
})

const cancelMutation = useMutation({
    mutationFn: () => emergencyApi.cancelAlert(alertId.value, cancelReason.value),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.emergency.alerts.detail(alertId.value) })
        queryClient.invalidateQueries({ queryKey: queryKeys.emergency.alerts.all() })
        showCancelModal.value = false
        cancelReason.value = ''
        toast.success('Alert cancelled successfully')
    },
    onError: (error: any) => {
        toast.error(error.message || 'Failed to cancel alert')
    }
})

const alertData = computed(() => alertQuery.data.value)
const isLoading = computed(() => alertQuery.isLoading.value)
const isError = computed(() => alertQuery.isError.value)
const refetch = () => alertQuery.refetch()

const handleAcknowledge = () => {
    acknowledgeMutation.mutate()
}

const handleStartResponse = () => {
    startResponseMutation.mutate()
}

const handleResolve = () => {
    resolveMutation.mutate()
}

const handleCancel = () => {
    cancelMutation.mutate()
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleString()
}

const getPriorityClass = (priority: string) => {
    const classes = {
        low: 'bg-gray-100 text-gray-800',
        medium: 'bg-primary/15 text-primary',
        high: 'bg-orange-100 text-orange-800',
        critical: 'bg-red-100 text-red-800'
    }
    return classes[priority as keyof typeof classes] || classes.high
}

const getStatusClass = (status: string) => {
    const classes = {
        active: 'bg-red-100 text-red-800',
        acknowledged: 'bg-yellow-100 text-yellow-800',
        responding: 'bg-primary/15 text-primary',
        resolved: 'bg-green-100 text-green-800',
        cancelled: 'bg-gray-100 text-gray-800',
        false_alarm: 'bg-purple-100 text-purple-800'
    }
    return classes[status as keyof typeof classes] || classes.active
}
</script>
